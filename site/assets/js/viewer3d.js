/* ============================================================
   5M Signcom — live 3D "box-up letter" viewer (Three.js r128)
   Builds the 5M mark as channel-letter strokes: coloured
   returns + a front face that can glow like an LED sign.
   Runs only if a #viewer3d canvas is present.
   ============================================================ */
(function () {
  "use strict";

  var canvas = document.getElementById("viewer3d");
  if (!canvas) return;

  var fallback = document.getElementById("viewerFallback");
  function showFallback() {
    canvas.style.display = "none";
    if (fallback) fallback.style.display = "block";
  }

  if (typeof THREE === "undefined") { showFallback(); return; }

  var renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  } catch (e) { showFallback(); return; }
  if (!renderer || !renderer.getContext()) { showFallback(); return; }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0.2, 6.6);

  // lighting — intensities swap between "day" (LED off) and "night" (LED on)
  var ambient = new THREE.AmbientLight(0xffffff, 0.55);
  scene.add(ambient);
  var key = new THREE.DirectionalLight(0xffffff, 0.85);
  key.position.set(3, 5, 4);
  scene.add(key);
  var fill = new THREE.DirectionalLight(0xffffff, 0.35);
  fill.position.set(-4, -2, 3);
  scene.add(fill);
  // warm spill light that only shines when the LED face is lit
  var glow = new THREE.PointLight(0xff8a40, 0.0, 14);
  glow.position.set(0, 0.3, 2.6);
  scene.add(glow);

  // materials — shared so toggles apply everywhere
  // returns are logo red; the front face is a warmer orange-red shade so it
  // never blends into the paper background the way a white face did
  var RED = 0xD42B1E;
  var FACE_DAY = 0xF06A1D;
  var sideMat = new THREE.MeshStandardMaterial({ color: RED, roughness: 0.55, metalness: 0.1 });
  var faceMat = new THREE.MeshStandardMaterial({ color: FACE_DAY, roughness: 0.35, metalness: 0.0, emissive: 0xff7a30, emissiveIntensity: 0.0 });
  // BoxGeometry material order: [+x,-x,+y,-y,+z(front),-z(back)]
  var mats = [sideMat, sideMat, sideMat, sideMat, faceMat, sideMat];

  var DEPTH = 0.62, T = 0.42;
  var group = new THREE.Group();

  function bar(cx, cy, w, h, rot) {
    var geo = new THREE.BoxGeometry(w, h, DEPTH);
    var mesh = new THREE.Mesh(geo, mats);
    mesh.position.set(cx, cy, 0);
    if (rot) mesh.rotation.z = rot;
    group.add(mesh);
  }

  // letter "5" — blocky segments, letter-centre at xOff
  (function letterFive(xOff) {
    var o = xOff;
    bar(o + 0.00, 0.89, 1.60, T);        // top
    bar(o - 0.59, 0.45, T, 0.89);        // upper-left vertical
    bar(o + 0.00, 0.00, 1.60, T);        // middle
    bar(o + 0.59, -0.45, T, 0.89);       // lower-right vertical
    bar(o + 0.00, -0.89, 1.60, T);       // bottom
  })(-1.65);

  // letter "M" — two verticals + two diagonals, centre at xOff
  (function letterEm(xOff) {
    var o = xOff;
    bar(o - 0.79, 0.00, T, 2.20);        // left vertical
    bar(o + 0.79, 0.00, T, 2.20);        // right vertical
    bar(o - 0.40, 0.47, 1.48, T, -0.9764); // left diagonal
    bar(o + 0.40, 0.47, 1.48, T, 0.9764);  // right diagonal
  })(1.55);

  group.rotation.set(-0.1, -0.32, 0);
  scene.add(group);

  /* ---- controls ---- */
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var autoRotate = !reduce;
  var ledOn = false;
  var wrap = canvas.closest ? canvas.closest(".viewer-wrap") : null;

  function applyLed() {
    if (ledOn) {
      // night: the LED face itself glows — strong emissive + warm spill light
      faceMat.emissiveIntensity = 1.15;
      faceMat.color.set(0xff8a3c);
      ambient.intensity = 0.12;
      key.intensity = 0.15;
      fill.intensity = 0.05;
      glow.intensity = 0.9;
      if (wrap) wrap.classList.add("night");
    } else {
      // day: full light, face reads as unlit orange-red acrylic
      faceMat.emissiveIntensity = 0.0;
      faceMat.color.set(FACE_DAY);
      ambient.intensity = 0.55;
      key.intensity = 0.85;
      fill.intensity = 0.35;
      glow.intensity = 0.0;
      if (wrap) wrap.classList.remove("night");
    }
  }

  var btnRotate = document.getElementById("btnRotate");
  var btnLight = document.getElementById("btnLight");
  var btnWire = document.getElementById("btnWire");
  if (btnRotate) {
    btnRotate.setAttribute("aria-pressed", autoRotate ? "true" : "false");
    btnRotate.addEventListener("click", function () {
      autoRotate = !autoRotate;
      btnRotate.setAttribute("aria-pressed", autoRotate ? "true" : "false");
    });
  }
  if (btnLight) {
    btnLight.addEventListener("click", function () {
      ledOn = !ledOn;
      applyLed();
      btnLight.setAttribute("aria-pressed", ledOn ? "true" : "false");
    });
    btnLight.setAttribute("aria-pressed", "false");
  }
  applyLed();
  if (btnWire) {
    btnWire.addEventListener("click", function () {
      var on = btnWire.getAttribute("aria-pressed") !== "true";
      sideMat.wireframe = on; faceMat.wireframe = on;
      btnWire.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  /* ---- pointer drag to orbit ---- */
  var dragging = false, px = 0, py = 0;
  function down(e) { dragging = true; var p = point(e); px = p.x; py = p.y; }
  function move(e) {
    if (!dragging) return;
    var p = point(e);
    group.rotation.y += (p.x - px) * 0.01;
    group.rotation.x += (p.y - py) * 0.01;
    group.rotation.x = Math.max(-1.1, Math.min(1.1, group.rotation.x));
    px = p.x; py = p.y;
    if (e.cancelable) e.preventDefault();
  }
  function up() { dragging = false; }
  function point(e) {
    if (e.touches && e.touches[0]) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    return { x: e.clientX, y: e.clientY };
  }
  canvas.addEventListener("mousedown", down);
  window.addEventListener("mousemove", move);
  window.addEventListener("mouseup", up);
  canvas.addEventListener("touchstart", down, { passive: true });
  canvas.addEventListener("touchmove", move, { passive: false });
  canvas.addEventListener("touchend", up);
  canvas.addEventListener("wheel", function (e) {
    camera.position.z = Math.max(4.2, Math.min(9.5, camera.position.z + (e.deltaY > 0 ? 0.5 : -0.5)));
    e.preventDefault();
  }, { passive: false });

  /* ---- resize ---- */
  function resize() {
    var w = canvas.clientWidth || 600, h = canvas.clientHeight || 420;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);
  resize();

  /* ---- render loop ---- */
  var running = true;
  document.addEventListener("visibilitychange", function () { running = !document.hidden; if (running) tick(); });
  function tick() {
    if (!running) return;
    if (autoRotate && !dragging) group.rotation.y += 0.006;
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();
})();
