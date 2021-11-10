---
path: '/k8s-operator'
title: '3 Reasons to use Kubernetes Operators (and 2 reasons not to)'
date: 2021-11-10T06:00:00.000+00:00
featured_image: hero-image.png
categories: ['Pixie Team Blogs', 'Kubernetes']
authors: ['Michelle Nguyen']
emails: ['michelle@pixielabs.ai']
featured: true
---

We recently switched Pixie to an operator-based deployment. In order to make this decision, we compiled reasons for why you should and shouldn’t build an operator for your application.

## What is a Kubernetes Operator?

A Kubernetes [operator](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/) is a controller for packaging, managing, and deploying applications on Kubernetes. In this model, the controller watches a custom resource (CR) which represents the configuration and state of a Kubernetes application. The controller is then responsible for reconciling the actual state of the application with its expected state. This controller loop principle can help automate scaling, upgrades, and recovery for the application.

::: div image-m
<svg title='Operators allow you to manage complex applications by extending the Kubernetes control loop principle to an application defined in a custom resource definition (CRD).' src='operator.png' />
:::

## Should you add an Operator?

Whether or not you should use an operator depends on the specifics of your application, but here are some general points to consider:

### 🟢 Simplification for the end user

Abstracting your application into a single CRD helps users view your application as a single component rather than individual, separate parts (deployments/statefulsets/configmaps/etc). The operator can surface an overall system state, which reduces the cognitive load on users.

In Pixie’s case, users previously checked Pixie’s deploy status by viewing the pods:

```bash
kubectl get pods -n pl

NAME                                      READY   STATUS    RESTARTS   AGE
kelvin-5b7c8c4c5b-n7v5x                   1/1     Running   0          2d20h
pl-etcd-0                                 1/1     Running   0          2d20h
pl-etcd-1                                 1/1     Running   0          2d20h
pl-etcd-2                                 1/1     Running   0          2d20h
pl-nats-0                                 1/1     Running   0          2d20h
vizier-certmgr-7bcbf9d4bd-r8h5s           1/1     Running   0          2d20h
vizier-cloud-connector-854f8bb487-d69kk   1/1     Running   0          2d20h
vizier-metadata-79f8764589-hmz59          1/1     Running   0          2d20h
vizier-pem-crg62                          1/1     Running   12         2d20h
vizier-pem-r2xsn                          1/1     Running   4          2d20h
vizier-proxy-f584dc9c8-4gb72              1/1     Running   0          2d20h
vizier-query-broker-ddbc89b-wftbz         1/1     Running   0          2d20h
```

After the addition of the CRD, the entire state of the application can be summarized with one `kubectl
describe vizier` command:

```bash
kubectl describe vizier

Status:
 Last Reconciliation Phase Time:  2021-11-05T22:30:56Z
 Reconciliation Phase:            Ready
 Version:                         0.9.11
 Vizier Phase:                    Healthy
```

### 🟢 Cleanliness and consistency

Configuration options live in one place (the CRD) rather than spread out across many configmaps. The values in the CRD can be viewed as the source of truth, and is the single place where users need to make their modifications when adjusting the config.

Pixie originally had four configmaps:

```bash
pl-cloud-config
pl-cloud-connector-tls-config
pl-cluster-config
pl-tls-config
```

These configMaps are now represented by a [single CRD](https://github.com/pixie-io/pixie/blob/main/k8s/operator/crd/base/px.dev_viziers.yaml).

### 🟢 Auto-recovery

The operator can monitor the overall state of the application and apply whatever changes necessary to get the application into a healthy state. This is especially beneficial for persistent systems, or applications that need to be highly available.

NATS is a major dependency of Pixie, and enables most of Pixie’s pod-to-pod communication. Occasionally we have seen the NATS instance fail, and require a redeploy to recover. The operator can monitor NATS’s status and redeploy when necessary without any action from the user.

### 🔴 Loss of user control

The operator is responsible for deploying K8s resources that are abstracted away from the user. However, many users prefer to know exactly what is deployed on their system. Since it is the operator’s responsibility to manage these resources, the operator may also unknowingly overwrite any manual user changes.

In Pixie’s case, the user deploys only the [operator’s YAMLs](https://github.com/pixie-io/pixie/tree/main/k8s/operator) to get started. Pixie’s operator actually deploys [more resources](https://github.com/pixie-io/pixie/tree/main/k8s/vizier) to their cluster, which are not included in these initial YAMLs.

### 🔴 Maintenance burden

The operator is an additional piece of code that needs to be maintained and updated, alongside with the actual application itself. The more powerful the operator, the more complex its logic. The operator may be responsible for keeping the application up-to-date, but what happens when [the operator itself](https://olm.operatorframework.io/) needs to be updated?

Although the [operator’s logic](https://github.com/pixie-io/pixie/tree/main/src/operator) is not nearly as complicated as Pixie’s actual application, it is still over 1000+ LOC.

## Conclusion

Since Pixie is a complex application performance monitoring tool, we believed the benefits of running an operator-based deployment heavily outweighed the downsides. Feel free to check out the [implementation of our operator](https://github.com/pixie-io/pixie/tree/main/src/operator) as an example.
