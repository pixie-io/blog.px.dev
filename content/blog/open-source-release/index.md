---
path: '/open-source-release'
title: 'Open sourcing Pixie under Apache 2.0 license'
date: 2021-5-04T06:00:00.000+00:00
featured_image: hero-image.png
categories: ['Pixie Team Blogs']
authors: ['Zain Asgar', 'Pixie Founding Team']
emails: ['zasgar@pixielabs.ai']
featured: true
---

We are thrilled to announce that Pixie has officially been open sourced by New Relic. Pixie is an in-cluster observability platform for Kubernetes. It's designed to be a low friction tool for developers to debug and monitor their applications.

As a quick background for those new to the project, here are Pixie's three most important capabilities:

### Auto-Instrumentation

Manually adding instrumentation to existing codebases can be a burden for teams. Pixie provides immediate, significant baseline visibility into the target system. Once deployed, it automatically collects full-body application requests from a variety of protocols, system metrics, and network-level data. Pixie's auto-instrumentation is powered by eBPF, a Linux kernel technology popularized by Brendan Gregg.

### Fully Scriptable

As developers, we wanted Pixie to be a fully programmatic interface so that it can better fit into our own workloads. Pixie uses a Pythonic query language called PxL, based on Pandas syntax. All of Pixie's clients (CLI, API, and web UI) use PxL scripts to analyze data. Pixie ships with a rich set of PxL scripts out of the box, but users can also write their own PxL scripts to perform custom analysis. PxL also serves as the interface for importing and exporting Pixie data to other systems.

### In-Cluster Edge Compute

Shipping large amounts of telemetry data to remote data stores often introduces a significant burden on the network as well as privacy concerns when the data is sensitive. Pixie performs all data storage and computation entirely on the user’s Kubernetes cluster. This architecture allows the user to isolate data storage and computation within their environment for finer-grained context, faster performance, and a greater level of data security.

## What is being open sourced?

With today's release, it is now possible to run an entirely self-hosted version of Pixie without third-party dependencies or vendor lock-in.

Here is a summary of the major components we have made available:

- **Vizier** - Pixie's in-cluster data collection and query engine. Vizier runs on a Kubernetes cluster and collects data, stores it locally within the cluster, and executes queries for Pixie clients (CLI, API, web UI).
- **Pixie Cloud** - Pixie's cloud is responsible for managing users, profiles, projects, and other administrative parts of the application.
- **Pixie Docs** - Documentation for the OSS project.
- **Pixie Website** - OSS project website.

Users can choose to self-host Pixie entirely, or to run Vizier in conjunction with Pixie Cloud hosted by New Relic to reduce management burden.  New Relic-hosted Pixie will remain entirely free, and users can choose to send data to New Relic One.

- Reference docs for the hosted version of Pixie will continue at [pixielabs.ai](https://pixielabs.ai) and [docs.pixielabs.ai](https://docs.pixielabs.ai).
- In order to preserve vendor neutrality for OSS Pixie, reference docs for the OSS version of Pixie will live at [px.dev](https://px.dev) and [docs.px.dev](https://docs.px.dev).

The blog and website assets look similar today, but we expect them to diverge over time as the OSS project develops.

## Why open source?

Our vision for Pixie is to build a ubiquitous data platform for application infrastructure. We hope that developers will build new applications that use Pixie data in ways we haven't thought of yet. In terms of building a community around Pixie, it was important to make Pixie accessible to any developer using Kubernetes. In order to support these goals, we decided to open source the project. New Relic boldly supported this decision as part of acquiring Pixie Labs in December 2020. After the acquisition, New Relic also committed to ensuring that the entire Pixie Labs team remain 100% focused on the Pixie project.

Here are three decisions we made in order to preserve the integrity of Pixie as an open source project:

- **Apache 2.0 License**: Pixie is an Apache 2.0 Licensed project.
- **Contributing Pixie to CNCF**: New Relic [started the process](https://github.com/cncf/toc/issues/651) to contribute Pixie as a new CNCF observability open source Sandbox project. CNCF is the home for cloud-native open source projects dedicated to vendor neutrality.
- **Built to integrate with other tools**: We are working to add support to export data to OpenTelemetry. This will allow Pixie data to easily interoperate with data collected by other observability tools. We have a Grafana data-source plugin under development and will be building a native Prometheus integration. Developers can also use our client API in order to easily export Pixie data anywhere.
- **Cross-vendor governance structure**: Pixie's board is made up of 2 members from the Pixie team ([Zain Asgar](https://twitter.com/zainasgar) and [Michelle Nguyen](https://twitter.com/michelle_aimi)), 2 community members ([Kelsey Hightower](https://twitter.com/kelseyhightower) and [Jaana Dogan](https://twitter.com/rakyll)), and 2 end-user community members (currently [Dax McDonald](https://twitter.com/cloudmarooned)).

We believe that by contributing Pixie as a truly open source project to the community, we can maximize the impact it has. We hope to see it power entirely new applications build on top of the data we collect.

## Getting started

Here are some materials to get started with our OSS version of Pixie:

- [About Pixie](https://docs.px.dev/about-pixie/what-is-pixie/)
- [Quick-start guide](https://docs.px.dev/installing-pixie/quick-start/)
- Tutorials
  - [Using the CLI](https://docs.px.dev/using-pixie/using-cli/)
  - [Using the web UI](https://docs.px.dev/using-pixie/using-live-ui/)
  - [Using the API](https://docs.px.dev/using-pixie/api-quick-start/)
  - [Writing a PxL script](https://docs.px.dev/tutorials/pxl-scripts/)
  - [Pixie-powered Slackbot](https://docs.px.dev/tutorials/slackbot-alert/)

As mentioned earlier, docs for our hosted solution can be found at [pixielabs.ai](https://pixielabs.ai).

### Acknowledgements

We would like to thank all of our users for their feedback and help in building Pixie. Big thanks to our advisors, Kelsey Hightower and Jaana Dogan, as well as the entire Pixie team. Thanks to New Relic for supporting our open source vision for Pixie. Finally, thank you to Brendan Gregg for his trailblazing work with eBPF.
