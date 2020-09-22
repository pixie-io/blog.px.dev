---
path: '/hybrid-architecture'
title: 'Building a Hybrid Architecture to Reduce Data Transfer Cost'
date: 2020-09-23T06:00:00.000+00:00
featured_image: hero-image.png
category: 'Pixie Team Blogs'
author: 'Michelle Nguyen'
email: 'michelle@pixielabs.ai'
featured: true
---

In this blogpost, we discuss the design of a hybrid architecture aimed to address the limitations of the typical satellite agent / central data store architecture. For people building systems impacted by these same limitations, we hope this post can serve as a valuable resource that we wish we'd had when building Pixie.

# Introduction

When collecting data across different environments, it is often necessary to deploy satellites to gather information from each environment. For example, collecting metrics from all of your Kubernetes clusters may require an instance of Prometheus per cluster. Similarly, to gather the Air Quality Index (AQI) distributions across different regions of the country requires many sensors spread across a wide range of locations. For easy consumption, all of this data is usually made available via some central server. To do so, each satellite commonly sends their data to the central server where it is stored and queried. 

::: div image-m
<svg title='' src='central-arch.svg' />
:::

This standard pattern has several pros and cons:

### Pros

- All data is stored in a single location. This simplifies data management, as the database is in an environment which the developer can easily access and configure.
- The satellite interface is simple. The satellite’s sole responsibility is to collect and send data. This is ideal for deploying satellites in environments that you do not control—the less complexity, the better.

### Cons

- The cost of transferring data to the central server can be high. Some environments have hundreds of thousands of satellites collecting hundreds of thousands of datapoints a second, all of which need to be shipped across the network.
- Collected data may contain sensitive information which users may not actually want stored in an external database outside of their network. 

Depending on your use-case, addressing these cons can be crucial. To avoid transferring large amounts of data, it is common to sample the data before it is sent over the network. Unfortunately, obtaining the perfect sample is difficult, and the sample may provide an incorrect view of the full data set. To avoid exposing sensitive information, there are standard techniques for scrubbing personally identifiable information (PII). However, certain types of data may contain non-standard PII or information that can be harder to detect and remove. In some use-cases, it may even be beneficial for users to have the ability to view sensitive information. 

To address these limitations, we designed a hybrid architecture in which queries are still sent to a central server, but are now delegated to satellites who are responsible for both storing data and responding to queries. In this blogpost, we discuss how to build this pipeline for delegating queries to the satellites from the server. Future blogposts may dive into how data can be efficiently stored or how to implement a query execution engine on the satellites.

# Approach 1: Making Requests Directly to the Satellites

Assuming the user is initiating the query request via a UI hosted by the central server, the simplest approach for executing the query on a satellite is to have the UI make the request directly to the satellite itself. To do this, the UI must be able to get the (1) status and (2) address of the satellite from the server, so that it knows whether the satellite is available for querying and where it should make requests to. 

::: div image-m
<svg title='' src='non-passthrough.svg' />
:::

## Step 1: Heartbeating

A common technique to track the status of a program is to establish a heartbeat sequence between the program (the satellite) and the monitoring system (the server). This is typically done by having the satellite first send a registration message to the server. During registration, the satellite either provides an identifier or is assigned an identifier via the server, which is used to identify the satellite in subsequent heartbeat messages.

Following registration, the satellite begins sending periodic heartbeats to the server to indicate it is alive and healthy. Additional information can be sent in these heartbeats. In our case, we also attach the satellite’s IP address. Alternatively, the IP address could have been sent during registration, if it is not subject to change. The server records the satellite’s status and address so that it can be queried by the UI.

Now, when the UI wants to make a request to a satellite, it first queries the server for the address, then directly makes the request to that address. 

Great! That wasn’t too bad. In many cases, many server/distributed satellite architectures already communicate via heartbeats to track satellite state, so sending an additional address is no problem. However... If your UI is running on a browser and your satellite is responding over HTTPS (likely with self-signed certs), you are not done yet...

::: div image-l
<svg title='' src='cert-authority-invalid-1.png' />
:::

## Step 2: Assigning Satellites a Domain Name

