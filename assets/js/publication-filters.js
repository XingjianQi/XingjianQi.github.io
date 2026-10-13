import { highlightSearchTerm } from "./highlight-search-term.js";

document.addEventListener("DOMContentLoaded", () => {
  const publications = document.getElementById("publication-list");
  const filters = document.getElementById("publication-topic-filters");
  const search = document.getElementById("bibsearch");
  const emptyState = document.getElementById("publication-no-results");
  if (!publications || !filters) return;

  const entries = Array.from(publications.querySelectorAll("ol.bibliography > li"), (item) => {
    const topic = item.querySelector("[data-publication-topic]")?.dataset.publicationTopic.trim() || "";
    return {
      item,
      topic,
      text: `${item.textContent} ${topic}`.replace(/\s+/g, " ").toLowerCase(),
    };
  });
  const groups = Array.from(publications.querySelectorAll("ol.bibliography"), (list) => ({
    list,
    heading: list.previousElementSibling?.matches("h2.bibliography") ? list.previousElementSibling : null,
  }));
  const topics = [...new Set(entries.map((entry) => entry.topic).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  const buttons = [];
  let selectedTopic = null;

  const applyFilters = () => {
    const query = (search?.value || "").trim().replace(/\s+/g, " ").toLowerCase();
    let visibleCount = 0;
    entries.forEach((entry) => {
      const matches = (selectedTopic === null || entry.topic === selectedTopic) && entry.text.includes(query);
      entry.item.hidden = !matches;
      if (matches) visibleCount += 1;
    });

    groups.forEach(({ list, heading }) => {
      const visible = Array.from(list.children).some((item) => !item.hidden);
      list.hidden = !visible;
      if (heading) heading.hidden = !visible;
    });

    buttons.forEach(({ button, topic }) => button.setAttribute("aria-pressed", String(topic === selectedTopic)));
    if (emptyState) emptyState.hidden = visibleCount > 0;
    highlightSearchTerm({ search: query, selector: "#publication-list .bibliography > li" });
  };

  [null, ...topics].forEach((topic) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "publication-topic-filter";
    button.textContent = topic === null ? "All" : topic;
    button.setAttribute("aria-controls", "publication-list");
    button.addEventListener("click", () => {
      selectedTopic = topic;
      applyFilters();
    });
    filters.append(button);
    buttons.push({ button, topic });
  });
  filters.hidden = topics.length === 0;

  search?.addEventListener("input", applyFilters);

  // Preserve links that open the publications page with a search term in the URL hash.
  const readSearchFromHash = () => {
    if (search) {
      try {
        search.value = decodeURIComponent(window.location.hash.slice(1));
      } catch {
        search.value = window.location.hash.slice(1);
      }
    }
    applyFilters();
  };
  window.addEventListener("hashchange", readSearchFromHash);
  readSearchFromHash();
});
