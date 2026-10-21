/* The Atlas teaser on the home page: the posting count in the copy and the
 * ring of job families, job types and job flavours, drawn from the Atlas's
 * own published data. Hovering a segment names it in the centre and lights
 * its family; clicking opens the Atlas.
 *
 * Markup (src/_layouts/home.html):
 *   <span data-atlas-count hidden></span>      filled with "1,070 " from the data
 *   <div data-atlas-ring data-src="…/dashboard-data.json" data-href="…/"></div>
 * Needs D3 (window.d3), loaded from the Atlas before this script.
 *
 * The ring's box keeps its space while the data loads, so the copy doesn't
 * move. If the data or D3 can't load, the copy reads without the number and
 * the ring's box is removed. The data's shape is the Atlas's schema version 1. */
(function () {
  "use strict";

  const SCHEMA_VERSION = 1;
  const ORCHID = "#9525AA", ALICE = "#D9E2EC";
  const DEFAULT_FAMILY = "Genomics & Computational Biology Research";
  const fmt = (n) => n.toLocaleString("en-US");

  // the ring's colours, as on the Atlas: the lit family in royal orchid, its
  // job types and flavours in lighter steps; every other family alice blue
  const orchidStep = (t) => d3.interpolateRgb(ORCHID, "#FFFFFF")(t);

  function wrapWords(s, max) {
    const lines = [];
    let line = "";
    String(s).split(/\s+/).forEach((w) => {
      if (line && (line + " " + w).length > max) { lines.push(line); line = w; }
      else line = line ? line + " " + w : w;
    });
    if (line) lines.push(line);
    return lines;
  }

  function fillCount(data) {
    const n = data && data.meta && data.meta.n_postings;
    if (typeof n !== "number") return;
    document.querySelectorAll("[data-atlas-count]").forEach((el) => {
      el.textContent = `${fmt(n)} `;
      el.hidden = false;
    });
  }

  function drawRing(box, data) {
    const size = 460, R = size / 2;
    const jt = new Map(data.job_types.map((j) => [j.id, j]));
    const fl = new Map(data.flavours.map((f) => [f.id, f]));
    const total = data.meta.n_postings;

    const tree = { children: data.families.map((f) => ({
      id: f.id, kind: "family", name: f.name, n: f.n_postings,
      children: f.job_type_ids.map((jid) => {
        const j = jt.get(jid);
        const kids = j.flavour_ids.map((fid) => fl.get(fid));
        return { id: jid, kind: "job", name: j.name, n: j.n_postings,
          value: kids.length ? undefined : j.n_postings,
          children: kids.length ? kids.map((k) => ({ id: k.id, kind: "flavour",
            name: k.is_residual ? "General" : k.short_name, n: k.n_postings, value: k.n_postings })) : undefined };
      }),
    })) };
    const root = d3.hierarchy(tree).sum((d) => d.value || 0);
    d3.partition().size([2 * Math.PI, R])(root);

    // centre hole 0.6 of the radius (room for the label), then families,
    // job types and flavours, as on the Atlas
    const ringR = [0, 0.6, 0.775, 0.9, 1.0].map((t) => t * R);
    const arc = d3.arc()
      .startAngle((d) => d.x0).endAngle((d) => d.x1)
      .padAngle(0.004).padRadius(R)
      .innerRadius((d) => ringR[d.depth]).outerRadius((d) => ringR[d.depth + 1] - 2)
      .cornerRadius(2);

    const svg = d3.select(box).append("svg")
      .attr("viewBox", [-R, -R, size, size])
      .attr("role", "img")
      .attr("aria-label", `Ring chart of the Atlas: ${data.families.length} job families, their job types and job flavours`);
    const nodes = root.descendants().filter((d) => d.depth > 0);
    const famOf = (d) => d.ancestors().find((a) => a.depth === 1).data.id;
    const fam0 = (data.families.find((f) => f.name === DEFAULT_FAMILY)
      || [...data.families].sort((a, b) => b.n_postings - a.n_postings)[0]).id;

    const paths = svg.append("g").selectAll("path").data(nodes).join("path")
      .attr("class", "atlas-arc").attr("d", arc)
      .attr("stroke", "#fff").attr("stroke-width", 1);
    const center = svg.append("g").style("pointer-events", "none");

    const line = (y, cls, px, text) => center.append("text")
      .attr("class", `atlas-ring-text ${cls}`).attr("y", y).style("font-size", `${px}px`).text(text);

    function paint(hovered) {
      const lit = hovered ? new Set([...hovered.ancestors(), ...hovered.descendants()]) : null;
      const family = hovered ? famOf(hovered) : fam0;
      paths
        .attr("fill", (d) => famOf(d) === family ? orchidStep([0, 0.3, 0.55][d.depth - 1]) : ALICE)
        // hovering: the segment, what's inside it and its path to the centre
        // stay; the rest fades
        .attr("fill-opacity", (d) => lit && !lit.has(d) ? 0.35 : 1);

      center.selectAll("*").remove();
      if (!hovered) {
        ["Hover", "the ring", "to explore"].forEach((ln, i) => line((i - 1) * 46, "atlas-ring-name", 38, ln));
        return;
      }
      const d = hovered.data;
      const level = { family: "Job family", job: "Job type", flavour: "Job flavour" }[d.kind];
      const lines = wrapWords(d.name, 16);
      const px = lines.length > 3 ? 25 : 29, lh = px * 1.15;
      const y0 = -(lines.length * lh + 56) / 2;
      line(y0 + 9, "atlas-ring-eyebrow", 17, level.toUpperCase());
      lines.forEach((ln, i) => line(y0 + 42 + i * lh, "atlas-ring-name", px, ln));
      line(y0 + 42 + lines.length * lh + 10, "atlas-ring-sub", 21,
        `${fmt(d.n)} job postings · ${Math.round(100 * d.n / total)}%`);
    }

    // leaving one segment for the next fires leave then enter: wait a moment
    // before clearing so the centre doesn't flicker
    let timer;
    paths
      .on("mouseenter", (e, d) => { clearTimeout(timer); paint(d); })
      .on("mouseleave", () => { clearTimeout(timer); timer = setTimeout(() => paint(null), 80); });
    if (box.dataset.href) {
      paths.style("cursor", "pointer").on("click", () => { window.location.href = box.dataset.href; });
    }
    paint(null);
  }

  async function start() {
    const box = document.querySelector("[data-atlas-ring]");
    if (!box || !box.dataset.src) return;
    try {
      const res = await fetch(box.dataset.src);
      if (!res.ok) throw new Error(`data ${res.status}`);
      const data = await res.json();
      fillCount(data);
      if (data.schema_version !== SCHEMA_VERSION || !window.d3) throw new Error("unexpected data or no D3");
      drawRing(box, data);
    } catch (err) {
      // the teaser reads fine without the number or the ring
      box.hidden = true;
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
})();