The browser is blocking our requests because of the satellite’s SSL certs! A user could go ahead and navigate directly to the satellite’s address, where the browser prompts the user with whether or not they want to bypass the invalid cert.

::: div image-m
<svg title='' src='cert-authority-invalid-2.png' />
:::

However, this would need to be done per satellite and is disruptive to the user’s overall experience. It is possible to generate SSL certs for IP addresses, but this is uncommon and isn’t available with most free Certificate Authorities. This approach is also complicated if the satellite’s IP address is subject to change. 

::: div image-xl
<svg title='' src='SSL-cert-flow.svg' />
:::

To solve this problem, we used the following solution:

1. Pre-generate SSL certs under a subdomain that you control, for instance: `<uuid>.satellites.yourdomain.com`. This step is easy to do with any free Certificate Authority. You should make sure to generate more SSL certs than the number of expected satellites. 
2. When an satellite registers with the server, it should be assigned an unused SSL cert and associated subdomain. The SSL cert should be securely sent to the satellite and the satellite’s proxy should be updated to use the new cert.
3. When the server receives the satellite’s IP address from its heartbeats, it updates the DNS record for the satellite’s subdomain to point to the IP address. 
4. When executing queries, the UI can now safely make requests to the satellite’s assigned subdomain rather than directly to its IP address, all with valid certs!

In the end, making requests directly to the satellites turned out to be more complicated (and hacky) than we’d originally thought. The solution also doesn’t scale well, since the SSL certs need to be pre-generated. Without having a fixed number of satellites, or an upperbound on the number of satellites, it isn’t long before all the certs have been assigned and someone needs to step in and manually generate more. It is possible to generate the certs and their DNS records on the fly, but we’ve found these operations can take too long to propagate to all networks.

# Approach 2: Proxying Queries through the Server

::: div image-m
<svg title='' src='passthrough-general.svg' />
:::

As seen in the previous approach, it is easiest to have the UI make requests to the server to avoid any certificate errors. However, we still want the actual query execution to be handled by the satellites themselves. To solve this, we architected another approach which follows these general steps:

1. User initiates query via the UI.
2. The server forwards the query to the appropriate satellite.
3. Satellite send its responses back to the server.
4. Server forwards responses back to the UI.

The server must be able to handle multiple queries to many different satellites at once. A satellite will stream batches of data in response, which the server needs to send to the correct requestor. With so many messages flying back and forth, all of which need to be contained within their own request/reply channels, we thought this would be the perfect job for a message bus. 

The next question was: which message bus should we use? 

## Choosing a Message Bus

We built up a list of criteria that we wanted our message bus to fulfill: 

- It should receive and send messages quickly, especially since there is a user waiting at the receiving end.
- It should be able to handle relatively large messages. An satellite’s query response can be batched into many smaller messages, but the size of a single datapoint can still be non-trivial.
- Similarly, since an satellite’s response may be batched into many messages, the message bus should be able to handle a large influx of messages at any given time.
- It should be easy to start new channels at any time. We may want to create a new channel per request or per satellite, all of which we have no fixed number.

We briefly considered Google Pub/Sub, which had strict quota requirements (only 10,000 topics per Google project), and other projects that weren’t yet as mature as Apache Kafka, but still had significant operational complexity (Apache Pulsar). However, we primarily considered two messaging systems: Apache Kafka and NATS. General comparisons between Kafka and NATS have been discussed at length in other blogs. In this blog post, we aim to compare these two systems based on our requirements above.

