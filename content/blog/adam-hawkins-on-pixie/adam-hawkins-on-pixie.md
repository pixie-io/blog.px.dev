---
path: '/adam-hawkins-on-pixie'
title: 'Adam Hawkins On Pixie'
category: 'Guest Blogs'
author: 'Adam Hawkins'
email: 'adam@hawkins.io'
featured: true
featured_image: hero-image.png
date: 2020-06-17T06:00:00.000+00:00
---

I, [Adam Hawkins](https://hawkins.io), recently tried Pixie. I was
instantly impressed because it solved a recurring problem for me:
application code changes. Let me explain.

As an SRE, I'm responsible for operations, but am often unaware of the
services internals. These services
are black boxes to me. If the box is an HTTP service, then that
requires telemetry on incoming request counts, latencies, and
response status code--bonus points for p50, p90, and p95 latencies. My
problem, and I'm guessing it's common to other SRE and DevOps teams,
is that these services are often improperly instrumented. Before
Pixie, we would have to wait on the dev team to add the required
telemetry. Truthfully, that's just toil. It would be better for
SREs, DevOps engineers, and application developers to have
telemetry provided automatically via infrastructure. Enter Pixie.

Pixie is the first telemetry tool I've seen that provides
operational telemetry out of the box with **zero** changes to
application code. SREs can simply run `px deploy`, start collecting
data, then begin troubleshooting in minutes.

It took me a bit to grok Pixie because it's different than
tools like NewRelic or DataDog that I've used in the past. Tools like
these are different than Pixie becauase:

* They require application code changes (like adding in
  client library or annotating Kubernetes manifests) to gather full
  telemetry.
* They're largely GUI driven.
* Telemetry is collected then shipped off to a centralized service
  (which drives up the cost).

Pixie is radically different. 

* First, it integrates with eBPF so it can
collect data about application traffic without application code
changes.  Pixie provides common HTTP telemetry (think request counts,
latencies, and status codes) for all services running on your
Kubernetes cluster.  Better yet, Pixie generates service to service
telemetry, so you're given a service map right out of the box. 
* Second, it bakes infrastructure-as-code principles into the core DX. Every
Pixie Dashboard is a program, which you can manage with version
control and distribute amongst your team, or even take with to
different teams. Pixie also provides a terminal interface so you can
interact with the dashboards directly in the CLI. That's a first for
me and I loved it! These same scripts can also run in the browser.
* Third, and lastly, Pixie's data storage and pricing model is
different. Pixie keeps all telemetry data on your cluster, as a result
the cost is signicantly lower. It's easy to pay $XXX,XXX dollars per
year for other tools. Pixie's cost promises to be orders of
magnitude less.

Sounds interesting right? 

Check out my demo video for quick
walkthrough.

<iframe width="560" height="315" src="https://www.youtube.com/embed/_MlD-hVjVok" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Pixie is in free community beta right now. You can install it on your
cluster and try it for yourself.
