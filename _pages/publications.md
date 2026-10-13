---
layout: page
permalink: /publications/
title: Publications
description: Publications in reverse chronological order, with filters for research topics.
nav: true
nav_order: 2
scholar:
  sort_by: year,month
  order: descending
---

<div id="publication-topic-filters" class="publication-topic-filters" role="group" aria-label="Filter publications by topic" hidden></div>

{% if site.bib_search %}
<input type="search" id="bibsearch" class="search bibsearch-form-input" aria-label="Search publications" spellcheck="false" autocomplete="off" placeholder="Type to filter">
{% endif %}

<div id="publication-list" class="publications">

{% bibliography --group_by year --group_order descending %}

</div>

<p id="publication-no-results" role="status" hidden>No publications match these filters.</p>

<script src="{{ '/assets/js/publication-filters.js' | relative_url | bust_file_cache }}" type="module"></script>

<style>
  .publication-topic-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin: 1rem 0;
  }

  .publication-topic-filter {
    padding: 0.45rem 0.85rem;
    border: 1px solid var(--global-divider-color);
    border-radius: 0.35rem;
    background: var(--global-bg-color);
    color: var(--global-text-color);
    font: inherit;
    cursor: pointer;
  }

  .publication-topic-filter:hover {
    border-color: var(--global-theme-color);
  }

  .publication-topic-filter[aria-pressed="true"] {
    border-color: var(--global-theme-color);
    background: var(--global-theme-color);
    color: var(--global-bg-color);
  }

  .publication-topic-filter:focus-visible {
    outline: 2px solid var(--global-theme-color);
    outline-offset: 3px;
  }

  #publication-topic-filters[hidden],
  #publication-list [hidden],
  #publication-no-results[hidden] {
    display: none !important;
  }

  .publications .publication-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem;
    margin-top: 0.5rem;
  }

  .publications .publication-tag {
    max-width: 100%;
    border: 1px solid var(--global-theme-color);
    color: var(--global-theme-color);
    border-radius: 0.75rem;
    padding: 0.15rem 0.5rem;
    font-size: 0.75rem;
    line-height: 1.4;
    overflow-wrap: anywhere;
  }
</style>
