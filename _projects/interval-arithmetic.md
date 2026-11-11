---
layout: page
title: Interval Arithmetic
permalink: /research/interval-arithmetic/
description: Reliable numerical enclosures with efficient arithmetic, automatic vectorization, and usable programming interfaces.
research: true
research_area: Verified computing
research_highlight: "VILIB++ · ICPP 2026"
research_figure: # Add a local image path, e.g. /assets/img/research/interval-arithmetic.png
research_figure_alt:
importance: 1
category: research
---

[← Research overview]({{ '/research/' | relative_url }})

This work aims to make interval computing practical for scientific and engineering applications. We study how to preserve reliable enclosures while reducing the cost of obtaining them, with particular attention to rounding, data layout, compiler optimization, and programming interfaces.

## The problem

Interval arithmetic represents a quantity by lower and upper bounds. With suitable arithmetic and outward rounding, these bounds enclose the mathematical result despite finite-precision computation or uncertainty in the inputs.

Two difficulties arise in practice. First, enclosures can become too wide to be informative: repeated operations and lost dependencies between quantities can amplify overestimation. Second, interval computations incur additional arithmetic and memory traffic. Rounding-mode changes and conditional branches can further hinder compiler optimization and parallel execution.

The aim is to obtain useful enclosures at a manageable computational cost, while retaining interfaces that fit existing numerical software.

## Our approach: VILIB++

**VILIB++** is our C++ library for efficient, automatically vectorized interval arithmetic. It addresses the interaction between outward rounding and compiler-generated SIMD code.

- **Branchless rounding correction.** An additive correction avoids changing the global rounding mode, exposing arithmetic that compilers can vectorize.
- **Familiar expressions.** Overloaded arithmetic operators let suitable existing code use interval values without handwritten SIMD instructions.
- **Evaluation across layouts and workloads.** We examine both arrays of structures (AoS) and structures of arrays (SoA), from individual arithmetic operations to application kernels.

This approach trades some enclosure tightness for efficient execution. The evaluation therefore considers both numerical widths and throughput.

## Results and trade-offs

### Basic arithmetic

In the reported double-precision benchmarks, VILIB++ achieves roughly **12× the addition and subtraction throughput** of the fastest tested FILIB++ policies. Multiplication improves several-fold, depending on interval signs and data layout. Division gains are smaller: the best-performing VILIB++ layouts reach approximately **1.5–2×** the throughput of the optimized FILIB++ implementations.

These are measurements on the tested AMD EPYC 7662 system. The gains depend on the operation, compiler, and data layout; they are not a uniform speedup for every interval computation.

### Enclosure tightness

The following results use point-interval inputs that produce normal results. They report mean relative enclosure widths; smaller values indicate tighter enclosures. RMS denotes the FILIB++ rounding-mode-switching policy.

<div class="research-table" role="region" aria-label="Mean relative interval enclosure widths" tabindex="0" markdown="1">

| Operation | FILIB++ RMS | VILIB++ | VILIB++ / RMS |
| :--- | ---: | ---: | ---: |
| Addition | 1.534 × 10⁻¹⁶ | 3.079 × 10⁻¹⁶ | 2.01× |
| Subtraction | 1.534 × 10⁻¹⁶ | 3.079 × 10⁻¹⁶ | 2.01× |
| Multiplication | 1.600 × 10⁻¹⁶ | 3.200 × 10⁻¹⁶ | 2.00× |
| Division | 1.602 × 10⁻¹⁶ | 3.204 × 10⁻¹⁶ | 2.00× |

</div>

For these tests, the mean widths are approximately twice those obtained with rounding-mode switching. This describes enclosure quality under the stated conditions, rather than a universal bound on width growth in larger computations.

### Application kernels

VILIB++ can keep low-degree polynomial evaluations and small one-dimensional stencil computations limited by memory bandwidth. In those cases, much of the additional arithmetic work is hidden behind the movement of interval data.

As polynomial degree or stencil size increases, arithmetic becomes more significant. The results also depend on the compiler and layout; the AoS–SoA difference is especially pronounced for polynomial evaluation with ICX. The separately measured copy-bandwidth reference in these experiments is **99 GB/s**.

## Broader research questions

VILIB++ is one contribution to a broader investigation of interval computing. Further questions concern the balance between enclosure tightness and execution time, interval-aware control flow, and abstractions that remain usable while exposing efficient parallel code to compilers.

For example, when an interval comparison admits both outcomes, a conditional cannot simply select one branch. For an input interval spanning negative and positive values, an evaluation of `x > 0` must account for the feasible results of both branches and enclose their union. Handling such cases is part of the broader programming-model problem.

## Related publication

<div class="research-reference">
{% reference 10.1145/3832810.3832828 %}
<div class="research-paper-links">
  <a href="{{ '/assets/bib/vilib-2026.bib' | relative_url }}" download>Bib</a>
  <a href="https://doi.org/10.1145/3832810.3832828">Publication page</a>
</div>
</div>

## Background

The [Interval Arithmetic field guide]({{ '/resources/interval-arithmetic/' | relative_url }}) introduces enclosures, dependency, and verified computation. The [Vectorization field guide]({{ '/resources/vectorization/' | relative_url }}) explains the execution and compiler concepts behind automatic SIMD code generation.

<link rel="stylesheet" href="{{ '/assets/css/research.css' | relative_url | bust_file_cache }}">
