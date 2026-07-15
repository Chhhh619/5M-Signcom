/* ============================================================
   5M Signcom: shared site behaviour + i18n (EN / BM / 中文)
   Vanilla JS, no dependencies. Loaded on every page.
   ============================================================ */
(function () {
  "use strict";

  /* ---- mobile menu ---- */
  var btn = document.getElementById("menuBtn");
  var nav = document.getElementById("nav");
  if (btn && nav) {
    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        nav.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---- language dropdown (globe button) ---- */
  var langBtn = document.getElementById("langBtn");
  var langMenu = document.querySelector(".lang-menu");
  if (langBtn && langMenu) {
    langBtn.addEventListener("click", function () {
      var open = langMenu.hidden;
      langMenu.hidden = !open;
      langBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("click", function (e) {
      if (!langMenu.hidden && !e.target.closest(".lang")) {
        langMenu.hidden = true;
        langBtn.setAttribute("aria-expanded", "false");
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !langMenu.hidden) {
        langMenu.hidden = true;
        langBtn.setAttribute("aria-expanded", "false");
        langBtn.focus();
      }
    });
  }

  /* ---- current year in footer ---- */
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---- prefill every WhatsApp link with a quick opener ---- */
  var WA_MSG = "Hi, I am enquiring from 5msigncom.com.my";
  document.querySelectorAll('a[href*="wa.me"]').forEach(function (a) {
    var href = a.getAttribute("href");
    if (!href || /[?&]text=/.test(href)) return;
    a.setAttribute("href", href + (href.indexOf("?") === -1 ? "?" : "&") + "text=" + encodeURIComponent(WA_MSG));
  });

  /* ---- contact form (demo, with inline validation) ---- */
  var form = document.getElementById("quoteForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      ["f-name", "f-phone"].forEach(function (id) {
        var input = document.getElementById(id);
        if (!input) return;
        var field = input.closest(".field");
        if (!input.value.trim()) {
          field.classList.add("field-error");
          ok = false;
        } else {
          field.classList.remove("field-error");
        }
      });
      if (!ok) {
        var firstErr = form.querySelector(".field-error input");
        if (firstErr) firstErr.focus();
        return;
      }
      document.getElementById("formOk").classList.add("show");
      form.querySelectorAll(".field-error").forEach(function (f) {
        f.classList.remove("field-error");
      });
    });
    form.addEventListener("input", function (e) {
      var field = e.target.closest(".field");
      if (field && field.classList.contains("field-error") && e.target.value.trim()) {
        field.classList.remove("field-error");
      }
    });
  }

  /* ---- project gallery filter ---- */
  var filterbar = document.querySelector(".filterbar");
  if (filterbar) {
    var items = Array.prototype.slice.call(document.querySelectorAll(".proj-item"));
    var empty = document.querySelector(".proj-empty");
    filterbar.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      var cat = b.getAttribute("data-filter");
      filterbar.querySelectorAll("button").forEach(function (x) {
        x.setAttribute("aria-pressed", x === b ? "true" : "false");
      });
      var shown = 0;
      items.forEach(function (it) {
        var match = cat === "all" || it.getAttribute("data-cat") === cat;
        it.style.display = match ? "" : "none";
        if (match) shown++;
      });
      if (empty) empty.style.display = shown === 0 ? "block" : "none";
    });
  }

  /* ================= i18n ================= */
  var I18N = {
    en: {
      /* nav / shared */
      nav_home: "Home", nav_about: "About", nav_services: "Services", nav_projects: "Projects",
      nav_why: "Why 5M", nav_process: "Process", nav_contact: "Contact", nav_menu: "Menu",
      lang_label: "Language",
      nav_wa: "WhatsApp us",
      lb_close: "Close gallery", lb_prev: "Previous photo", lb_next: "Next photo",
      gl_photos: "photos", gl_photo: "photo", gl_acrylic_sub: "Lobby & wall lettering +",
      cta_quote: "Request a quotation",
      cta_band_h: "Ready to put your sign up?",
      cta_band_p: "Send a photo of your frontage on WhatsApp and we'll come back with sizes and a price. No obligation.",
      foot_blurb: "Custom signboard manufacturer: design, fabrication and installation from our workshop in Bukit Kemuning, Shah Alam. Since 2008.",
      foot_nav: "Navigate", foot_contact: "Contact", foot_made: "Shah Alam, Selangor, Malaysia",

      /* service names (shared) */
      s_signboard: "Signboard", s_3d: "3D / box-up lettering", s_cutout: "Cut-out flat lettering",
      s_led: "Neon / LED signs", s_lightbox: "Lightbox", s_pylon: "Pylon signs",
      s_outdoor: "Outdoor projects", s_acrylic: "Acrylic works",
      s_etching: "Chemical etching", s_laser: "Laser cutting",

      /* project types (shared) */
      type_billboard: "Billboard signboard", type_3dled: "3D box-up · LED", type_3d: "3D box-up lettering",
      type_acrylic: "Acrylic signage", type_lightbox: "Lightbox signage", type_outdoor: "Outdoor project",
      type_pylon: "Pylon sign", type_pylon_multi: "Multi-tenant pylon", type_cutout: "Cut-out flat lettering",
      type_etching: "Chemical etching",
      lbl_project: "Project", lbl_type: "Type", lbl_installed: "● Installed",

      /* ---------- HOME ---------- */
      hero_eyebrow: "Signage manufacturer, Shah Alam, Selangor",
      hero_h1: "Our service is your ",
      hero_h1_sign: "SIGN",
      hero_sub: "5M Signcom designs, fabricates and installs commercial signage for Malaysian businesses, from 3D LED lettering to pylon signs. In-house production since 2008.",
      chip_since: "Since 2008", chip_area: "Klang Valley & nationwide",
      clients_label: "Trusted by businesses & sign retailers:",
      tag_services: "Services",
      services_h2: "Every service. One workshop.",
      services_intro: "Every service below is produced in our own facility in Shah Alam, and the list is only the start. Tell us what your premises need; we build it.",
      svc1_h: "Storefront & building signage", svc1_p: "The face of your business, fabricated to your brand artwork and building dimensions.",
      svc2_h: "Illuminated signage", svc2_p: "Signs that work after sunset: LED modules, neon and backlit panels sized for your frontage.",
      svc3_h: "Large format & outdoor", svc3_p: "Pylons, billboards and site-wide works, engineered for Malaysian weather.",
      svc4_h: "Precision fabrication", svc4_p: "Detail work in metal and acrylic: plaques, panels and custom cut parts.",
      home_svc_more: "See all our services →",
      tag_projects: "Project gallery",
      projects_h2: "Installed and photographed on site",
      projects_intro: "Through 18 years in business, 5M has earned the trust of clients from independent shops to national brands, completing over 1,000 signage projects end to end. Here are a few of them.",
      home_proj_more: "View the full gallery →",
      tag_why: "The company",
      why_h2: "Why clients choose us",
      why1_h: "One roof, one team", why1_p: "Design, fabrication and installation happen in our own Shah Alam workshop. One team is responsible for your sign from first drawing to final handover.",
      why2_h: "Since 2008", why2_p: "Eighteen years of signboards and experience with 1000+ satisfied clients.",
      why3_h: "From plaques to pylons", why3_p: "Brass etching, water jet cutting, LED lettering, highway-scale pylons: every signage service under one roof, so complex jobs stay with one contractor.",
      stamp: "SSM 200801011102 · EST. 2008 · SHAH ALAM",
      tag_process: "How a job runs",
      process_h2: "Four steps from enquiry to handover",
      step1_h: "Site visit & measurement", step1_p: "We measure your frontage and check mounting, wiring and access.",
      step2_h: "Design & quotation", step2_p: "You approve a drawing and a firm price before anything is fabricated.",
      step3_h: "Fabrication", step3_p: "Built in our own workshop: lettering, lighting, structure and finish.",
      step4_h: "Installation & handover", step4_p: "Our crew installs, tests the lighting and hands over a finished sign.",

      /* ---------- ABOUT ---------- */
      ab_crumb: "About us",
      ab_h1: "A signboard manufacturer, everything under one roof",
      ab_lede: "5M Signcom Sdn Bhd has designed, built and installed commercial signage from our own Shah Alam workshop since 2008.",
      ab_tag: "The company",
      ab_h2: "Who we are",
      ab_lead: "We are a sign manufacturer supplying every type of sign to commercial buildings and institutions, from shopfront to pylon to chemical etching and cutouts.",
      ab_lead_tag: "“ANYTHING YOU CAN IMAGINE, WE CAN DO IT.”",
      ab_p2: "A signboard is one of the most effective ways to catch attention from a distance and bring customers through the door. A well-made sign is a marketing tool that works for you around the clock, so it is worth building properly.",
      ab_p3: "Because design, fabrication and installation all happen under our own roof, quality stays in our hands and the result is consistent, job after job.",
      ab_p4: "When you need quick, quality work, call or WhatsApp us. Send a photo or drawing with the size you want and we will come back with the best result we can offer.",
      ab_p5: "We also welcome collaboration and partnerships with retail sign shops to supply signage solutions at the lowest cost possible.",
      ab_hq_lbl: "Location", ab_hq_val: "Bukit Kemuning, Shah Alam", ab_hq_type: "Workshop & office", ab_hq_own: "● Our own facility",
      ab_why1_p: "Design, fabrication and installation happen in our own Shah Alam workshop. We ensure your project is handled professionally by our team from start to finish.",
      ab_why2_p: "Eighteen years of signboards and experience with 1000+ satisfied clients.",
      ab_stats_tag: "At a glance",
      ab_stat1_n: "2008", ab_stat1_l: "Manufacturing since",
      ab_stat2_n: "18", ab_stat2_l: "Years in business",
      ab_stat3_n: "ALL", ab_stat3_l: "Signage services under one roof",
      ab_stat4_n: "1,000+", ab_stat4_l: "Projects completed end to end",
      ab_cidb_h: "Registered with CIDB",
      ab_cidb_p: "5M Signcom is registered with the Construction Industry Development Board (CIDB Malaysia) as a Grade G3 contractor under categories B04 and CE21. That covers the signage work that counts as construction: pylon foundations, structural steel and jobs inside an active development site, where the main contractor needs a registered firm on the paperwork.",
      ab_cidb_f1: "Registration", ab_cidb_f2: "Grade", ab_cidb_f2v: "G3 · B04 · CE21",
      ab_cidb_f3: "Valid until", ab_cidb_f3v: "9 April 2028",
      ab_cidb_cta: "View the certificate →", ab_cidb_lbl: "CIDB certificate",
      ab_cap_tag: "Where the work goes",
      ab_cap_h: "Our busiest services",
      ab_cap_p: "Across a typical year, most of our workload sits in three areas, though we build more than just these.",
      sv_inst_tag: "Installation",
      sv_inst_h: "We handle installation too",
      sv_inst_p1: "We offer installation as part of the project. Our own crew brings your sign to site and puts it up, with the skylifts, cranes, welding and wiring taken care of, and we stay until everything is up and working.",
      sv_inst_p2: "Whether it is casting the concrete base for a pylon or fitting letters onto a building face, the team that built your sign is ready to install it too.",

      /* ---------- SERVICES ---------- */
      sv_crumb: "Our services",
      sv_h1: "Every signage service, all in-house",
      sv_lede: "From cut vinyl lettering to a highway pylon, every service below is designed, fabricated and installed by our own team in Shah Alam.",
      sv_tag: "Services",
      sv_mat_label: "Typical materials",
      sv_d_signboard: "The primary face of your premises. We fabricate storefront and building signboards to your brand artwork and exact building dimensions, finished for years of outdoor exposure.",
      sv_d_3d: "Individual profile-cut letters manufactured from a wide selection of materials (stainless steel, anodised aluminium, brass or acrylic) for a solid, dimensional storefront.",
      sv_d_led: "One of the brightest, most effective forms of advertising. Neon and LED signage stays visible long after dark and, well looked after, lasts for many years.",
      sv_d_lightbox: "Backlit fascia and projecting lightboxes with even illumination across the panel, for a clean, bright frontage that reads clearly day and night.",
      sv_d_cutout: "Flat letters cut from acrylic, aluminium or PVC and mounted directly to your wall or panel, for a crisp, economical look in interiors and shopfronts.",
      sv_d_acrylic: "Precision-cut and fabricated acrylic for panels, plaques, directories and built-up letters, with polished or flame-finished edges.",
      sv_d_etching: "The image is cut into the surface of the material by a chemical process, giving a permanent, hard-wearing result, ideal for brass and stainless plaques.",
      sv_d_laser: "Laser cutting for clean, precise profiles in sheet metal, holding tight tolerances and leaving an edge that needs little finishing before fabrication.",
      sv_d_pylon: "Free-standing pylon and monument signs engineered for wind load and Malaysian weather: the landmark that marks your site from the road.",
      sv_d_outdoor: "Site-wide and large-format outdoor works: billboards, gantries, hoardings and multi-sign rollouts installed by our own crew.",
      sv_mat_signboard: ["Aluminium composite", "Steel frame", "Vinyl", "LED"],
      sv_mat_3d: ["Stainless steel", "Anodised aluminium", "Brass", "Acrylic"],
      sv_mat_led: ["LED modules", "Neon flex", "Acrylic face", "Backing panel"],
      sv_mat_lightbox: ["Acrylic face", "LED", "Aluminium frame"],
      sv_mat_cutout: ["Acrylic", "Aluminium", "PVC foam"],
      sv_mat_acrylic: ["Cast acrylic", "Polished edge", "Custom colour"],
      sv_mat_etching: ["Brass", "Stainless steel", "Aluminium"],
      sv_mat_laser: ["Stainless steel", "Mild steel", "Aluminium", "Brass"],
      sv_mat_pylon: ["Steel structure", "ACP cladding", "LED / lightbox"],
      sv_mat_outdoor: ["Steel", "ACP", "Digital print", "Structure"],

      /* 3D viewer */
      v_tag: "See it in 3D",
      v_h3: "Spin a 3D box-up letter",
      v_p: "This is a live 3D model running in your browser. Drag to rotate it and see how a box-up letter sits off the wall, catches light on its returns and glows when lit. On the finished website we can load a 3D model of your own signage this same way.",
      v_head_l: "Model: 5M logo · box-up",
      v_live: "● Live 3D",
      v_ctl_rotate: "Auto-rotate", v_ctl_light: "LED on",
      v_fallback: "3D preview needs WebGL, which this browser has turned off. Everything else on the page works; this box is only the interactive logo.",

      /* ---------- GALLERY ---------- */
      gl_crumb: "Project gallery",
      gl_h1: "Installed and photographed on site",
      gl_lede: "Through 18 years in business, 5M Signcom has been trusted by clients from independent shops to national brands, completing over 1,000 signage projects end to end. Below are a few projects we are proud to showcase.",
      gl_tag: "Project gallery",
      gl_all: "All projects", gl_all_cta: "See all our projects →",
      gl_empty: "No projects in this category yet. Ask us and we'll send recent examples.",

      /* ---------- CONTACT ---------- */
      ct_crumb: "Contact us",
      ct_h1: "Tell us what your premises need",
      ct_lede: "Send a photo of your frontage on WhatsApp for the fastest reply, or use the form and we'll call you back.",
      tag_contact: "Contact",
      contact_h2a: "Get a ", contact_h2free: "free", contact_h2b: " quotation",
      contact_intro: "Attach your artwork and a sample picture. A photo of where the sign will go helps us quote faster.",
      info_head: "5M Signcom Sdn Bhd, 200801011102 (812390-K)",
      lbl_workshop: "Workshop & office", lbl_directions: "Open in Google Maps →",
      lbl_tel: "Telephone", lbl_fax: "Fax", lbl_email: "Email",
      lbl_map: "Find us", map_note: "Bukit Kemuning, Seksyen 32, off Jalan Sungai Jerluh, a short drive from Kesas and the Kemuning interchange.",
      f_name: "Name", f_company: "Company", f_phone: "Phone / WhatsApp", f_service: "Type of signage",
      o_notsure: "Not sure yet, advise me",
      f_artwork: "Artwork", f_artwork_hint: "Upload your logo or design — JPG, PNG or PDF",
      f_sample: "Sample picture", f_sample_hint: "A photo of the signage style you have in mind",
      f_install: "Installation location", f_install_hint: "Photo of where the sign will go, if installation is needed",
      f_msg: "Anything else? Location, deadline, details",
      err_required: "Please fill this in",
      form_note: "Design mockup: this form does not send yet. The live site will deliver enquiries to signcom5m@yahoo.com.",
      form_ok: "✓ In the live website, your enquiry would now be on its way to 5M Signcom."
    },

    ms: {
      nav_home: "Utama", nav_about: "Tentang", nav_services: "Perkhidmatan", nav_projects: "Projek",
      nav_why: "Kenapa 5M", nav_process: "Proses", nav_contact: "Hubungi", nav_menu: "Menu",
      lang_label: "Bahasa",
      nav_wa: "WhatsApp kami",
      lb_close: "Tutup galeri", lb_prev: "Foto sebelumnya", lb_next: "Foto seterusnya",
      gl_photos: "foto", gl_photo: "foto", gl_acrylic_sub: "Huruf lobi & dinding +",
      cta_quote: "Minta sebut harga",
      cta_band_h: "Sedia untuk pasang papan tanda anda?",
      cta_band_p: "Hantar foto hadapan premis anda melalui WhatsApp dan kami akan berikan ukuran serta harga. Tiada obligasi.",
      foot_blurb: "Pengilang papan tanda tersuai: reka bentuk, fabrikasi dan pemasangan dari bengkel kami di Bukit Kemuning, Shah Alam. Sejak 2008.",
      foot_nav: "Navigasi", foot_contact: "Hubungi", foot_made: "Shah Alam, Selangor, Malaysia",

      s_signboard: "Papan tanda", s_3d: "Huruf timbul 3D / box-up", s_cutout: "Huruf potong rata",
      s_led: "Papan tanda neon / LED", s_lightbox: "Kotak lampu", s_pylon: "Pilon",
      s_outdoor: "Projek luaran", s_acrylic: "Kerja akrilik",
      s_etching: "Punaran kimia", s_laser: "Pemotongan laser",

      type_billboard: "Papan iklan besar", type_3dled: "3D box-up · LED", type_3d: "Huruf timbul 3D",
      type_acrylic: "Papan tanda akrilik", type_lightbox: "Kotak lampu", type_outdoor: "Projek luaran",
      type_pylon: "Pilon", type_pylon_multi: "Pilon pelbagai penyewa", type_cutout: "Huruf potong rata",
      type_etching: "Punaran kimia",
      lbl_project: "Projek", lbl_type: "Jenis", lbl_installed: "● Siap dipasang",

      hero_eyebrow: "Pengilang papan tanda, Shah Alam, Selangor",
      hero_h1: "Perkhidmatan kami ialah ",
      hero_h1_sign: "PAPAN TANDA ANDA",
      hero_sub: "5M Signcom mereka bentuk, membuat dan memasang papan tanda komersial untuk perniagaan Malaysia, daripada huruf timbul 3D LED hingga pilon. Pengeluaran sendiri sejak 2008.",
      chip_since: "Sejak 2008", chip_area: "Lembah Klang & seluruh negara",
      clients_label: "Dipercayai perniagaan & kedai papan tanda:",
      tag_services: "Perkhidmatan",
      services_h2: "Setiap kemahiran. Satu bengkel.",
      services_intro: "Setiap perkhidmatan di bawah dihasilkan di kemudahan kami sendiri di Shah Alam, dan senarai ini hanyalah permulaan. Beritahu kami keperluan premis anda; kami bina.",
      svc1_h: "Papan tanda kedai & bangunan", svc1_p: "Wajah perniagaan anda, dibuat mengikut rekaan jenama dan ukuran bangunan anda.",
      svc2_h: "Papan tanda bercahaya", svc2_p: "Papan tanda yang berfungsi selepas senja: modul LED, neon dan panel bercahaya mengikut saiz kedai anda.",
      svc3_h: "Format besar & luaran", svc3_p: "Pilon, papan iklan dan kerja seluruh tapak, dibina untuk cuaca Malaysia.",
      svc4_h: "Fabrikasi persis", svc4_p: "Kerja halus logam dan akrilik: plak, panel dan bahagian potongan khas.",
      home_svc_more: "Lihat semua perkhidmatan kami →",
      tag_projects: "Galeri projek",
      projects_h2: "Siap dipasang, difoto di tapak",
      projects_intro: "Sepanjang 18 tahun beroperasi, 5M dipercayai oleh pelanggan daripada kedai kecil hingga jenama besar, dengan lebih 1,000 projek papan tanda disiapkan dari mula hingga akhir. Berikut sebahagian daripadanya.",
      home_proj_more: "Lihat galeri penuh →",
      tag_why: "Syarikat",
      why_h2: "Kenapa pelanggan memilih kami",
      why1_h: "Satu bumbung, satu pasukan", why1_p: "Reka bentuk, fabrikasi dan pemasangan dibuat di bengkel kami sendiri di Shah Alam. Satu pasukan bertanggungjawab ke atas papan tanda anda dari lukisan pertama hingga serahan.",
      why2_h: "Sejak 2008", why2_p: "Lapan belas tahun papan tanda dan pengalaman dengan 1000+ pelanggan berpuas hati.",
      why3_h: "Dari plak hingga pilon", why3_p: "Punaran tembaga, pemotongan water jet, huruf LED, pilon skala lebuh raya: setiap kemahiran papan tanda di bawah satu bumbung.",
      stamp: "SSM 200801011102 · SEJAK 2008 · SHAH ALAM",
      tag_process: "Perjalanan kerja",
      process_h2: "Empat langkah dari pertanyaan ke serahan",
      step1_h: "Lawatan tapak & ukuran", step1_p: "Kami ukur hadapan premis anda serta semak pemasangan, pendawaian dan akses.",
      step2_h: "Reka bentuk & sebut harga", step2_p: "Anda luluskan lukisan dan harga muktamad sebelum apa-apa dibuat.",
      step3_h: "Fabrikasi", step3_p: "Dibina di bengkel kami sendiri: huruf, lampu, struktur dan kemasan.",
      step4_h: "Pemasangan & serahan", step4_p: "Krew kami memasang, menguji lampu dan menyerahkan papan tanda siap.",

      ab_crumb: "Tentang kami",
      ab_h1: "Pengilang papan tanda, semuanya di bawah satu bumbung",
      ab_lede: "5M Signcom Sdn Bhd telah mereka bentuk, membina dan memasang papan tanda komersial dari bengkel kami sendiri di Shah Alam sejak 2008.",
      ab_tag: "Syarikat",
      ab_h2: "Siapa kami",
      ab_lead: "Kami pengilang papan tanda yang membekalkan setiap jenis papan tanda kepada bangunan komersial dan institusi, daripada papan kedai hingga pilon, ukiran kimia dan huruf potong.",
      ab_lead_tag: "“APA SAHAJA YANG ANDA BAYANGKAN, KAMI BOLEH BUAT.”",
      ab_p2: "Papan tanda ialah salah satu cara paling berkesan untuk menarik perhatian dari jauh dan membawa pelanggan masuk. Papan tanda yang dibuat dengan baik ialah alat pemasaran yang bekerja sepanjang masa, jadi ia berbaloi dibina dengan betul.",
      ab_p3: "Kerana reka bentuk, fabrikasi dan pemasangan semuanya di bawah bumbung kami sendiri, kualiti kekal di tangan kami dan hasilnya sentiasa konsisten, projek demi projek.",
      ab_p4: "Apabila anda perlukan kerja pantas dan berkualiti, telefon atau WhatsApp kami. Hantar foto atau lukisan dengan saiz yang dikehendaki dan kami akan berikan hasil terbaik yang mampu kami tawarkan.",
      ab_p5: "Kami juga mengalu-alukan kerjasama dan perkongsian dengan kedai papan tanda runcit untuk membekalkan penyelesaian papan tanda pada kos serendah mungkin.",
      ab_hq_lbl: "Lokasi", ab_hq_val: "Bukit Kemuning, Shah Alam", ab_hq_type: "Bengkel & pejabat", ab_hq_own: "● Kemudahan sendiri",
      ab_why1_p: "Reka bentuk, fabrikasi dan pemasangan dibuat di bengkel kami sendiri di Shah Alam. Kami pastikan projek anda dikendalikan secara profesional oleh pasukan kami dari mula hingga siap.",
      ab_why2_p: "Lapan belas tahun papan tanda dan pengalaman dengan 1000+ pelanggan berpuas hati.",
      ab_stats_tag: "Sekilas pandang",
      ab_stat1_n: "2008", ab_stat1_l: "Mengilang sejak",
      ab_stat2_n: "18", ab_stat2_l: "Tahun beroperasi",
      ab_stat3_n: "SEMUA", ab_stat3_l: "Kemahiran papan tanda satu bumbung",
      ab_stat4_n: "1,000+", ab_stat4_l: "Projek siap dari mula hingga akhir",
      ab_cidb_h: "Berdaftar dengan CIDB",
      ab_cidb_p: "5M Signcom berdaftar dengan Lembaga Pembangunan Industri Pembinaan Malaysia (CIDB) sebagai kontraktor Gred G3 di bawah kategori B04 dan CE21. Ini merangkumi kerja papan tanda yang dikira sebagai pembinaan: tapak asas pilon, kerja keluli struktur dan kerja di dalam tapak pembangunan yang aktif, di mana kontraktor utama memerlukan firma berdaftar dalam dokumen mereka.",
      ab_cidb_f1: "Pendaftaran", ab_cidb_f2: "Gred", ab_cidb_f2v: "G3 · B04 · CE21",
      ab_cidb_f3: "Sah sehingga", ab_cidb_f3v: "9 April 2028",
      ab_cidb_cta: "Lihat perakuan →", ab_cidb_lbl: "Perakuan CIDB",
      ab_cap_tag: "Tumpuan kerja",
      ab_cap_h: "Kemahiran paling sibuk",
      ab_cap_p: "Dalam setahun biasa, kebanyakan kerja kami tertumpu pada tiga bidang, tetapi kerja kami tidak terhad kepada ini sahaja.",
      sv_inst_tag: "Pemasangan",
      sv_inst_h: "Kami juga menyediakan pemasangan",
      sv_inst_p1: "Kami menawarkan pemasangan sebagai sebahagian daripada projek. Krew kami sendiri membawa papan tanda anda ke tapak dan memasangnya, termasuk skylift, kren, kimpalan dan pendawaian, dan kami berada di tapak sehingga semuanya siap berfungsi.",
      sv_inst_p2: "Sama ada menuang tapak konkrit untuk pilon atau memasang huruf pada muka bangunan, pasukan yang membina papan tanda anda juga bersedia memasangnya.",

      sv_crumb: "Perkhidmatan kami",
      sv_h1: "Setiap kemahiran papan tanda, semua dibuat sendiri",
      sv_lede: "Daripada huruf vinil hingga pilon lebuh raya, setiap perkhidmatan di bawah direka, dibuat dan dipasang oleh pasukan kami sendiri di Shah Alam.",
      sv_tag: "Perkhidmatan",
      sv_mat_label: "Bahan biasa",
      sv_d_signboard: "Wajah utama premis anda. Kami membuat papan tanda kedai dan bangunan mengikut rekaan jenama dan ukuran tepat bangunan anda, dikemas untuk tahan bertahun-tahun di luar.",
      sv_d_3d: "Huruf potong profil individu dibuat daripada pelbagai bahan (keluli tahan karat, aluminium teranod, tembaga atau akrilik) untuk hadapan kedai yang kukuh dan berdimensi.",
      sv_d_led: "Salah satu bentuk pengiklanan paling terang dan berkesan. Papan tanda neon dan LED kekal jelas selepas gelap dan, jika dijaga, bertahan bertahun-tahun.",
      sv_d_lightbox: "Kotak lampu fasia dan unjur dengan pencahayaan sekata di seluruh panel, untuk hadapan yang bersih dan terang, jelas dibaca siang dan malam.",
      sv_d_cutout: "Huruf rata dipotong daripada akrilik, aluminium atau PVC dan dipasang terus pada dinding atau panel anda, untuk kemasan kemas dan jimat di dalaman dan hadapan kedai.",
      sv_d_acrylic: "Akrilik dipotong dan dibuat dengan persis untuk panel, plak, direktori dan huruf timbul, dengan tepi digilap atau dikemas api.",
      sv_d_etching: "Imej dipotong ke permukaan bahan melalui proses kimia, memberikan hasil kekal dan tahan lasak, sesuai untuk plak tembaga dan keluli tahan karat.",
      sv_d_laser: "Pemotongan laser untuk profil bersih dan tepat pada logam kepingan, dengan toleransi ketat dan tepi yang hanya perlu sedikit kemasan sebelum fabrikasi.",
      sv_d_pylon: "Papan tanda pilon dan monumen berdiri sendiri, direka untuk beban angin dan cuaca Malaysia: mercu tanda yang menandakan tapak anda dari jalan.",
      sv_d_outdoor: "Kerja luaran format besar seluruh tapak: papan iklan, gantri, pagar iklan dan pemasangan berbilang papan tanda oleh krew kami sendiri.",
      sv_mat_signboard: ["Komposit aluminium", "Rangka keluli", "Vinil", "LED"],
      sv_mat_3d: ["Keluli tahan karat", "Aluminium teranod", "Tembaga", "Akrilik"],
      sv_mat_led: ["Modul LED", "Neon flex", "Muka akrilik", "Panel belakang"],
      sv_mat_lightbox: ["Muka akrilik", "LED", "Rangka aluminium"],
      sv_mat_cutout: ["Akrilik", "Aluminium", "PVC buih"],
      sv_mat_acrylic: ["Akrilik tuang", "Tepi digilap", "Warna tersuai"],
      sv_mat_etching: ["Tembaga", "Keluli tahan karat", "Aluminium"],
      sv_mat_laser: ["Keluli tahan karat", "Keluli lembut", "Aluminium", "Tembaga"],
      sv_mat_pylon: ["Struktur keluli", "Lapisan ACP", "LED / kotak lampu"],
      sv_mat_outdoor: ["Keluli", "ACP", "Cetakan digital", "Struktur"],

      v_tag: "Lihat dalam 3D",
      v_h3: "Putar huruf box-up 3D",
      v_p: "Ini model 3D langsung berjalan dalam pelayar anda. Seret untuk memutarnya dan lihat bagaimana huruf box-up terpisah dari dinding, menangkap cahaya pada tepinya dan bersinar apabila dinyalakan. Di laman siap, kami boleh memuatkan model 3D papan tanda anda sendiri dengan cara yang sama.",
      v_head_l: "Model: logo 5M · box-up",
      v_live: "● 3D langsung",
      v_ctl_rotate: "Auto-putar", v_ctl_light: "LED hidup",
      v_fallback: "Pratonton 3D memerlukan WebGL, yang dimatikan oleh pelayar ini. Semua lagi pada halaman ini berfungsi; kotak ini hanya logo interaktif.",

      gl_crumb: "Galeri projek",
      gl_h1: "Siap dipasang, difoto di tapak",
      gl_lede: "Sepanjang 18 tahun beroperasi, 5M Signcom dipercayai oleh pelanggan daripada kedai kecil hingga jenama besar, dengan lebih 1,000 projek papan tanda disiapkan dari mula hingga akhir. Berikut beberapa projek yang kami banggakan.",
      gl_tag: "Galeri projek",
      gl_all: "Semua projek", gl_all_cta: "Lihat semua projek kami →",
      gl_empty: "Belum ada projek dalam kategori ini. Tanya kami dan kami akan hantar contoh terkini.",

      ct_crumb: "Hubungi kami",
      ct_h1: "Beritahu kami keperluan premis anda",
      ct_lede: "Hantar foto hadapan kedai anda melalui WhatsApp untuk jawapan terpantas, atau isi borang dan kami akan hubungi anda semula.",
      tag_contact: "Hubungi",
      contact_h2a: "Dapatkan sebut harga ", contact_h2free: "percuma", contact_h2b: "",
      contact_intro: "Lampirkan karya seni dan gambar contoh anda. Foto lokasi pemasangan membantu kami sebut harga dengan lebih pantas.",
      info_head: "5M Signcom Sdn Bhd, 200801011102 (812390-K)",
      lbl_workshop: "Bengkel & pejabat", lbl_directions: "Buka di Google Maps →",
      lbl_tel: "Telefon", lbl_fax: "Faks", lbl_email: "E-mel",
      lbl_map: "Cari kami", map_note: "Bukit Kemuning, Seksyen 32, dari Jalan Sungai Jerluh, tidak jauh dari Kesas dan susur Kemuning.",
      f_name: "Nama", f_company: "Syarikat", f_phone: "Telefon / WhatsApp", f_service: "Jenis papan tanda",
      o_notsure: "Belum pasti, nasihatkan saya",
      f_artwork: "Karya seni", f_artwork_hint: "Muat naik logo atau reka bentuk anda — JPG, PNG atau PDF",
      f_sample: "Gambar contoh", f_sample_hint: "Foto gaya papan tanda yang anda inginkan",
      f_install: "Lokasi pemasangan", f_install_hint: "Foto tempat papan tanda akan dipasang, jika perlukan pemasangan",
      f_msg: "Apa-apa lagi? Lokasi, tarikh akhir, butiran",
      err_required: "Sila isi ruangan ini",
      form_note: "Contoh reka bentuk: borang ini belum berfungsi. Laman sebenar akan menghantar pertanyaan ke signcom5m@yahoo.com.",
      form_ok: "✓ Di laman sebenar, pertanyaan anda kini sedang dihantar kepada 5M Signcom."
    },

    zh: {
      nav_home: "首页", nav_about: "关于我们", nav_services: "服务项目", nav_projects: "工程案例",
      nav_why: "为何选5M", nav_process: "流程", nav_contact: "联系我们", nav_menu: "菜单",
      lang_label: "语言",
      nav_wa: "WhatsApp 咨询",
      lb_close: "关闭相册", lb_prev: "上一张", lb_next: "下一张",
      gl_photos: "张照片", gl_photo: "张照片", gl_acrylic_sub: "大堂与墙面立体字 +",
      cta_quote: "索取报价",
      cta_band_h: "准备好竖起您的招牌了吗？",
      cta_band_p: "通过 WhatsApp 发送店面照片，我们会回复尺寸与价格。无需任何承诺。",
      foot_blurb: "定制招牌制造商：设计、制造与安装，尽在莎阿南武吉哥文宁厂房。始于2008年。",
      foot_nav: "网站导航", foot_contact: "联系方式", foot_made: "马来西亚雪兰莪莎阿南",

      s_signboard: "招牌", s_3d: "3D立体字 / 箱式字", s_cutout: "平面切割字",
      s_led: "霓虹 / LED招牌", s_lightbox: "灯箱", s_pylon: "立柱广告塔",
      s_outdoor: "户外工程", s_acrylic: "压克力制品",
      s_etching: "化学蚀刻", s_laser: "激光切割",

      type_billboard: "大型广告招牌", type_3dled: "3D箱式字 · LED", type_3d: "3D箱式立体字",
      type_acrylic: "压克力招牌", type_lightbox: "灯箱招牌", type_outdoor: "户外工程",
      type_pylon: "立柱广告塔", type_pylon_multi: "多租户立柱塔", type_cutout: "平面切割字",
      type_etching: "化学蚀刻",
      lbl_project: "项目", lbl_type: "类型", lbl_installed: "● 已安装",

      hero_eyebrow: "招牌制造商，雪兰莪莎阿南",
      hero_h1: "我们的服务，就是您的",
      hero_h1_sign: "招牌",
      hero_sub: "5M Signcom 为马来西亚企业设计、制造与安装商业招牌，从3D LED立体字到立柱广告塔。自2008年起自设厂房生产。",
      chip_since: "始于2008年", chip_area: "巴生谷及全马服务",
      clients_label: "深受企业与招牌同行信赖：",
      tag_services: "服务项目",
      services_h2: "全部工艺，一间厂房。",
      services_intro: "以下每项服务都在我们莎阿南自设的厂房内完成，而我们能做的远不止这些。告诉我们您的店面需要什么，我们来制造。",
      svc1_h: "店面与楼宇招牌", svc1_p: "企业的门面，按您的品牌设计与建筑尺寸量身制造。",
      svc2_h: "发光招牌", svc2_p: "日落后依然醒目：LED模组、霓虹灯与背光灯箱，按店面尺寸定制。",
      svc3_h: "大型与户外工程", svc3_p: "立柱广告塔、大型广告牌与整体工程，专为马来西亚气候而建。",
      svc4_h: "精密加工", svc4_p: "金属与压克力细工：铭牌、面板与定制切割部件。",
      home_svc_more: "查看全部服务 →",
      tag_projects: "工程案例",
      projects_h2: "实地安装，实景拍摄",
      projects_intro: "创业18年来，5M深受大小客户信赖，从头到尾完成超过1,000个招牌项目。以下是其中一部分。",
      home_proj_more: "查看完整案例 →",
      tag_why: "公司简介",
      why_h2: "客户为何选择我们",
      why1_h: "一站式团队", why1_p: "设计、制造、安装全在我们莎阿南的自家厂房完成。由同一支团队负责您的招牌，从图纸到交付。",
      why2_h: "始于2008年", why2_p: "十八年招牌制作经验，1000+ 满意客户。",
      why3_h: "从铭牌到广告塔", why3_p: "铜牌蚀刻、水刀切割、LED立体字、大型立柱广告塔：所有招牌工艺齐全，复杂工程一家搞定。",
      stamp: "SSM 200801011102 · 始于2008 · 莎阿南",
      tag_process: "工程流程",
      process_h2: "从咨询到交付，四个步骤",
      step1_h: "上门量尺", step1_p: "我们测量店面尺寸，检查安装位置、电线与施工通道。",
      step2_h: "设计与报价", step2_p: "您先确认设计图与固定价格，我们才开工制造。",
      step3_h: "厂内制作", step3_p: "在自家厂房制造：字体、灯光、结构与表面处理。",
      step4_h: "安装与交付", step4_p: "我们的团队负责安装、测试灯光，交付完工招牌。",

      ab_crumb: "关于我们",
      ab_h1: "招牌制造商，一切自家厂房完成",
      ab_lede: "5M Signcom Sdn Bhd 自2008年起，在莎阿南自设厂房为客户设计、制造与安装商业招牌。",
      ab_tag: "公司简介",
      ab_h2: "我们是谁",
      ab_lead: "我们是招牌制造商，为商业楼宇与机构供应各类招牌，从店面招牌、立柱广告塔到化学蚀刻与立体切割字。",
      ab_lead_tag: "“只要您想得到，我们就做得到。”",
      ab_p2: "招牌是从远处吸引注意、把顾客引进门最有效的方式之一。做工精良的招牌是一件全天候为您工作的营销工具，因此值得好好制作。",
      ab_p3: "设计、制造与安装都在自家厂房完成，品质由我们把关，成品始终如一。",
      ab_p4: "当您需要快速又优质的服务，请致电或 WhatsApp 我们。发来照片或图纸并注明尺寸，我们将尽力给您最好的成果。",
      ab_p5: "我们也欢迎与招牌零售同行合作结盟，以尽可能低的成本供应招牌解决方案。",
      ab_hq_lbl: "地点", ab_hq_val: "莎阿南武吉哥文宁", ab_hq_type: "厂房与办公室", ab_hq_own: "● 自家厂房",
      ab_why1_p: "设计、制造、安装全在我们莎阿南的自家厂房完成。我们确保您的项目由自家团队专业跟进，从开工到完工。",
      ab_why2_p: "十八年招牌制作经验，1000+ 满意客户。",
      ab_stats_tag: "一览",
      ab_stat1_n: "2008", ab_stat1_l: "制造始于",
      ab_stat2_n: "18", ab_stat2_l: "经营年数",
      ab_stat3_n: "全部", ab_stat3_l: "招牌工艺一站式完成",
      ab_stat4_n: "1,000+", ab_stat4_l: "项目从头到尾完成",
      ab_cidb_h: "已在 CIDB 注册",
      ab_cidb_p: "5M Signcom 已在马来西亚建筑工业发展局（CIDB）注册，为 G3 级承包商，类别 B04 与 CE21。这涵盖了属于建筑工程范畴的招牌工作：立柱地基、结构钢材，以及在施工中的发展区内作业——总承包商需要在文件上列明注册公司的场合。",
      ab_cidb_f1: "注册编号", ab_cidb_f2: "等级", ab_cidb_f2v: "G3 · B04 · CE21",
      ab_cidb_f3: "有效期至", ab_cidb_f3v: "2028年4月9日",
      ab_cidb_cta: "查看证书 →", ab_cidb_lbl: "CIDB 证书",
      ab_cap_tag: "工作重心",
      ab_cap_h: "我们最繁忙的工艺",
      ab_cap_p: "在寻常的一年里，我们大部分工作集中在三个领域，但我们的业务远不止于此。",
      sv_inst_tag: "安装施工",
      sv_inst_h: "我们也提供安装服务",
      sv_inst_p1: "我们也提供安装服务，作为项目的一部分。自家团队会把招牌送到现场安装，升降台、吊车、焊接与接线一并处理，直到一切装好、正常亮灯。",
      sv_inst_p2: "无论是为立柱广告塔浇筑混凝土基座，还是把立体字装上建筑外墙，制作招牌的团队也随时可以为您安装。",

      sv_crumb: "服务项目",
      sv_h1: "全部招牌工艺，皆自家制造",
      sv_lede: "从切割字到高速公路立柱广告塔，以下每项服务都由我们莎阿南的团队亲自设计、制造与安装。",
      sv_tag: "服务项目",
      sv_mat_label: "常用材料",
      sv_d_signboard: "您店面的主要门面。我们按您的品牌设计与建筑精确尺寸制造店面及楼宇招牌，表面处理耐受多年户外风吹日晒。",
      sv_d_3d: "以多种材料（不锈钢、阳极氧化铝、黄铜或压克力）单独切割制成的立体字，打造扎实而有层次的店面。",
      sv_d_led: "最明亮、最有效的广告形式之一。霓虹与 LED 招牌入夜后依然清晰，若保养得当可用许多年。",
      sv_d_lightbox: "背光面板与突出式灯箱，整块面板照明均匀，打造干净明亮、日夜都清晰易读的门面。",
      sv_d_cutout: "以压克力、铝或 PVC 切割的平面字，直接安装于墙面或面板，打造室内与店面皆宜、简洁又经济的效果。",
      sv_d_acrylic: "精密切割与加工的压克力，用于面板、铭牌、指示牌与立体字，边缘经抛光或火焰处理。",
      sv_d_etching: "图案通过化学工艺蚀入材料表面，效果永久耐磨，最适合黄铜与不锈钢铭牌。",
      sv_d_laser: "激光切割，可在金属板上切出干净精确的轮廓，公差严密，切边平整，后续加工前几乎无需修整。",
      sv_d_pylon: "独立式立柱与地标招牌，按风载与马来西亚气候设计：从马路上标示您所在位置的地标。",
      sv_d_outdoor: "整体场地与大型户外工程：广告牌、龙门架、围板及多招牌统一安装，由我们自己的团队完成。",
      sv_mat_signboard: ["铝塑板", "钢架", "贴膜", "LED"],
      sv_mat_3d: ["不锈钢", "阳极氧化铝", "黄铜", "压克力"],
      sv_mat_led: ["LED模组", "柔性霓虹", "压克力面", "背板"],
      sv_mat_lightbox: ["压克力面", "LED", "铝框"],
      sv_mat_cutout: ["压克力", "铝", "PVC发泡板"],
      sv_mat_acrylic: ["浇铸压克力", "抛光边", "定制颜色"],
      sv_mat_etching: ["黄铜", "不锈钢", "铝"],
      sv_mat_laser: ["不锈钢", "碳钢", "铝", "黄铜"],
      sv_mat_pylon: ["钢结构", "铝塑板包覆", "LED / 灯箱"],
      sv_mat_outdoor: ["钢", "铝塑板", "数码印刷", "结构"],

      v_tag: "3D 实景",
      v_h3: "旋转一个 3D 箱式立体字",
      v_p: "这是在您浏览器中实时运行的 3D 模型。拖动即可旋转，看看箱式字如何从墙面凸出、侧面如何反光、以及点亮时如何发光。正式网站上，我们可以用同样的方式加载您自己招牌的 3D 模型。",
      v_head_l: "模型：5M 立体标志",
      v_live: "● 实时 3D",
      v_ctl_rotate: "自动旋转", v_ctl_light: "LED 开",
      v_fallback: "3D 预览需要 WebGL，而此浏览器已将其关闭。页面上其他内容均正常，此框仅为可交互的立体标志。",

      gl_crumb: "工程案例",
      gl_h1: "实地安装，实景拍摄",
      gl_lede: "创业18年来，5M Signcom 深受大小客户信赖，从头到尾完成超过1,000个招牌项目。以下是我们引以为傲的部分项目。",
      gl_tag: "工程案例",
      gl_all: "全部案例", gl_all_cta: "查看我们的全部案例 →",
      gl_empty: "此类别暂无案例。请联系我们，我们会发送近期实例。",

      ct_crumb: "联系我们",
      ct_h1: "告诉我们您的店面需要什么",
      ct_lede: "WhatsApp 发送店面照片，回复最快；或填写表格，我们会回电给您。",
      tag_contact: "联系我们",
      contact_h2a: "获取", contact_h2free: "免费", contact_h2b: "报价",
      contact_intro: "请附上您的设计稿与样图。安装位置的照片能帮我们更快报价。",
      info_head: "5M Signcom Sdn Bhd, 200801011102 (812390-K)",
      lbl_workshop: "厂房与办公室", lbl_directions: "在 Google 地图中打开 →",
      lbl_tel: "电话", lbl_fax: "传真", lbl_email: "电邮",
      lbl_map: "找到我们", map_note: "武吉哥文宁，第32区，位于 Jalan Sungai Jerluh，距 Kesas 高速与 Kemuning 交汇处不远。",
      f_name: "姓名", f_company: "公司", f_phone: "电话 / WhatsApp", f_service: "招牌类型",
      o_notsure: "还不确定，请给我建议",
      f_artwork: "设计稿", f_artwork_hint: "上传您的标志或设计稿 — JPG、PNG 或 PDF",
      f_sample: "样图", f_sample_hint: "您想要的招牌样式照片",
      f_install: "安装位置", f_install_hint: "招牌安装位置的照片（如需安装）",
      f_msg: "还有其他吗？地点、期限、细节",
      err_required: "请填写此项",
      form_note: "设计示范：此表格暂不发送。正式网站将把询价发送至 signcom5m@yahoo.com。",
      form_ok: "✓ 在正式网站上，您的询价此刻已发送给 5M Signcom。"
    }
  };

  function applyValue(el, val) {
    if (Array.isArray(val)) return; // arrays handled by data-i18n-list
    el.textContent = val;
  }

  function setLang(code) {
    var dict = I18N[code] || I18N.en;
    document.documentElement.lang = code;

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (dict[key] !== undefined) applyValue(el, dict[key]);
    });

    // list-type keys (material tag rows) -> rebuild <span> children
    document.querySelectorAll("[data-i18n-list]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-list");
      var arr = dict[key];
      if (!Array.isArray(arr)) arr = (I18N.en[key] || []);
      while (el.firstChild) el.removeChild(el.firstChild);
      arr.forEach(function (t) {
        var s = document.createElement("span");
        s.textContent = t;
        el.appendChild(s);
      });
    });

    // attribute translations: data-i18n-attr="placeholder:key;aria-label:key"
    document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
      el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
        var bits = pair.split(":");
        if (bits.length === 2 && dict[bits[1]] !== undefined) {
          el.setAttribute(bits[0].trim(), dict[bits[1].trim()]);
        }
      });
    });

    document.querySelectorAll(".lang [data-lang]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-lang") === code ? "true" : "false");
    });
    var cur = document.querySelector(".lang-cur");
    if (cur) cur.textContent = code === "ms" ? "BM" : code === "zh" ? "中文" : "EN";
    try { localStorage.setItem("5m-lang", code); } catch (e) {}
  }

  document.querySelectorAll(".lang [data-lang]").forEach(function (b) {
    b.addEventListener("click", function () {
      setLang(b.getAttribute("data-lang"));
      var m = document.querySelector(".lang-menu");
      var t = document.getElementById("langBtn");
      if (m) m.hidden = true;
      if (t) t.setAttribute("aria-expanded", "false");
    });
  });

  var qlang = null, saved = null;
  try { qlang = new URLSearchParams(location.search).get("lang"); } catch (e) {}
  try { saved = localStorage.getItem("5m-lang"); } catch (e) {}
  if (qlang && I18N[qlang]) setLang(qlang);
  else if (saved && I18N[saved]) setLang(saved);
})();
