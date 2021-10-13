---
path: '/nr-detect-sqli'
title: 'Guest Post: Detect SQL injections with Pixie'
date: 2021-10-14T00:00:00.000+00:00
featured_image: hero-image.png
categories: ['Pixie Team Blogs', 'Announcements', 'Kubernetes']
authors: ['Elaine Laguerta', 'Hannah Stepanek', 'Robert Prast - New Relic']
emails: ['elaguerta@newrelic.com', 'hstepanek@newrelic.com', 'rprast@newrelic.com']
featured: true
---
*FYI - The team will demo this SQL injection detection workflow at KubeCon! The demo will be live at KubeCon 2021 [Friday, October 15, 11 am PDT](https://kccncna2021.sched.com/event/lV4c). The source code for the demo is [available at the Pixie demo repo](https://github.com/pixie-io/pixie-demos/tree/main/sql-injection-demo).*   

*This is a guest post by employees of New Relic.*  

---

Think about the possible security vulnerabilities in code that you ship. What keeps you up at night? You’d be wise to answer “SQL injection” -- after all, since 2003 it’s been on the OWASP’s (Open Web Application Security Project) [top 10 list of CVEs](https://owasp.org/Top10/) (Common Vulnerabilities and Exposures).  

Imagine you have an endpoint that takes an id query parameter:
```
http://example.com.com/api/host?id=1
```
The id parameter, it turns out, is not correctly sanitized and it is injectable. A hacker could come along and do something like: 
```
http://example.com.com/api/host?id=1 UNION SELECT current_user, NULL FROM user 
```
Which, at the database level would run the following query: 
```sql
SELECT name, ip FROM host WHERE id=1 UNION SELECT current_user, NULL FROM user
```
Instead of returning the host data that belongs to that id, the endpoint would now return the database username. As you can imagine this could be really bad as the hacker has just exposed a huge vulnerability within this endpoint. Any user using this vulnerability could get any data they wanted out of the database. 

We won’t link to any news stories about devastating hacks; that’s not why we’re here. As developers and security engineers, we believe our job isn’t to scare, but to empower. Pixie is a powerful observability platform, and as security people we saw some unique opportunities to apply Pixie to security use cases. We’re here to show you how you can use Pixie to proactively detect and report SQL injection attempts, while your application is live.   


Compared to traditional WAFs (web application firewalls), and various tools that position themselves as middlemen in your tech stack, Pixie runs within your cluster and hooks into your nodes underlying kernel. Specifically, while traditional firewalls are constrained to viewing only the surface of network traffic, Pixie uses [eBPF](https://docs.px.dev/about-pixie/pixie-ebpf/) (extended Berkeley Packet Filter) tracing to offer visibility to the operating system itself. This positions Pixie perfectly to traverse most layers in the OSI (Open Systems Interconnection) model to collect data rather than being pigeonholed into one. In practice, this means we can look at raw HTTP and database requests in the application layer while also peeling back any encryption happening in the presentation layer. To put things bluntly, context is king and Pixie allows us to understand the flow of data at every contextual layer.

Why detect injection attempts? Why not just block them actively? Because blocking works -- until it doesn’t. No firewall is 100% effective for long; eventually someone determined will find a way through. And when they do, we won’t know about it until the consequences of the attack.  

Compared to blocking, detection can offer more information for the defenders and less information for attackers. For example, say an attacker begins by probing a system with some more obvious injection attempts. These are probably the malicious queries that would be most likely to be known to the firewall and actively blocked. That means that we defenders won’t know about these initial blocked attempts, while the attacker gets a chance to learn the firewall. Now there is an information asymmetry in favor of the attacker. While us defenders continue to have a blind spot because of our blocker, the attacker can try ever more insidious queries until they get past the firewall.

Detection allows us to observe attacks on our code while our systems are live. What we can observe, we can understand. Understanding is how we will turn the bogeyman of SQL injection into something more like a weed: it’s an inevitable part of growing our code base, and it can be really bad. But if we can observe it, we can nip it in the bud.
 
To that end, we made a simple [PxL script](https://docs.px.dev/reference/pxl/) that uses Pixie to flag suspicious database queries that appear to be SQL injection attempts.

This script is a proof of concept of a grander vision. We don’t want to rely on firewalls to be our system’s main defense agent, because firewalls aren’t responsive and context aware to your actual application. We want a tool that flags what we think are injections, but is smart enough to minimize false positives, without blocking.  That way we humans have full visibility into attempted attacks, and we have the final say on which events constitute serious attempts. 

At New Relic, we’re really excited to make a security product using Pixie that will realize this vision, a tool that will cover a significant portion of the  OWASP Top 10 vulnerabilities.

In the short term, we’ll be contributing SQL injection detection to the open source Pixie project, as a part of Pixie’s built in SQL parser. We are also extending our proof of concept to Cross Site Scripting (XSS) and Server Side Request Forgery (SSRF) attacks.

In the mid term, we want to replace our regular expression rule set approach with machine learning detection. The Pixie team has already laid the groundwork for a machine learning approach; we’ll be able to leverage PxL’s [existing support of Tensorflow models](https://blog.tensorflow.org/2021/06/leveraging-machine-learning-pixie.html). In the long term, we are designing an observability-based security product that will run on open-source building blocks.

Because that long term vision will be some time from now, we’ll leave you with the recipe for our SQL injection proof of concept. You can dig into the source code and test it on a vulernable app with this [demo repo](link to demo repo).  

So spin up your development environment and get ready to turn monsters into dandelions.   


---

## A PxL script for identifying potential SQL injections

The PxL script identifies SQL injections by matching the query against a simple set of regular expressions. Each of these regexes is associated with a particular SQL injection rule. For example, if a query contains a comment (--) then it is flagged as a SQL injection attack and in violation of the comment dash rule, represented as `RULE_BROKEN` in the data table. 
![SQL Injection Table](sql_injection_table.png)

Regular expressions are fairly easy to evade in the real world however, attackers usually start with attempts like these to see if vulnerabilities are present. This rule set captures many attacker’s first attempts.  If you want to know if someone is probing your system for vulnerabilities before trying something more sophisticated, this might be handy -- which is why we’re planning on building these rules into the Pixie SQL parser.  
```python
# Rule set to capture some obvious attempts.
SCRIPT_TAG_RULE = "(<|%3C)\s*[sS][cC][rR][iI][pP][tT]"
COMMENT_DASH_RULE = "--"
COMMENT_SLASH_RULE = "\/\*"
SEMICOLON_RULE = ";.+"
UNMATCHED_QUOTES_RULE = "^([^']*'([^']*'[^']*')*[^']*')[^']*'[^']*$"
UNION_RULE = "UNION"
CHAR_CASTING_RULE = "[cC][hH][rR](\(|%28)"
SYSTEM_CATALOG_ACCESS_RULE = "[fF][rR][oO][mM]\s+[pP][gG]_"
```
Here's the full PxL script:
```python
# Copyright 2018- The Pixie Authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
# SPDX-License-Identifier: Apache-2.0
''' PostgreSQL Data Tracer
Shows the most recent PostgreSQL messages in the cluster.
'''
import px
SCRIPT_TAG_RULE = "(<|%3C)\s*[sS][cC][rR][iI][pP][tT]"
COMMENT_DASH_RULE = "--"
COMMENT_SLASH_RULE = "\/\*"
SEMICOLON_RULE = ";.+"
UNMATCHED_QUOTES_RULE = "^([^']*'([^']*'[^']*')*[^']*')[^']*'[^']*$"
UNION_RULE = "UNION"
CHAR_CASTING_RULE = "[cC][hH][rR](\(|%28)"
SYSTEM_CATALOG_ACCESS_RULE = "[fF][rR][oO][mM]\s+[pP][gG]_"
# google re2 doesn't support backreferences
# ALWAYS_TRUE_RULE = "OR\s+(['\w]+)=\1"
def add_sql_injection_rule(df, rule_name, rule):
    df[rule_name] = px.regex_match(".*" + rule + ".*", df.req)
    return df
def sql_injections(df):
    df = add_sql_injection_rule(df, 'script_tag', SCRIPT_TAG_RULE)
    df = add_sql_injection_rule(df, 'comment_dashes', COMMENT_DASH_RULE)
    df = add_sql_injection_rule(df, 'comment_slash_star', COMMENT_SLASH_RULE)
    df = add_sql_injection_rule(df, 'semicolon', SEMICOLON_RULE)
    df = add_sql_injection_rule(df, 'unmatched_quotes', UNMATCHED_QUOTES_RULE)
    df = add_sql_injection_rule(df, 'union', UNION_RULE)
    df = add_sql_injection_rule(df, 'char_casting', CHAR_CASTING_RULE)
    df = add_sql_injection_rule(df, 'system_catalog_access', SYSTEM_CATALOG_ACCESS_RULE)
    df = df[
        df.script_tag or (df.comment_dashes or (df.comment_slash_star or (df.semicolon or (
                df.unmatched_quotes or (df.union or (df.char_casting or df.system_catalog_access))))))]
    df.rule_broken = px.select(df.script_tag, 'script_tag',
                               px.select(df.comment_dashes, 'comment_dashes',
                                         px.select(df.comment_slash_star, 'comment_slash_star',
                                                   px.select(df.unmatched_quotes, 'unmatched_quotes',
                                                             px.select(df.union, 'union',
                                                                       px.select(df.char_casting, 'char_casting',
                                                                                 px.select(df.system_catalog_access,
                                                                                           'system_catalog_access',
                                                                                           px.select(df.semicolon,
                                                                                                     'semicolon',
                                                                                                     'N/A'))))))))
    return df[['time_', 'source', 'destination', 'remote_port', 'req', 'resp', 'latency', 'rule_broken']]
def pgsql_data(start_time: str, source_filter: str, destination_filter: str, num_head: int):
    df = px.DataFrame(table='pgsql_events', start_time=start_time)
    df = add_source_dest_columns(df)
    # Filter out entities as specified by the user.
    df = df[px.contains(df.source, source_filter)]
    df = df[px.contains(df.destination, destination_filter)]
    # Add additional filters below:
    # Restrict number of results.
    df = df.head(num_head)
    df = add_source_dest_links(df, start_time)
    df = df[['time_', 'source', 'destination', 'remote_port', 'req', 'resp', 'latency']]
    return df
def potential_sql_injections(start_time: str, source_filter: str, destination_filter: str, num_head: int):
    df = pgsql_data(start_time, source_filter, destination_filter, num_head)
    df = sql_injections(df)
    return df
def add_source_dest_columns(df):
    ''' Add source and destination columns for the PostgreSQL request.
    PostgreSQL requests are traced server-side (trace_role==2), unless the server is
    outside of the cluster in which case the request is traced client-side (trace_role==1).
    When trace_role==2, the PostgreSQL request source is the remote_addr column
    and destination is the pod column. When trace_role==1, the PostgreSQL request
    source is the pod column and the destination is the remote_addr column.
    Input DataFrame must contain trace_role, upid, remote_addr columns.
    '''
    df.pod = df.ctx['pod']
    df.namespace = df.ctx['namespace']
    # If remote_addr is a pod, get its name. If not, use IP address.
    df.ra_pod = px.pod_id_to_pod_name(px.ip_to_pod_id(df.remote_addr))
    df.is_ra_pod = df.ra_pod != ''
    df.ra_name = px.select(df.is_ra_pod, df.ra_pod, df.remote_addr)
    df.is_server_tracing = df.trace_role == 2
    df.is_source_pod_type = px.select(df.is_server_tracing, df.is_ra_pod, True)
    df.is_dest_pod_type = px.select(df.is_server_tracing, True, df.is_ra_pod)
    # Set source and destination based on trace_role.
    df.source = px.select(df.is_server_tracing, df.ra_name, df.pod)
    df.destination = px.select(df.is_server_tracing, df.pod, df.ra_name)
    # Filter out messages with empty source / destination.
    df = df[df.source != '']
    df = df[df.destination != '']
    df = df.drop(['ra_pod', 'is_ra_pod', 'ra_name', 'is_server_tracing'])
    return df
def add_source_dest_links(df, start_time: str):
    ''' Modifies the source and destination columns to display deeplinks in the UI.
    Clicking on a pod name in either column will run the px/pod script for that pod.
    Clicking on an IP address, will run the px/net_flow_graph script showing all
    network connections to/from that address.
    Input DataFrame must contain source, destination, is_source_pod_type,
    is_dest_pod_type, and namespace columns.
    '''
    # Source linking. If source is a pod, link to px/pod. If an IP addr, link to px/net_flow_graph.
    df.src_pod_link = px.script_reference(df.source, 'px/pod', {
        'start_time': start_time,
        'pod': df.source
    })
    df.src_link = px.script_reference(df.source, 'px/net_flow_graph', {
        'start_time': start_time,
        'namespace': df.namespace,
        'from_entity_filter': df.source,
        'to_entity_filter': '',
        'throughput_filter': '0.0'
    })
    df.source = px.select(df.is_source_pod_type, df.src_pod_link, df.src_link)
    # If destination is a pod, link to px/pod. If an IP addr, link to px/net_flow_graph.
    df.dest_pod_link = px.script_reference(df.destination, 'px/pod', {
        'start_time': start_time,
        'pod': df.destination
    })
    df.dest_link = px.script_reference(df.destination, 'px/net_flow_graph', {
        'start_time': start_time,
        'namespace': df.namespace,
        'from_entity_filter': '',
        'to_entity_filter': df.destination,
        'throughput_filter': '0.0'
    })
    df.destination = px.select(df.is_dest_pod_type, df.dest_pod_link, df.dest_link)
    df = df.drop(['src_pod_link', 'src_link', 'is_source_pod_type', 'dest_pod_link',
                  'dest_link', 'is_dest_pod_type'])
    return df
```

And here is a companion `vis.json` that will give you a nicely formatted table:
```json
{
  "variables": [
    {
      "name": "start_time",
      "type": "PX_STRING",
      "description": "The relative start time of the window. Current time is assumed to be now.",
      "defaultValue": "-5m"
    },
    {
      "name": "source_filter",
      "type": "PX_STRING",
      "description": "The partial string to match the 'source' column.",
      "defaultValue": ""
    },
    {
      "name": "destination_filter",
      "type": "PX_STRING",
      "description": "The partial string to match the 'destination' column.",
      "defaultValue": ""
    },
    {
      "name": "max_num_records",
      "type": "PX_INT64",
      "description": "Max number of records to show.",
      "defaultValue": "1000"
    }
  ],
  "globalFuncs": [
    {
      "outputName": "potential_sql_injections",
      "func": {
        "name": "potential_sql_injections",
        "args": [
          {
            "name": "start_time",
            "variable": "start_time"
          },
          {
            "name": "source_filter",
            "variable": "source_filter"
          },
          {
            "name": "destination_filter",
            "variable": "destination_filter"
          },
          {
            "name": "num_head",
            "variable": "max_num_records"
          }
        ]
      }
    }
  ],
  "widgets": [
    {
      "name": "Table",
      "position": {
        "x": 0,
        "y": 0,
        "w": 12,
        "h": 4
      },
      "globalFuncOutputName": "potential_sql_injections",
      "displaySpec": {
        "@type": "types.px.dev/px.vispb.Table"
      }
    }
  ]
}
```
