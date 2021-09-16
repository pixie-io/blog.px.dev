---
path: '/ebpf-openssl-tracing'
title: 'Part 3: Tracing SSL/TLS connections using eBPF'
date: 2021-09-16T06:00:00.000+00:00
featured_image: hero-image.png
categories: ['Pixie Team Blogs', 'eBPF']
authors: ['Omid Azizi']
emails: ['oazizi@pixielabs.ai']
featured: true
---

This post will demonstrate how to use eBPF to trace encrypted connections that operate over TLS (or its predecessor, SSL). TLS has become the standard for securing microservice communication, so any production-ready tracing tool should be prepared to handle encrypted connections.

This post is part of our ongoing series sharing how you can use eBPF to debug applications without recompilation or redeployment. For more eBPF projects, check out:

- [Part 1](https://blog.pixielabs.ai/blog/ebpf-function-tracing/post/): Debugging Go function arguments in prod
- [Part 2](https://blog.pixielabs.ai/ebpf-http-tracing/): Full body HTTP request/response tracing

## Tracing with BPF

[BPF](https://www.brendangregg.com/ebpf.html) can be used to interrupt the execution of a program at virtually any point—much like how one can set a breakpoint in an application using a debugger.

However, unlike a debugger, which stops a program indefinitely to allow you to poke around, with BPF, the kernel simply runs a BPF program when the specified trigger occurs and then immediately resumes execution of the original program.

One interesting application of BPF is the tracing of network traffic. Many network traffic tracers, like Wireshark, use pcap (**p**acket **cap**ture) to capture the data as it is sent to the network interface card (NIC). These days, pcap actually uses BPF under the hood. Whenever a packet is sent to the NIC, a BPF program captures the packet data.

BPF probes are not limited to tracing data at the packet-level; probes can be deployed at numerous spots in the network stack.

At Pixie, we place BPF *kprobes* on the send() and recv() family of Linux syscalls. Any time one of these syscalls is executed, the kprobe will trigger and Pixie will capture the data.

::: div image-l
<svg title='Diagram of a network traffic tracer BPF program using kprobes attached to Linux syscalls.' src='bpf-syscall-tracing.svg' />
:::

The `send()` and `recv()` syscalls are very high up on the network stack, before the data has been packetized and prepared for network transmission. Since Pixie’s goal is to automatically observe the data an application sends over the network, adding probes at this level is ideal for gaining visibility into how the application is talking to other services in its environment.

## The problem with TLS/SSL

The BPF kprobe approach outlined above works well for all plain-text traffic, but will not work for encrypted connections. By the time the data flows through the Linux `send()` and `recv()` syscalls for TSL/SSL traffic, it is encrypted and we can’t make any sense of it.

The approach taken by Wireshark and other low-level packet captures is to ask for the key so that the data can be decrypted. TLS handshakes are fairly complex and consist of a number of different keys and secrets, but at a high-level, there are two modes for this:

1. Give Wireshark the RSA private key, so that it can trace the entire connection. In this setup, Wireshark is able to trace the data as long as it was able to observe the initial key-exchange; for existing connections, you’ll be out of luck.
2. Give Wireshark the (pre)-master key which was negotiated during the key exchange—if you know it. In this setup, Wireshark can decrypt the data even without seeing the initial connection. Because this is a common use case, you can actually ask your [browser to dump the session keys](https://redflagsecurity.net/2019/03/10/decrypting-tls-wireshark/) for this purpose.

Sharing encryption keys works well for Wireshark’s use case, but this approach is not scalable enough to use in an observability platform whose mantra is “up and running in seconds.”

## A simple solution

Given how powerful BPF is, we wondered if there wasn’t a more seamless way to access the plain-text data. The resulting plan is very basic: we simply capture the data before it is encrypted.

This pre-encryption approach rules out kprobes, because the data is encrypted before it reaches the Linux kernel. But BPF isn’t restricted to kernel event triggers. Uprobes allow the kernel to trigger a BPF program whenever the *application code* reaches a certain instruction.

To figure out where to place the uprobe in order to capture the pre-encryption traffic, it helps to look at a diagram of how SSL/TLS is typically incorporated in applications.

::: div image-xl
<svg title='Diagram of application without TLS vs Application with TLS.' src='bpf-tls-tracing.svg' />
:::

The diagram above shows the common setup for encrypting application traffic with the popular TLS library, OpenSSL. The goal is to trace the inputs to the TLS library, which happen to be the `SSL_write` and `SSL_read` functions in OpenSSL. Tracing these calls, instead of the Linux `send()` and `recv()` syscalls, will capture the traffic before it is encrypted.

This strategy is well supported by BPF *uprobes*. With uprobes, we set our triggers to be events that happen in user-space. Often, uprobes are set in the user’s own compiled code, but there’s nothing preventing us from placing them on a shared library.

By placing the uprobe on a *shared* library, we end up tracing *all* applications that use the shared library, so we’ll need to filter out the data for the processes we’re actually interested in. This is no different than when we put a kprobe on Linux’s `send()` and `recv()` syscalls, though. Those kprobes also end up tracing *all* applications —- in fact, they trace more applications, as not all applications use OpenSSL, but all applications go through the kernel. In the context of a full system tracer, however, a probe on *shared* library is actually an advantage, since a single probe gives us wide observability coverage.

## Setting a uprobe on a shared library

Attaching uprobes to shared library is no different than setting uprobes on application code.

[BCC](https://github.com/iovisor/bcc) makes it easy to attach a uprobe to a function in your application code. For example, if you had a function called `foo()` in a program called `demo`, you’d use BCC to attach a uprobe in the following way:

```
attach_uprobe(
	"/home/user/demo",
	"foo",
	<your BPF code here>);
```

Note that for this to work, you must have compiled your code with debug symbols. You can verify that a binary has symbols by running a program like `nm`; below we also run grep to search for a particular symbol of interest.

```bash
$ nm -C demo | grep foo
0000000000401110 T foo()
```

Compiler optimizations like inlining can often mean that the symbol you’re looking for is not available, so this is something to watch out for. Nevertheless, as long as the symbol is available in the binary, you can trace it.

Now, what if you want to attach a uprobe to a shared library? In this case, we’re dealing with the `.so` shared library as our object file instead of the program we’ve compiled, since the shared library is where the code of interest lives. To start, let’s see if we can find the `SSL_write` or `SSL_read` symbol that we want to probe. To do this, we run `nm` directly on the `libssl.so` file.

```bash
$ nm /usr/lib/x86_64-linux-gnu/libssl.so.1.1
nm: /usr/lib/x86_64-linux-gnu/libssl.so.1.1: no symbols
```

Uh-oh. No symbols? They’ve been stripped? So how will we call `attach_uprobe`?

After a brief moment of panic, you ask yourself, how does the application even call OpenSSL functions like `SSL_write`? That information must be somewhere, right? Reading through the man pages for `nm` reveals the answer. We need to pass the flag `--dynamic` to see the dynamic symbols. Those are never stripped, otherwise no binary could possibly link to the shared library. Running `nm` again with this flag reveals something a lot more interesting

```bash
$ nm --dynamic /usr/lib/x86_64-linux-gnu/libssl.so.1.1 | grep -e SSL_write -e SSL_read
0000000000038b00 T SSL_read
000000000003c730 T SSL_read_early_data
0000000000038b70 T SSL_read_ex
0000000000038dd0 T SSL_write
000000000003c900 T SSL_write_early_data
0000000000038e40 T SSL_write_ex
```

Phew! The symbols do exist. This is promising.

The final `attach_uprobe` invocation is really easy. For the object on which to set the uprobe, you can directly provide the shared library. And for the symbol, use the dynamic symbol of interest.

```
attach_uprobe(
    "/usr/lib/x86_64-linux-gnu/libssl.so.1.1",
    "SSL_write",
    <your BPF code here>)
```

## Putting it all together

A fully working version of the OpenSSL tracer can be found [here](https://github.com/pixie-io/pixie-demos/tree/main/openssl-tracer). To run the demo, follow the directions in the [`README`](https://github.com/pixie-io/pixie-demos/blob/main/openssl-tracer/README.md) file.

The main project files are:

- `openssl_tracer.cc`: the user-space tracer
- `openssl_tracer_bpf_funcs.c`: the BPF probes to deploy
- `probe_deployment.h/cc`: a thin wrapper around BCC

### User-space tracer

`openssl_tracer.cc` is the top-level file that includes `main`. It is responsible for deploying the probes and then reading the traced data from BPF and printing it out to screen.

At the top of `openssl_tracer.cc`, we list out the probes that we want to attach. `UProbeSpec` is a custom struct that we have defined to fully specify a uprobe. It has the object file and symbol to which we want to attach the probe. It also specifies whether the probe should trigger on the entry or return of the traced function. Finally, `probe_fn` specifies which BPF function to execute when the probe is triggered (more on that later).

In our OpenSSL tracer, we want to trace `SSL_write` and `SSL_read`. Since we are interested in both inputs and outputs to both these functions, we actually need 4 probes: an entry and return probe on `SSL_write`, and an entry and return probe on `SSL_read`. We’ll look at the content of the BPF probe functions in the next section.

```cpp
// A probe on entry of SSL_write
UProbeSpec kSSLWriteEntryProbeSpec{
    .binary_path = "/usr/lib/x86_64-linux-gnu/libssl.so.1.1",
    .symbol = "SSL_write",
    .attach_type = BPF_PROBE_ENTRY,
    .probe_fn = "probe_entry_SSL_write",
};

// A probe on return of SSL_write
UProbeSpec kSSLWriteRetProbeSpec{
    .binary_path = "/usr/lib/x86_64-linux-gnu/libssl.so.1.1",
    .symbol = "SSL_write",
    .attach_type = BPF_PROBE_RETURN,
    .probe_fn = "probe_ret_SSL_write",
};

// A probe on entry of SSL_read
UProbeSpec kSSLReadEntryProbeSpec{
    .binary_path = "/usr/lib/x86_64-linux-gnu/libssl.so.1.1",
    .symbol = "SSL_read",
    .attach_type = BPF_PROBE_ENTRY,
    .probe_fn = "probe_entry_SSL_read",
};

// A probe on return of SSL_read
UProbeSpec kSSLReadRetProbeSpec{
    .binary_path = "/usr/lib/x86_64-linux-gnu/libssl.so.1.1",
    .symbol = "SSL_read",
    .attach_type = BPF_PROBE_RETURN,
    .probe_fn = "probe_ret_SSL_read",
};

const std::vector<UProbeSpec> kUProbes = {
    kSSLWriteEntryProbeSpec,
    kSSLWriteRetProbeSpec,
    kSSLReadEntryProbeSpec,
    kSSLReadRetProbeSpec,
};
```

Next, we set-up the perf buffer output. Recall that the perf buffer is just an output buffer (the name “perf” is only there because it was historically used as part of the perf suite); it is really just a simple output buffer. The BPF probes in kernel space will push data into the perf buffer, and here we read the data out from user-space.

Once again, we have defined a custom `PerfBufferSpec` to specify the perf buffer we want to read. In this case, the perf_buffer is called `tls_events`. This name must match the perf buffer that is specified in the BPF probes, otherwise we wouldn’t be able find the pushed data. We also set a `probe_output_fn`, that specifies which user-space function to call when we read an event from the buffer. In this case, we call `handle_output`, which simply prints out the information to `stdout`. Since the buffer is essentially a circular buffer and can drop events, there is also an optional `probe_loss_fn` to handle the loss incidents; for simplicity, we ignore such events in this example.

```cpp
void handle_output(void* /*cb_cookie*/, void* data, int /*data_size*/) {
  // Cast the raw memory into the ssl_data_event_t struct that we know it is.
  struct ssl_data_event_t r = *static_cast<struct ssl_data_event_t*>(data);
  
  std::string_view plaintext(r.data, r.data_len);

  std::cout << " t=" << r.timestamp_ns;
  std::cout << " type=" << (r.type == kSSLRead ? "read" : "write");
  std::cout << " data=" << plaintext;
  std::cout << std::endl;
}

const PerfBufferSpec kPerfBufferSpec = {
    .name = "tls_events",
    .probe_output_fn = &handle_output,
    .probe_loss_fn = nullptr,
};
```

Next, we have the `main` function of our tracer, which is not too complex. The main parts of the code consist of:

- Loading the BPF code in `openssl_tracer_bpf_funcs.c` into the kernel.
- Deploying the 4 uprobes so they start tracing `SSL_read` and `SSL_write` in `libssl.so`.
- Opening the perf buffer so we can read the data being inserted by the uprobes.
- Using a loop to periodically read all the events in the perf buffer. Each time an event is read out of here, it will trigger `handle_output` as described above.

```cpp
int main(int argc, char** argv) {
  // Read arguments to get the target PID to trace.
  if (argc != 2) {
    std::cerr << "Usage: " << argv[0] << " <PID to trace for SSL traffic>" << std::endl;
    exit(1);
  }
  std::string target_pid(argv[1]);

  BCCWrapper bcc;

  // Read and deploy the BPF code.
  std::ifstream ifs("openssl_tracer_bpf_funcs.c");
  std::string bpf_code(std::istreambuf_iterator<char>(ifs), {});
  RETURN_IF_ERROR(bcc.Init(bpf_code, {"-DTRACE_PID=" + target_pid}));

  // Deploy uprobes.
  for (auto& probe_spec : kUProbes) {
    RETURN_IF_ERROR(bcc.AttachUProbe(probe_spec));
  }

  // Open the perf buffer used by our uprobes to output data.
  RETURN_IF_ERROR(bcc.OpenPerfBuffer(kPerfBufferSpec));

  std::cout << "Successfully deployed BPF probes. Tracing for SSL data. Use Ctrl-C to exit." << std::endl;

  // Periodically read the output buffer and print entries to screen.
  while (true) {
    bcc.PollPerfBuffer(kPerfBufferSpec.name);
    usleep(100000);
  }

  return 0;
}
```

### BPF uprobes

The main purpose of BPF uprobes are to trace the `SSL_write` and `SSL_read` functions and capture the data. Practically, this means we need to trace both the entry and exit to these functions. The return value probe is necessary to trace the return value. Moreover, in the case of `SSL_read`, the pointer to the input buffer won’t contain the read data at the entry point, so copying the data at return is essential.

| Function | Entry probe actions | Return probe actions |
| :------- | :------------------ | :------------------- |
| `int SSL_write(SSL *ssl, const void *buf, int num);` | Record location of input data (i.e. `buf`) into a BPF map. | Retrieve location of input data from BPF map. Check return value for number of bytes written. Copy data from `buf` to perf buffer output. |
| `int SSL_read(SSL *ssl, void *buf, int num);` | Record location of return data (i.e `buf`) into a BPF map. | Retrieve location of return data from BPF map. Check return value for number of bytes read. Copy data from `buf` to perf buffer output. |

Walking through the BPF code in a bit more detail, there are a few things to highlight.

First, we have some globals at the top of the file:

```cpp
BPF_PERF_OUTPUT(tls_events);

// Key is thread ID (from bpf_get_current_pid_tgid).
// Value is a pointer to the data buffer argument to SSL_write/SSL_read.
BPF_HASH(active_ssl_read_args_map, uint64_t, struct ssl_args_t);
BPF_HASH(active_ssl_write_args_map, uint64_t, struct ssl_args_t);

// BPF programs are limited to a 512-byte stack. We store this value per CPU
// and use it as a heap allocated value.
BPF_PERCPU_ARRAY(data_buffer_heap, struct ssl_data_event_t, 1);
```

One can think of the three statements above as global structures that are available to any BPF probe. In the case of `BPF_HASH` it represents a global hash table: The first argument is the name, the second argument is the key, and the third argument is the value type. We use the first two maps to “transfer” data from the entry probe to the return probe. In particular, we stash the location of the data buffer, which is an input argument into the global map. The return probe—which does not have access to the input arguments directly—then reads the value from the global map. To make this work, we’ll use the thread_id as the key to these maps.

The `BPF_PERCPU_ARRAY` is another BPF map that is local to each CPU. We use this as a temporary scratch space, since it is not possible to copy too much data onto the BPF stack.

Next, I’ll show the code for the `SSL_read` probe—the probe for `SSL_write` is very similar, so you can explore that one on your own.

The entry probe, `probe_entry_SSL_read` first gets the pid to see if the probe that was just triggered is the PID of interest. If not, the probe returns without taking any action. If, however, the current PID is the target PID, then the probe reads the buffer pointer and stores the value in the global `active_ssl_read_args_map`. This is just a way to communicate the argument to the return probe by storing it in a persistent, global location.

Soon after the entry probe is triggered, we’ll expect the return probe, `probe_ret_SSL_read` to be triggered. When that happens, we again make sure that we’re tracing a PID of interest. If so, we’ll “unstash” the buf argument which tells us where the `SSL_read` data was copied to. Then we make a copy of that data as well and push it to the output perf_buffer via `process_SSL_data`.

```cpp
static int process_SSL_data(struct pt_regs* ctx, uint64_t id, enum ssl_data_event_type type,
                            const char* buf) {
  int len = (int)PT_REGS_RC(ctx);
  if (len < 0) {
    return 0;
  }

  struct ssl_data_event_t* event = create_ssl_data_event(id);
  if (event == NULL) {
    return 0;
  }

  event->type = type;
  // This is a max function, but it is written in such a way to keep older BPF verifiers happy.
  event->data_len = (len < MAX_DATA_SIZE ? (len & (MAX_DATA_SIZE - 1)) : MAX_DATA_SIZE);
  bpf_probe_read(event->data, event->data_len, buf);
  tls_events.perf_submit(ctx, event, sizeof(struct ssl_data_event_t));

  return 0;
}

// Function signature being probed:
// int SSL_read(SSL *s, void *buf, int num)
int probe_entry_SSL_read(struct pt_regs* ctx) {
  uint64_t current_pid_tgid = bpf_get_current_pid_tgid();
  uint32_t pid = current_pid_tgid >> 32;

  if (pid != TRACE_PID) {
    return 0;
  }

  const char* buf = (const char*)PT_REGS_PARM2(ctx);

  active_ssl_read_args_map.update(&current_pid_tgid, &buf);
  return 0;
}

int probe_ret_SSL_read(struct pt_regs* ctx) {
  uint64_t current_pid_tgid = bpf_get_current_pid_tgid();
  uint32_t pid = current_pid_tgid >> 32;

  if (pid != TRACE_PID) {
    return 0;
  }

  const char** buf = active_ssl_read_args_map.lookup(&current_pid_tgid);
  if (buf != NULL) {
    process_SSL_data(ctx, current_pid_tgid, kSSLRead, *buf);
  }

  active_ssl_read_args_map.delete(&current_pid_tgid);
  return 0;
}
```

And that’s it. Once the probes push the data to the `tls_events` perf buffer, the user-space `openssl_tracer.cc` tracer will see the data the next time it wakes up. And then it’ll print it out to screen.

Voila! You’ve just traced your own TLS/SSL application.
