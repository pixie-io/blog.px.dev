---
path: '/plugin-system'
title: 'Open Observability with the Pixie Plugin System'
date: 2022-5-12T00:00:00.000+00:00
featured_image: hero-image.png
categories: ['Pixie Team Blogs', 'Announcements', 'Kubernetes']
authors: ['Michelle Nguyen']
emails: ['michelle@pixielabs.ai']
---

At Pixie, we believe that **the future of observability lies in open source**.

With the rise of open standards such as [OpenTelemetry](https://opentelemetry.io/), it is easier than ever to go from a fresh cluster to full observability. It is as simple as deploying standard-friendly agents and sending data to the tool(s) of your choice. Want to analyze metrics in Prometheus and explore your traces in Jaeger? That’s supported. Want to track those traces in Zipkin instead? Easy. Gone are the days of restrictive, proprietary agents designed to work with one specific tool. The interoperability of open source tooling makes it painless to adopt and switch out products that best fit a developer’s needs.

## Pixie Plugin System

With these beliefs in mind, we built the [Pixie Plugin System](https://github.com/pixie-io/pixie-plugin). At its core, Pixie focuses on providing a no-instrumentation, real-time debugging platform. However, effectively monitoring clusters and applications requires more. Developers need long-term data retention to track historical trends and perform comparisons overtime. They want alerts to notify them when something has gone wrong. Rather than building out all of these capabilities into Pixie, we recognize there are already other excellent tools which offer these features. We took inspiration from [Grafana’s Plugins](https://grafana.com/docs/grafana/latest/plugins/) which allows users to enhance their Grafana experience by integrating with other tools as datasources and panels. The Plugin System is designed to embrace the interoperability of open source software and leverage the strengths of other tools in the ecosystem.

::: div image-xl
<svg title='The OpenTelemetry plugin comes with several preset scripts. You can also add your own scripts to export custom Pixie data in the OpenTelemetry format.' src='otel-plugin-scripts.png' />
:::

The initial version of the Pixie Plugin System aims to address Pixie’s data storage limitations. Pixie stores its collected data in-cluster for performance and security benefits. However, paired with a large dataset, this restricts our data storage to the last 24 hours. The Pixie Plugin System enables long-term retention for Pixie data by providing export to other tools. By relying on OpenTelemetry as Pixie’s export format, Pixie’s metrics and traces can be ingested by any OpenTelemetry-supported product. You can [enable the plugin]() for your favorite tool, and Pixie will immediately start egressing data. Each plugin provider has pre-configured a set of default scripts to export data best complemented by the tool. However, you can also [write custom export scripts](https://docs.px.dev/tutorials/integrations/otel/) to send any Pixie data you want.

## What's Next?

With Pixie’s Plugin System, we envision a future where Pixie’s telemetry data can be consumed anywhere. However, integrating across many tools has its drawbacks. Navigating and context-switching from tool to tool is cumbersome and inefficient. The future of Pixie’s Plugin System aspires to unite these tools in a central location. All from within the Pixie UI, developers will be able to configure alerts across products, query long-term data from different sources using Pixie’s scriptable views, and more. Pixie’s goal has always been to make gaining visibility into developers’ clusters and applications as simple as possible. By leveraging the benefits of open source and open standards, we hope to make observability more powerful, easy, and accessible for all developers.

## Get Started

Here are some materials to get started using Pixie Plugins:

- Read the [Export OpenTelemetry Data](https://docs.px.dev/tutorials/integrations/otel/) tutorial
- Check out the Plugin System [reference docs](https://docs.px.dev/reference/plugins/plugin-system)
- See the list of [available plugins](https://github.com/pixie-io/pixie-plugin#available-plugins)
- Learn how to [contribute a plugin](https://github.com/pixie-io/pixie-plugin#contributing)
