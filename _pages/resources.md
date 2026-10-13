---
layout: page
title: Resources
permalink: /resources/
description: Introductions, references, and practical tools for computer arithmetic and efficient numerical computation.
nav: true
nav_order: 3
---

Under Construction. Currently AI generated.

## Links

[Browse the Link Library]({{ '/resources/links/' | relative_url }}) for websites, events, and libraries on GitHub, with short descriptions and tags. Search all links or filter by topic, resource type, and tag.

## Research

These pages introduce the ideas and people behind each research field. Books, papers, and standards are linked in the literature sections. Each page ends with useful links for that field.

{% assign guides = site.field_guides | sort: "order" %}

<div class="projects">
  <div class="row row-cols-1 row-cols-md-2">
  {% for guide in guides %}
    <div class="col mb-4">
      <a href="{{ guide.url | relative_url }}">
        <div class="card hoverable h-100">
          <div class="card-body">
            <h3 class="card-title">{{ guide.title }}</h3>
            <p class="card-text">{{ guide.description }}</p>
          </div>
        </div>
      </a>
    </div>
  {% endfor %}
  </div>
</div>
