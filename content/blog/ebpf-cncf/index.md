---
path: '/ebpf-cncf'
title: 'A brief stroll through the CNCF eBPF landscape'
date: 2022-4-19T06:00:00.000+00:00
featured_image: hero-image.png
categories: ['Pixie Team Blogs', 'eBPF']
authors: ['Hannah Troisi']
emails: ['htroisi@pixielabs.ai']
---

eBPF has been steadily gaining traction in the past few years. The foundation for the idea sounds a bit esoteric on the surface - running user-defined programs in the Linux kernel. However, **eBPF has made a huge splash because of the major applications it has in fields like observability, networking, and security**.

In particular, eBPF made a large impact in the cloud native community. This is because the move to Kubernetes and microservices has introduced new challenges in deploying, monitoring, and securing applications - challenges that eBPF can help address.

With a lot of buzz and excitement, it can be hard to understand the adoption and applications of a technology like eBPF. In this blog post, we’ll get a quick overview of a few CNCF open source projects that are applying eBPF to solve important problems.

## What is eBPF?

[eBPF](https://ebpf.io/what-is-ebpf) is a revolutionary technology that allows you to run lightweight sandboxed programs inside of the Linux kernel.

The operating system is the ideal location to implement observability, networking, and security functionality as it can oversee the entire system. However, before eBPF came onto the scene, writing code for the kernel was fraught with stability and compatibility issues: there was no guarantee that your code wouldn’t crash the kernel and changing kernel versions and architecture could easily break code.

**eBPF is game changing, because it provides a safe and efficient way to run code in the kernel.** As shown in the overview below, eBPF allows the kernel to run BPF bytecode. While the front-end language used can vary, it is often a restricted subset of C. Typically the C code is first compiled to the BPF bytecode using Clang, then the bytecode is verified to make sure it's safe to execute. These strict verifications guarantee that the machine code will not intentionally or accidentally compromise the Linux kernel, and that the BPF probe will execute in a bounded number of instructions every time it is triggered.

::: div image-xl
<svg title='Example eBPF observability application (from <a href="https://www.brendangregg.com/ebpf.html#ebpf">brendangregg.com</a>).' src='linux_ebpf_internals.png' />
:::

## What is the CNCF?

The [Cloud Native Compute Forum](https://www.cncf.io/) (CNCF) exists to promote the growth of the cloud native ecosystem. One of the ways it does this is by providing a vendor-neutral home for open source cloud-native projects. If you’ve worked with Kubernetes or Prometheus, you’ve already used a CNCF project. The CNCF brings together some of the world’s top developers and by looking at the emerging technologies used in its projects, you can get a glimpse into the direction of the future of cloud computing.

You can check out all of the CNCF’s open source projects [here](https://landscape.cncf.io/?project=hosted).

## eBPF in CNCF Projects

Let’s examine how three different CNCF projects have applied eBPF to solve problems in the cloud-native space.

### Falco (Security)

Securing software applications is already a difficult task, but when you break your applications into many small, scalable and distributed microservices, it can get even harder.

**[Falco](https://falco.org/) is an open source runtime security tool.** Runtime security is the last layer of defense when securing your Kubernetes cluster and is designed to alert you to threats that sneak past other defense protections.

Falco monitors system calls to check for [a variety of unusual behavior](https://falco.org/docs/#what-does-falco-check-for), such as:

- Privilege escalation using privileged containers
- Namespace changes using tools like `setns`
- Read/Writes to well-known directories such as `/etc`, `/usr/bin`, `/usr/sbin`, etc
- Executing shell binaries or SSH binaries

As shown in the diagram below, Falco can use an eBPF driver to safely and efficiently produce a stream of system call information. These system calls are parsed by the userspace program which checks against the rules defined in the configuration to determine whether to send an alert.

::: div image-xl
<svg title='Diagram showing how Falco works (from <a href="https://sysdig.com/blog/intro-runtime-security-falco/#how-dow-falco-work">Sysdig</a>).' src='falco.png' />
:::

[Falco supports multiple drivers](https://falco.org/blog/choosing-a-driver), including one using a kernel module and one using eBPF probes. Compared to the original kernel module, the newer eBPF driver is considered safer as it is unable to crash or panic a kernel. The eBPF driver is also able to run in environments where loading a kernel module is not an option (such as GKE).

To get started with Falco, check out the guide [here](https://falco.org/docs/getting-started/).

### Pixie (Observability)

Kubernetes makes it easier to decouple application logic from infrastructure and scale up independent microservices. However, this introduces new complexity in observing the system's behavior.

**[Pixie](https://px.dev/) is an open source observability tool for Kubernetes applications.** Observability is a rather vague term, but in Pixie’s case this includes [full-body application requests](https://docs.px.dev/tutorials/pixie-101/request-tracing/), [application profiles](https://docs.px.dev/tutorials/pixie-101/profiler/) and [network](https://docs.px.dev/tutorials/pixie-101/network-monitoring/) and [infra](https://docs.px.dev/tutorials/pixie-101/infra-health/) health metrics.

All of the telemetry data provided by the Pixie platform is [automatically captured using eBPF](https://docs.px.dev/about-pixie/pixie-ebpf/). By using eBPF, Pixie eliminates the need for traditional manual instrumentation. Let’s take a look at how this works for application request tracing.

::: div image-xl
<svg title='Pixie protocol tracing using eBPF (from <a href="https://docs.px.dev/about-pixie/pixie-ebpf/">docs.px.dev</a>).' src='pixie.svg' />
:::

When Pixie is deployed to the nodes in your cluster, it deploys eBPF kernel probes that are set up to trigger on the Linux syscalls used for networking. When your application makes any network-related syscalls -- such as `send()` and `recv()` -- Pixie's eBPF probes snoop the data and send it to Pixie’s edge module. The edge module parses the data according to the detected protocol and stores the data in tables locally on the node. These [data tables](https://docs.px.dev/reference/datatables/) can then be queried and visualized using the Pixie API, CLI or web-based UI.

Got encrypted traffic? eBPF probes can be used to [trace TLS connections](https://docs.px.dev/about-pixie/pixie-ebpf/#protocol-tracing-tracing-tlsssl-connections) too!

To get started with Pixie, check out the guide [here](https://docs.px.dev/installing-pixie/install-guides/).

### Cilium (Networking)

Kubernetes can be highly dynamic with large numbers of containers getting created and destroyed in just seconds as applications scale to adapt to load changes or during rolling updates. This ephemeral nature of Kubernetes [stresses the traditional networking approach](https://docs.cilium.io/en/stable/intro/#why-cilium-hubble) that operates using IP addresses and ports - as these methods of identification can frequently change.

Kubernetes can be highly dynamic with large numbers of containers getting created and destroyed in just seconds as applications scale to adapt to load changes or during rolling updates. For large clusters, this ephemeral nature of Kubernetes stresses the traditional network security approaches that operate using IP addresses and ports.

**[Cilium](https://cilium.io) is an open source Kubernetes container networking interface (CNI) plugin** for providing and transparently securing network connectivity and load balancing between application workloads.

Similarly to Pixie, Cilium uses eBPF to observe network traffic at the Linux syscall level. However, Cilium also uses eBPF at the XDP/tc layer to influence the routing of packets. By being able to observe and interact with network traffic, eBPF allows Cilium to transparently insert security visibility + enforcement in a way that incorporates service / pod / container context. This solves the aforementioned networking problem by decoupling security from IP addresses and ports and instead using Kubernetes context for identity.

::: div image-xl
<svg title='eBPF is the foundation of Cilium. Diagram from (from <a href="https://cilium.io/get-started">cilium.io</a>).' src='cilium.png' />
:::

[Hubble](https://github.com/cilium/hubble) is part of the Cilium project which **provides network and security observability for cloud native workloads.** Hubble provides [service maps](https://github.com/cilium/hubble#service-dependency-graph), [network](https://github.com/cilium/hubble#networking-behavior) health and [application request](https://github.com/cilium/hubble#http-requestresponse-rate--latency) monitoring. Hubble uses Cilium for data collection and Envoy for protocol parsing and filtering.

To get started with Cilium and Hubble, check out the guide [here](https://docs.cilium.io/en/stable/gettingstarted/).

## Conclusion

eBPF is an innovative technology that has led to efficiency improvements and new capabilities in fields like observability, networking, and security. We highlighted three CNCF projects that are currently using eBPF, however, we expect to see many more projects leveraging eBPF in the future.

Have questions? Need help? Find us on [Slack](https://slackin.px.dev/) or [Twitter](https://twitter.com/pixie_run).
