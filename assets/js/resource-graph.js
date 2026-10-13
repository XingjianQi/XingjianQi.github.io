const SVG_NS = "http://www.w3.org/2000/svg";

function svgElement(name, attributes = {}, text = "") {
  const element = document.createElementNS(SVG_NS, name);
  for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
  if (text) element.textContent = text;
  return element;
}

export function createResourceGraph({ container, options, subtopics, onFilter }) {
  const svg = container.querySelector(".resource-graph-canvas");
  const detail = container.querySelector(".resource-graph-detail");
  const showTags = container.querySelector("#resource-graph-show-tags");
  const clearButton = container.querySelector('[data-graph-action="clear"]');
  const measure = document.createElement("canvas").getContext("2d");
  let entries = [];
  let nodes = [];
  let edges = [];
  let active = false;
  let dirty = true;
  let selection = null;
  let viewport;
  let width = 0;
  let height = 0;
  let transform = { x: 0, y: 0, scale: 1 };
  let gesture = null;

  function labelLines(label) {
    measure.font = `12px ${getComputedStyle(svg).fontFamily}`;
    const words = label.split(/\s+/);
    const lines = [];
    let line = "";
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (line && measure.measureText(candidate).width > 150) {
        lines.push(line);
        line = word;
      } else {
        line = candidate;
      }
    }
    if (line) lines.push(line);
    const visible = lines.slice(0, 2);
    if (lines.length > 2) visible[1] += "…";
    return visible.map((text) => {
      if (measure.measureText(text).width <= 154) return text;
      while (text.length > 1 && measure.measureText(`${text}…`).width > 154) text = text.slice(0, -1);
      return `${text}…`;
    });
  }

  function makeModel() {
    const byId = new Map();
    const connections = new Set();
    edges = [];
    const add = (node) => {
      if (!byId.has(node.id)) byId.set(node.id, node);
      return byId.get(node.id);
    };
    const connect = (source, target, relation) => {
      const key = JSON.stringify([source, target, relation]);
      if (connections.has(key)) return;
      connections.add(key);
      edges.push({ source, target, relation });
    };
    for (const entry of entries) {
      const resourceId = 'resource:' + entry.id;
      add({ id: resourceId, kind: 'resource', label: entry.title.trim(), entry });
      for (const topic of entry.values.topic) {
        const topicId = 'topic:' + topic;
        add({ id: topicId, kind: 'topic', value: topic, label: options.topic.get(topic) });
        const branches = Array.from(entry.values.subtopic).filter((id) => subtopics.get(id)?.topic === topic);
        if (!branches.length) connect(topicId, resourceId, 'topic');
        for (const value of branches) {
          const id = 'subtopic:' + value;
          add({ id, kind: 'subtopic', value, label: options.subtopic.get(value) });
          connect(topicId, id, 'topic');
          connect(id, resourceId, 'subtopic');
        }
      }
      if (showTags.checked) {
        for (const tag of entry.values.tag) {
          const id = 'tag:' + tag;
          add({ id, kind: 'tag', value: tag, label: tag });
          connect(resourceId, id, 'tag');
        }
      }
    }
    for (const entry of entries) {
      if (entry.parent && byId.has('resource:' + entry.parent.id)) {
        connect('resource:' + entry.parent.id, 'resource:' + entry.id, 'parent');
      }
    }
    nodes = Array.from(byId.values());
    edges = edges.map((edge) => ({ ...edge, source: byId.get(edge.source), target: byId.get(edge.target) }));
    if (!byId.has(selection)) selection = null;
    for (const node of nodes) {
      node.lines = labelLines(node.label);
      node.width = Math.max(62, ...node.lines.map((line) => measure.measureText(line).width + 26));
      node.height = node.lines.length * 16 + 18;
    }
  }

  function layout() {
    const sorted = (items) => items.sort((a, b) => a.label.localeCompare(b.label));
    const topicNodes = sorted(nodes.filter((node) => node.kind === 'topic'));
    const lanes = new Map(topicNodes.map((node) => [node.value, { node, groups: new Map() }]));
    const placement = new Map();
    for (const edge of edges) {
      if (edge.target.kind !== 'resource' || !['topic', 'subtopic'].includes(edge.relation)) continue;
      if (placement.has(edge.target.id)) continue;
      const branch = edge.source;
      placement.set(edge.target.id, {
        topic: branch.kind === 'topic' ? branch.value : subtopics.get(branch.value).topic,
        branch: branch.kind === 'subtopic' ? branch : null,
      });
    }
    // Keep context parents near their components without inventing topic memberships.
    for (let pass = 0; pass < nodes.length; pass += 1) {
      let changed = false;
      for (const edge of edges.filter((item) => item.relation === 'parent')) {
        const from = placement.get(edge.source.id), to = placement.get(edge.target.id);
        if (from && !to) { placement.set(edge.target.id, from); changed = true; }
        if (to && !from) { placement.set(edge.source.id, to); changed = true; }
      }
      if (!changed) break;
    }
    for (const node of nodes.filter((item) => item.kind === 'resource')) {
      const location = placement.get(node.id) || { topic: '', branch: null };
      if (!lanes.has(location.topic)) lanes.set(location.topic, { node: null, groups: new Map() });
      const lane = lanes.get(location.topic);
      const key = location.branch?.id || '';
      if (!lane.groups.has(key)) lane.groups.set(key, { node: location.branch, members: [] });
      lane.groups.get(key).members.push(node);
    }
    // A branch can have extra memberships even when its resources are placed elsewhere.
    for (const node of nodes.filter((item) => item.kind === 'subtopic')) {
      const lane = lanes.get(subtopics.get(node.value).topic);
      if (!lane.groups.has(node.id)) lane.groups.set(node.id, { node, members: [] });
    }
    const ancestry = (node) => {
      const path = [node.label];
      for (let parent = node.entry.parent; parent; parent = parent.parent) path.unshift(parent.title.trim());
      return path.join(' / ');
    };
    let column = 0;
    for (const lane of lanes.values()) {
      const left = column++ * 270;
      let y = 30;
      if (lane.node) {
        Object.assign(lane.node, { x: left + 132, y: y + lane.node.height / 2 });
        y += lane.node.height + 28;
      }
      const groups = Array.from(lane.groups.values()).sort((a, b) => (a.node?.label || '').localeCompare(b.node?.label || ''));
      for (const group of groups) {
        if (group.node) {
          Object.assign(group.node, { x: left + 132, y: y + group.node.height / 2, bus: left + 12 });
          y += group.node.height + 12;
        }
        group.members.sort((a, b) => ancestry(a).localeCompare(ancestry(b)));
        for (const node of group.members) {
          Object.assign(node, { x: left + 158, y: y + node.height / 2, bus: left + (group.node ? 34 : 12) });
          y += node.height + 10;
        }
        y += 18;
      }
    }
    const tags = sorted(nodes.filter((node) => node.kind === 'tag'));
    let tagY = 30;
    for (const node of tags) {
      Object.assign(node, { x: column * 270 + 100, y: tagY + node.height / 2 });
      tagY += node.height + 12;
    }
  }

  function positionElements() {
    for (const node of nodes) node.element.setAttribute('transform', 'translate(' + node.x + ',' + node.y + ')');
    for (const edge of edges) {
      const a = edge.source, b = edge.target;
      let path;
      if (edge.relation === 'tag') {
        const start = a.x + a.width / 2, end = b.x - b.width / 2;
        const middle = (start + end) / 2;
        path = 'M' + start + ',' + a.y + ' C' + middle + ',' + a.y + ' ' + middle + ',' + b.y + ' ' + end + ',' + b.y;
      } else if (edge.relation === 'parent') {
        const start = a.x + a.width / 2, end = b.x + b.width / 2 + 5;
        const bus = Math.max(start, end) + 16;
        path = 'M' + start + ',' + a.y + ' H' + bus + ' V' + b.y + ' H' + end;
      } else {
        const start = a.x - a.width / 2, end = b.x - b.width / 2;
        const bus = Math.min(b.bus, start - 12, end - 12);
        path = 'M' + start + ',' + a.y + ' H' + bus + ' V' + b.y + ' H' + end;
      }
      edge.element.setAttribute('d', path);
    }
  }

  function applyTransform() {
    viewport?.setAttribute("transform", `translate(${transform.x},${transform.y}) scale(${transform.scale})`);
  }

  function fit() {
    if (!nodes.length) return;
    const left = Math.min(...nodes.map((node) => node.x - node.width / 2)) - 44;
    const right = Math.max(...nodes.map((node) => node.x + node.width / 2)) + 44;
    const top = Math.min(...nodes.map((node) => node.y - node.height / 2)) - 22;
    const bottom = Math.max(...nodes.map((node) => node.y + node.height / 2)) + 22;
    const scale = Math.min(width / (right - left), height / (bottom - top), 1.25);
    transform = { scale, x: width / 2 - ((left + right) / 2) * scale, y: height / 2 - ((top + bottom) / 2) * scale };
    applyTransform();
  }

  function zoom(factor, x = width / 2, y = height / 2) {
    const scale = Math.max(0.2, Math.min(3, transform.scale * factor));
    transform.x = x - ((x - transform.x) / transform.scale) * scale;
    transform.y = y - ((y - transform.y) / transform.scale) * scale;
    transform.scale = scale;
    applyTransform();
  }

  function showDetail(node) {
    detail.replaceChildren();
    if (!node) {
      const description = document.createElement("p");
      description.textContent = nodes.length
        ? `${entries.length} resources organized by topic and subtopic. Shared tags are optional. Select a node for details.`
        : "No resources match the current filters.";
      detail.append(description);
      return;
    }
    const kind = document.createElement("p");
    kind.className = "resource-graph-kind";
    kind.textContent = node.kind === "resource" ? `Resource · ${options.type.get(Array.from(node.entry.values.type)[0])}` : ({ topic: "Research topic", subtopic: "Subtopic", tag: "Shared tag" })[node.kind];
    const title = document.createElement("h3");
    title.textContent = node.label;
    const description = document.createElement("p");
    detail.append(kind, title, description);
    if (node.kind === "resource") {
      description.textContent = node.entry.description;
      if (node.entry.parent) {
        const parent = document.createElement("p");
        parent.append("Part of ");
        const parentLink = document.createElement("a");
        parentLink.href = node.entry.parent.url;
        parentLink.textContent = node.entry.parent.title.trim();
        parent.append(parentLink);
        detail.append(parent);
      }
      const link = document.createElement("a");
      link.href = node.entry.url;
      link.textContent = "Open resource ↗";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      detail.append(link);
    } else {
      const count = entries.filter((entry) => entry.values[node.kind].has(node.value)).length;
      description.textContent = `${node.kind === "subtopic" ? subtopics.get(node.value).description + " " : ""}${count} ${count === 1 ? "resource" : "resources"} in this ${node.kind === "tag" ? "tag" : "branch"}.`;
      const filter = document.createElement("button");
      filter.type = "button";
      filter.className = "resource-tag";
      filter.textContent = `Filter by ${node.label}`;
      filter.addEventListener("click", () => onFilter(node.kind, node.value));
      detail.append(filter);
    }
  }

  function select(id) {
    selection = id;
    const related = new Set([id]);
    const connectedEdges = new Set();
    const selectedNode = nodes.find((node) => node.id === id);
    const include = (edge) => {
      connectedEdges.add(edge);
      related.add(edge.source.id);
      related.add(edge.target.id);
    };
    if (selectedNode?.kind === 'topic' || selectedNode?.kind === 'subtopic') {
      // Follow classification branches downward; parent/component links stay distinct.
      for (let pass = 0; pass < 2; pass += 1) {
        for (const edge of edges) {
          if (['topic', 'subtopic'].includes(edge.relation) && related.has(edge.source.id)) include(edge);
        }
      }
    } else {
      for (const edge of edges) {
        if (edge.source.id === id || edge.target.id === id) include(edge);
      }
    }
    // Show the upstream topic for selected subtopics and resources.
    for (const edge of edges) {
      if (edge.target.kind === 'subtopic' && related.has(edge.target.id)) include(edge);
    }
    for (const node of nodes) {
      node.element.classList.toggle("is-muted", Boolean(id) && !related.has(node.id));
      node.element.setAttribute("aria-pressed", String(node.id === id));
    }
    for (const edge of edges) {
      const connected = connectedEdges.has(edge);
      edge.element.classList.toggle("is-muted", Boolean(id) && !connected);
      edge.element.classList.toggle("is-highlighted", Boolean(id) && connected);
    }
    clearButton.disabled = !id;
    showDetail(nodes.find((node) => node.id === id));
  }

  function render() {
    if (!active) return;
    width = svg.clientWidth;
    height = svg.clientHeight;
    if (!width || !height) return;
    makeModel();
    layout();
    svg.replaceChildren();
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
    svg.append(svgElement("title", {}, "Resource knowledge graph"));
    svg.append(svgElement("desc", {}, "Topics branch into subtopics and resources. Optional shared tags cross these branches. Dashed arrows point from a parent to its component. Select a node to read its details."));
    const defs = svgElement("defs");
    const marker = svgElement("marker", { id: "resource-graph-arrow", markerWidth: 7, markerHeight: 7, refX: 6, refY: 3.5, orient: "auto", markerUnits: "userSpaceOnUse" });
    marker.append(svgElement("path", { d: "M0,0 L7,3.5 L0,7 Z", class: "resource-graph-arrow" }));
    defs.append(marker);
    svg.append(defs);
    viewport = svgElement("g", { "data-graph-viewport": "" });
    svg.append(viewport);
    for (const edge of edges) {
      edge.element = svgElement("path", { class: "resource-graph-edge", "data-relation": edge.relation, "data-source": edge.source.id, "data-target": edge.target.id });
      if (edge.relation === "parent") edge.element.setAttribute("marker-end", "url(#resource-graph-arrow)");
      edge.element.append(svgElement("title", {}, `${edge.source.label} → ${edge.target.label}${edge.relation === "parent" ? " (contains)" : ""}`));
      viewport.append(edge.element);
    }
    for (const node of nodes) {
      const group = svgElement("g", { class: "resource-graph-node", "data-graph-id": node.id, "data-kind": node.kind, role: "button", tabindex: 0, "aria-label": `${node.kind}: ${node.label}`, "aria-pressed": "false" });
      group.append(svgElement("title", {}, node.label));
      group.append(svgElement("rect", { x: -node.width / 2, y: -node.height / 2, width: node.width, height: node.height, rx: node.kind === "resource" ? 5 : 17 }));
      const label = svgElement("text", { "text-anchor": "middle" });
      node.lines.forEach((line, index) => label.append(svgElement("tspan", { x: 0, y: (index - (node.lines.length - 1) / 2) * 16 + 4 }, line)));
      group.append(label);
      group.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          select(node.id);
        }
      });
      node.element = group;
      viewport.append(group);
    }
    positionElements();
    fit();
    select(selection);
    dirty = false;
  }

  function point(event) {
    const rect = svg.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }

  svg.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || gesture) return;
    const position = point(event);
    const element = event.target.closest("[data-graph-id]");
    const node = nodes.find((item) => item.id === element?.dataset.graphId);
    gesture = { pointer: event.pointerId, start: position, last: position, node, moved: false };
    svg.setPointerCapture(event.pointerId);
  });
  svg.addEventListener("pointermove", (event) => {
    if (!gesture || gesture.pointer !== event.pointerId) return;
    const position = point(event);
    if (Math.hypot(position.x - gesture.start.x, position.y - gesture.start.y) > 4) gesture.moved = true;
    if (gesture.moved) {
      svg.classList.add("is-dragging");
      const dx = position.x - gesture.last.x;
      const dy = position.y - gesture.last.y;
      if (gesture.node) {
        gesture.node.x += dx / transform.scale;
        gesture.node.y += dy / transform.scale;
        positionElements();
      } else {
        transform.x += dx;
        transform.y += dy;
        applyTransform();
      }
    }
    gesture.last = position;
  });
  const finishGesture = (event) => {
    if (!gesture || gesture.pointer !== event.pointerId) return;
    if (event.type === "pointerup" && !gesture.moved) select(gesture.node?.id || null);
    gesture = null;
    svg.classList.remove("is-dragging");
  };
  svg.addEventListener("pointerup", finishGesture);
  svg.addEventListener("pointercancel", finishGesture);
  svg.addEventListener("lostpointercapture", finishGesture);
  svg.addEventListener("wheel", (event) => {
    if (!event.ctrlKey && !event.metaKey) return;
    event.preventDefault();
    const position = point(event);
    zoom(Math.exp(-event.deltaY * 0.002), position.x, position.y);
  }, { passive: false });
  container.addEventListener("click", (event) => {
    const action = event.target.closest("[data-graph-action]")?.dataset.graphAction;
    if (action === "zoom-in") zoom(1.25);
    if (action === "zoom-out") zoom(0.8);
    if (action === "fit") fit();
    if (action === "clear") select(null);
  });
  showTags.addEventListener("change", () => { dirty = true; render(); });
  new ResizeObserver(() => {
    if (active && (width !== svg.clientWidth || height !== svg.clientHeight)) render();
  }).observe(svg);

  return {
    update(nextEntries) {
      if (entries.map((entry) => entry.id).join("|") === nextEntries.map((entry) => entry.id).join("|")) return;
      entries = nextEntries;
      dirty = true;
      render();
    },
    setActive(value) {
      active = value;
      if (active && (dirty || width !== svg.clientWidth)) render();
    },
  };
}
