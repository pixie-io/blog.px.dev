---
path: '/kubecon-na-2022'
title: 'Come meet us at Kubecon NA 2022'
date: 2022-10-18T00:00:00.000+00:00
featured_image: hero-image.png
categories: ['Pixie Team Blogs', 'Announcements', 'Kubernetes']
authors: ['Zain Asgar', 'Michelle Nguyen']
emails: ['zasgar@pixielabs.ai', 'michelle@pixielabs.ai']
---

Pixie contributors will be attending this year’s [KubeCon + CloudNativeCon North America 2022](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/) in Detroit, Michigan!

Come chat about open source observability for Kubernetes with Pixie’s core contributors at our booth in the [Project Pavilion](https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/program/project-engagement/#project-pavilion).

Pixie contributors will also be speaking at the following events:

- [**OpenTelemetry or eBPF? That is the Question**](https://sched.co/1Auyh) ([eBPF Day](https://events.linuxfoundation.org/cloud-native-ebpf-day-north-america/) - Monday, October 24, 2022 9:25 AM EDT)<br/><br/>
_In the observability space, OpenTelemetry and eBPF are two technologies that have been rapidly changing the landscape. So which should you use? The OpenTelemetry project provides a rich set of tools with which teams can instrument their applications, enabling deep visibility into the application behavior. eBPF, on the other hand, has been powering instrumentation-less observability through other projects like the CNCF Pixie and Hubble projects. In this environment, users often wonder which approach they should turn to. In this session, we'll cover the strengths and weaknesses of both approaches, and show how both approaches have a role to play. We'll demonstrate how eBPF observability tools can be configured to export to OpenTelemetry collectors as automatic data sources. We'll then focus on the problem of tracing, and how request tracing works with eBPF and OpenTelemetry. In this process, we'll show how eBPF has the power to avoid some manual instrumentation; in contrast, we'll show how instrumentation is still required for true distributed tracing today. The session will wrap up with a perspective into the future of the two technologies, and what is on the horizon._

- [**Tracing SSL/TLS Encrypted Microservices with eBPF**](https://sched.co/1Auyt) ([eBPF Day](https://events.linuxfoundation.org/cloud-native-ebpf-day-north-america/) - Monday, October 24, 2022 11:15 AM EDT)<br/><br/>
_SSL/TLS adoption in the Cloud Native environments is growing rapidly. While great for security, the encryption in such environments pose a unique challenge for observability tools. Many traffic sniffing tools can only collect the encrypted data, which is of limited value to the application developer. Important attributes like the operation, the endpoint and the payload are undecipherable. To truly help in the troubleshooting process, application developers need to be able to see these messages and their contents. In this talk, we present how eBPF can be used to tracing SSL/TLS connections. The method we present is used by tools like BCC’s sslsniff and Pixie’s protocol tracer. Specifically, we cover how eBPF uprobes can be attached to popular SSL/TLS libraries, including OpenSSL, BoringSSL and goTLS. We show how eBPF enables us to collect clear text data directly from the TLS library, while discussing the challenges of tracing dynamically vs statically linked TLS libraries. Finally, we also present how this feature could help with improving application observability at some of the largest engineering organizations without disrupting their production environment._

- [**When the Logs Just Don’t Cut It: Root-Causing Incidents Without Re-Deploying Prod**](https://sched.co/182IS) (Friday, October 28, 2022 2:00 PM EDT) <br/><br/>
_We’ve all been there: your pod is crash-looping, you check the logs and you realize you forgot to log something important - now you’re unable to figure out what went wrong. You try to reproduce the problem locally with no luck: it only seems to happen in production. What do you do? Do you re-deploy to production with more print statements? You could burn hours doing that while you risk more problems. What if you could instead get that same data without the headache of restarting prod? In this talk, I’ll show you how to magically collect this data using bpftrace. Bpftrace lets you capture lots of useful data (function arguments, return values, latencies of individual functions - just to name a few) without re-deploying pods. Bpftrace is very powerful, but can be complex to work with, especially in multi-node environments like a Kubernetes cluster. I’ll show you how to cut past these problems by walking through a demo incident. I’ll show you some tips and tricks for working with bpftrace on Kubernetes, including how to leverage Pixie to easily deploy and collect data from bpftrace scripts._

Here are some of the events we'll be attending. We hope to see you at them, along with the many other exciting talks at Kubecon!

**Wednesday, October 26**

- 11:55 AM EDT: [Resize Your Pods In-Place With Deterministic eBPF Triggers](https://sched.co/182HU) - Pablo Chico de Guzman (Okteto), Vinay Kulkarni (Futurewei Technologies)

- 2:30 PM EDT: [Kubernet-Bees: How Bees Solve Problems Of Distributed Systems](https://sched.co/182DK) - Simon Emms & Christian Weichel (Gitpod)

- 4:30 PM EDT: [Fluent Bit V2.0: Unifying Open Standards For Logs, Metrics & Traces](https://sched.co/182NO) - Eduardo Silva & Anurag Gupta (Calyptia)

**Thursday, October 27**

- 11:55 AM EDT: [Edge-Native Application Principles: Taking Your App Beyond the Cloud](https://sched.co/182Nv) - Kate Goldenring (Fermyon), Amar Kapadia (Aarna Networks)

- 2:30 PM EDT: [Edge-Native: The New Paradigm For Operating And Developing Edge Apps](https://sched.co/182Gx) - Frank Brockners (Cisco)
