---
layout: page
title: Performance and Numerical Reliability of Floating-Point Computation
permalink: /research/floating-point-reliability/
description: Evaluating numerical accuracy and throughput together, across mathematical functions, input regions, and SIMD implementations.
research: true
research_area: Floating-point computation
research_highlight: "SIMDMathBench · Correctness 2026"
research_figure: # Add a local image path, e.g. /assets/img/research/simd-math.png
research_figure_alt:
importance: 2
category: research
---

[← Research overview]({{ '/research/' | relative_url }})

This work investigates how numerical algorithms and their implementations affect both accuracy and performance. Our current evaluation of SIMD mathematical functions examines behavior that can be obscured by a single accuracy bound or throughput measurement.

## The problem

Functions such as exponentials, logarithms, and trigonometric functions rely on approximation, argument reduction, and special-case handling. SIMD implementations evaluate several inputs together, but their execution cost and numerical behavior can depend on the input region and, in some cases, on the other values in the same vector.

Our aim is to characterize these interactions so that numerical software can be selected and validated against application requirements. This work combines accuracy testing with measurements that deliberately exercise different execution paths.

## Evaluation method

Our study evaluates unary **FP32 mathematical functions through 256-bit AVX2 interfaces** from AOCL-LibM, GNU libmvec, SLEEF, and Intel SVML.

For accuracy, we exhaustively test every finite FP32 encoding against a **256-bit MPFR reference**, supplemented by checks for infinities, NaNs, and mixed-lane inputs. We measure error in units in the last place (ULP), examine documented accuracy claims where they apply, and investigate whether a neighboring lane can change the result for an otherwise unchanged input.

For performance, we use inputs that exercise ordinary SIMD evaluation, expensive argument reduction, and scalar correction or fallback paths. Scalar and vector interfaces are compared under the same benchmark conditions.

## Main findings

- **Throughput depends strongly on the inputs.** Every tested function-library pair is faster through its vector interface on selected inexpensive inputs. Other input regions can reduce throughput by an order of magnitude or more, and some vector routines become slower than their scalar counterparts.
- **Accuracy needs to be checked over the relevant domain.** The evaluation identifies violations of documented bounds in several tested implementations, as well as behavior around cutoffs and special inputs that a single aggregate value can hide.
- **SIMD lanes can interact numerically.** Selected tests show that changing a neighboring lane can alter the output for a fixed input. Mixed-lane testing therefore complements exhaustive tests of individual input values.

These findings apply to the tested library versions, FP32 AVX2 interfaces, and AMD EPYC system. They do not establish a universal ranking of libraries across architectures, precisions, or later releases.

## Detailed accuracy results

The following evaluation includes a **later SVML CR campaign beyond the paper's original six configurations**. Those additional results appear in the final column and should not be read as measurements from the original paper.

### Tested interfaces and bounds

Here, `*` stands for the function name. Some bounds are historical or conjectured, as indicated; those values are not all documented guarantees of the tested version.

<div class="research-table" role="region" aria-label="Tested SIMD math library versions and accuracy bounds" tabindex="0" markdown="1">

| Backend | Version | AVX2 symbol family | Reported or assumed bound |
| :--- | :--- | :--- | :--- |
| AOCL | 5.3.0 | `amd_vrs8_*f` | ≤4 ULP |
| libmvec | glibc 2.42 | `_ZGVdN8v_*f` | ≤4 ULP (historical) |
| SLEEF U10 | 3.9.0 | `Sleef_*f8_u10avx2` | ≤1 ULP, with function-specific exceptions |
| SLEEF U35 | 3.9.0 | `Sleef_*f8_u35avx2` | ≤3.5 ULP |
| SVML | 2026.0.0-947 | `__svml_*f8` | ≤4 ULP |
| SVML HA | 2026.0.0-947 | `__svml_*f8_ha` | ≤1 ULP (conjectured) |
| SVML CR | 2026.2.0-863 | `__svml_*f8_cr` | ≤0.5 ULP (conjectured; later campaign) |

</div>

The libmvec comparison uses the bound documented through glibc 2.41; glibc 2.42 removed that bound from its documentation. SLEEF bounds apply within each function's documented effective region, with U05, U15, and U35 exceptions identified below. The SVML HA and CR bounds are conjectures based on compiler precision-mode settings.

<details class="research-results" markdown="1">
<summary>Explore the complete maximum-error table and interpretation notes</summary>

### Maximum observed error

Values are maximum observed errors in ULP within each implementation's effective region. Lower is better; finite values are rounded upward. A displayed value of 0.500 alone is not a proof of correct rounding.

<div class="research-table" role="region" aria-label="Maximum observed ULP errors across FP32 AVX2 functions" tabindex="0" markdown="1">

