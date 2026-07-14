/* ============================================================
   5M Signcom — process flow thread (home page)
   Draws ONE continuous red leader line that weaves through the
   .flow step cards: starts at a dot, dips into each card's top
   edge, exits its bottom edge, sweeps across to the next card,
   and ends at a dot. Mid-path arrowheads follow the tangent.
   Geometry is measured from the real card layout and redrawn
   on resize, so it works at every viewport width.
   Runs only if a #process .flow container is present.
   ============================================================ */
(function () {
  "use strict";

  var flow = document.querySelector("#process .flow");
  if (!flow) return;
  var steps = Array.prototype.slice.call(flow.querySelectorAll(".flow-step"));
  if (steps.length < 2) return;

  var NS = "http://www.w3.org/2000/svg";
  var svg = document.createElementNS(NS, "svg");
  svg.setAttribute("class", "flow-thread");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  flow.insertBefore(svg, flow.firstChild);

  function el(name, attrs) {
    var e = document.createElementNS(NS, name);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }

  function cubicPoint(p0, c1, c2, p1, t) {
    var u = 1 - t;
    return {
      x: u * u * u * p0.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * p1.x,
      y: u * u * u * p0.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * p1.y
    };
  }

  function cubicTangent(p0, c1, c2, p1, t) {
    var u = 1 - t;
    var x = 3 * u * u * (c1.x - p0.x) + 6 * u * t * (c2.x - c1.x) + 3 * t * t * (p1.x - c2.x);
    var y = 3 * u * u * (c1.y - p0.y) + 6 * u * t * (c2.y - c1.y) + 3 * t * t * (p1.y - c2.y);
    var len = Math.sqrt(x * x + y * y) || 1;
    return { x: x / len, y: y / len };
  }

  function draw() {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    var fr = flow.getBoundingClientRect();
    svg.setAttribute("viewBox", "0 0 " + fr.width + " " + fr.height);
    svg.style.width = fr.width + "px";
    svg.style.height = fr.height + "px";

    var narrow = fr.width < 640;
    var swing = narrow ? 34 : 70;         // how far the curve overshoots sideways
    var dip = 12;                          // how far the line tucks under card edges

    // card anchor points, relative to the flow container
    var rects = steps.map(function (s) {
      var r = s.getBoundingClientRect();
      return { left: r.left - fr.left, right: r.right - fr.left, top: r.top - fr.top, bottom: r.bottom - fr.top, w: r.width };
    });
    function entry(i) { var r = rects[i]; return { x: r.left + r.w * (narrow ? 0.72 : 0.8), y: r.top + dip }; }
    function exit(i) { var r = rects[i]; return { x: r.left + r.w * (narrow ? 0.24 : 0.2), y: r.bottom - dip }; }

    var d = "";
    var heads = [];

    // start dot -> into card 1
    var e0 = entry(0);
    var start = { x: e0.x + (narrow ? 14 : 30), y: Math.max(e0.y - (narrow ? 42 : 64), 8) };
    d += "M" + start.x + " " + start.y +
         " C" + start.x + " " + (start.y + 24) + " " + e0.x + " " + (e0.y - 28) + " " + e0.x + " " + e0.y;

    // card i -> card i+1
    for (var i = 0; i < steps.length - 1; i++) {
      var a = exit(i), b = entry(i + 1);
      var dy = b.y - a.y;
      var dir = b.x >= a.x ? 1 : -1;
      var c1 = { x: a.x - dir * swing * 0.4, y: a.y + dy * 0.55 };
      var c2 = { x: b.x + dir * swing, y: b.y - dy * 0.45 };
      d += " M" + a.x + " " + a.y +
           " C" + c1.x + " " + c1.y + " " + c2.x + " " + c2.y + " " + b.x + " " + b.y;
      heads.push({ p0: a, c1: c1, c2: c2, p1: b });
    }

    // out of the last card -> end dot
    var xl = exit(steps.length - 1);
    var last = rects[rects.length - 1];
    var endX = xl.x + last.w * 0.18;
    var endY = xl.y + (narrow ? 44 : 64);
    d += " M" + xl.x + " " + xl.y +
         " C" + xl.x + " " + (xl.y + 26) + " " + endX + " " + (endY - 24) + " " + endX + " " + endY;

    svg.appendChild(el("path", { "class": "ft-line", d: d, fill: "none" }));

    // mid-path arrowheads, oriented to the curve's travel direction
    var L = narrow ? 16 : 22, Wd = narrow ? 11 : 15;
    heads.forEach(function (h) {
      var p = cubicPoint(h.p0, h.c1, h.c2, h.p1, 0.5);
      var t = cubicTangent(h.p0, h.c1, h.c2, h.p1, 0.5);
      var n = { x: -t.y, y: t.x };
      var tip = { x: p.x + t.x * L * 0.6, y: p.y + t.y * L * 0.6 };
      var b1 = { x: p.x - t.x * L * 0.4 + n.x * Wd / 2, y: p.y - t.y * L * 0.4 + n.y * Wd / 2 };
      var b2 = { x: p.x - t.x * L * 0.4 - n.x * Wd / 2, y: p.y - t.y * L * 0.4 - n.y * Wd / 2 };
      svg.appendChild(el("path", {
        "class": "ft-head",
        d: "M" + tip.x + " " + tip.y + " L" + b1.x + " " + b1.y + " L" + b2.x + " " + b2.y + " Z"
      }));
    });

    svg.appendChild(el("circle", { "class": "ft-dot", cx: start.x, cy: start.y, r: narrow ? 5 : 6.5 }));
    svg.appendChild(el("circle", { "class": "ft-dot", cx: endX, cy: endY, r: narrow ? 5 : 6.5 }));
  }

  var pending = null;
  function schedule() {
    if (pending) return;
    pending = requestAnimationFrame(function () { pending = null; draw(); });
  }
  window.addEventListener("resize", schedule);
  window.addEventListener("load", schedule);
  draw();
})();
