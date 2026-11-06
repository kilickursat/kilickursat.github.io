(function () {
  "use strict";

  const data = window.PORTFOLIO_DATA || {};
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.from((root || document).querySelectorAll(selector));
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (typeof text !== "undefined") node.textContent = text;
    return node;
  }

  function externalAnchor(href, text, className) {
    const a = el("a", className || "text-link", text);
    a.href = href;
    if (!href.startsWith("mailto:")) {
      a.target = "_blank";
      a.rel = "noreferrer";
    }
    return a;
  }

  function renderStats() {
    const target = qs("[data-stat-strip]");
    if (!target || !data.stats) return;
    target.innerHTML = "";
    data.stats.forEach((stat) => {
      const card = el("div", "metric reveal");
      card.appendChild(el("strong", "", stat.value));
      card.appendChild(el("span", "", stat.label));
      target.appendChild(card);
    });
  }

  function renderResearch() {
    const target = qs("[data-research-grid]");
    if (!target || !data.researchAreas) return;
    target.innerHTML = "";
    data.researchAreas.forEach((item) => {
      const card = el("article", "research-card reveal");
      card.appendChild(el("div", "research-icon", item.icon));
      card.appendChild(el("h3", "", item.title));
      card.appendChild(el("p", "", item.text));
      const tags = el("div", "tag-row");
      item.tags.forEach((tag) => tags.appendChild(el("span", "tag", tag)));
      card.appendChild(tags);
      target.appendChild(card);
    });
  }

  function buildPublicationCard(pub) {
    const card = el("article", "publication-card reveal");
    const meta = el("div", "pub-meta");
    meta.appendChild(el("span", "badge", pub.year));
    meta.appendChild(el("span", "badge subtle", pub.type));
    card.appendChild(meta);

    card.appendChild(el("h3", "", pub.title));
    card.appendChild(el("div", "pub-authors", pub.authors));
    card.appendChild(el("p", "pub-summary", pub.summary));

    const tags = el("div", "tag-row");
    pub.tags.forEach((tag) => tags.appendChild(el("span", "tag", tag)));
    card.appendChild(tags);

    const actions = el("div", "card-actions");
    if (pub.url) actions.appendChild(externalAnchor(pub.url, pub.doi ? "DOI" : "Open", "text-link"));
    const copy = el("button", "copy-button", "Copy citation");
    copy.type = "button";
    copy.dataset.citation = pub.cite || "";
    actions.appendChild(copy);
    card.appendChild(actions);
    return card;
  }

  function renderPublications() {
    const grid = qs("[data-publication-grid]");
    const search = qs("[data-publication-search]");
    const filters = qs("[data-filter-pills]");
    if (!grid || !data.publications) return;

    let activeTag = "All";
    const allTags = Array.from(new Set(data.publications.flatMap((pub) => pub.tags))).sort();
    const filterList = ["All"].concat(allTags.slice(0, 8));

    function drawFilters() {
      if (!filters) return;
      filters.innerHTML = "";
      filterList.forEach((tag) => {
        const btn = el("button", "filter-pill" + (tag === activeTag ? " active" : ""), tag);
        btn.type = "button";
        btn.dataset.tag = tag;
        btn.addEventListener("click", () => {
          activeTag = tag;
          drawFilters();
          drawCards();
        });
        filters.appendChild(btn);
      });
    }

    function matches(pub, query) {
      const haystack = [pub.title, pub.venue, pub.authors, pub.summary, pub.year, pub.type].concat(pub.tags).join(" ").toLowerCase();
      const queryMatch = !query || haystack.includes(query.toLowerCase());
      const tagMatch = activeTag === "All" || pub.tags.includes(activeTag);
      return queryMatch && tagMatch;
    }

    function drawCards() {
      const query = search ? search.value.trim() : "";
      grid.innerHTML = "";
      const results = data.publications.filter((pub) => matches(pub, query));
      if (!results.length) {
        const empty = el("p", "glass-card reveal visible", "No publications matched this filter.");
        grid.appendChild(empty);
        return;
      }
      results.forEach((pub) => grid.appendChild(buildPublicationCard(pub)));
      observeRevealItems(grid);
    }

    drawFilters();
    drawCards();
    if (search) search.addEventListener("input", drawCards);
  }

  function renderProjects() {
    const grid = qs("[data-project-grid]");
    if (!grid || !data.projects) return;
    grid.innerHTML = "";
    data.projects.forEach((project) => {
      const card = el("article", "project-card reveal");
      const meta = el("div", "project-meta");
      meta.appendChild(el("span", "badge", project.category));
      card.appendChild(meta);
      card.appendChild(el("h3", "", project.name));
      card.appendChild(el("p", "", project.description));
      const tags = el("div", "tag-row");
      project.tags.forEach((tag) => tags.appendChild(el("span", "tag", tag)));
      card.appendChild(tags);
      const actions = el("div", "card-actions");
      if (project.site) actions.appendChild(externalAnchor(project.site, "Open the app", "text-link"));
      actions.appendChild(externalAnchor(project.url, "Open repository", "text-link"));
      card.appendChild(actions);
      grid.appendChild(card);
    });
  }

  function renderTimeline() {
    const target = qs("[data-timeline]");
    if (!target || !data.timeline) return;
    target.innerHTML = "";
    data.timeline.forEach((item) => {
      const row = el("article", "timeline-item reveal");
      row.appendChild(el("span", "timeline-dot"));
      const content = el("div", "timeline-content");
      content.appendChild(el("strong", "", item.year));
      content.appendChild(el("h3", "", item.title));
      content.appendChild(el("p", "", item.text));
      row.appendChild(content);
      target.appendChild(row);
    });
  }

  function renderContactLinks() {
    const target = qs("[data-contact-links]");
    if (!target || !data.profile || !data.profile.links) return;
    target.innerHTML = "";
    data.profile.links.forEach((link) => {
      const a = externalAnchor(link.url, link.label, "");
      const detail = el("span", "", link.detail || "Open link");
      a.appendChild(detail);
      target.appendChild(a);
    });
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise((resolve, reject) => {
      const area = document.createElement("textarea");
      area.value = text;
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.focus();
      area.select();
      try {
        document.execCommand("copy");
        document.body.removeChild(area);
        resolve();
      } catch (error) {
        document.body.removeChild(area);
        reject(error);
      }
    });
  }

  function initCopyButtons() {
    document.addEventListener("click", (event) => {
      const button = event.target.closest(".copy-button");
      if (!button) return;
      const citation = button.dataset.citation || "";
      const oldText = button.textContent;
      copyText(citation).then(() => {
        button.textContent = "Copied";
        window.setTimeout(() => { button.textContent = oldText; }, 1400);
      }).catch(() => {
        button.textContent = "Copy failed";
        window.setTimeout(() => { button.textContent = oldText; }, 1400);
      });
    });
  }

  let revealObserver;
  function observeRevealItems(root) {
    const items = qsa(".reveal:not(.visible)", root || document);
    if (reducedMotion) {
      items.forEach((item) => item.classList.add("visible"));
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.14, rootMargin: "0px 0px -60px 0px" });
    }
    items.forEach((item) => revealObserver.observe(item));
  }

  function initNavigation() {
    const toggle = qs("[data-nav-toggle]");
    const links = qs("[data-nav-links]");
    if (toggle && links) {
      toggle.addEventListener("click", () => {
        const open = links.classList.toggle("open");
        document.body.classList.toggle("nav-open", open);
        toggle.setAttribute("aria-expanded", String(open));
      });
      links.addEventListener("click", (event) => {
        if (event.target.closest("a")) {
          links.classList.remove("open");
          document.body.classList.remove("nav-open");
          toggle.setAttribute("aria-expanded", "false");
        }
      });
    }

    const navLinks = qsa(".nav-links a");
    const sections = navLinks.map((a) => qs(a.getAttribute("href"))).filter(Boolean);
    if (!sections.length) return;
    const activeObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { threshold: 0.28, rootMargin: "-20% 0px -60% 0px" });
    sections.forEach((section) => activeObserver.observe(section));
  }

  function initThreeHero() {
    const canvas = qs("#tbm-canvas");
    const frame = qs(".visual-frame");
    if (!canvas || !window.THREE) return;

    const THREE = window.THREE;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05070d, 0.08);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 7.2);

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    if (renderer.outputEncoding !== undefined && THREE.sRGBEncoding !== undefined) {
      renderer.outputEncoding = THREE.sRGBEncoding;
    }

    const cutter = new THREE.Group();
    const tunnel = new THREE.Group();
    const particles = new THREE.Group();
    scene.add(tunnel, cutter, particles);

    const metal = new THREE.MeshStandardMaterial({ color: 0x9db4c9, metalness: 0.72, roughness: 0.28 });
    const darkMetal = new THREE.MeshStandardMaterial({ color: 0x1d2b3b, metalness: 0.82, roughness: 0.38 });
    const amber = new THREE.MeshStandardMaterial({ color: 0xffbf6a, metalness: 0.55, roughness: 0.24, emissive: 0x4a2105, emissiveIntensity: 0.18 });
    const cyan = new THREE.MeshStandardMaterial({ color: 0x68e2ff, metalness: 0.35, roughness: 0.22, emissive: 0x0a6476, emissiveIntensity: 0.3 });
    const liningMaterial = new THREE.MeshBasicMaterial({ color: 0x68e2ff, transparent: true, opacity: 0.16 });

    const outerRing = new THREE.Mesh(new THREE.TorusGeometry(2.25, 0.12, 18, 128), metal);
    const innerRing = new THREE.Mesh(new THREE.TorusGeometry(1.18, 0.085, 18, 96), darkMetal);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.48, 0.26, 48), amber);
    hub.rotation.x = Math.PI / 2;
    cutter.add(outerRing, innerRing, hub);

    for (let i = 0; i < 12; i += 1) {
      const angle = (i / 12) * Math.PI * 2;
      const spoke = new THREE.Mesh(new THREE.BoxGeometry(1.78, 0.085, 0.13), i % 2 ? metal : darkMetal);
      spoke.position.set(Math.cos(angle) * 0.82, Math.sin(angle) * 0.82, 0.02);
      spoke.rotation.z = angle;
      cutter.add(spoke);

      const cutterBit = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.085, 0.18, 18), i % 3 === 0 ? cyan : amber);
      cutterBit.rotation.x = Math.PI / 2;
      cutterBit.position.set(Math.cos(angle) * 1.72, Math.sin(angle) * 1.72, 0.18);
      cutter.add(cutterBit);
    }

    for (let ring = 0; ring < 16; ring += 1) {
      const radius = 2.65 + ring * 0.018;
      const torus = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.008, 8, 96), liningMaterial.clone());
      torus.position.z = -ring * 0.42;
      torus.material.opacity = Math.max(0.03, 0.18 - ring * 0.008);
      tunnel.add(torus);
    }

    const radialLinesMaterial = new THREE.MeshBasicMaterial({ color: 0xffbf6a, transparent: true, opacity: 0.13 });
    for (let i = 0; i < 20; i += 1) {
      const line = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.006, 0.006), radialLinesMaterial);
      line.position.z = -2.6;
      line.rotation.z = (i / 20) * Math.PI;
      tunnel.add(line);
    }

    const particleCount = 420;
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i += 1) {
      const r = 0.35 + Math.random() * 2.35;
      const a = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = Math.sin(a) * r;
      positions[i * 3 + 2] = -7 + Math.random() * 7.8;
      speeds[i] = 0.016 + Math.random() * 0.032;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({ color: 0x68e2ff, size: 0.028, transparent: true, opacity: 0.78, depthWrite: false });
    const pointCloud = new THREE.Points(particleGeo, particleMat);
    particles.add(pointCloud);

    scene.add(new THREE.AmbientLight(0x7aa7ff, 1.1));
    const key = new THREE.DirectionalLight(0xffffff, 1.9);
    key.position.set(3, 4, 7);
    scene.add(key);
    const rim = new THREE.PointLight(0x68e2ff, 2.2, 12);
    rim.position.set(-3.2, -2.8, 3.5);
    scene.add(rim);

    const pointer = { x: 0, y: 0 };
    window.addEventListener("mousemove", (event) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 0.22;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 0.16;
    }, { passive: true });

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    let last = performance.now();
    function render(now) {
      const delta = Math.min(42, now - last);
      last = now;
      if (!reducedMotion) {
        cutter.rotation.z += delta * 0.00026;
        cutter.rotation.x += (pointer.y - cutter.rotation.x) * 0.035;
        cutter.rotation.y += (pointer.x - cutter.rotation.y) * 0.035;
        tunnel.rotation.z -= delta * 0.000035;
        for (let i = 0; i < particleCount; i += 1) {
          const zIndex = i * 3 + 2;
          positions[zIndex] += speeds[i] * delta;
          if (positions[zIndex] > 2.2) positions[zIndex] = -7.2;
        }
        particleGeo.attributes.position.needsUpdate = true;
      }
      renderer.render(scene, camera);
      if (!reducedMotion) requestAnimationFrame(render);
    }

    resize();
    if (frame) frame.classList.add("three-ready");
    window.addEventListener("resize", resize, { passive: true });
    requestAnimationFrame(render);
  }

  function init() {
    renderStats();
    renderResearch();
    renderPublications();
    renderProjects();
    renderTimeline();
    renderContactLinks();
    initCopyButtons();
    initNavigation();
    observeRevealItems(document);
    initThreeHero();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
