---
path: '/endpoint-deprecation'
title: 'Can I deprecate this endpoint?'
date: 2022-01-11T06:00:00.000+00:00
featured_image: hero-image.png
categories: ['Pixie Team Blogs', 'Kubernetes']
authors: ['Hannah Troisi']
emails: ['htroisi@pixielabs.ai']
---

Nothing lasts forever, including even the best designed APIs.

Let’s imagine you are a developer who has taken over ownership of a Catalog microservice. You’ve been asked to deprecate the `/v1/catalog` endpoint in favor of the new `/v2/catalog` endpoint. How do you go about this?

Whatever the reason for removal – a new version or a planned end-of-life – the first step in a _graceful_ API deprecation is to observe:

- Is this endpoint used?
- If so, who is calling it?

## Is this endpoint used?

Before you can deprecate the endpoint, you need to first check if the endpoint is actually being used.

### Search the codebase

For internal endpoints, a great way to start is to search the codebase for calls to the API. However, once you believe all calls have been removed, you will still want to use observability tooling to verify that all usage of the API has indeed stopped.

Note that most established companies have standards for backwards compatibility of their microservice APIs (even internal ones). For example, a company might have a policy requiring 3 releases to pass between deprecation of an API and removal, in the event that there’s a rollback.

### Verify with observability tooling

Your company’s specific method for determining endpoint usage may vary. Some applications export metrics that they explicitly define on their services (e.g. Prometheus). Some applications are set up to log every inbound HTTP request (e.g. Apache logging).

Another option is to use [Pixie](https://github.com/pixie-io/pixie), an open source observability tool for Kubernetes applications. Pixie automatically traces request traffic of [numerous protocols](https://docs.px.dev/about-pixie/data-sources/) (HTTP, MySQL, gRPC, and more) [using eBPF](https://docs.px.dev/about-pixie/pixie-ebpf/). But no matter how you gather the data, you’ll need to answer the same questions.

Let’s check for HTTP traffic to the `/v1/catalog` endpoint.

::: div image-xl
<svg title='Output of a PxL script showing all HTTP/2 traffic sent to a specific service.' src='service-traffic.png' />
:::

### Endpoints with wildcards?

Now you have an answer: the  `/v1/catalog` endpoint _is_ actually being used.

Taking a look at the different request paths, you can see that the endpoint contains a wildcard parameter. In this case, it appears we have a `/v1/catalog/{uuid}/details` endpoint that takes an `uuid` query parameter that will change depending on the product the API client would like to get details about.

Clustering by logical endpoint provies a better high-level view of the usage of the API.

For example, these two calls:

```
/v1/catalog/d3588631-ad8e-49df-bbd6-3167f7efb291/details
/v1/catalog/d3234332-s5fe-s30s-gsh6-323434sdf634/details
```

Should be clustered together into the logical endpoint:

```
/v1/catalog/*/details
```

Let’s cluster the requests to the Catalog service by logical endpoint. Pixie takes a statistical approach to this, but you can also try to manually build patterns with regexes.

::: div image-xl
<svg title='Output of PxL script showing all endpoints for a specific service, with high-level latency, error and throughput statistics.' src='service-endpoint-summary.png' />
:::

This high-level view of the Catalog service traffic confirms that there are two versions of the `/catalog` endpoint receiving traffic and that only the `/v1` version has the `/details` endpoint.

## Who uses this endpoint?

Unfortunately, your endpoint is still receiving traffic. How do you determine the source so that they can be notified about the deprecation?

### Check the request headers

Let’s inspect the request headers for clues. Pixie automatically traces full requests, including body and request headers. Service meshes can also capture this type of information in Kubernetes.

::: div image-xl
<svg title='Output of a PxL script showing all HTTP/2 traffic to a specific endpoint (with the request headers expanded in JSON form).' src='request-headers.png' />
:::

Here, you can see that the request headers include a `Referer` and `API-Key` field. Aggregating these values gives us a list of API clients to notify:

::: div image-l
<svg title='Output of a PxL script listing unique values for the request header `Referer` and `API-Key` fields.' src='req-header-values.png' />
:::

Can’t find any information identifying the API client in the request headers?

Here are some other places to check:

- Request body
- URL parameter
- IP address of the inbound request

Any API clients you identify should be notified of the impending deprecation. If certain clients fail to migrate to the new API, this sort of identifying information could be used to implement a progressive shutdown that affects clients differently. For example, free-tier clients could have their deprecated API request responses slightly delayed, while paying clients could continue using the deprecated API without penalty.

## Time to proceed to deprecation

Now that you know how your API is being used, you can create a deprecation plan.

Developers don't appreciate surprise deprecations, so it’s best to notify in multiple ways, including:

- **Documentation**: update reference docs to prevent new users from using the deprecated API.
- **Slack/email blast**: tell existing users how and when to migrate.
- **Deprecated / Sunset Headers**: automate detection of deprecated APIs for users with HTTP middleware.
- **Monitor**: track endpoint traffic to remind the API client to migrate.
- **Progressive Shutdowns**: give a last-chance warning to API clients.

Once you’ve done your best to migrate remaining clients off the deprecated API, it’s time to turn off the endpoint. Tech debt eliminated!

**Interested in a Tutorial?** [Learn](https://github.com/pixie-io/pixie-demos/endpoint-deprecation) how to run the scripts included in this post.

**Questions?** Find us on [Slack](https://slackin.px.dev/) or Twitter at [@pixie_run](https://twitter.com/pixie_run).
