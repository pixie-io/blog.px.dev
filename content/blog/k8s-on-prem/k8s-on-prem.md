---
path: '/k8s-on-prem'
title: 'How Kubernetes Made On-Prem Cool Again'
date: 2021-02-24T06:00:00.000+00:00
featured_image: hero-image.png
categories: ['Pixie Team Blogs']
authors: ['Natalie Serrino']
emails: ['nserrino@pixielabs.ai']
featured: true
---
In this post, we will discuss the following:
1. The historical advantages and disadvantages to on-prem software deployments.
2. The ways Kubernetes makes it easier to deploy software to on-prem customer environments.
3. The remaining challenges with on-prem deployments that Kubernetes does not currently solve.

# Introduction
On-prem software deployments have gotten a bad rap, at least from the perspective of the vendors that build and support such software. This reputation has been largely justified. In comparison to their cloud-hosted/SaaS counterparts, on-prem products are generally much more difficult to deploy, manage, and maintain. That being said, there are strong benefits to on-prem deployments, or else no one would bother (more on those later).

Enter Kubernetes. Kubernetes has dramatically shifted the tradeoffs of on-prem versus SaaS deployments. Thanks to the rich abstractions that Kubernetes provides, deploying a software product to a customer's on-prem environment can be significantly easier than before. Because Kubernetes has achieved such [high market penetration](https://www.cncf.io/wp-content/uploads/2020/11/CNCF_Survey_Report_2020.pdf) (and still growing), it is now a viable target environment for many B2B software products.

