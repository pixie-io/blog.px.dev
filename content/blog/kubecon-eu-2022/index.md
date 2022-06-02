---
path: '/kubecon-eu-2022'
title: 'Come meet us at Kubecon EU 2022'
date: 2022-05-13T00:00:00.000+00:00
featured_image: hero-image.png
categories: ['Pixie Team Blogs', 'Announcements', 'Kubernetes']
authors: ['Zain Asgar', 'Michelle Nguyen']
emails: ['zasgar@pixielabs.ai', 'michelle@pixielabs.ai']
---


<alert severity="info">
Recordings of the KubeCon + CloudNativeCon talks are now live! Check out this <a href="https://youtube.com/playlist?list=PLwam28KvZfrSTr5at3blIdY5YKzS2T6W-">YouTube playlist</a> to watch the Pixie contributor talks.
</alert>

Pixie contributors will be attending this year’s KubeCon + CloudNativeCon Europe 2022 in person in Valencia, Spain and virtually!

Come chat about open source observability for Kubernetes with Pixie’s core contributors at our booth in the Project Pavilion.

Pixie contributors will also be speaking at the following events:

- [**Bpftrace Meets Pixie: Dynamic Monitoring of K8s Clusters Unleashed**](https://sched.co/zrPc) ([eBPF Day](https://cloudnativeebpfdayeu22.sched.com/?iframe=no) Monday, May 16, 2022 11:55 CEST)<br/><br/>
Bpftrace is an essential tool for developers investigating the workings and performance of applications on Linux systems; Pixie is an eBPF-based observability platform for real-time troubleshooting of applications on Kubernetes. What if you could bring these two open-source projects together and combine the power of bpftrace with Pixie's approach to monitoring Kubernetes? This session presents Pixie's bpftrace integration and how it enables dynamic monitoring of Kubernetes clusters. This talk will show how Pixie can deploy a bpftrace program across all the nodes of your cluster, and make the collected data available for querying and visualization. Topics include (1) an overview of how the Pixie bpftrace integration works, (2) how to import existing bpftrace scripts (or write new ones) into Pixie, and (3) how to use the Pixie's query language to perform real-time debugging of Kubernetes applications. The talk will include a number of live demonstrations, including how bpftrace + Pixie can identify TCP issues, and even how to discover patterns of unauthorized bitcoin mining in your K8s cluster.

- [**Lightning Talks: Detecting Data Exfiltration on the Edge with Pixie**](https://sched.co/zsTa) ([SecurityCon](https://cloudnativesecurityconeu22.sched.com/) Monday, May 16, 2022 15:10 CEST)<br/><br/>
Detecting data exfiltration in your Kubernetes cluster is important but hard. Capturing the right data, especially encrypted data, in order to perform the analysis can be a hassle. Additionally, it can be a non-starter to export sensitive requests outside of the cluster to perform this analysis. In this lightning talk, you’ll learn how Pixie (an open source, CNCF sandbox project), can be applied to attack this problem. Pixie’s auto-telemetry, in-cluster edge compute, and scriptability make it a powerful tool for anyone looking to identify data exfiltration attacks in their cluster. We’ll show a demo which will also be open source for attendees to reference later.

- [**Virtual Project Office Hours**](https://sched.co/zdqe) (Wednesday May 18, 2022 13:30 CEST)<br/><br/>
We're excited to meet everyone at our office hours! We welcome all questions about Pixie, whether they're questions about what Pixie is, or low-level questions about Pixie's internal workings.

- [**Autoscaling Kubernetes Deployments: A (Mostly) Practical Guide**](https://sched.co/ytmH) (Wednesday, May 18, 2022 15:25 CEST)<br/><br/>
Sizing a Kubernetes deployment can be tricky. How many pods should it have? How much CPU/memory is needed per pod? Is it better to use a small number of large pods or a large number of small pods? What’s the best way to ensure stable performance when the load on the application changes over time? Luckily for anyone asking these questions, Kubernetes provides rich, flexible options for autoscaling deployments. This session will cover the following topics: (1) Factors to consider when sizing your Kubernetes application (2) Horizontal vs Vertical autoscaling (3) How, when, and why to use the Kubernetes custom metrics API. It will also include a practical demo (autoscaling an application with various custom metrics) and an impractical demo (a Turing-complete autoscaler)!

- [**Reproducing Production Issues in your CI Pipeline Using eBPF**](https://sched.co/ytpE) (Thursday, May 19, 2022 14:30 CEST) <br/><br/>
Observing production workloads with enough detail to find real problems is difficult, but it's getting easier with the community adoption of eBPF. As the technology becomes better understood, tools like Falco, Cilium and Pixie are increasingly appearing in production clusters. But have you ever considered using eBPF data to help with unit tests, Continuous Integration and load testing? This talk will explain the basic technology behind eBPF while presenting some examples of how to use data collected via eBPF for a variety of software quality use cases. We'll use the Pixie CNCF sandbox project to pull data and replicate production issues on the developer desktop for debugging. You'll also get some ideas on using those calls in your Continuous Integration pipeline to sanity check builds before they are deployed. Included in that discussion will be handling some common issues like timestamp skew and authentication. All examples are open source and available after the talk.

Here are some of the events we'll be attending. We hope to see you at them, along with the many other exciting talks at Kubecon!

**Wednesday, May 18**

- 11:00 CEST: [Fluent Bit: Logs, OpenMetrics, and OpenTelemetry all-in-one](https://sched.co/ytl1) - Eduardo Silva & Anurag Gupta (Calyptia)
- 11:00 CEST: [Intro to Kubernetes, GitOps, and Observability Hands-On Tutorial](https://sched.co/ytkj) - Joaquin Rodriguez (Microsoft), Tiffany Wang (Weaveworks)

**Thursday, May 19**

- 11:55 CEST: [OpenTelemetry: The Vision, Reality, and How to Get Started](https://sched.co/ytob) - Dotan Horovits (Logz.io)
- 14:30 CEST: [Prometheus Intro and Deep Dive](https://sched.co/ytpW) - Julius Volz (PromLabs), Björn Rabenstein (Grafana Labs), Julien Pivotto (Inuits), Matthias Rampke (SoundCloud)

**Friday, May 20**

- 14:55 CEST: [Build a Cloud Native Logging Pipeline on the Edge with Fluentbit Operator](https://sched.co/ytt3) - Feynman Zhou (QingCloud)
- 16:00 CEST: [A Guided Tour of Cilium Service Mesh](https://sched.co/yttj) - Liz Rice (Isovalent)
