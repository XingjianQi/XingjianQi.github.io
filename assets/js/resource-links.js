import { createResourceGraph } from "./resource-graph.js";

const library = document.getElementById("resource-library");

if (library) {
  const facets = ["topic", "subtopic", "type", "tag"];
  const selected = { topic: "", subtopic: "", type: "", tag: "" };
  const options = Object.fromEntries(facets.map((facet) => [facet, new Map()]));
  const subtopics = new Map();
  const search = document.getElementById("resource-link-search");
  const status = document.getElementById("resource-link-status");
  const empty = document.getElementById("resource-link-empty");
  const list = document.getElementById("resource-link-list");
  const graphPanel = document.getElementById("resource-graph-panel");
  const filterDetails = document.getElementById("resource-filter-details");
  const viewButtons = library.querySelectorAll("[data-resource-view]");
  let view = "list";
  const normalize = (value) => value.normalize("NFKC").toLocaleLowerCase();
  const entries = Array.from(library.querySelectorAll(".resource-link-entry"), (element) => {
    const content = element.querySelector(":scope > .resource-link-content");
    const values = Object.fromEntries(facets.map((facet) => [facet, new Set()]));
    content.querySelectorAll("[data-resource-facet]").forEach((tag) => {
      const { resourceFacet: facet, resourceValue: value } = tag.dataset;
      values[facet].add(value);
      options[facet].set(value, tag.textContent.trim());
      if (facet === "subtopic") {
        subtopics.set(value, { topic: tag.dataset.resourceTopic, description: tag.dataset.resourceDescription });
      }
    });
    return {
      element,
      values,
      id: element.dataset.resourceId,
      title: content.querySelector(".resource-link-title").textContent,
      description: content.querySelector(":scope > p").textContent,
      url: content.querySelector(".resource-link-title a").getAttribute("href"),
      text: normalize(content.textContent),
    };
  });
  const entriesByElement = new Map(entries.map((entry) => [entry.element, entry]));
  const childLists = library.querySelectorAll(".resource-link-children");
  for (const entry of entries) {
    entry.parent = entriesByElement.get(entry.element.parentElement.closest(".resource-link-entry"));
  }

  const graph = createResourceGraph({
    container: graphPanel,
    options,
    subtopics,
    onFilter(facet, value) {
      setFacet(facet, value);
      applyFilters();
      writeHash();
    },
  });
  for (const entry of entries) {
    for (let parent = entry.parent; parent; parent = parent.parent) {
      entry.text += ` ${normalize(parent.title)}`;
    }
  }

  for (const facet of facets) {
    const group = library.querySelector(`[data-resource-group="${facet}"] .resource-filter-options`);
    const sortedOptions = Array.from(options[facet]).sort((a, b) => a[1].localeCompare(b[1]));
    for (const [value, label] of [["", "All"], ...sortedOptions]) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "resource-tag";
      button.dataset.resourceFacet = facet;
      button.dataset.resourceValue = value;
      button.setAttribute("aria-controls", "resource-link-list");
      button.setAttribute("aria-pressed", "false");
      button.textContent = label;
      group.append(button);
    }
  }

  const filterControls = library.querySelectorAll("[data-resource-facet]");

  function setFacet(facet, value) {
    selected[facet] = value;
    if (facet === "subtopic" && value) selected.topic = subtopics.get(value).topic;
    if (facet === "topic" && selected.subtopic && subtopics.get(selected.subtopic).topic !== value) selected.subtopic = "";
  }

  function applyFilters() {
    const terms = normalize(search.value).trim().split(/\s+/).filter(Boolean);
    const matches = new Set();
    for (const entry of entries) {
      const matching =
        facets.every((facet) => !selected[facet] || entry.values[facet].has(selected[facet])) &&
        terms.every((term) => entry.text.includes(term));
      if (matching) matches.add(entry);
    }
    const visible = new Set(matches);
    for (const entry of matches) {
      for (let parent = entry.parent; parent; parent = parent.parent) visible.add(parent);
    }
    for (const entry of entries) {
      entry.element.hidden = !visible.has(entry);
    }
    for (const list of childLists) {
      list.hidden = Array.from(list.children).every((child) => child.hidden);
    }
    for (const control of filterControls) {
      const active = selected[control.dataset.resourceFacet] === control.dataset.resourceValue;
      if (control.tagName === "BUTTON") {
        control.setAttribute("aria-pressed", String(active));
        if (control.dataset.resourceFacet === "subtopic") {
          const subtopic = subtopics.get(control.dataset.resourceValue);
          control.hidden = Boolean(selected.topic && subtopic && subtopic.topic !== selected.topic);
        }
      } else if (active) {
        control.setAttribute("aria-current", "true");
      } else {
        control.removeAttribute("aria-current");
      }
    }
    const parentCount = visible.size - matches.size;
    const context = parentCount ? ` · ${parentCount} ${parentCount === 1 ? "parent" : "parents"} shown for context` : "";
    status.textContent = `${matches.size} of ${entries.length} ${entries.length === 1 ? "link" : "links"}${context}`;
    empty.hidden = matches.size !== 0;
    const activeFacets = facets.filter((facet) => selected[facet]).length;
    filterDetails.querySelector("summary").textContent = `Filter by topic, subtopic, type, or tag${activeFacets ? ` (${activeFacets} active)` : ""}`;
    graph.update(Array.from(visible));
  }

  function showView(nextView) {
    if (view !== nextView) filterDetails.open = nextView === "list";
    view = nextView;
    list.hidden = view !== "list";
    graphPanel.hidden = view !== "graph";
    for (const button of viewButtons) button.setAttribute("aria-pressed", String(button.dataset.resourceView === view));
    graph.setActive(view === "graph");
  }

  function writeHash() {
    const parameters = new URLSearchParams();
    if (view === "graph") parameters.set("view", "graph");
    for (const facet of facets) {
      if (selected[facet]) parameters.set(facet, selected[facet]);
    }
    if (search.value.trim()) parameters.set("q", search.value.trim());
    const hash = parameters.size ? `#${parameters}` : "";
    window.history.replaceState(window.history.state, "", `${window.location.pathname}${window.location.search}${hash}`);
  }

  function readHash() {
    const parameters = new URLSearchParams(window.location.hash.slice(1));
    for (const facet of facets) {
      const value = parameters.get(facet);
      selected[facet] = options[facet].has(value) ? value : "";
    }
    if (selected.subtopic) selected.topic = subtopics.get(selected.subtopic).topic;
    search.value = parameters.get("q") || "";
    showView(parameters.get("view") === "graph" ? "graph" : "list");
  }

  library.addEventListener("click", (event) => {
    const control = event.target.closest("[data-resource-facet]");
    if (!control || !library.contains(control)) return;
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setFacet(control.dataset.resourceFacet, control.dataset.resourceValue);
    applyFilters();
    writeHash();
  });

  search.addEventListener("input", () => {
    applyFilters();
    writeHash();
  });

  for (const button of viewButtons) {
    button.addEventListener("click", () => {
      showView(button.dataset.resourceView);
      writeHash();
    });
  }

  document.getElementById("resource-link-reset").addEventListener("click", () => {
    for (const facet of facets) selected[facet] = "";
    search.value = "";
    applyFilters();
    writeHash();
  });

  window.addEventListener("hashchange", () => {
    readHash();
    applyFilters();
  });

  readHash();
  applyFilters();
  document.getElementById("resource-link-controls").hidden = false;
  document.getElementById("resource-view-switch").hidden = false;
}
