/* ============================================================
   5M Signcom — project lightbox slider (gallery + services)
   Click any .proj-item[data-cat] -> popup slider over the full
   image set for that key. Swipe / arrows / keyboard to navigate.
   Reads image sets from window.GALLERY (gallery-data.js).
   ============================================================ */
(function () {
  "use strict";

  var data = window.GALLERY;
  var cards = document.querySelectorAll(".proj-item[data-cat]");
  if (!data || !cards.length) return;

  /* data-cat may be a single key ("parkson") or a comma-separated group
     ("signboard,3d,cutout") — gather every photo across the listed keys,
     keeping first-seen order and dropping duplicates shared between them. */
  function imagesFor(catAttr) {
    var out = [], seen = {};
    (catAttr || "").split(",").forEach(function (raw) {
      var k = raw.trim();
      (data[k] || []).forEach(function (src) {
        if (!seen[src]) { seen[src] = 1; out.push(src); }
      });
    });
    return out;
  }

  /* ---- build the lightbox DOM once (eagerly, so site.js i18n can reach it) ---- */
  var lb = document.createElement("div");
  lb.className = "lb";
  lb.hidden = true;
  lb.setAttribute("role", "dialog");
  lb.setAttribute("aria-modal", "true");
  lb.setAttribute("aria-label", "Project photos");

  var stage = document.createElement("div");
  stage.className = "lb-stage";
  var img = document.createElement("img");
  img.className = "lb-img";
  img.alt = "";
  stage.appendChild(img);

  function mkBtn(cls, glyph, label, i18nKey) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = cls;
    b.textContent = glyph;
    b.setAttribute("aria-label", label);
    b.setAttribute("data-i18n-attr", "aria-label:" + i18nKey);
    return b;
  }
  var btnPrev = mkBtn("lb-prev", "‹", "Previous photo", "lb_prev");
  var btnNext = mkBtn("lb-next", "›", "Next photo", "lb_next");
  var btnClose = mkBtn("lb-close", "×", "Close gallery", "lb_close");
  stage.appendChild(btnPrev);
  stage.appendChild(btnNext);

  var bar = document.createElement("div");
  bar.className = "lb-bar mono";
  var cap = document.createElement("span");
  cap.className = "lb-cap";
  var count = document.createElement("span");
  count.className = "lb-count";
  bar.appendChild(cap);
  bar.appendChild(count);

  lb.appendChild(btnClose);
  lb.appendChild(stage);
  lb.appendChild(bar);
  document.body.appendChild(lb);

  /* ---- state ---- */
  var setImgs = [], idx = 0, label = "", lastFocus = null;

  function show(i) {
    idx = (i + setImgs.length) % setImgs.length;
    img.src = setImgs[idx];
    img.alt = label + ", photo " + (idx + 1) + " of " + setImgs.length;
    cap.textContent = label;
    count.textContent = (idx + 1) + " / " + setImgs.length;
    // preload neighbours for smooth swiping
    [idx + 1, idx - 1].forEach(function (n) {
      var u = setImgs[(n + setImgs.length) % setImgs.length];
      var p = new Image(); p.src = u;
    });
  }

  function open(cat, projLabel) {
    var imgs = imagesFor(cat);
    if (!imgs.length) return;
    setImgs = imgs;
    label = projLabel || cat;
    lastFocus = document.activeElement;
    lb.hidden = false;
    document.body.classList.add("lb-open");
    show(0);
    btnClose.focus();
  }

  function close() {
    lb.hidden = true;
    document.body.classList.remove("lb-open");
    img.src = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  btnPrev.addEventListener("click", function () { show(idx - 1); });
  btnNext.addEventListener("click", function () { show(idx + 1); });
  btnClose.addEventListener("click", close);
  lb.addEventListener("click", function (e) {
    if (e.target === lb) close(); // click on the dark backdrop
  });

  document.addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "Escape") { close(); }
    else if (e.key === "ArrowLeft") { show(idx - 1); }
    else if (e.key === "ArrowRight") { show(idx + 1); }
    else if (e.key === "Tab") {
      // keep focus cycling between the three buttons
      var order = [btnClose, btnPrev, btnNext];
      var at = order.indexOf(document.activeElement);
      e.preventDefault();
      var next = e.shiftKey ? (at <= 0 ? order.length - 1 : at - 1) : (at === order.length - 1 ? 0 : at + 1);
      order[next].focus();
    }
  });

  /* ---- swipe left / right on the image ---- */
  var tx = null, ty = null;
  img.addEventListener("touchstart", function (e) {
    if (e.touches.length === 1) { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }
  }, { passive: true });
  img.addEventListener("touchend", function (e) {
    if (tx === null) return;
    var dx = e.changedTouches[0].clientX - tx;
    var dy = e.changedTouches[0].clientY - ty;
    tx = ty = null;
    if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      show(dx < 0 ? idx + 1 : idx - 1);
    }
  }, { passive: true });

  /* ---- wire up the project cards ---- */
  cards.forEach(function (card) {
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-haspopup", "dialog");
    // keep the photo-count badge in sync with the manifest
    var countEl = card.querySelector(".gl-count");
    var set = imagesFor(card.getAttribute("data-cat"));
    if (countEl && set.length) countEl.textContent = set.length;
    function activate() {
      // caption (gallery page), the service sheet's heading (services page),
      // or the card's own heading (home service groups)
      var titleEl = card.querySelector(".sheet-block b");
      if (!titleEl) {
        var sheet = card.closest ? card.closest(".svc-sheet") : null;
        if (sheet) titleEl = sheet.querySelector("h3");
      }
      if (!titleEl) titleEl = card.querySelector("h3");
      open(card.getAttribute("data-cat"), titleEl ? titleEl.textContent : "");
    }
    card.addEventListener("click", activate);
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activate(); }
    });
  });
})();
