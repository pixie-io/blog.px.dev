---
path: '/e2e-encryption'
title: 'Adding End-to-End Encryption for Proxied Data'
date: 2021-9-21T06:00:00.000+00:00
featured_image: e2e-hero.png
categories: ['Pixie Team Blogs']
authors: ['Vihang Mehta']
emails: ['vihang@pixielabs.ai']
featured: true
---

End-to-end encryption has become increasingly popular as users demand that any data they send - a file, email, or text message - is not decipherable by any unauthorized recipients. This consumer trend is evident in the recent surge in popularity of Signal, an encrypted instant messaging service.

In this post, we’ll cover what end-to-end encryption is and walk you through how we implemented it in our system.

## Why End-to-End Encryption?

Pixie is designed with a [hybrid cloud architecture](/hybrid-architecture/hybrid-architecture/) where the data is collected and stored on the customers enviroment. The cloud component is used for user management, authentication and proxying data.

::: div image-xl
<svg title="This is a simplified architecture diagram of our system before end-to-end encryption." src='before-e2e.svg' />
:::

We use standard security practices to secure data in transit; all network communication between the cluster, proxy and client is TLS encrypted.

But TLS encryption is only point-to-point. When data passes internally through our proxy, the data is temporarily unencrypted. Pixie is an open source project, so users might deploy Pixie Cloud (and the accompanying proxy) in a variety of environments. We wanted to provide privacy guarantees for users given the heterogeneity of deployment scenarios.

By adding end-to-end encryption, we can ensure that the proxy only sees an encrypted form of the telemetry data.

## Implementation

Pixie provides multiple clients for developers to interact with its platform:
* a web UI (JavaScript)
* a CLI (Golang)
* APIs (client libraries: Golang, Python)

Since we needed to support E2E encryption across multiple languages, using a crypto standard with readily available implementations in multiple languages was a must. Given that we already use [JSON Web Token (JWT)](https://datatracker.ietf.org/doc/html/rfc7519/) for user claims, we chose to look at the IETF proposed [JSON Object Signing and Encryption (JOSE) standard](https://datatracker.ietf.org/group/jose/documents/) for our E2E encryption needs. We settled on using [JSON Web Key (JWK)](https://datatracker.ietf.org/doc/html/rfc7517/) for key exchange and [JSON Web Encryption (JWE)](https://datatracker.ietf.org/doc/html/rfc7516/) as our encryption format.

There are multiple libraries that implement the JOSE spec in different languages. We chose the following:
* [jose](https://www.npmjs.com/package/jose) for JavaScript (imported as [@inrupt/jose-legacy-modules](https://www.npmjs.com/package/@inrupt/jose-legacy-modules) for compatibility with our tooling)
* [lestrrat-go/jwx](https://pkg.go.dev/github.com/lestrrat-go/jwx) for Golang
* [Authlib](https://pypi.org/project/Authlib/) for Python (notably, this library successfully handles messages that include null bytes)

All three libraries seem to have an active community of maintainers and users, well designed and thoroughly documented APIs, and extensive test suites.

## End-to-End Encryption in Pixie

JWE supports a variety of key types and algorithms, however [RSA-OAEP](https://datatracker.ietf.org/doc/html/rfc3447#section-7.1) seems to be the most widely supported one across the many libraries. So we chose to use 4096 bit RSA keys with the RSA-OAEP encryption scheme across all our clients.

::: div image-xl
<svg title="This is how a client interacts with Pixie after enabling end-to-end encryption." src='after-e2e.svg' />
:::

The client generates an asymmetric keypair and sends the public key with any requests for data. Telemetry data is encrypted with the given public key on the cluster. It remains encrypted from the moment it leaves the cluster until it reaches the client.

The asymmetric keypairs are intentionally ephemeral and generated at client creation time and rotated across sessions. This lack of reuse of keys allows an additional layer of protection from any accidentally leaked private keys.

We encrypt all telemetry data. Other message fields currently remain unencrypted within the proxy and are used by the proxy to make routing decisions.

## Summary

Once we identified the various client libraries we wanted to use, implementing E2E encryption was straightforward. Check out the commits below for implementation details:
* [commit #1](https://github.com/pixie-io/pixie/commit/d36d56b2e549038a59625525d20c5510f1e79ddf): Add encryption support to the **Golang Server**
* [commit #2](https://github.com/pixie-io/pixie/commit/86237e511154e46d644086276fb103038d8d96e0): Add key creation & decryption support to the **JavaScript UI**
* [commit #3](https://github.com/pixie-io/pixie/commit/079ad7d482d89e7349c930466721a00a70f01d1d): Add key creation & decryption support to the **Golang API**
* [commit #4](https://github.com/pixie-io/pixie/commit/0d8e5c5220215bd7d88c83347284ff94ec27d2dc): Add key creation & decryption support to the **Python API**

We hope that the JOSE proposal becomes an IETF standard and this set of libraries and commits acts as a reference for anyone looking to implement E2E encryption in their own project!


Questions? Find us on [Slack](https://slackin.px.dev/) or Twitter at [@pixie_run](https://twitter.com/pixie_run).
