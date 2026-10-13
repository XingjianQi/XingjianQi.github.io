---
layout: page
title: Link Library
permalink: /resources/links/
description: Websites, events, and libraries for computer arithmetic and efficient numerical computation.
nav: false
---

{% assign resources = site.data.resource_links | sort_natural: "title" %}

<div id="resource-library" class="resource-library">
  <div id="resource-view-switch" class="resource-view-switch" role="group" aria-label="Resource view" hidden>
    <button type="button" class="resource-tag" data-resource-view="list" aria-pressed="true" aria-controls="resource-link-list">List</button>
    <button type="button" class="resource-tag" data-resource-view="graph" aria-pressed="false" aria-controls="resource-graph-panel">Graph</button>
  </div>
  <div id="resource-link-controls" hidden>
    <label for="resource-link-search">Search links</label>
    <input id="resource-link-search" type="search" placeholder="Search titles, descriptions, and tags" autocomplete="off" aria-controls="resource-link-list">
    <details id="resource-filter-details" open>
      <summary>Filter by topic, subtopic, type, or tag</summary>
      <div class="resource-filter-groups">
      <fieldset data-resource-group="topic"><legend>Topic</legend><div class="resource-filter-options"></div></fieldset>
      <fieldset data-resource-group="subtopic"><legend>Subtopic</legend><div class="resource-filter-options"></div></fieldset>
      <fieldset data-resource-group="type"><legend>Type</legend><div class="resource-filter-options"></div></fieldset>
      <fieldset data-resource-group="tag"><legend>Tags</legend><div class="resource-filter-options"></div></fieldset>
      </div>
      <button type="button" id="resource-link-reset" class="resource-reset">Reset filters</button>
    </details>
  </div>

  <p id="resource-link-status" role="status" aria-live="polite">{{ resources.size }} links</p>
  <ul id="resource-link-list" class="resource-link-list">
    {% for resource in resources %}
      {% if resource.parent == nil or resource.parent == empty %}
        {% include resource_link_node.liquid resource=resource resources=resources depth=0 %}
      {% endif %}
    {% endfor %}
  </ul>
  <section id="resource-graph-panel" class="resource-graph-panel" aria-label="Resource knowledge graph" hidden>
    <div class="resource-graph-toolbar">
      <div class="resource-graph-legend" aria-label="Node and connection types">
        <span><i class="graph-key-topic" aria-hidden="true"></i>Topic</span>
        <span><i class="graph-key-subtopic" aria-hidden="true"></i>Subtopic</span>
        <span><i class="graph-key-resource" aria-hidden="true"></i>Resource</span>
        <span><i class="graph-key-tag" aria-hidden="true"></i>Tag</span>
        <span><i class="graph-key-parent" aria-hidden="true"></i>Parent → component</span>
      </div>
      <div class="resource-graph-actions">
        <label><input id="resource-graph-show-tags" type="checkbox"> Show shared tags</label>
        <button type="button" class="resource-tag" data-graph-action="zoom-in" aria-label="Zoom in">+</button>
        <button type="button" class="resource-tag" data-graph-action="zoom-out" aria-label="Zoom out">−</button>
        <button type="button" class="resource-tag" data-graph-action="fit">Fit</button>
        <button type="button" class="resource-tag" data-graph-action="clear" disabled>Clear selection</button>
      </div>
    </div>
    <p class="resource-graph-hint">Follow topic → subtopic → resource. Select a branch to explore it. Drag to pan; use + / − to zoom.</p>
    <svg id="resource-graph-canvas" class="resource-graph-canvas" role="group" aria-label="Interactive graph of topics, subtopics, and resources"></svg>
    <div id="resource-graph-detail" class="resource-graph-detail" role="status" aria-live="polite"></div>
  </section>
  <p id="resource-link-empty" hidden>No links match these filters.</p>
</div>

<link rel="stylesheet" href="{{ '/assets/css/resource-graph.css' | relative_url | bust_file_cache }}">
<script src="{{ '/assets/js/resource-links.js' | relative_url | bust_file_cache }}" type="module"></script>

<style>
  .resource-library [hidden] {
    display: none !important;
  }

  .resource-view-switch {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  #resource-filter-details summary {
    margin-bottom: 0.75rem;
    cursor: pointer;
  }

  .resource-library input[type="search"] {
    display: block;
    width: 100%;
    box-sizing: border-box;
    padding: 0.6rem 0.75rem;
    margin-bottom: 1rem;
    border: 1px solid var(--global-divider-color);
    border-radius: 0.3rem;
    background: var(--global-bg-color);
    color: var(--global-text-color);
    font: inherit;
  }

  .resource-filter-groups fieldset {
    min-width: 0;
    margin: 0 0 0.75rem;
    padding: 0;
    border: 0;
  }

  .resource-filter-groups legend {
    margin-bottom: 0.35rem;
    font-size: 0.9rem;
    font-weight: 600;
  }

  .resource-filter-options,
  .resource-link-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  .resource-tag {
    max-width: 100%;
    padding: 0.2rem 0.6rem;
    border: 1px solid var(--global-divider-color);
    border-radius: 1rem;
    background: var(--global-bg-color);
    color: var(--global-text-color);
    font: inherit;
    font-size: 0.8rem;
    line-height: 1.5;
    overflow-wrap: anywhere;
    cursor: pointer;
  }

  .resource-tag:hover {
    border-color: var(--global-theme-color);
    color: var(--global-theme-color);
    text-decoration: none;
  }

  .resource-tag[aria-pressed="true"],
  .resource-tag[aria-current="true"] {
    border-color: var(--global-theme-color);
    background: var(--global-theme-color);
    color: var(--global-bg-color);
  }

  .resource-library :is(a, button, input):focus-visible {
    outline: 2px solid var(--global-theme-color);
    outline-offset: 3px;
  }

  .resource-reset {
    margin: 0 0 0.75rem;
    padding: 0;
    border: 0;
    background: transparent;
    color: var(--global-theme-color);
    font: inherit;
    text-decoration: underline;
    cursor: pointer;
  }

  #resource-link-status {
    margin: 0.75rem 0;
    font-size: 0.85rem;
  }

  .resource-link-list,
  .resource-link-children {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .resource-link-entry {
    border-bottom: 1px solid var(--global-divider-color);
    overflow-wrap: anywhere;
  }

  .resource-link-content {
    padding: 1rem 0;
  }

  .resource-link-children {
    margin-left: 0.25rem;
    padding-left: 1rem;
    border-left: 2px solid var(--global-divider-color);
  }

  .resource-link-children > .resource-link-entry:last-child {
    border-bottom: 0;
  }

  .resource-link-title {
    margin: 0 0 0.35rem;
    font-size: 1.1rem;
  }

  .resource-link-entry p {
    margin: 0 0 0.5rem;
  }
</style>
