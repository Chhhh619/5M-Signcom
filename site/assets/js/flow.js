/* ============================================================
   5M Signcom — process flow thread (home page)
   Threads ONE continuous red leader line through the .flow step
   cards: a bookend dot, a tail into card 1, a bowed connector
   between each pair of cards (arrowhead at the curve's midpoint),
   a tail out of the last card, and a closing dot.
   Geometry is measured from the real card boxes and redrawn on
   resize, so it follows the grid at any width — including the
   single-column stack on mobile.
   Ported from the Claude Design "Process Flow" component; the
   inline <script> and Google Fonts in that source can't be used
   here (CSP: script-src 'self', font-src 'self'), so the logic
   lives in this file and the type/colour come from site.css.
   Runs only if a #process .flow container is present.
   ============================================================ */
(function () {
  "use strict";

  var flow = document.querySelector("#process .flow");
  if (!flow) return;
  var svg = flow.querySelector(".flow-thread");
  var cards = Array.prototype.slice.call(flow.querySelectorAll(".flow-step"));
  if (!svg || cards.length < 2) return;

  var NS = "http://www.w3.org/2000/svg";
  var WEIGHT = 2.4;
  var STUB = 26;          // tail length between a card edge and its bookend dot
  var accent = (getComputedStyle(document.documentElement)
    .getPropertyValue("--red") || "").trim() || "#D42B1E";

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealed = false;

  function el(name, attrs) {
    var e = document.createElementNS(NS, name);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }

  function curvePath(s, c1, c2, e) {
    return "M " + s.x.toFixed(1) + " " + s.y.toFixed(1) +
      " C " + c1.x.toFixed(1) + " " + c1.y.toFixed(1) +
      ", " + c2.x.toFixed(1) + " " + c2.y.toFixed(1) +
      ", " + e.x.toFixed(1) + " " + e.y.toFixed(1);
  }

  function arrowHead(tip, ang, size) {
    var sp = 0.44;
    var a1 = ang + Math.PI - sp, a2 = ang + Math.PI + sp;
    var p1 = { x: tip.x + size * Math.cos(a1), y: tip.y + size * Math.sin(a1) };
    var p2 = { x: tip.x + size * Math.cos(a2), y: tip.y + size * Math.sin(a2) };
    return "M " + tip.x.toFixed(1) + " " + tip.y.toFixed(1) +
      " L " + p1.x.toFixed(1) + " " + p1.y.toFixed(1) +
      " L " + p2.x.toFixed(1) + " " + p2.y.toFixed(1) + " Z";
  }

  /* Work out every drawable piece of the thread, in draw order:
     dot -> tail -> connector(+arrow) xN -> tail -> dot */
  function plan() {
    var g = flow.getBoundingClientRect();
    var r = cards.map(function (c) {
      var b = c.getBoundingClientRect();
      return {
        x: b.left - g.left, y: b.top - g.top, w: b.width, h: b.height,
        right: b.right - g.left, bottom: b.bottom - g.top
      };
    });
    var N = r.length;
    var singleCol = Math.abs(r[0].x - r[1].x) < 8;   // cards stacked
    var pieces = [];

    var first = r[0], last = r[N - 1];
    var firstIn = singleCol
      ? { x: first.x + first.w * 0.5, y: first.y }
      : { x: first.x + first.w * 0.30, y: first.y };
    var lastOut = singleCol
      ? { x: last.x + last.w * 0.5, y: last.bottom }
      : { x: last.x + last.w * 0.62, y: last.bottom };
    var startDot = { x: firstIn.x, y: firstIn.y - STUB };
    var endDot = { x: lastOut.x, y: lastOut.y + STUB };

    pieces.push({ type: "dot", x: startDot.x, y: startDot.y });
    pieces.push({
      type: "line", arrow: false,
      d: "M " + startDot.x.toFixed(1) + " " + startDot.y.toFixed(1) +
         " L " + firstIn.x.toFixed(1) + " " + firstIn.y.toFixed(1)
    });

    for (var i = 0; i < N - 1; i++) {
      var A = r[i], B = r[i + 1], s, e, c1, c2, dy;
      if (singleCol) {
        s = { x: A.x + A.w * 0.5, y: A.bottom };
        e = { x: B.x + B.w * 0.5, y: B.y };
        dy = e.y - s.y;
        // the sideways bow has to stay small next to the vertical gap it spans,
        // or the connector reads as a hook jutting out of the card rather than a
        // line running between two — on a phone that gap is only ~50px
        var bow = (i % 2 === 0 ? 1 : -1) *
          Math.min(44, A.w * 0.30, Math.abs(dy) * 0.42);
        c1 = { x: s.x + bow, y: s.y + dy * 0.45 };
        c2 = { x: e.x + bow, y: e.y - dy * 0.45 };
      } else {
        if (B.x > A.x + 4) {                    // stepping right
          s = { x: A.x + A.w * 0.62, y: A.bottom };
          e = { x: B.x + B.w * 0.30, y: B.y };
        } else {                                 // stepping back left
          s = { x: A.x + A.w * 0.38, y: A.bottom };
          e = { x: B.x + B.w * 0.70, y: B.y };
        }
        dy = e.y - s.y;
        c1 = { x: s.x, y: s.y + dy * 0.5 };
        c2 = { x: e.x, y: e.y - dy * 0.5 };
      }
      pieces.push({ type: "line", arrow: true, d: curvePath(s, c1, c2, e) });
    }

    pieces.push({
      type: "line", arrow: false,
      d: "M " + lastOut.x.toFixed(1) + " " + lastOut.y.toFixed(1) +
         " L " + endDot.x.toFixed(1) + " " + endDot.y.toFixed(1)
    });
    pieces.push({ type: "dot", x: endDot.x, y: endDot.y });
    return pieces;
  }

  function draw(animate) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    var doAnim = animate && !reduce;
    var delay = 0;

    plan().forEach(function (pc) {
      if (pc.type === "dot") {
        var ring = el("circle", {
          cx: pc.x.toFixed(1), cy: pc.y.toFixed(1), r: 9.5, fill: "none",
          stroke: accent, "stroke-width": Math.max(1.4, WEIGHT - 0.6), opacity: 0.35
        });
        var dot = el("circle", { cx: pc.x.toFixed(1), cy: pc.y.toFixed(1), r: 4.6, fill: accent });
        svg.appendChild(ring);
        svg.appendChild(dot);
        if (doAnim) {
          [ring, dot].forEach(function (n) {
            n.style.transformBox = "fill-box";
            n.style.transformOrigin = "center";
            n.style.transform = "scale(0)";
            n.style.opacity = "0";
            n.getBoundingClientRect();
            n.style.transition = "transform .34s cubic-bezier(.34,1.56,.64,1) " + delay +
              "s, opacity .2s ease " + delay + "s";
          });
          requestAnimationFrame(function () {
            ring.style.transform = "scale(1)"; ring.style.opacity = "0.35";
            dot.style.transform = "scale(1)"; dot.style.opacity = "1";
          });
          delay += 0.24;
        }
        return;
      }

      var line = el("path", {
        d: pc.d, fill: "none", stroke: accent, "stroke-width": WEIGHT,
        "stroke-linecap": "round", "stroke-linejoin": "round"
      });
      svg.appendChild(line);

      var head = null;
      if (pc.arrow) {
        // arrowhead rides the midpoint of the connector, angled to the tangent
        var total = line.getTotalLength();
        var mid = line.getPointAtLength(total / 2);
        var ahead = line.getPointAtLength(Math.min(total, total / 2 + 1));
        head = el("path", {
          d: arrowHead({ x: mid.x, y: mid.y }, Math.atan2(ahead.y - mid.y, ahead.x - mid.x), 12),
          fill: accent
        });
        svg.appendChild(head);
      }

      if (doAnim) {
        var len = line.getTotalLength();
        var dur = Math.min(1.0, Math.max(0.32, len / 620));
        line.style.strokeDasharray = len;
        line.style.strokeDashoffset = len;
        if (head) head.style.opacity = "0";
        line.getBoundingClientRect();
        line.style.transition = "stroke-dashoffset " + dur + "s cubic-bezier(.5,.05,.3,1) " + delay + "s";
        if (head) head.style.transition = "opacity .22s ease " + (delay + dur - 0.04) + "s";
        requestAnimationFrame(function () {
          line.style.strokeDashoffset = "0";
          if (head) head.style.opacity = "1";
        });
        delay += dur + 0.06;
      }
    });
  }

  var pending = null;
  function schedule() {
    if (pending) return;
    pending = requestAnimationFrame(function () { pending = null; draw(false); });
  }
  window.addEventListener("resize", schedule);
  window.addEventListener("load", schedule);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { draw(revealed && !reduce ? false : false); });
  }

  draw(false);

  // draw the thread on first scroll-in; after that resizes just redraw static
  if (!reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (en.isIntersecting && !revealed) {
          revealed = true;
          draw(true);
          io.disconnect();
        }
      });
    }, { threshold: 0.3 });
    io.observe(flow);
  }
})();
