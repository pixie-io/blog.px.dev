---
path: '/k8s-122-challenge'
title: 'Unexpected Challenges Supporting Kubernetes 1.22 in Pixie'
date: 2021-10-05T06:00:00.000+00:00
featured_image: k8s122challenge.png
categories: ['Pixie Team Blogs']
authors: ['Phillip Kuznetsov']
emails: ['philkuz@pixielabs.ai']
featured: true
---
Last year, Kubernetes [updated its feature lifecycle policy](https://kubernetes.io/blog/2020/08/21/moving-forward-from-beta/#avoiding-permanent-beta) to prevent the existence of “permanent beta” APIs. The new policy gives beta REST APIs three releases to either reach GA (and deprecate the beta) or create a new beta version (and deprecate the previous beta). Kubernetes 1.22 is the first release to remove [deprecated beta APIs](https://kubernetes.io/docs/reference/using-api/deprecation-guide/#v1-22) since the policy was adopted.

While testing Pixie on Kubernetes 1.22, we discovered that the removal of `CustomResourceDefinition` from `apiextensions.k8s.io/v1beta1` broke the `nats-operator` and `etcd-operator`. In this post, we share how we adapted our [NATS](https://github.com/nats-io/nats-server) and [etcd](https://github.com/etcd-io/etcd) deployments to be compatible with Kubernetes 1.22 and the challenges we faced while updating active Pixie deployments to the new architecture.

## The Problem: Deprecated Third-Party Operators
Pixie's [on-prem data collector](https://blog.px.dev/hybrid-architecture/), Vizier, relies on NATS and etcd. We opted to use the `nats-operator` and `etcd-operator` when we added these dependencies. These operators expose a simple interface via a `CustomResourceDefinition` (CRD) and translate requested resources into the necessary set of configurations, deployments, and services - simplifying the deployment.

Unfortunately, both operators chose to define their CRD inside of their code (rather than as a separate yaml) and the latest releases[^1] still used the beta version of the API. That meant our Kubernetes 1.22 cluster rejected CRD creation requests from these operators because those APIs no longer existed. Since [NATS no longer recommends using nats-operator](https://github.com/nats-io/nats-operator#nats-operator) and coreos [archived etcd-operator](https://github.com/coreos/etcd-operator/pull/2169), we needed a new deployment model.

## The Solution: StatefulSets
We decided to switch away from CustomResources over to StatefulSet equivalents ([etcd](https://github.com/pixie-io/pixie/commit/305726d4bbb4c1587a323d20361525bb0ee8c0cd), [nats](https://github.com/pixie-io/pixie/commit/35d3aec70a1d85e06703b7a044057787d82c0e64)). Forking the operator code bases was an option, but we did not need all of the features provided by the operators nor did we want to maintain a forked project. The main operator feature that we needed was dynamic configuration; the operator deployments knew the name of the pods in their configuration before the pods were deployed. We replicated this with StatefulSets (which gave us predictable naming) combined with [environment variable substitution](https://kubernetes.io/docs/tasks/inject-data-application/define-environment-variable-container/#using-environment-variables-inside-of-your-config).

## Another Challenge: Updating Active Deployments
Although updating to StatefulSet NATS/etcd deployments is only necessary for Kubernetes 1.22+, we wanted to reduce our operational burden by updating all running Viziers.
We encountered two issues:
1. We did not have a path to update our dependencies (etcd/NATS).
2. We had trouble including the recommended clients for the etcd and NATS custom resources.

### Updating the dependencies
Pixie’s Vizier is deployed and updated using the Kubernetes [operator pattern](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/). The Vizier operator already had an update path for our core product, but lacked the equivalent for our dependencies. We originally delayed building the update path for the dependencies because we didn’t want to interrupt connected Viziers for longer than necessary and our deps rarely changed. This would also be the first update with destructive changes: we would need to get rid of the actively running etcd and NATS instances.

We decided to special case this in the Vizier operator code. Whenever we detect the etcd-cluster and nats-cluster CustomResources in the Vizier namespace, we remove the resources and deploy the new StatefulSet versions. We didn’t create an update path for dependencies, but given the destructive changes were a special case, we decided to delay building out a whole update path.

### Including the etcd and NATS clients
We wanted to use the etcd-cluster and nats-cluster clients to detect old NATS and etcd dependencies. We hit a [strange compilation error](https://github.com/coreos/etcd-operator/issues/2167) while attempting to include the clients. It turns out that our packaged version of client-go is incompatible with the packaged version in the clients. The client-go developers introduced a [breaking interface change](https://github.com/kubernetes/client-go/commit/ae9f6b2601c8f8b97ad2865943f423d65539ffdb) and Go’s dependency management disallows [two different incompatible versions](https://research.swtch.com/vgo-import#dependency_story) with the same import path.

Fortunately, we had recently used `client-gen` [to generate client code for Vizier CustomResources](https://github.com/pixie-io/pixie/commit/3950a03d723029b4280e5267f0c2c9c78f2dd7c8). We decided to do the same with nats-cluster and etcd-cluster, [vendoring the clients into our operator code](https://github.com/pixie-io/pixie/commit/c5079278c55c70451a59d9fc315b56d311aa2e54). Once you have a hammer, everything starts to look like a nail.

Now during our updates, the Vizier operator simply uses the vendored clients to check for etcd-cluster or nats-cluster resources deployed by old versions of Vizier and replaces them with the new StatefulSet versions if they happen to exist. Future Viziers will only deploy with the StatefulSet Versions.

## Conclusion
The removal of the beta CRD API from Kubernetes 1.22 posed a unique challenge for our team. Switching to StatefulSet NATS and etcd removed the deprecated third-party operator dependencies. Updating all of our running instances allowed us to avoid bifurcating our deployments.

If you’re looking to use StatefulSet NATS and etcd, check out our [NATS](https://github.com/pixie-io/pixie/tree/main/k8s/vizier_deps/base/nats) and [etcd](https://github.com/pixie-io/pixie/tree/main/k8s/vizier_deps/base/etcd) yamls as references. You should also check our [blog on how etcd works ](https://blog.px.dev/etcd-6-tips/)and [why we chose NATS as our message bus](https://blog.px.dev/hybrid-architecture/#choosing-a-message-bus).

Let us know if you found this type of post interesting! We’re trying to not only open-source our codebase, but also openly discuss the challenges we’ve faced and lessons that we’ve learned along the way.

_Find us on [Slack](https://slackin.px.dev/), [GitHub](https://github.com/pixie-io/pixie/blob/main/CONTRIBUTING.md), or Twitter at [@pixie_run](https://twitter.com/pixie_run)._

[^1]: the `nats-operator` code for managing CRDs has since[ been updated to the GA API ](https://github.com/nats-io/nats-operator/pull/333), but they have not released a new version.

