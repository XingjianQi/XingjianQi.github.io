---
layout: page
title: Research
permalink: /research/
description: Research on accurate and efficient computer arithmetic for scientific computing.
nav: true
nav_order: 1
---

My research focuses on improving the **accuracy**, **efficiency**, and **expressiveness** of computer arithmetic. I work across numerical representation, algorithms, and software implementation, with the goal of making new arithmetic ideas useful in real scientific applications.

## Numerical representations

Conventional IEEE floating-point formats are an extraordinarily successful compromise, but no single fixed format is ideal for every stage of every computation. I investigate alternative and variable-length representations that can distribute precision and dynamic range differently, including tapered floating-point formats.

The central question is not simply whether a new format can represent more values. A useful representation must also support efficient operations, predictable numerical behavior, and integration into existing software and hardware.

## Mixed- and low-precision algorithms

Many numerical algorithms do not need the same precision everywhere. Lower precision can reduce memory traffic, increase SIMD throughput, and lower computational cost; higher precision can be reserved for sensitive operations, residual calculations, or refinement.

I am interested in algorithms that make these choices deliberately and provide a clear relationship between computational cost and the accuracy of the final result.

## Arithmetic libraries

I develop C++ libraries that turn arithmetic research into tools that can be evaluated in applications. Current directions include:

- emulation and evaluation of novel tapered floating-point formats;
- fast interval arithmetic;
- variable-length and mixed-precision data types;
- SIMD implementations of numerical operations;
- Efficient(GPU and CPU) implementations of mixed-precision algorithms;
- applying these libraries to scientific-computing workloads.

The [Resources]({{ '/resources/' | relative_url }}) pages give broader introductions and useful links for [floating-point arithmetic]({{ '/resources/floating-point-arithmetic/' | relative_url }}), [interval arithmetic]({{ '/resources/interval-arithmetic/' | relative_url }}), and [vectorization]({{ '/resources/vectorization/' | relative_url }}).

## Collaboration

I am looking for scientific applications in which arithmetic representation or precision is a genuine performance or accuracy constraint. If you are interested in evaluating one of my libraries or exploring a joint application, please contact me with Email. 
