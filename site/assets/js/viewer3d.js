/* ============================================================
   5M Signcom — live 3D logo viewer (Three.js r128)
   Extrudes the actual 5M logo mark (outline traced from
   logo.png) as a box-up sign: coloured returns + a front
   face that can glow like an LED sign.
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

  // the 5M logo mark, traced from assets/img/logo.png (x right, y up,
  // centred, 4.6 units wide) — one polygon per solid piece of the mark
  var LOGO = [
    // "M" outer stroke
    [[2.3, -0.765], [1.713, 0.503], [1.525, 0.713], [1.42, 0.754], [1.273, 0.775], [-0.498, 0.775], [-0.498, 0.723], [-0.54, 0.723], [-0.571, 0.754], [-0.571, -0.765], [-0.11, -0.765], [-0.11, 0.388], [1.053, 0.388], [1.126, 0.367], [1.305, 0.22], [1.808, -0.765]],
    // "5"
    [[-0.665, 0.754], [-2.237, 0.754], [-2.216, 0.692], [-2.3, 0.733], [-2.3, -0.157], [-1.284, -0.157], [-1.189, -0.21], [-1.189, -0.44], [-1.158, -0.44], [-1.21, -0.513], [-1.252, -0.524], [-1.305, -0.513], [-1.284, -0.472], [-2.227, -0.472], [-2.216, -0.534], [-2.248, -0.534], [-2.3, -0.482], [-2.3, -0.765], [-0.938, -0.775], [-0.77, -0.702], [-0.697, -0.608], [-0.665, -0.503], [-0.665, -0.126], [-0.718, 0.01], [-0.802, 0.094], [-0.896, 0.136], [-1.787, 0.147], [-1.787, 0.451], [-0.665, 0.451]],
    // "M" centre stroke
    [[0.812, -0.765], [0.812, 0.199], [0.424, 0.189], [0.424, 0.147], [0.382, 0.147], [0.351, 0.178], [0.351, -0.765]]
  ];

  var DEPTH = 0.55;
  var group = new THREE.Group();

  LOGO.forEach(function (poly) {
    var shape = new THREE.Shape();
    shape.moveTo(poly[0][0], poly[0][1]);
    for (var i = 1; i < poly.length; i++) shape.lineTo(poly[i][0], poly[i][1]);
    shape.closePath();
    var geo = new THREE.ExtrudeGeometry(shape, { depth: DEPTH, bevelEnabled: false });
    geo.translate(0, 0, -DEPTH / 2);
    // ExtrudeGeometry material order: [caps (front/back), extruded sides]
    group.add(new THREE.Mesh(geo, [faceMat, sideMat]));
  });

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
