---
title: Vectorization
description: How scalar computations become vector operations, and what this means for compilers, math libraries, and numerical behavior.
order: 3
resource_topic: vectorization
---

Single Instruction, Multiple Data (SIMD) execution applies one operation to several data elements at once. It is a core source of performance in contemporary CPUs and accelerators, but productive SIMD programming requires more than replacing scalar types with vectors. Data layout, memory access, control flow, compiler analysis, and numerical semantics all interact.

## The execution model

A vector instruction conceptually consumes vectors of lanes:

$$[x_0,x_1,\ldots,x_{w-1}] + [y_0,y_1,\ldots,y_{w-1}]
  = [x_0+y_0,x_1+y_1,\ldots,x_{w-1}+y_{w-1}].$$

Fixed-width instruction sets include x86 SSE/AVX/AVX-512 and Arm NEON. Scalable-vector approaches such as Arm SVE and the RISC-V Vector extension allow the same program representation to target different hardware vector lengths. GPUs expose related data-parallel models, usually discussed as SIMT, with their own scheduling and divergence behavior.

## How code becomes vector code

- **Compiler auto-vectorization** recognizes independent loop iterations or packs similar scalar operations. LLVM distinguishes loop vectorization from SLP vectorization.
- **Intrinsics** expose architecture-specific vector operations in a C-like form.
- **Portable vector abstractions** such as C++ `std::simd`, Highway, and xsimd aim to retain portability without hiding the model completely.
- **Vector math libraries** provide `sin`, `exp`, `log`, and other functions for whole vectors when hardware has no single matching instruction.

Important constraints include alignment, aliasing, irregular gathers and scatters, reductions, tail handling, register pressure, and branch divergence. Predication or masks let inactive lanes retain defined behavior, but masked work is not necessarily free.

## Numerical questions

Floating-point addition is not associative, so vectorizing a reduction may change its order and result. Compilers must know whether reassociation is permitted. Reproducible reductions, compensated algorithms, and higher-precision accumulators trade speed and implementation complexity for stronger numerical behavior.

Transcendental functions are especially rich. A vector `exp` or `sin` implementation normally performs range reduction, approximation, reconstruction, and special-case handling across all lanes. The fastest path may conflict with correct rounding, consistent exceptions, or accurate behavior near difficult inputs.

## People who shaped the field

- **Michael J. Flynn** introduced the widely used taxonomy that gave SIMD its name.
- **Seymour Cray** and teams building vector supercomputers established vector processing as a practical high-performance model.
- **Frances Allen** made foundational contributions to compiler optimization and program analysis that underpin automatic parallelization.
- **David Kuck** advanced dependence analysis and parallelizing compilers.
- **Dorit Nuzman**, **Ayal Zaks**, and compiler researchers across GCC and LLVM developed modern auto-vectorization techniques.
- **Naoki Shibata**, **Francesco Petrogalli**, and contributors to SLEEF advanced portable, accurate vector elementary functions.

## Related topics

Numerical SIMD code must respect the semantics of the arithmetic it accelerates. Reductions may be reordered, fused multiply-add changes intermediate rounding, and lower-precision lanes trade accuracy for throughput. These issues are introduced more fully in the [floating-point arithmetic resources]({{ '/resources/floating-point-arithmetic/' | relative_url }}).

## A route into the literature

1. Michael J. Flynn, [*Some Computer Organizations and Their Effectiveness*](https://doi.org/10.1109/TC.1972.5009071).
2. Dorit Nuzman, Ira Rosen, and Ayal Zaks, [*Auto-vectorization of Interleaved Data for SIMD*](https://research.ibm.com/publications/auto-vectorization-of-interleaved-data-for-simd).
3. Naoki Shibata and Francesco Petrogalli, [*SLEEF: A Portable Vectorized Library of C Standard Mathematical Functions*](https://arxiv.org/abs/2001.09258).

## Useful resources

{% include field_resource_links.liquid topic=page.resource_topic %}
