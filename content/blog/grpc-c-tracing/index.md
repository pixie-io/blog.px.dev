---
path: '/grpc-c-tracing'
title: 'Pushing the envelope: monitoring gRPC-C with eBPF'
date: 2022-8-24T06:00:00.000+00:00
featured_image: hero-image.png
categories: ['Guest Blogs', 'eBPF']
authors: ['Ori Shussman', 'Aviv Zohari']
emails: ['ori@groundcover.com', 'aviv@groundcover.com']
---

gRPC is quickly becoming the preferred tool for enabling quick, lightweight connections between microservices, but it also presents new problems for observability. This is mainly because gRPC connections apply stateful compression, which makes monitoring them with sniffing tools an extremely challenging task. At least, this was traditionally the case. But thanks to eBPF, gRPC monitoring has become much easier.

We at groundcover were thrilled to have the opportunity to collaborate with the Pixie project to build a gRPC monitoring solution that uses eBPF to trace gRPC sessions that use the [gRPC-C library](https://github.com/grpc/grpc). In this blog post we will discuss what makes gRPC monitoring difficult, the challenges of constructing a user based eBPF solution, and how we integrated gRPC-C tracing within the existing Pixie framework.

## The hassle of gRPC monitoring

[gRPC](https://grpc.io/) is a remote procedure call framework that has become widely used in microservice environments, and works in virtually any type of environment, offering implementations in all of the popular languages - including but not limited to Python, C#, C++ and PHP. This means you can use gRPC to do [pretty much anything](https://www.xenonstack.com/insights/what-is-grpc) involving distributed applications or services. Whether you want to power machine learning applications, manage cloud services, handle device-to-device communications or do anything in between, gRPC has you covered.

Another reason to love gRPC is that it's (typically) implemented over HTTP/2, so you get long-lived, reliable streams. Plus, the protocol headers are compressed using HPACK, which saves a ton of space by avoiding transmission of repetitive header information. Yet, despite all this, gRPC implements its own API layer, so developers don't actually have to worry about the HTTP/2 implementation. They enjoy the benefits of HTTP/2 without the headache.

All of that magic being said, efficiency comes with a price. HTTP/2’s HPACK header compression makes the problem of tracing connections through sniffers much more difficult. Unless you know the entire session context from when the connection was established, it is difficult to decode the header information from sniffed traffic (See [this post](/ebpf-http2-tracing/) for more info and an example).

On its own, gRPC doesn’t provide tools to overcome this problem. Nor does it provide a way to collect incoming or outgoing data, or report stream control events, like the closing of a stream.

## eBPF to the rescue

What we need is a super power - one that will enable us to grab what we need from the gRPC library itself, rather than trying to get it from the raw session.

This is exactly what eBPF enables. Introduced in 2014, [eBPF](http://ebpf.io) enables observability of system functions in the Linux kernel, alongside powerful usermode monitoring capabilities - making it possible to extract runtime information from applications. Although eBPF is still maturing, it is rapidly becoming the go-to observability standard for Kubernetes and a variety of other distributed, microservices-based environments where traditional approaches to monitoring are too complicated, too resource-intensive or both.

Recognizing the power of eBPF as a gRPC monitoring solution, Pixie implemented an [eBPF-based approach for monitoring gRPC sessions](/ebpf-http2-tracing/) involving golang applications. Inspired by the benefits of that work to the community, we at groundcover decided to expand the eBPF arsenal to support gRPC monitoring in even more frameworks and programming languages, by monitoring the gRPC-C library.

Before diving into gRPC-C specifics, the following diagram illustrates the general approach to tracing gRPC with eBPF:

::: div image-xl
<svg title="" src='grpc-ebpf-tracing.png' />
:::

Using a mixture of uprobes and kprobes (eBPF code which triggers on user functions and kernel functions, respectively), we are able to collect all of the necessary runtime data to fully monitor gRPC traffic.

While the kprobes are agnostic to the gRPC library used (e.g Go-gRPC, gRPC-C), the uprobes are tailored to work with the specific implementations. The rest of the blog post will describe the gRPC-C specific solution.

## Tracing gRPC-C

Among the different implementations of gRPC, [gRPC-C](https://github.com/grpc/grpc) stands out as one of the more common variations, as it is used by default in many popular coding languages - Python, C, C# and more.

Our mission was to achieve complete gRPC observability - meaning the ability to observe both unary and streaming RPCs - for environments which use the gRPC-C library. We did so by tracing all of the following:

1. [Incoming and outgoing data](#incoming-and-outgoing-data)
2. [Plaintext headers (both initial and trailing)](#headers-initial-and-trailing)
3. [Stream control events (specifically, closing of streams)](#stream-control-events)

## Planning the solution

Before getting into the bits and bytes, it’s important to first describe the structure of the solution. Following the general uprobe tracing schema described in the diagram above, we implemented the following 3 parts:

1. The eBPF programs that are attached to the gRPC-C usermode functions. Note that even though the functions belong to userland, the code runs in a kernel context

2. The logic to parse the events that are sent from the eBPF programs to the usermode agent

3. The logic to find instances of the gRPC-C library, identify their versions and attach to them correctly

To help ensure that everything integrates nicely with the existing framework, we made sure our gRPC-C parsers produce results in a format that the existing Pixie Go-gRPC parsers expect. The result is a seamless gRPC observability experience, no matter which framework it came from.

## The nitty and gritty

In this part we will elaborate on how we approached each of the tasks described above.[^1]

### Incoming and outgoing data

**Tracing incoming data** turned out to be a relatively straightforward task. We simply probed the grpc_chttp2_header_parser_parse function. This is one of the core functions in the ingress flow, and it has the following signature:

```cpp
grpc_error* grpc_chttp2_data_parser_parse(void* /*parser*/,
                                          grpc_chttp2_transport* t,
                                          grpc_chttp2_stream* s,
                                          const grpc_slice& slice,
                                          int is_last)
```

The key parameters to note are `grpc_chttp2_stream` and `grpc_slice`, which contain the associated stream and the freshly received data buffer (=slice), respectively. The stream object will matter to us when we get to retrieving headers a bit later, but for now, the slice object contains the raw data we are interested in.

**Tracing outgoing data** proved to be a bit harder. Most of the functions in the ingress flow are inlined, so finding a good probing spot turned out to be challenging[^2].

::: div image-xl
<svg title="Central functions of the egress flow. All of the Flush_x functions are inlined in the compiled binary." src='tracing-outgoing-data.png' />
:::

To solve the challenge, we ended up choosing the `grpc_chttp2_list_pop_writable_stream` function, which is called just before the Flush_x functions are called. The function iterates over a list of gRPC Stream objects that have data ready for sending, and it returns the first one available. By hooking the return value of the function, we get the Stream object just before the data is encoded in the Flush_x functions - exactly what we are looking for!

```cpp
/* for each grpc_chttp2_stream that's become writable, frame it's data
     (according to available window sizes) and add to the output buffer */
  while (grpc_chttp2_stream* s = ctx.NextStream()) {
    StreamWriteContext stream_ctx(&ctx, s);
    size_t orig_len = t->outbuf.length;
    stream_ctx.FlushInitialMetadata();
    stream_ctx.FlushWindowUpdates();
    stream_ctx.FlushData();
    stream_ctx.FlushTrailingMetadata();
```

```cpp
    grpc_chttp2_stream* NextStream() {
    if (t_->outbuf.length > target_write_size(t_)) {
      result_.partial = true;
      return nullptr;
    }

    grpc_chttp2_stream* s;
    if (!grpc_chttp2_list_pop_writable_stream(t_, &s)) {
      return nullptr;
    }

    return s;
  }
```

### Headers (initial and trailing)

Tracing incoming and outgoing data is great, but it’s not enough to deliver full observability. Most of the context in gRPC is passed over the request and response headers. This is where you'll find out which resource is being accessed, what the request and response types are, and so on. Because the headers are encoded as part of the protocol,  (which makes them particularly hard to access, as we noted above) extracting their plaintext form is our next objective.

Looking at the functions we already found for data extraction, it seems we are in luck. Part of the logic in these functions deals with header encoding and decoding - for example, the FlushMetadata functions described above. We should be able to find plain text headers inside the same probe.

In practice, however, we noticed that for some cases, some of the headers were missing. Further examination of the codebase led us to note two other relevant functions, which we thought could help us find the missing pieces:

```cpp
void grpc_chttp2_maybe_complete_recv_initial_metadata(grpc_chttp2_transport* t,
                                                      grpc_chttp2_stream* s);
void grpc_chttp2_maybe_complete_recv_trailing_metadata(grpc_chttp2_transport* t,
                                                       grpc_chttp2_stream* s);
```

This is a good example of just how powerful and dynamic eBPF is - if at first you don’t succeed, probe, probe again. With minimal time and effort we were able to place new probes on those functions, and to our delight, found the missing headers. Mystery solved!

### Stream control events

The last bit of information we need for observability centers on stream control events – particularly the closing of streams. This data is important  because it lets us “wrap up” each individual request/response exchange over long-living connections.

Getting this data turned out to be easy enough.  We simply probed the `grpc_chttp2_mark_stream_closed` function, which is called when a given stream is closed for reading, writing or both. Sometimes, it’s just that simple. 🙂

## Portability is challenging

The functions we walked through above allowed us to get the gRPC observability data we needed from our environment.

However, one tricky thing about eBPF is that eBPF usermode programs are far less portable than they would ideally be. This is mainly due to the sheer amount of usermode code which exists. There is no easy way to formalize a [central solution such as the CO-RE project](https://nakryiko.com/posts/bpf-portability-and-co-re/), making portability a hassle. Code that works for us may not work for someone else.

We were cognizant of this challenge, and we took several steps to address it.

### Choosing stable functions

First, the functions we chose for probing are fitting in more than one way. Not only do they give us what we need, but, equally important, they continue to exist between major versions of the library - both in source code and compiled binaries. As far as we know, they are a stable safe haven in an ever changing codebase landscape.

However, it’s important to note that when dealing with uprobes, there are no real guarantees. Even the seemingly most stable functions could change and vanish completely as the codebase evolves, requiring additional work to keep the eBPF code functional.

### Dealing with stripped binaries

We know which functions we want to probe, but knowing is only half the battle. We still have to make sure the eBPF loader can find the functions. When probing the kernel itself or usermode applications that have debug symbols, this is trivial - we just need the name of the function (note that for C++ this would be the mangled name). However, we quickly noticed that newer compiled versions of the gRPC-C library are _stripped_, with all debug symbols removed. Naively trying to attach to those binaries will fail, as the eBPF loader can’t figure out where in the binary the functions are located.

Fear not! The functions _are_ there - we just need to find them. And fortunately, this is not our first reverse engineering rodeo - so we know that Ghidra and other RE methods can be used to locate the functions. Let’s look at the following example:

```cpp
gpr_log(GPR_INFO, "%p[%d][%s]: pop from %s", t, s->id,
            t->is_client ? "cli" : "svr", stream_list_id_string(id));
```

The code snippet above is taken from the `stream_list_pop` function, which is called by the `grpc_chttp2_list_pop_writable_stream` function we use as part of our solution. The log string that it prints out is unique, making it easy enough to find in the binary. Using this approach, we could either write a script that locates the functions beforehand in each Docker image and use a hashmap to track which binary uses which version, or get this information at runtime through the eBPF agent.

### Finding the correct field offsets

As structs in the gRPC-C library shift and evolve, the order and size of their fields may vary. Changes such as these immediately affect our eBPF code, which needs to traverse different objects in the memory to find what it needs. Let’s look at an example:

```cpp
grpc_chttp2_incoming_metadata_buffer_publish(&s->metadata_buffer[1], s->recv_trailing_metadata);
```

This code snippet is taken from the `grpc_chttp2_maybe_complete_recv_trailing_metadata` function, which we use for retrieving the trailing headers of the stream. In order to do so, we traverse  the `s→recv_trailing_metadata` object - so we have to know the offset of this field inside `grpc_chttp2_stream`. However, as seen in the decompiled code, the offset can change for different versions. This means that whenever a new version of the gRPC-C library is released, the tracing code needs to be checked against that version and potentially updated to read the appropriate offset:

```cpp
// Offset of recv_trailing_metadata inside a grpc_chttp2_stream object
case GRPC_C_V1_24_1:
      offset = 0x170;
      break;
case GRPC_C_V1_33_2:
      offset = 0x168;
      break;
…
BPF_PROBE_READ_VAR(&dst, (void*)(src+offset));
```

## Squaring the circle of gRPC monitoring

Monitoring gRPC requests wasn't a trivial task – at least until eBPF came around.

Today, with the help of eBPF functions, we can get the data we need to achieve gRPC observability. Specifically, we can trace data, headers and stream closes. Finding the right functions to achieve these tasks was not simple, as we demonstrated above. But with a little trial and error (and a bit of help from software reverse engineering tools), we were able to build a solution that will work reliably, even as eBPF continues to evolve.

## Footnotes

[^1] All source code snippets were taken from gRPC-C version 1.33
[^2] eBPF requires the functions to exist as actual functions, which is the opposite of inlining. For example, think about what happens when trying to add a probe at the end of an inlined function. Since the function was inlined, the return instructions are completely gone, and there’s no simple way to find the correct point to hook.