We relied heavily on benchmarks that [others have performed](https://bravenewgeek.com/category/benchmarking/) to judge latency based on message size and message volume. These results lean in favor of NATS.

We also wanted to test each system on our particular use-case, and performed the following benchmark to do so:

1. Through a WebSocket run on the browser, send a message to the server.
2. A service running on the server, called RequestProxyer, receives the message and puts it on topic A.
3. A subscriber of topic A reads the message, and publishes it onto topic B.
4. RequestProxyer reads the message on topic B, and writes a response back out to the WebSocket.

In this case, the total time recorded for the benchmark is the time from which the message was sent, to the time which the browser receives the response message.

**Self-Hosted Kafka**, running on K8s

```text
100 samples of 1000 events
Cumulative:     529.450986ms
HMean:          5.092644ms
Avg.:           5.294509ms
p50:            4.923762ms
p75:            5.122964ms
p95:            6.701295ms
p99:            12.489971ms
p999:           13.507677ms
Long 5%:        11.341461ms
Short 5%:       4.534924ms
Max:            13.507677ms
Min:            4.458423ms
Range:          9.049254ms
StdDev:         1.501562ms
Rate/sec.:      188.87
```

**Kafka Cloud**

```text
100 samples of 900 events
Cumulative:     1.44973762s
HMean:          13.410003ms
Avg.:           14.497376ms
p50:            12.806018ms
p75:            13.606431ms
p95:            31.166141ms
p99:            43.261452ms
p999:           48.511126ms
Long 5%:        38.227189ms
Short 5%:       11.178102ms
Max:            48.511126ms
Min:            10.769523ms
Range:          37.741603ms
StdDev:         6.136001ms
Rate/sec.:      68.98
```

**NATS Streaming**, running on K8s

```text
100 samples of 600 events
Cumulative:     59.463179ms
HMean:          586.156µs
Avg.:           594.631µs
p50:            583.769µs
p75:            620.758µs
p95:            730.251µs
p99:            777.927µs
p999:           843.834µs
Long 5%:        776.46µs
Short 5%:       468.027µs
Max:            843.834µs
Min:            443.451µs
Range:          400.383µs
StdDev:         73.517µs
Rate/sec.:      1681.71
```

### The Winner

We ended up choosing NATS as our messaging system. Benchmarks performed by others and our own benchmark above showed that NATS is capable of efficiently handling our request and response messaging patterns. We also found it was extremely easy to create topics on-the-fly in NATS, whereas creating topics on Kafka is fairly complicated and must be determined before start-up. Given that we will support many short-lived queries, we want to avoid any topic creation overhead. These points, paired with the lower operational complexity of NATS made it the clear winner.

## The Implementation

::: div image-m
<svg title='' src='passthrough-diagram.svg' />
:::

The actual implementation of our query request pipeline looks very similar to the benchmark case we ran above. 

1. The user initiates the query request through the UI. 
2. The service responsible for handling the query requests receives the message and starts up a RequestProxyer instance in a new goroutine. 
3. The RequestProxyer generates an ID for the query and forwards the query and its ID to the correct satellite by putting a message on the `satellite/<satellite_id>` NATS topic. It waits for the response on the `reply-<query-ID>` NATS topic.
4. The service responsible for handling satellite communication (such as heartbeats) is subscribed to the `satellite/*` NATS topic. It reads the query request and sends it to the appropriate satellite via its usual communication channels. The satellite streams the response back to this service. The service then puts these responses on the `reply-<query-id>` NATS topic.
5. The RequestProxyer receives the responses on the `reply-<query-id>` topic and sends them back to the UI.


It is worth noting that in this approach, data is now funneled through the server rather than directly from the satellite to the browser. As a result, this may still accrue some network latency. However, as opposed to the non-hybrid approach, we are only transferring relevant data which the user has specifically requested, rather than sending all datapoints that the satellite has ever collected. Also, although data is now sent to the server, it is still only persisted by the satellites themselves.  

# Conclusion 

Although this architecture mitigates the cons of the non-hybrid system, the non-hybrid system’s pros are inversely reflected as cons of our approach.

* All data is now spread across multiple satellites. This is often in an environment that the developer does not control, and therefore can be harder to manage and configure.
* The satellite is now responsible for more than just collecting and sending data. It must also know how to respond to queries. Again, having more complexity running on an external environment may be non-ideal.

For us, the pros of the hybrid approach -- reducing the data transfer cost and keeping sensitive data within their environments — outweigh the cons. The approach you choose will depend on the overall use-case of the system which  determines which pros/cons should be weighed more significantly.

Architecting fast and secure distributed systems is something we are working on at Pixie. You can checkout an overview of our architecture here. If working on hybrid systems is something that interests you, check out our [open positions](https://pixielabs.ai/careers).


