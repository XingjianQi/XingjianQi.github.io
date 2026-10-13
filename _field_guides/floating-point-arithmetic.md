---
title: Floating-Point Arithmetic
description: How finite binary formats approximate real arithmetic—and how researchers reason about accuracy, performance, and new formats.
order: 1
resource_topic: floating-point-arithmetic
---

Floating-point arithmetic is the machinery that turns real-number calculations into finite operations on a computer. It is remarkably successful: the same basic model supports weather simulations, graphics, machine learning, and control systems. It is also an approximation. Understanding where that approximation enters is the beginning of computer-arithmetic research.

## The basic model

A normalized binary floating-point number has a sign, a significand, and an exponent. In simplified form,

$$x = (-1)^s \times m \times 2^e.$$

Only finitely many values of $m$ and $e$ are available. A real result therefore usually has to be rounded to a representable value. IEEE 754 defines widely used formats, rounding directions, exceptional values such as infinities and NaNs, and the expected behavior of core operations.

The standard error model writes a basic operation as

$$\operatorname{fl}(x \circ y) = (x \circ y)(1+\delta), \qquad |\delta| \leq u,$$

when no exceptional condition occurs. Here $u$ is the unit roundoff. This compact model is central to forward and backward error analysis, but it does not remove the need to study underflow, overflow, cancellation, exceptional values, or correlations between errors.

## What researchers study

- **Representation:** binary, decimal, tapered, logarithmic, block, and variable-length formats.
- **Rounding:** correctly rounded operations, stochastic rounding, directed rounding, and reproducibility.
- **Algorithms:** summation, dot products, elementary functions, and transformations that control error.
- **Precision allocation:** choosing different precisions across an algorithm to reduce time, memory traffic, or energy while meeting an accuracy target.
- **Verification:** proving error bounds or checking implementations against high-precision references.
- **Hardware–software co-design:** deciding which arithmetic behavior belongs in an instruction set, compiler, library, or application.

## People who shaped the field

- **William Kahan** was the principal architect of IEEE 754 and developed foundational ideas in practical error analysis, including compensated summation.
- **Jerome Coonen** contributed to the early design and formalization of the IEEE binary floating-point standard.
- **David Goldberg** made floating-point error analysis accessible through a widely read tutorial.
- **Nicholas Higham** developed widely used frameworks for numerical stability and error analysis.
- **Jean-Michel Muller** and collaborators systematized algorithms for elementary functions and correctly rounded arithmetic.
- **Siegfried Rump** made major contributions to accurate and verified numerical computation.

This is necessarily selective: computer arithmetic is a large, international field whose progress comes from standards work, numerical analysis, architecture, compilers, and library engineering.

## Related topics

Floating-point arithmetic also underlies topics such as [interval arithmetic]({{ '/resources/interval-arithmetic/' | relative_url }}) and accurate vector math libraries. For example, a SIMD implementation of `exp` must combine range reduction and approximation with lane-wise exceptional cases and hardware-aware scheduling.

## A route into the literature

1. David Goldberg, [*What Every Computer Scientist Should Know About Floating-Point Arithmetic*](https://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html).
2. Nicholas J. Higham, [*Accuracy and Stability of Numerical Algorithms*](https://epubs.siam.org/doi/book/10.1137/1.9780898718027).
3. Jean-Michel Muller et al., [*Handbook of Floating-Point Arithmetic*](https://link.springer.com/book/10.1007/978-3-319-76526-6).
4. IEEE 754, [*Standard for Floating-Point Arithmetic*](https://standards.ieee.org/ieee/754/6210/).

## Useful resources

{% include field_resource_links.liquid topic=page.resource_topic %}
