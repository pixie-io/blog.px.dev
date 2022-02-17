---
path: '/detect-monero-miners'
title: 'Detecting Monero miners with bpftrace'
date: 2022-02-17T06:00:00.000+00:00
featured_image: hero.png
categories: ['Pixie Team Blogs']
authors: ['Phillip Kuznetsov']
emails: ['philkuz@pixielabs.ai']
---

Cryptomining is expensive if you have to pay for the equipment and energy. But if you “borrow” those resources, cryptomining switches from marginal returns to entirely profit. This asymmetry is why [cybercrime groups](https://www.tigera.io/blog/teamtnt-latest-ttps-targeting-kubernetes/) increasingly focus on
[cryptojacking](https://www.interpol.int/en/Crimes/Cybercrime/Cryptojacking)  – stealing compute time for the purpose of cryptomining – as part of malware deployments.

Despite a common misconception, [most cryptocurrencies are not actually anonymous](https://bitcoin.org/en/you-need-to-know#:~:text=Bitcoin%20is%20not%20anonymous&text=All%20Bitcoin%20transactions%20are%20stored,transactions%20of%20any%20Bitcoin%20address.&text=This%20is%20one%20reason%20why%20Bitcoin%20addresses%20should%20only%20be%20used%20once.). If these cryptojackers were to mine Bitcoin or Ethereum, their transaction details would be open to the public, making it possible for law enforcement to track them down. Because of this, many cybercriminals opt to mine [Monero: a privacy focused cryptocurrency](https://www.getmonero.org/get-started/what-is-monero/) that makes transactions confidential and untraceable.

In this article we’ll discuss the following:
- Existing methods for detecting cryptojackers
- How to leverage [bpftrace](https://github.com/iovisor/bpftrace) to detect Monero miners

_Detection scripts and test environment can be [found in this repo](https://github.com/pixie-io/pixie-demos/tree/main/detect-monero-demo)_.

## Contents

- [What happens during cryptomining?](#what-happens-during-cryptomining)
- [What signals can we detect?](#what-can-we-detect)
- [Monero mining signals](#detecting-monero-miners)
- [Building our bpftrace script](#building-our-bpftrace-script)
  - [What is bpftrace?](#what-is-bpftrace)
  - [Test environment](#test-environment)
  - [Where should we trace?](#where-can-we-find-the-data)
  - [What data do we need?](#what-data-do-we-need)

## What happens during cryptomining?

What happens during cryptomining and why is it important? [This blog post by Anthony Albertorio](https://medium.com/coinmonks/simply-explained-why-is-proof-of-work-required-in-bitcoin-611b143fc3e0) provides more detail, but here's what's relevant:

Miners race to create the next block for the blockchain. The network rewards them with cryptocurrency when they submit a valid block. Each block contains the hash of the previous block (hence the “chain”), the list of transactions, and a Proof of Work (PoW) [^1]. A miner wins when it successfully finds a valid Proof of Work for that list of transactions. [The Bitcoin Proof of Work](https://youtu.be/9V1bipPkCTU?t=183) is a string that causes the entire block to hash to a bit-string with a “target” number of leading 0s. 

::: div image-m
<svg title="Bitcoin Proof of Work" src='btc-pow.png' />
:::


Verifying the proof is computationally easy: you hash the block and verify that the bitstring matches the expected target. Finding the proof is difficult:  the only way to discover it is by guessing. When a miner finds a proof, they broadcast the solution to the network of other miners, who quickly verify the solution. Once the solution is accepted, each miner updates their local copy of the blockchain and starts work on the next block. 


## What can we detect?

Now that we know how cryptomining works, we can evaluate ways to detect cryptojackers. Note that no matter what we propose below, the landscape will shift and new techniques will be necessary. Attackers adapt to defenses and detections as they confront them in the field.


### Analyzing binaries

Many cryptojackers opt to use open-source mining software without modification. Scanning binaries running on the operating system for common mining software names and signatures of mining software is a simple yet effective barrier.

🟢 **Pros:** simple to implement, large surface area. 

🔴 **Cons:** easy to bypass with obfuscation of code. Can also be hidden from  tools like `ps` or `top` using [libprocesshider](https://github.com/gianlucaborello/libprocesshider).


### Block connections to known IPs

Many cryptominers choose to [contribute to a mining pool](https://www.investopedia.com/tech/how-choose-cryptocurrency-mining-pool/), which will require some outgoing network connection to a central location. You can make a blocklist of the top 100 cryptomining pools and block a large portion of miners. 

🟢 **Pros:** simple to implement, large surface area

🔴 **Cons:** easy to bypass with proxies or by searching for allowed pools


### Model common network patterns of miners

Most miners opt for SSL which means reading the body of messages is impossible, but there are still signatures that exist for the network patterns. [Michele Russo et al. collect network data](https://jis-eurasipjournals.springeropen.com/articles/10.1186/s13635-021-00126-1) on these traces and trained an ML classifier to discriminate between normal network patterns and cryptominer network patterns.

Because the miners must receive block updates from the rest of the network as well as updates from mining pools, they must rely on the network. 

🟢 **Pros:** robust to proxies, miners are guaranteed to leave a trace due to dependence on the network. 

🔴 **Cons:** large upfront investment to collect data and train models. Operational investment to update models with new data after discovery of new attacks. Risk of [steganographic obfuscation](https://www.sciencedirect.com/science/article/pii/S1389128621001249) or [adversarial examples](https://en.wikipedia.org/wiki/Adversarial_machine_learning).


### Model hardware usage patterns of miners

Similarly, you can collect data from hardware counters and train a model that discriminates between mining and not-mining use of CPU, GPU, etc., as discussed in [Gangwal et al.](https://arxiv.org/abs/1909.00268) and [Tahir et al.](http://caesar.web.engr.illinois.edu/papers/dime-raid17.pdf) 

🟢 **Pros:** robust to binary obfuscation

🔴 **Cons:** large upfront investment to collect data and train models. Operational investment to update models with new data after discovery of new attacks. Risk of [steganographic obfuscation](https://www.sciencedirect.com/science/article/pii/S1389128621001249) or [adversarial examples](https://en.wikipedia.org/wiki/Adversarial_machine_learning).


## Detecting Monero miners

We mentioned earlier that cryptojackers opt to mine Monero because of [the privacy guarantees](https://www.getmonero.org/resources/about/). It turns out that Monero’s Proof of Work algorithm, [RandomX](https://github.com/tevador/RandomX), actually leaves behind a detectable trace.

RandomX adds a layer on top of the Bitcoin PoW. Instead of guessing the “proof string” directly, you need to find a “proof program” in the [RandomX instruction set](https://github.com/tevador/RandomX/blob/master/doc/design.md#21-instruction-set) that outputs the “proof string” when run in the RandomX VM. Because every correct length bitstring is a valid program, Monero miners randomly generate "proof programs" and evaluate each in the RandomX VM. 

::: div image-xl
<svg title="Monero miner Proof of Work" src='xmr-pow.png'/>
::: 

**These RandomX programs are easy to spot.** They leverage a large set of CPU features, some of which are rarely used by other programs. The instruction set [attempts to hit many features available on](https://github.com/tevador/RandomX/blob/master/doc/design.md#23-registers) commodity CPUs. 
This design decision [curtails the effectiveness of GPUS and ASICs](https://github.com/tevador/RandomX/blob/master/doc/design.md#1-design-considerations), forcing miners to use CPUs.

One RandomX instruction in particular leaves behind a strong signal in the CPU. [CFROUND](https://github.com/tevador/RandomX/blob/master/doc/specs.md#541-cfround) changes the rounding mode for floating point operations. Other programs rarely set this mode. When they do, they rarely toggle this value as much as RandomX does. The main RandomX contributor, [tevador](https://github.com/tevador), created [randomx-sniffer](https://github.com/tevador/randomx-sniffer) which looks for programs that change the rounding-mode often on Windows machines. Nothing exists for Linux yet - but we can build this with bpftrace.


## Building our bpftrace script
We want to detect traces of RandomX (the CPU-intensive mining function for Monero) running on a cluster. Specifically, we want to find the forensic trace of RandomX changing the [floating-point rounding mode](https://developer.arm.com/documentation/dui0475/k/floating-point-support/ieee-754-arithmetic-and-rounding). We can do this with [bpftrace](https://github.com/iovisor/bpftrace).

### What is bpftrace?

[bpftrace](https://github.com/iovisor/bpftrace) makes it easy to collect data about running Linux processes. bpftrace is a simple interface on top of [eBPF](https://ebpf.io/), a Linux kernel technology that allows you to add operating system capabilities safely at runtime. We want to leverage bpftrace to collect data from running programs.

We specifically want a script that grabs information about the floating-point unit (FPU) configuration. The FPU configuration contains the rounding mode setting that Monero miners change often.


### Test environment

The scripts and environment setup instructions [are available here](https://github.com/pixie-io/pixie-demos/tree/main/detect-monero-demo).

**The cluster:** I deployed a Kubernetes cluster on a few machines running Linux Kernel 5.13, using x86 processors [^2].

**The target:** I deployed [xmrig, a popular open source Monero miner](https://github.com/xmrig/xmrig) to my cluster.

**The bpftrace environment:** You can use the [bpftrace CLI](https://github.com/iovisor/bpftrace/blob/master/INSTALL.md) directly on nodes. I chose to use Pixie instead because I wanted to [deploy bpftrace to all the nodes](https://blog.px.dev/distributed-bpftrace/) on my cluster and leverage Pixie's data engine.


### Where can we find the data?

We need to find a probe accessible from bpftrace that stores information about the FPU. Where do we look? One option is to search for matching probes in the bpftrace CLI:  `bpftrace -l *fpu*`. Unfortunately this leaves a large set of options (62 on my cluster) that can take a while to evaluate.

I had better luck searching for existing eBPF programs that attach to fpu probes. [Intel's cri-resource-manager](https://github.com/intel/cri-resource-manager) attaches to the `x86_fpu_regs_deactivated` tracepoint to track context switches of x86 CPUs. They accessed an `fpu` struct, grabbing a field called `avx512_timestamp`. That `fpu` struct felt like a good place to investigate for register values.

But before diving into the struct definition, let’s make sure the tracepoint actually collects data on our system. Here’s our first bpftrace script: 


```c
tracepoint:x86_fpu:x86_fpu_regs_deactivated
{
    printf("time_:%llu pid:%d comm:%s",
            nsecs, pid, comm);
}
```


It runs whenever the `x86_fpu_regs_deactivated` event triggers. For each event, the script outputs the time of the event, the pid of the triggering process and the name of the triggering process (aka `comm`). 

We see a bunch of events, some of which come from the miner, xmrig. 


::: div image-xl
<svg title="Table listing every fpu deactivated event" src='fpu_events_table.png'/>
:::


Aggregating, we see that `xmrig` shows up near the top of the list, but it doesn’t show up alone and is definitely not the heaviest user of the FPU. We need to inspect the actual data in the `x86_fpu_regs_deactivated` probe to help us discriminate xmrig.


::: div image-xl
<svg title="Aggregated table of every fpu event by process" src='fpu_events_aggregated.png'/>
:::



### What data do we need?

We're trying to detect a signature of the [CFROUND](https://github.com/tevador/RandomX/blob/master/doc/specs.md#541-cfround) instruction from RandomX. `CFROUND` changes the [floating-point rounding mode](https://developer.arm.com/documentation/dui0475/k/floating-point-support/ieee-754-arithmetic-and-rounding) for future floating-point operations. Most programs do not change this value so it gives us a strong signal of something fishy.

**What happens when RandomX executes `CFROUND`?** If you inspect the RandomX [x86 implementation of CFROUND](https://github.com/tevador/RandomX/blob/f9ae3f235183c452962edd2a15384bdc67f7a11e/src/jit_compiler_x86.cpp#L766), you'll find the last instruction calls [LDMXCSR](https://www.felixcloutier.com/x86/ldmxcsr).

This sets the [MXCSR](https://help.totalview.io/previous_releases/2019/html/Reference_Guide/Intelx86MXSCRRegister.html) register in the FPU; the register is responsible for control and status values for [Streaming SIMD Extensions](https://en.wikipedia.org/wiki/Streaming_SIMD_Extensions). `CFROUND` sets the two rounding bits ([with mask 0x6000](https://en.wikipedia.org/wiki/Streaming_SIMD_Extensions)) of MXCSR to the argument value. (See the [x86 assembly for CFROUND](https://github.com/tevador/RandomX/blob/a44d07c89fb83ae748b9966b50848092afadde6b/doc/program.asm#L351)).

Let’s try to find the MXCSR register in the `fpu` struct exposed by `x86_fpu_regs_deactivated`. What fields are available inside the `fpu` struct? First, I searched for the [tracepoint definition](https://sourcegraph.com/github.com/torvalds/linux@v5.13/-/blob/arch/x86/include/asm/trace/fpu.h), which led me to the x86/include/fpu namespace. Then I searched for the struct definition inside the namespace, which surfaced: [asm/fpu/types.h](https://sourcegraph.com/github.com/torvalds/linux@v5.13/-/blob/arch/x86/include/asm/fpu/types.h?L317:1). We’ll include this header in our bpftrace script. Finally, I searched in that file for `mxcsr` and found it's available via `fpu->state.xsave.i387.mxcsr`

Let's access this register value in bpftrace [^3].


```c
#include <asm/fpu/internal.h>
#include <asm/fpu/types.h>
tracepoint:x86_fpu:x86_fpu_regs_deactivated
{
    $f = (struct fpu *)args->fpu;
    $mxcsr = $f->state.xsave.i387.mxcsr;
    printf("time_:%llu pid:%d comm:%s mxcsr:%d",
            nsecs, pid, comm, $mxcsr);
}
```


_[Source](https://github.com/pixie-io/pixie-demos/tree/main/detect-monero-demo)_

Running this, `xmrig` stands out from the rest based on the register value alone. We’re on the right track.


::: div image-xl
<svg title="mxcsr register values" src='mxcsr_register_values.png'/>
:::


Now for the sinker: filtering by the rounding-bits from `$mxcsr`. We can find the rounding bits of the register by [masking 0x6000](https://help.totalview.io/previous_releases/2019/html/index.html#page/Reference_Guide/Intelx86MXSCRRegister.html) and shifting the bits towards the least significant bits. Then we filter out all non-zero values.


```c
#include <asm/fpu/internal.h>
#include <asm/fpu/types.h>
tracepoint:x86_fpu:x86_fpu_regs_deactivated
{
    $f = (struct fpu *)args->fpu;
    $mxcsr = $f->state.xsave.i387.mxcsr;
    $fpcr = ($mxcsr & 0x6000) >> 13;
    if ($fpcr != 0) { 
        printf("time_:%llu pid:%d comm:%s fpcr:%d",
            nsecs, pid, comm, $fpcr);
    }
}
```


_[Source](https://github.com/pixie-io/pixie-demos/tree/main/detect-monero-demo)_

And now we only see xmrig! **Our detector successfully isolates the Monero miner running in the cluster.**


::: div image-xl
<svg title="non default floating-point rounding mode table" src='fpcr_values.png'/>
:::


We can then [connect the process to the hosting Kubernetes pod using Pixie](https://github.com/pixie-io/pixie-demos/blob/main/detect-monero-demo/detectrandomx.pxl).

::: div image-xl
<svg title="Pods that are suspected to run RandomX" src='pods.png'/>
:::

## Wrapping up

And there you have it - easily detect Monero mining on your cluster! _If only it could be so simple._ Like any other security tool, this mining detector is only one turn of the security cat and mouse game. For example, an illicit miner might be able to avoid running RandomX programs that contain `CFROUND` instructions and evade detection entirely.

The best anti-cryptojacking solution will be a combination of defenses and detections using different modalities. That might mean combining this approach with the approaches listed earlier in the article or with other detectors written in bpftrace.

All the above code is available [on Github](https://github.com/pixie-io/pixie-demos/tree/main/detect-monero-demo). If you come up with some new Monero detectors or clever ways to use bpftrace, let us know on [our Slack](https://slackin.px.dev/) or tag us on Twitter [@pixie_run](https://twitter.com/pixie_run). 


[^1]: Some cryptocurrencies use other consensus mechanisms than Proof of Work such as Proof of Stake. We don’t cover these in this article.
[^2]: The scripts in this article are x86 specific. You’ll have to modify the script for other CPU architectures. However, bpftrace scripts are not necessarily architecture specific.
[^3]: Why did I include this other random header? I received: `include/asm/fpu/types.h:309:15: error: use of undeclared identifier 'PAGE_SIZE'` When I only included `types.h`. I looked for a file in the same directory that defined this variable and included it first.