| Function | AOCL | libmvec | SLEEF U10 | SLEEF U35 | SVML | SVML HA | SVML CR |
|---|---:|---:|---:|---:|---:|---:|---:|
| `acos` | 1.534 | 2.153 | 0.695 | 1.282 | 1.245 | 0.796 | 0.500 |
| `acosh` | — | 2.807 | 0.513† | — | 2.807 | 0.902 | — |
| `acospi` | — | — | — | — | 2.457 | 0.792 | — |
| `asin` | 2.232 | 2.662 | 0.777 | 2.432 | 2.266 | 0.755 | 0.500 |
| `asinh` | — | 2.087 | 1.001† | — | 2.087 | 0.716 | — |
| `asinpi` | — | — | — | — | 2.677 | 0.788 | — |
| `atan` | 2.504 | 2.466 | 0.939 | 2.637 | 2.466 | 0.829 | 0.500 |
| `atanh` | — | 2.044 | 1.001 | — | 2.044 | 0.572 | — |
| `atanpi` | — | — | — | — | 3.269 | 1.000 | — |
| `cbrt` | — | 2.852 | 0.501 | 1.312 | 2.774 | 0.522 | 0.500 |
| `cos` | 12.778 | 2.014 | 0.937 | 2.494 | 2.468 | 0.875 | 0.500 |
| `cosd` | — | — | — | — | 2.026 | 0.501 | — |
| `cosh` | 3.695 | 2.080 | 0.503† | 1.447† | 2.080 | 0.572 | 0.500 |
| `cospi` | — | — | 7.137e44 (U05) | — | 2.455 | 0.611 | — |
| `erf` | ∞* | 1.929 | 1.000 | — | 1.929 | 0.780 | — |
| `erfc` | 6.628 | 1.615 | 1.448 (U15) | — | 1.615 | 0.934 | — |
| `exp` | 3.281 | 2.638 | 0.988 | — | 2.638 | 0.750 | 0.500 |
| `exp10` | — | 1.735 | 0.822 | 1.004 | 1.735 | 0.525 | 0.500 |
| `exp2` | 1.217 | 0.823 | 0.885 | 0.885 | 2.844 | 0.617 | 0.500 |
| `exp2m1` | — | — | — | — | — | — | 0.500 |
| `expm1` | — | 1.679 | 1.000 | — | 2.620 | 0.560 | 0.500 |
| `invsqrt` | — | — | — | — | 2.386‡ | 0.510‡ | 0.500‡ |
| `lgamma` | — | — | 9.555e4† | — | — | — | — |
| `log` | 1.999e6† | 3.938 | 0.629 | 2.845 | 3.938 | 0.932 | 0.500 |
| `log10` | 4.635 | 2.785 | 0.712 | — | 2.785 | 0.771 | 0.500 |
| `log1p` | — | 1.958 | 1.000 | — | 1.958 | 0.623 | 0.500 |
| `log2` | 4.295 | 2.082 | 0.674 | 3.073 | 2.082 | 0.681 | 0.500 |
| `log2p1` | — | — | — | — | — | — | 0.500 |
| `sin` | 3.114 | 2.112 | 0.904 | 2.474 | 2.371 | 0.771 | 0.500 |
| `sind` | — | — | — | — | 1.959 | 0.501 | — |
| `sinh` | — | 1.546 | 1.000† | 3.403† | 1.546 | 0.697 | 0.500 |
| `sinpi` | — | — | 8.389e6 (U05) | — | 2.454 | 0.611 | — |
| `sqrt` | 0.500 | 0.500  | 0.500  (U35) | 0.500  | 0.500  | 0.500  | — |
| `tan` | 3.989 | 3.651 | 0.938 | 3.456 | 3.651 | 0.503 | 0.500 |
| `tand` | — | — | — | — | 3.913 | 0.880 | — |
| `tanh` | 0.500 | 1.027 | 1.001 | 2.860 | 3.819 | 0.514 | 0.500 |
| `tanpi` | — | — | — | — | 3.176 | 1.000 | — |
| `tgamma` | — | — | 2.463e4 | — | — | — | — |

</div>

### Reading the results

- **—**: no result in the respective tested interface/campaign. `exp2m1` and `log2p1` are additions from the CR campaign.
- **†**: a cutoff or special input increases the in-domain maximum beyond the effective-region value shown here.
- **‡**: `invsqrt(-0)` differs between SVML's −∞ and the MPFR oracle's +∞ convention. The CR scan records this one semantic discrepancy separately; it is not included in the finite effective-region maximum.
- **∞\*:** AOCL `erf` can return infinity for a finite result with a NaN companion. Its maximum without NaN companions is 4.015 ULP; the broadcast maximum is 3.939 ULP. The infinity is a separate diagnostic, not the broadcast error.
- **U05/U15/U35**: actual SLEEF routine suffix where it differs from the column heading.
- `libmvec sqrt` uses a local AVX2 square-root intrinsic, because no native symbol is provided.

</details>

## Code and publication

The evaluation code is available in [SIMDMathBench on GitHub](https://github.com/XingjianQi/SIMDMathBench).

<div class="research-reference">
{% reference qi2026simdmath %}
<div class="research-paper-links">
  <a href="{{ '/assets/bib/simd-math-2026.bib' | relative_url }}" download>Bib</a>
  <a href="https://correctness-workshop.github.io/2026/#program">Workshop program</a>
</div>
</div>

## Background

The [Floating-Point Arithmetic field guide]({{ '/resources/floating-point-arithmetic/' | relative_url }}) introduces representation, rounding, and numerical error. The [Vectorization field guide]({{ '/resources/vectorization/' | relative_url }}) covers SIMD execution, portable abstractions, and vector math libraries.

<link rel="stylesheet" href="{{ '/assets/css/research.css' | relative_url | bust_file_cache }}">