In response to this shift, companies such as [Okera](https://www.okera.com), [Sourcegraph](https://about.sourcegraph.com) (self-hosted offering), and [Pixie Labs have](https://pixielabs.ai) decided to deploy their products directly on customers' Kubernetes clusters, rather than in a hosted cloud/SaaS environment. At Pixie Labs, we predict that more B2B tools will move to support deploying on-prem to their customers' Kubernetes clusters, a mirror of the most recent shift where many applications moved from on-prem to SaaS.

# Where we were: The historical pros and cons of on-prem deployments
## What is on-prem?
First, let's quickly define "on-prem" because that can mean different things to different people. Some people define "on-prem" to be running on a bare metal server environment, with machines managed by the customer themselves. We take a broader definition, where "on-prem" refers to deploying directly on the customer's servers, wherever they may be.
As long as it is running directly on a customer's environment rather than a hosted cloud, this includes all of the following:
* Bare metal servers (including air-gapped without external network connection)
* Virtual private cloud
* Managed cloud environment (such as ECS, GKE/AKS/EKS, etc)

## Which applications should be considered for on-prem?
Not all applications make sense to run on-prem in the first place. Some applications can live entirely in a vendor's hosted cloud and don't need to interact with a customer environment, such as a customer relationship management (CRM) product like Salesforce or JIRA. However, other types of applications may have heavy dependencies on the customer environment. For example, a log analytics tool will likely need to read a lot of data from a customer's production system. These types of tools are more likely to be a fit for an on-prem deployment. There are also business model reasons that will affect the decision, which are touched on below. However, the major emphasis is placed on the technical landscape shifts created by Kubernetes.

## Pros and cons of on-prem (summary)

The table below summarizes the pros/cons we have historically seen for on-prem deployments. Each item gets more detail in the next section.

| Pros | Cons |
| --- | ----------- |
| Customer data privacy (data remains in their environment) | Heterogeneous customer environments create higher technical complexity |
| Customer pays hosting costs (enables shipping "free" software) | Limited vendor visibility into bugs, crashes, and other problems |
| Support for more environments, such as air-gapped environments in finance/government | Vendor does not control deployed version |
| Lower network utilization (no need to export customer data to a remote cloud) | Orchestration and self-healing logic must be built out  |
| Increased customer control over system | Resource utilization of system must be carefully managed |

## Advantages of on-prem
There are five major advantages to on-prem software deployments that we would like to highlight in this post.

### 🟢 Customer data privacy
Customers are becoming increasingly sensitive to their private data being shipped to remote clouds that they don't control. For certain types of highly sensitive data (logs, user information, etc), it can be tough to impossible to convince customers to take the risk of exporting that data outside their system.

### 🟢 Customer pays hosting costs
When an application runs on-prem and stores customer data on-prem, the software vendor doesn't need to pass on the hosting costs to the end user and can offer a free or cheaper plan than SaaS competitors. This is nearly mandatory for open source solutions, which can't afford to pay to host their entire user base.

### 🟢 Support for more customer environments
Many customer environments, especially in fields like finance or government, are air gapped (no external network connection). It isn't possible to connect those environments to a vendor's remote cloud so products requiring such a connection are dead on arrival from a sales perspective.

### 🟢 Lower network utilization
SaaS applications often ingest significant amounts of data from their customer's production environment. Exporting large amounts of data to a remote SaaS environment can put a significant burden on the network resources of the customer's production system.

### 🟢 Increased customer control over the system
Many customers strongly prefer the ability to control the applications that they purchase, and are frustrated when there is downtime of SaaS applications which they can't fix. When a product deploys on-prem, the customer has the ability to have much greater control over the system and address issues as they arise, rather than being at the mercy of the vendor.

## Historical disadvantages of on-prem
Though there are significant advantages to on-prem deployments, they've come at a significant cost in the past, hence the shift to SaaS in many applications. Let's review some of the challenges of on-prem deployments, pre-Kubernetes.

### 🔴 Heterogeneous customer environments create higher technical complexity
When customer environments vary significantly, multiple parallel code paths must be built out for flows such as deployment, scale-up, updates, and error management. For example, binaries must be created for many different operating systems and environments. Additionally, there might be different network policies in a cluster, different resource amounts, and different endpoints/addresses for each of the nodes.

### 🔴 Limited vendor visibility into bugs, crashes, and other problems
In a SaaS offering, the vendor has easy access to logs, errors, crashes, etc, since they control the system. In a customer environment that vendor may have no idea that a problem is occuring in the first place. Usually, the customer must discover the problem for themselves and manually restart the system.

### 🔴 Vendor does not control deployed version
Many on-prem customers resist updating because "if it ain't broke, don't fix it". Since updating is usually controlled by the customer, vendors need to support a large number of versions of their product at any given time. In contrast, with SaaS, the vendor can control the running version to a small number of versions, or even a single version

### 🔴 Orchestration and self-healing logic must be built out
It's one thing to build a set of binaries for your application for each target OS that you want to support. It's another task altogether to deploy those binaries to many different customer nodes, and support new nodes coming online, old nodes disappearing, and fault tolerance in the case that the application encounters an error. Investing in this logic can eat up a large amount of the development budget, away from features, bug fixes, and other higher priority items.

### 🔴 Resource utilization of product must be carefully managed
Resource-intensive applications that need a lot of CPU or memory can impose a significant burden on their host system. Many of us have seen supposedly "lightweight" agents using 50% of CPU or memory on our production clusters, so resource utilization must be carefully managed, especially in sensitive environments.

# What changed: how Kubernetes makes on-prem deployments easier
Kubernetes provides a powerful and rich set of abstractions across highly diverse customer environments. As a result, it is now significantly easier for developers to deploy their products on-prem directly on a customer Kubernetes cluster. Thanks to the high adoption of Kubernetes, this is a very large section of the market, which is likely to continue to increase for the foreseeable future.

Let's dive into how Kubernetes mitigates some of the above "cons" when deploying software on-prem to a customer.

## Deployment and Orchestration

### Containerization
Kubernetes allows the user to create a single binary packaged inside a container. This container can be run on a variety of operating systems or environments. This benefit is offered by any container-based system, but it's still worth noting.

### Orchestration and self-healing
Previously, the vendor would build logic to deploy their product to every relevant customer node in the system. This would involve scaling up the deployment when nodes came online or went away.

Kubernetes provides a declarative, config-based solution for any system to do the following:
* Deploy to every node
* Deploy to specific nodes
* Update deployments when new nodes come online or go away

Rather than building out the complex logic to perform these tasks, the vendor only needs to create a YAML or JSON config. This is a win for the customer too, who only needs to apply that config file to their cluster.

Kubernetes also comes with self-healing and scaling logic, built in to configs as well.
* Crash handling
* Restarts
* Autoscaling of services based on load

While it was certainly possible to build out support for all of these cases in the past, it would be a significant investment. Reducing it to a system-agnostic YAML/JSON config file greatly reduces the barrier to building scalable, fault-tolerant on-prem products. Previously, supporting all of the above wouldn't just be done one time, but many times depending on the operating system, environment, etc.

One more note on this point - programmatic access to the Kubernetes API's orchestration and resource management capabilities comes built-in. As a result, users that want to encode orchestration logic inside their applications can still do so (without having to build out, expose, and support those APIs for themselves).

## System Monitoring
### Common API to access logs and errors
Another important abstraction that Kubernetes provides is related to the way it surfaces errors and logs. Through its APIs or command line, the vendor's application can query for the logs in a non-system dependent way (`kubetctl logs`). The application can also programmatically access the health of its various deployments and services, and read the most recent errors they have received.

### Resource constraints
Kubernetes supports specifying resource limits for your application. That way, through a pure config change, you can ensure that your application won't be allowed to greedily consume a large amount of CPU or memory. This can help prevent the scenario where a greedy vendor application is taking away too many resources from the customer environment. Since it's config-based, customers also have the power to personalize it if they have specific needs.

Finally, pod affinity and anti-affinity policies (also via config) allow the vendor to easily specify that especially resource-intensive parts of their application be scheduled on separate nodes, or only on nodes containing sufficient resources.

# Where we are now: Remaining challenges with on-prem on Kubernetes
Now that we have reviewed what Kubernetes has brought to the table, let's go back to the initial list of cons for on-prem deployments and see where they stand, post-Kubernetes.

### 🔴 → 🟢 Heterogeneous customer environments create higher technical complexity
In Kubernetes, there is one interface for deploying and orchestrating Kubernetes, which is a Kubernetes config file (JSON or YAML). These YAML files can point to a system-agnostic container. This is a big step up from manual deployments with OS/version-specific binaries.

However, it's still not a silver bullet. Kubernetes provides powerful abstractions across heterogeneous customer clusters, but not all Kubernetes clusters are created equal. For example, we at Pixie have learned that some of our customer's Kubernetes clusters do not support Persistent Volumes. Additionally, a 2,000 node cluster will behave differently than a minikube virtual environment, regardless of the abstraction on top of it. However, these Kubernetes abstractions have definitely made it a lot easier for us to deploy our products on-prem to customers.

### 🔴 → 🟡 Limited vendor visibility into bugs, crashes, and other problems
The problem of vendor visibility into application bugs and errors still definitely exists in a Kubernetes environment. The vendor does not control the cluster and therefore cannot gain access and control over its complete state. However, the common API provided by Kubernetes does enable the vendor application to query for the current logs, errors, and application state in a common, environment-agnostic way, which is still a major improvement.

### 🔴 → 🔴 Vendor does not control deployed version
This one of the biggest problems that remains with on-prem even when deploying to Kubernetes environments. If you can't control the version of code your customers are running, you will inevitably be forced to support many different versions in the wild. At Pixie, we solved this problem by providing the option to customers to allow their Pixie deployments to auto-update. While it doesn't work for every user (such as those without external network access), many users prefer for the system to grab the latest updates periodically so they don't have to worry about it.

### 🔴 → 🟢 Orchestration and self-healing logic must be built out
Orchestrating the deployment of an application across many types of environments is as simple as specifying a YAML or JSON config file. This process is automatically handled by Kubernetes, so the vendor does not have to build out any code to do this part of the job. Kubernetes also comes with self-healing logic to restart failed pods and containers, reducing the burden on both the vendor and the customer.

### 🔴 → 🟢 Resource utilization of product must be carefully managed
Resource limits and deployment specifications allow the vendor or customer to define the maximum amount of resources that the application should consume. This safeguards against catastrophic resource consumption in a sensitive production environment. Finally, affinity and anti-affinity policies for pods allow the vendor to specify where different parts of the application should run. This can prevent common problems, such as multiple resource-intensive parts of an application being scheduled on the same node.

# Conclusion
It is worth mentioning that none of these cons are solved if Kubernetes is not an appropriate target environment for your product. However, we believe that with the adoption that Kubernetes has seen, more and more products and tools will be able to target Kubernetes for their on-prem deployments in the future.

Although some challenges still remain with on-prem, we believe that the benefits provided by Kubernetes for on-prem deployments will shift the needle on the on-prem vs. SaaS question. Deploying applications on-prem has many compelling advantages, such as maintaining customer privacy, enabling open source tools and free tiers of software products, and support for more types of customer environments (such as air-gapped clusters). We hope to see more projects joining Sourcegraph, Okera, Pixie Labs, and many others in making on-prem "cool again".
