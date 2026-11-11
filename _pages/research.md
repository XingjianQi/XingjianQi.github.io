---
layout: page
title: Research
permalink: /research/
description: Accurate and efficient computer arithmetic, from numerical methods to working software.
nav: true
nav_order: 1
_styles: |
  .post > .post-header > .post-title,
  .post > article > h2 {
    font-weight: 500;
  }
---

My research examines the relationship between **numerical reliability and computational performance**. I study how arithmetic representations, algorithms, and implementations affect both the quality of a result and the cost of obtaining it, and develop numerical software for scientific computing.

## Research directions

### Number formats

I am interested in alternative and variable-length representations, including tapered floating-point formats. I study how precision and dynamic range can be allocated differently, and how these choices affect arithmetic operations, numerical behavior, and implementation cost.

### Mixed- and low-precision algorithms

I investigate how precision can be chosen across an algorithm to reduce computational cost while controlling numerical error. This includes efficient CPU and GPU implementations and the use of higher precision for sensitive operations or refinement.

### Scientific applications

I am interested in evaluating these arithmetic choices in practical workloads, where memory traffic, data layout, compiler behavior, and numerical requirements all influence the outcome.

## Research projects

Two current strands of this work are efficient interval arithmetic and the accuracy and performance of floating-point mathematical functions. The pages below explain the problems we address, our approaches, and the results and limitations of our evaluations.

{% assign research_projects = site.projects | where: "research", true | sort: "importance" %}

<div class="research-projects">
  {% for project in research_projects %}
    <a class="research-project-card" href="{{ project.url | relative_url }}">
      {% assign research_figure = project.research_figure | default: "" %}
      {% if research_figure != empty %}
        <span class="research-project-figure">
          <img src="{{ research_figure | relative_url }}" alt="{{ project.research_figure_alt | default: project.title | escape }}" width="640" height="360" loading="lazy">
        </span>
      {% else %}
        <span class="research-project-figure research-project-figure-placeholder" aria-hidden="true">
          <svg width="48" height="36" viewBox="0 0 48 36" fill="none" stroke="currentColor" stroke-width="1.5" focusable="false">
            <rect x="1" y="1" width="46" height="34" rx="3" />
            <circle cx="34" cy="11" r="3" />
            <path d="M3 29 15 16 25 26 31 20 45 33" />
          </svg>
        </span>
      {% endif %}
      <div class="research-project-content">
        <span class="research-project-area">{{ project.research_area | escape }}</span>
        <h3>{{ project.title | escape }}</h3>
        <p>{{ project.description | escape }}</p>
        <p class="research-project-highlight">{{ project.research_highlight | escape }}</p>
        <span class="research-project-link">Explore the research →</span>
      </div>
    </a>
  {% endfor %}
</div>

The [Publications]({{ '/publications/' | relative_url }}) page collects the associated papers and citation details.

## Background and collaboration

For introductions to the underlying fields, visit the [Field Guides]({{ '/resources/#field-guides' | relative_url }}). The [Link Library]({{ '/resources/links/' | relative_url }}) collects external tools, websites, and events.

I welcome collaborations on applications where precision, rounding, or numerical reliability limits performance or the usefulness of a result. You can reach me by [email](mailto:{{ site.data.socials.email }}).

<link rel="stylesheet" href="{{ '/assets/css/research.css' | relative_url | bust_file_cache }}">
