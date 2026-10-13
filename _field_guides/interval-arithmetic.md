---
title: Interval Arithmetic
description: Computing with guaranteed enclosures, from outward rounding and dependency to verified numerical algorithms.
order: 2
resource_topic: interval-arithmetic
---

Interval arithmetic represents an uncertain or unknown real value by an interval $[a,b]$ and extends operations so the resulting interval contains every possible exact result. Instead of asking only for a plausible approximation, it asks for an **enclosure** that can support a mathematical guarantee.

## From numbers to sets

For intervals $X=[a,b]$ and $Y=[c,d]$, addition is

$$X+Y=[a+c,b+d].$$

On a floating-point machine, the lower endpoint must be rounded downward and the upper endpoint upward. This outward rounding is what preserves containment. Multiplication, division, and elementary functions require more care because signs, extrema, discontinuities, and domain restrictions matter.

## Why intervals can become wide

Interval evaluation forgets relationships between repeated occurrences of a variable. If $X=[0,1]$, then the expression $X-X$ evaluates to $[-1,1]$ even though $x-x=0$ for every individual $x$. This **dependency problem**, together with wrapping effects in higher dimensions, motivates reformulation, subdivision, affine arithmetic, Taylor models, and other enclosure methods.

## What researchers study

- Efficient, portable outward rounding and elementary functions.
- Tight enclosures and strategies for controlling dependency and wrapping.
- Interval linear algebra, optimization, root finding, and differential equations.
- Decorations and semantics for undefined or discontinuous operations.
- Formal verification and computer-assisted proofs.
- Parallel and vector implementations that preserve containment.

## People who shaped the field

- **Ramon E. Moore** established modern interval analysis as a systematic discipline.
- **Fritz Krückeberg** and **Ulrich Kulisch** helped develop foundational theory and machine-oriented interval arithmetic.
- **Götz Alefeld** advanced interval methods for linear and nonlinear systems.
- **Arnold Neumaier** contributed influential algorithms, theory, and expository work in validated numerics.
- **R. Baker Kearfott** developed interval methods for global optimization and played a major role in standardization.
- **Nathalie Revol**, **John Pryce**, and many members of IEEE 1788 shaped standardized interval semantics.

## Related topics

Most practical interval implementations build on [floating-point arithmetic]({{ '/resources/floating-point-arithmetic/' | relative_url }}). Directed rounding, exceptional behavior, and elementary-function accuracy determine whether an enclosure remains valid and how tight it is. Independent intervals can also be processed with SIMD, although endpoint layout and discontinuities complicate vector implementations.

## A route into the literature

1. Ramon E. Moore, R. Baker Kearfott, and Michael J. Cloud, [*Introduction to Interval Analysis*](https://epubs.siam.org/doi/book/10.1137/1.9780898717716).
2. Arnold Neumaier, [*Interval Methods for Systems of Equations*](https://www.cambridge.org/core/books/interval-methods-for-systems-of-equations/1BC3BDF16A2F4EC44EAFAD75051733DA).
3. IEEE 1788, [*Standard for Interval Arithmetic*](https://standards.ieee.org/ieee/1788/4431/).
4. Ulrich Kulisch, [*Computer Arithmetic and Validity*](https://www.degruyterbrill.com/document/doi/10.1515/9783110301793/html).

## Useful resources

{% include field_resource_links.liquid topic=page.resource_topic %}
