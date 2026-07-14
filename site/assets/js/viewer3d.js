/* ============================================================
   5M Signcom — live 3D logo viewer (Three.js r128)
   Builds the full 5M Signcom mark as a box-up sign:
     • the "5M" letters (outline traced from logo.png), red
       returns with a front face that can glow like an LED sign
     • the word "SIGNCOM" as extruded 3D text (helvetiker font)
     • the five coloured "leaf" ribbons under the mark
   The whole composition is auto-centred and scaled to the frame,
   so relative layout is all that matters here.
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
  var camera = new THREE.PerspectiveCamera(42, 1.5, 0.1, 100);
  camera.position.set(0, 0.1, 7.2);

  // lighting — intensities swap between "day" (LED off) and "night" (LED on)
  var ambient = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambient);
  var key = new THREE.DirectionalLight(0xffffff, 0.85);
  key.position.set(3, 5, 4);
  scene.add(key);
  var fill = new THREE.DirectionalLight(0xffffff, 0.35);
  fill.position.set(-4, -2, 3);
  scene.add(fill);
  // warm spill light that only shines when the LED face is lit
  var glow = new THREE.PointLight(0xff8a40, 0.0, 16);
  glow.position.set(0, 0.3, 2.6);
  scene.add(glow);

  // ---- materials (shared, so toggles apply everywhere) ----
  // "5M" returns are logo red; the front face is a warmer orange-red that
  // never blends into the paper background the way a white face would
  var RED = 0xD42B1E;
  var FACE_DAY = 0xF06A1D;
  var sideMat = new THREE.MeshStandardMaterial({ color: RED, roughness: 0.55, metalness: 0.1 });
  var faceMat = new THREE.MeshStandardMaterial({ color: FACE_DAY, roughness: 0.35, metalness: 0.0, emissive: 0xff7a30, emissiveIntensity: 0.0 });
  // "SIGNCOM" — dark charcoal, gently self-lit at night so it stays readable
  var signMat = new THREE.MeshStandardMaterial({ color: 0x2A2D34, roughness: 0.5, metalness: 0.12, emissive: 0xff9a52, emissiveIntensity: 0.0 });
  var leafMats = [];

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

  // the colourful leaf ribbons, in logo order (blue at the base sweeping
  // round to red at the tip): [colour, tilt(rad), length, width, dx, dy]
  var LEAVES = [
    [0x2E9BD6,  0.62, 0.86, 0.15, -0.22, 0.00], // blue
    [0x5DBB46,  0.34, 1.02, 0.16,  0.00, 0.00], // green
    [0xF7941E,  0.03, 1.16, 0.16,  0.14, -0.02], // orange
    [0xFAD017, -0.28, 1.08, 0.15,  0.27, 0.02], // yellow
    [0xD42B1E, -0.62, 0.92, 0.14,  0.40, 0.08]  // red
  ];
  var LEAF_BASE = { x: -1.72, y: -1.46 };

  var DEPTH = 0.55;
  var content = new THREE.Group();   // holds every mesh at authored positions
  var group = new THREE.Group();     // the spinning group (drag / auto-rotate)
  scene.add(group);

  function addMark() {
    LOGO.forEach(function (poly) {
      var shape = new THREE.Shape();
      shape.moveTo(poly[0][0], poly[0][1]);
      for (var i = 1; i < poly.length; i++) shape.lineTo(poly[i][0], poly[i][1]);
      shape.closePath();
      var geo = new THREE.ExtrudeGeometry(shape, { depth: DEPTH, bevelEnabled: false });
      geo.translate(0, 0, -DEPTH / 2);
      // ExtrudeGeometry material order: [caps (front/back), extruded sides]
      content.add(new THREE.Mesh(geo, [faceMat, sideMat]));
    });
  }

  function addLeaves() {
    LEAVES.forEach(function (L) {
      var color = L[0], angle = L[1], len = L[2], wid = L[3], dx = L[4], dy = L[5];
      var s = new THREE.Shape();
      s.moveTo(0, 0);
      s.quadraticCurveTo(wid, len * 0.55, 0, len);
      s.quadraticCurveTo(-wid, len * 0.55, 0, 0);
      var g = new THREE.ExtrudeGeometry(s, { depth: 0.16, bevelEnabled: false });
      g.translate(0, 0, -0.08);
      var m = new THREE.MeshStandardMaterial({ color: color, roughness: 0.4, metalness: 0.05, emissive: color, emissiveIntensity: 0.0 });
      leafMats.push(m);
      var mesh = new THREE.Mesh(g, m);
      mesh.position.set(LEAF_BASE.x + dx, LEAF_BASE.y + dy, 0);
      mesh.rotation.z = angle;
      content.add(mesh);
    });
  }

  function addSigncom(font) {
    if (!font || typeof THREE.TextGeometry === "undefined") return;
    var tgeo = new THREE.TextGeometry("SIGNCOM", {
      font: font, size: 0.62, height: 0.18, curveSegments: 6, bevelEnabled: false
    });
    tgeo.computeBoundingBox();
    var bb = tgeo.boundingBox;
    var tw = bb.max.x - bb.min.x;
    // shift so the text's bottom-left sits at the local origin, centred in depth
    tgeo.translate(-bb.min.x, -bb.min.y, -0.09);
    var mesh = new THREE.Mesh(tgeo, signMat);
    var target = 2.75;                 // desired rendered width, under the mark
    var sc = target / tw;
    mesh.scale.setScalar(sc);
    mesh.position.set(-0.42, -1.5, 0.0);  // left edge / baseline, below the "M"
    content.add(mesh);
  }

  function fitAndShow() {
    content.updateMatrixWorld(true);
    var box = new THREE.Box3().setFromObject(content);
    var center = box.getCenter(new THREE.Vector3());
    var size = box.getSize(new THREE.Vector3());
    var s = Math.min(6.6 / size.x, 3.5 / size.y);
    content.scale.setScalar(s);
    content.position.set(-center.x * s, -center.y * s, -center.z * s);
    group.add(content);
    applyLed();
  }

  function build(font) {
    addMark();
    addLeaves();
    addSigncom(font);
    fitAndShow();
  }

  // SIGNCOM needs the font, which loads asynchronously; the mark + leaves
  // could render first, but building together keeps one clean centring pass.
  var built = false;
  function buildOnce(font) { if (built) return; built = true; build(font); }
  try {
    new THREE.FontLoader().load(
      "assets/fonts/helvetiker_bold.typeface.json",
      function (font) { buildOnce(font); },
      undefined,
      function () { buildOnce(null); }   // font failed: mark + leaves only
    );
  } catch (e) { buildOnce(null); }

  group.rotation.set(-0.08, -0.30, 0);

  /* ---- controls ---- */
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var autoRotate = !reduce;
  var ledOn = false;
  var wrap = canvas.closest ? canvas.closest(".viewer-wrap") : null;

  function applyLed() {
    if (ledOn) {
      // night: the LED face glows — strong emissive + warm spill light
      faceMat.emissiveIntensity = 1.15;
      faceMat.color.set(0xff8a3c);
      signMat.emissiveIntensity = 0.28;
      leafMats.forEach(function (m) { m.emissiveIntensity = 0.55; });
      ambient.intensity = 0.14;
      key.intensity = 0.16;
      fill.intensity = 0.06;
      glow.intensity = 0.95;
      if (wrap) wrap.classList.add("night");
    } else {
      // day: full light, faces read as unlit acrylic / painted metal
      faceMat.emissiveIntensity = 0.0;
      faceMat.color.set(FACE_DAY);
      signMat.emissiveIntensity = 0.0;
      leafMats.forEach(function (m) { m.emissiveIntensity = 0.0; });
      ambient.intensity = 0.6;
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
    camera.position.z = Math.max(4.6, Math.min(10.5, camera.position.z + (e.deltaY > 0 ? 0.5 : -0.5)));
    e.preventDefault();
  }, { passive: false });

  /* ---- resize ---- */
  function resize() {
    var w = canvas.clientWidth || 600, h = canvas.clientHeight || 400;
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
