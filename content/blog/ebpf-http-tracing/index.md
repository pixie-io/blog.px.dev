---
path: '/ebpf-http-tracing'
title: 'Part 2: Full body HTTP request/responses tracing using eBPF'
date: 2020-10-28T06:00:00.000+00:00
featured_image: hero-image.png
categories: ['Pixie Team Blogs', 'eBPF']
authors: ['Zain Asgar']
emails: ['zasgar@pixielabs.ai']
featured: true
---

This is the second in a series of posts in which we share how you can use eBPF to debug applications without recompilation / redeployment. The [first post](https://blog.px.dev/blog/ebpf-function-tracing/post/) provided a short introduction to eBPF and demonstrated how to use it to write a simple function argument tracer. In this second post, we will look at how to use eBPF to capture HTTP 1.X traffic.

# Introduction

Gaining visibility into HTTP traffic is valuable when working with distributed applications. This data can be used for performance, functional and security monitoring. Many applications accomplish this by utilizing middleware to add tracing or logging to HTTP requests in the application. One can also utilize popular open source frameworks like [Open Telemetry](https://opentelemetry.io/) to instrument requests and related context. In this post, we will take a look at an alternative approach that utilizes eBPF to capture HTTP data without having to manually add instrumentation. One advantage of this approach is that it always works, even if applications have not been specifically instrumented.

[Part 1](https://blog.px.dev/blog/ebpf-function-tracing/post/) of this series provides a more detailed overview of eBPF, which allows you to run restricted C code upon some trigger event. Kprobes provide a mechanism to trace the Kernel API or internals and uprobes provide a mechanism to intercept specific instructions in a user program. Since applications typically sit on top of the Kernel system API, if we capture the Kernel interface we should be able to capture all the ingress and egress data and reconstruct the HTTP requests.

Alternatively, we can use uprobes to carefully instrument underlying HTTP libraries (eg. net/http in Go) to capture HTTP requests directly. Since uprobes work at the application level, their implementation will be dependent on the underlying language used.

This post will explore tracing HTTP requests using both kprobes and uprobes and compare the tradeoffs for each.

## What happens during an HTTP request?

Before we start writing any BPF code, let’s try to understand how HTTP requests are handled by the system. We will utilize the same [test application](https://github.com/pixie-labs/pixie-demos/blob/main/simple-gotracing/app/app.go) we used in Part 1, a simple Golang HTTP server (simpleHTTP), however the results are generalizable to other HTTP applications.
The first step is to understand what Linux kernel APIs are used to send and receive data for a simple HTTP request.

We can use the Linux [perf](https://perf.wiki.kernel.org/index.php/Main_Page) command to understand what system calls are invoked:

```
sudo perf trace -p <PID>
```

Using `curl`, we’ll make a simple HTTP request in another terminal window:

```
curl http://localhost:9090/e\?iters\=10
```

Back in the original terminal window, where the `perf` command is running, you should see a spew of data:

```
[0] % sudo perf trace -p 1011089
        ? (         ): app/1011089  ... [continued]: epoll_pwait())                                      = 1
    ...
    0.087 ( 0.004 ms): app/1011089 accept4(fd: 3<socket:[7062148]>, upeer_sockaddr: 0xc0000799c8, upeer_addrlen: 0xc0000799ac, flags: 526336) = -1 EAGAIN (Resource temporarily unavailable)
    0.196 ( 0.005 ms): app/1011089 read(fd: 4, buf: 0xc00010e000, count: 4096)                           = 88
    0.238 ( 0.005 ms): app/1011089 futex(uaddr: 0xc000098148, op: WAKE|PRIVATE_FLAG, val: 1)             = 1
    0.278 ( 0.023 ms): app/1011089 write(fd: 4, buf: 0xc00010f000, count: 128)                           = 128
    ...
    0.422 ( 0.002 ms): app/1011091 close(fd: 4)                                                          = 0
    ...
```

Note that we took care not to have any additional print statements in our [app.go](https://github.com/pixie-labs/pixie-demos/blob/main/simple-gotracing/app/app.go) simple Golang HTTP server to avoid creating extra system calls.

Examining the output of the `perf` call shows us that there are 3 relevant system calls: `accept4`, `write`, `close`. Tracing these system calls should allow us to capture all of the data the server is sending out in response to a request.

From the server’s perspective, a typical request flow is shown below, where each box represents a system call. The Linux system call API is typically much more complex than this and there are other variants that can be used. For the purposes of this post we assume this simplified version, which works well for the application that we are tracing.

::: div image-l
<svg title='System call flow for an HTTP request.' src='http-request-flow-syscalls.png' />
:::

While the focus of this example is on tracing the HTTP response, it is also possible to trace the data sent in the HTTP request by adding a probe to the `read` syscall.

## Tracing with Kprobes

Now that we know that tracing `accept4`, `write` and `close` are sufficient for this binary, we can start constructing the BPF source code. Our program will roughly look like the following:

::: div image-m
<svg title='Diagram of our eBPF HTTP tracer using kprobes.' src='kprobe-tracing.png' />
:::

There is some additional complexity in the implementation in order to avoid limitations in eBPF (stacksize, etc.), but at a high level, we need to capture the following using 4 separate probes:

- **Entry to `accept4`**: The entry contains information about the socket. We store this socket information
- **Return from `accept4`**: The return value for accept4 is the file descriptor. We store this file descriptor in a BPF_MAP.
- **Entry to `write`**: The write function gives us information about the file descriptor and the data written to that file descriptor. We write out this data to a perf buffer so the userspace tracing program can read it.
- **Entry to `close`**: We use the file descriptor information to clear the BPF_MAP we allocated above and stop tracking this fd.

Note that kprobes work across the entire system so we need to filter by PID to limit capturing the data to only the processes of interest. This is done for all the probes listed above.

Once the data is captured, we can read it to our Go userspace program and parse the HTTP response using the [`net/http`](https://golang.org/pkg/net/http/) library.

The kprobe approach is conceptually simple, but the implementation is fairly long. You can check out the detailed code [here](https://github.com/pixie-labs/pixie-demos/blob/main/simple-gotracing/http_trace_kprobe/http_trace_kprobe.go). For brevity, we left out a few details such as reading the return value from write to know how many bytes were actually written.

One downside to capturing data using kprobes is that we land up reparsing all responses since we intercept them after they have been converted to the write format. An alternative approach is to use uprobes to capture the data before it gets sent to the kernel where we can read the data before it has been serialized.

## Tracing with Uprobes

Uprobes can be used to interrupt the execution of the program at a particular address and allow a BPF program to collect the underlying data. This capability can be used to capture data in a client library, but the underlying BPF code and addresses/offsets of interest will be dependent on the library's implementation . As a result, if there are changes in the client library, the uprobe will need to be updated as well. Therefore, it is best to add uprobes for client libraries that are unlikely to change significantly in order to minimize the number of updates we make to our uprobes.

For Go, we will try to find a tracepoint on the underlying [`net/http`](https://golang.org/pkg/net/http/) library. One approach is to directly examine the code to determine where to probe. We will show an alternate method that can be used to figure out which parts are relevant. For this, let’s run our application under [delve](https://github.com/go-delve/delve):

```bash:numbers
[0] % dlv exec ./app
Type 'help' for list of commands.
(dlv) c
Starting server on: :9090
(dlv) break syscall.write
Breakpoint 1 set at 0x497083 for syscall.write() /opt/golang/src/syscall/zsyscall_linux_amd64.go:998
```

As discussed earlier, the `write` syscall is utilized by the operating system in order to send a HTTP response. We therefore set a breakpoint there so that we can identify the underlying client code that triggers the syscall to 'write'. When we run the `curl` command again the program should interrupt. We get the backtrace using `bt`:

```bash:numbers
 (dlv) bt
  0x0000000000497083 in syscall.write at /opt/golang/src/syscall/zsyscall_linux_amd64.go:998
  0x00000000004aa481 in syscall.Write at /opt/golang/src/syscall/syscall_unix.go:202
  0x00000000004aa481 in internal/poll.(*FD).Write at /opt/golang/src/internal/poll/fd_unix.go:268
  0x0000000000545c4f in net.(*netFD).Write at /opt/golang/src/net/fd_unix.go:220
  0x0000000000551ef8 in net.(*conn).Write at /opt/golang/src/net/net.go:196
  0x0000000000638e36 in net/http.checkConnErrorWriter.Write at /opt/golang/src/net/http/server.go:3419
  0x00000000005116c5 in bufio.(*Writer).Flush at /opt/golang/src/bufio/bufio.go:593
  0x0000000000632c61 in net/http.(*response).finishRequest at /opt/golang/src/net/http/server.go:1588
  0x0000000000633bd3 in net/http.(*conn).serve at /opt/golang/src/net/http/server.go:1895
  0x000000000045afe1 in runtime.goexit at /opt/golang/src/runtime/asm_amd64.s:1357

```

Examining the stack, we find that the `net/http.(*response).finishRequest` function on line 9 looks promising. The Go source code tells us that this function is invoked every time an HTTP request is completed. This function is a good spot to grab the data with uprobes for a particular request.

The capture of the data is a direct extension of our approach in Part 1. We employ the same strategy to read variables in the struct, except this time we need to chase a few pointers. The BPF code for this is documented and located [here](https://github.com/pixie-labs/pixie-demos/tree/main/simple-gotracing/http_trace_uprobe), along with the user space code required to read the recorded data.

# Uprobes vs Kprobes

In order to compare our two different approaches, we must consider

1. Which probe is easier to design and implement?
2. Which probe is more performant?
3. Which probe is easier to maintain?

To answer the first question, let’s look at the pros and cons of each approach.

|               | Pros       | Cons                 |
| :------------ | :------------ | :---------------------- |
| kprobe    | `* Target language agnostic. // * Simpler to implement and more maintainable. It does not rely on the implementation details of other libraries.`  | `* The user program might split a single request across multiple system calls. // * There is some complexity in re-assembling these requests. // * Doesn’t work with TLS.`                 |
| uprobe  | `* We can access and capture application context, such as stack trace, in addition to the request itself. // * We can build the uprobes to capture the data after parsing is complete, avoiding repeated work in tracer. // * Works with TLS.` | `* Sensitive to the version of the underlying library being used. // * Will not function with binaries that are stripped of symbols. // * Need to implement a different probe for each library (and each programming language may have its own set of libraries). // * Might be hard (impossible?) with dynamic languages like Python, since  it’s hard to find the right location to probe in their underlying runtime environments. // * Causes an extra system call.` |

Conceptually, Kprobes are the clear winner since we can avoid any language dependence to perform HTTP capture. However, this method has the added caveat that we need to reparse every response, so we should investigate whether that introduces a significant performance overhead. It is worth calling out that kprobes do not work with TLS. However, we will share our method for tracing TLS requests using eBPF in a future blog post.

## Benchmarking performance of uprobes vs. kprobes

Since these probes will be used to monitor applications in production, we want them to have minimal overhead. On a fully loaded system, we want to understand the impact of deploying our tracers. One metric we can use to understand the performance impact is to look at the impact on the observed latency and the ability to handle high request throughput. This is not a comprehensive test and we will utilize our simple app binary to perform it. Since the probes only add overhead when the actual HTTP request is made, rather than when the request is processed, our simple binary nearly simulates the worst-case scenario.

Our experimental setup looks like:

::: div image-m
<svg title='Benchmark setup for comparing kprobes vs uprobes.' src='benchmark.png' />
:::

We utilize a modern Intel core-i9 machine with 14 physical cores to host both the load generator and the machine under test hosting the application and tracer. When running requests, we took care to ensure that the machine was under sufficient load to saturate the CPUs on the machine.

We captured HTTP requests of various durations by increasing the `iterations` parameter of the `computeE` function on our app.go http server. This is a relatively CPU-heavy workload because each invocation of the HTTP endpoint causes a loop to run a set number of iterations. The resulting overhead on request throughput and latency is plotted against the median latency of the baseline request, normalized by the baseline metric.

::: div image-m
<svg title='' src='latency-benchmark.png' />
:::

::: div image-m
<svg title='' src='throughput-benchmark.png' />
:::

From the results, we can see that if the HTTP latency is > 1ms the overhead introduced is negligible and in most cases appears to be noise. This is similar for Kprobes and Uprobes, with Kprobes performing slightly better (even though we are reparsing all the data). Note that the overhead is occasionally negative -- this is most likely just noise in the measurement. The key takeaway here is that if your HTTP handler is doing any real work (about 1ms of compute) the overhead introduced is basically negligible.

## Conclusion

::: div image-l
<svg title='Running the eBPF HTTP tracing demo code.' src='ebpf-http-tracing.gif' />
:::

Tracing HTTP requests using eBPF is possible using both kprobes and uprobes; however, the kprobe approach is more scalable as it is agnostic to the target language. The code used in this blog is available [here](https://github.com/pixie-labs/pixie-demos/tree/main/simple-gotracing) and should be fully functional to trace Go/Python applications. Making it robust and functional across the entire Kernel API surface can involve a significant amount of work. Some language stacks use different underlying syscalls such as writev, or excessively split requests over multiple system calls.

At Pixie, we are building an auto-telemetry system for Kubernetes that requires no manual instrumentation to get started. eBPF provides most of the magic behind our platform. Pixie uses both uprobes and kprobes to enable a lot of our functionality. We’ll be discussing more of this in our future blogs posts. If this post's contents are interesting, please give Pixie a try, or check out our open positions.

## Links

- Learn more about the [Pixie Community Beta](https://px.dev/).
- Check out our [open positions](https://pixielabs.ai/careers).
