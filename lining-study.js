// Build a segment as an annular wedge swept around a bevelled radial section.
// All lengths describe a conceptual model, independent of a particular tunnel.
(() => {
  "use strict";

  const dialog = document.getElementById("lining-study");
  const launcher = document.getElementById("open-lining-study");
  if (!dialog || !launcher || typeof dialog.showModal !== "function") return;

  const canvas = dialog.querySelector("canvas");
  const poster = dialog.querySelector(".lining-stage img");
  const controls = dialog.querySelector(".lining-controls");
  const angle = dialog.querySelector("#lining-angle");
  const gap = dialog.querySelector("#lining-gap");
  const dragHint = dialog.querySelector(".lining-hint");
  const staticHint = dialog.querySelector(".lining-static");
  const tau = 2 * Math.PI;

  function createLiningMesh() {
    const mesh = [];
    const inner = 1.30;
    const outer = 1.57;
    const halfWidth = 0.46;
    const bevel = 0.018;
    const keyWidth = 0.50;
    const section = [
      [-halfWidth + bevel, inner], [halfWidth - bevel, inner],
      [halfWidth, inner + bevel], [halfWidth, outer - bevel],
      [halfWidth - bevel, outer], [-halfWidth + bevel, outer],
      [-halfWidth, outer - bevel], [-halfWidth, inner + bevel],
    ];
    // Surface codes distinguish inner wall, end faces, outer wall and joint faces.
    const surfaces = [2, 5, 3, 5, 1, 5, 3, 5];

    function segment(ring, block, start, end) {
      const middle = (start + end) / 2;
      const isKey = ring === 2 && block === 0;
      const drift = isKey ? 0.92 : 0.47;
      const spread = [(ring - 1) * 0.80, Math.cos(middle) * drift, Math.sin(middle) * drift];
      const arcLength = (end - start) * outer;
      const variation = Math.sin(ring * 3.4 + block * 1.8);
      function vertex(x, radius, theta, nx, nr, tangent, face) {
        const c = Math.cos(theta);
        const s = Math.sin(theta);
        return [
          x + (ring - 1) * (halfWidth * 2 + 0.016), radius * c, radius * s,
          nx, nr * c - tangent * s, nr * s + tangent * c,
          ...spread,
          (theta - middle) * outer, x, (radius - inner) / (outer - inner), arcLength,
          face, Number(isKey), variation,
        ];
      }
      const steps = Math.max(8, Math.ceil((end - start) * 21));
      for (let side = 0; side < section.length; side++) {
        const [xa, ra] = section[side];
        const [xb, rb] = section[(side + 1) % section.length];
        const length = Math.hypot(xb - xa, rb - ra);
        const nx = (rb - ra) / length;
        const nr = (xa - xb) / length;
        const face = surfaces[side];
        for (let step = 0; step < steps; step++) {
          const a = start + (end - start) * step / steps;
          const b = start + (end - start) * (step + 1) / steps;
          const v0 = vertex(xa, ra, a, nx, nr, 0, face);
          const v1 = vertex(xb, rb, a, nx, nr, 0, face);
          const v2 = vertex(xb, rb, b, nx, nr, 0, face);
          const v3 = vertex(xa, ra, b, nx, nr, 0, face);
          mesh.push(...v0, ...v1, ...v2, ...v0, ...v2, ...v3);
        }
      }
      for (const theta of [start, end]) {
        const tangent = theta === start ? -1 : 1;
        const capVertex = ([x, r]) => vertex(x, r, theta, 0, 0, tangent, 4);
        for (let i = 1; i < section.length - 1; i++) {
          mesh.push(...capVertex(section[0]), ...capVertex(section[i]), ...capVertex(section[i + 1]));
        }
      }
    }

    for (let ring = 0; ring < 3; ring++) {
      // The narrow crown block closes a ring; adjacent rings have staggered joints.
      let start = (ring % 2 ? -0.63 : 0.08) - keyWidth / 2;
      for (let block = 0; block < 7; block++) {
        const width = block === 0 ? keyWidth : (tau - keyWidth) / 6;
        segment(ring, block, start + 0.005, start + width - 0.005);
        start += width;
      }
    }
    return new Float32Array(mesh);
  }

  const vertexSource = `
    attribute vec3 position, normal, spread, material;
    attribute vec4 coordinates;
    uniform vec3 right, up, eye;
    uniform vec2 scale;
    uniform float separation;
    varying vec3 vNormal, vPoint, vMaterial;
    varying vec4 vCoords;
    void main() {
      vec3 world = position + spread * separation;
      gl_Position = vec4(dot(world, right) * scale.x,
                         (dot(world, up) + 0.02) * scale.y,
                         -dot(world, eye) * 0.035, 1.);
      vPoint = position;
      vNormal = normal;
      vMaterial = material;
      vCoords = coordinates;
    }`;
  const fragmentSource = `
    precision highp float;
    varying vec3 vNormal, vPoint, vMaterial;
    varying vec4 vCoords;
    uniform vec3 eye;
    float hash(vec3 p) {
      p = fract(p * vec3(0.1031, 0.1030, 0.0973));
      p += dot(p, p.yxz + 33.33);
      return fract((p.x + p.y) * p.z);
    }
    float noise3(vec3 p) {
      vec3 cell = floor(p), f = fract(p);
      f = f*f*(3.-2.*f);
      return mix(
        mix(mix(hash(cell), hash(cell+vec3(1,0,0)), f.x),
            mix(hash(cell+vec3(0,1,0)),hash(cell+vec3(1,1,0)), f.x), f.y),
        mix(mix(hash(cell+vec3(0,0,1)),hash(cell+vec3(1,0,1)), f.x),
            mix(hash(cell+vec3(0,1,1)),hash(cell+vec3(1,1,1)), f.x), f.y), f.z);
    }
    void main() {
      vec3 n = normalize(vNormal);
      vec3 key = normalize(vec3(0.48, 0.88, 0.23));
      vec3 fill = normalize(vec3(-0.60, 0.18, 0.78));
      vec3 base = mix(vec3(.69,.68,.63), vec3(.78,.45,.22), vMaterial.y);
      float finish = (noise3(vPoint*5.)-.5)*.10 + (noise3(vPoint*52.)-.5)*.07;
      base *= 1.0 + finish + vMaterial.z*.025;
      float light = .42 + .53*max(dot(n,key),0.) + .21*max(dot(n,fill),0.);
      float face = vMaterial.x;
      if (face == 2.) {
        light *= .79 + .09*abs(vPoint.x);
        // Recessed fixing pockets on the intrados of each segment.
        float pocket = length(vec2((abs(vCoords.x)-vCoords.w*.23)*.80, abs(vCoords.y)-.30));
        light *= mix(.45,1.,smoothstep(.040,.052,pocket));
      }
      if (face == 3.) {
        float gasket = abs(vCoords.z-.77);
        light *= mix(.31,1.,smoothstep(.026,.046,gasket));
        float socket = length(vec2(abs(vCoords.x)-vCoords.w*.26,(vCoords.z-.44)*.27));
        light *= mix(.23,1.,smoothstep(.016,.028,socket));
      }
      if (face == 4.) {
        light *= .82;
        float gasket = abs(vCoords.z-.77);
        light *= mix(.38,1.,smoothstep(.025,.045,gasket));
      }
      if (face == 1. || face == 2.) {
        float distanceToJoint = .5*vCoords.w-abs(vCoords.x);
        light *= .78 + .22*smoothstep(0.,.023,distanceToJoint);
      }
      float glint = pow(max(dot(n,normalize(key+eye)),0.),25.);
      gl_FragColor = vec4(base*light + vec3(.046,.040,.032)*glint,1.);
    }`;

  function createRenderer(gl) {
    const program = gl.createProgram();
    for (const [type, source] of [[gl.VERTEX_SHADER, vertexSource], [gl.FRAGMENT_SHADER, fragmentSource]]) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        gl.deleteProgram(program);
        return null;
      }
      gl.attachShader(program, shader);
      gl.deleteShader(shader);
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      return null;
    }
    gl.useProgram(program);
    const mesh = createLiningMesh();
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, mesh, gl.STATIC_DRAW);
    let offset = 0;
    for (const [name, size] of [["position",3], ["normal",3], ["spread",3], ["coordinates",4], ["material",3]]) {
      const loc = gl.getAttribLocation(program, name);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 16 * 4, offset * 4);
      offset += size;
    }
    const uniforms = Object.fromEntries(["eye","up","right","scale","separation"].map(
      name => [name, gl.getUniformLocation(program, name)]
    ));
    const elevation = 20 * Math.PI / 180;
    const se = Math.sin(elevation);
    const ce = Math.cos(elevation);
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0, 0, 0, 0);
    return function draw() {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(rect.width * ratio));
      const height = Math.max(1, Math.round(rect.height * ratio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      const yaw = (52 + angle.valueAsNumber) * Math.PI / 180;
      const cy = Math.cos(yaw);
      const sy = Math.sin(yaw);
      const separation = gap.valueAsNumber / 100;
      const pixels = Math.min(width / (5.2 + separation * 2), height / (4.58 + separation * 1.45));
      gl.viewport(0, 0, width, height);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.uniform3f(uniforms.eye, sy * ce, se, cy * ce);
      gl.uniform3f(uniforms.right, cy, 0, -sy);
      gl.uniform3f(uniforms.up, -sy * se, ce, -cy * se);
      gl.uniform2f(uniforms.scale, 2 * pixels / width, 2 * pixels / height);
      gl.uniform1f(uniforms.separation, separation);
      gl.drawArrays(gl.TRIANGLES, 0, mesh.length / 16);
    };
  }

  let gl;
  let draw;
  let frame = 0;
  let drag;
  function update() {
    angle.setAttribute("aria-valuetext", angle.value + " degrees");
    gap.setAttribute("aria-valuetext", gap.value + " percent separated");
    if (dialog.open && draw && !frame) {
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (dialog.open && draw) draw();
      });
    }
  }
  function showRenderer() {
    canvas.hidden = !draw;
    poster.hidden = Boolean(draw);
    controls.hidden = !draw;
    dragHint.hidden = !draw;
    staticHint.hidden = Boolean(draw);
    update();
  }

  launcher.hidden = false;
  const posterLink = document.getElementById("lining-poster-link");
  if (posterLink) posterLink.hidden = true;
  launcher.addEventListener("click", () => {
    dialog.showModal();
    if (!gl) {
      try {
        gl = canvas.getContext("webgl", { alpha: true, antialias: true, powerPreference: "low-power" });
        if (gl) draw = createRenderer(gl);
      } catch {
        draw = null;
      }
    }
    showRenderer();
  });
  canvas.addEventListener("webglcontextlost", event => {
    event.preventDefault();
    draw = null;
    showRenderer();
  });
  canvas.addEventListener("webglcontextrestored", () => {
    draw = createRenderer(gl);
    showRenderer();
  });
  dialog.querySelector(".lining-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => {
    drag = null;
    cancelAnimationFrame(frame);
    frame = 0;
    launcher.focus({ preventScroll: true });
  });
  dialog.addEventListener("click", event => {
    if (event.target !== dialog) return;
    const b = dialog.getBoundingClientRect();
    if (event.clientX < b.left || event.clientX > b.right || event.clientY < b.top || event.clientY > b.bottom) dialog.close();
  });
  for (const input of [gap, angle]) input.addEventListener("input", update);
  dialog.querySelector(".lining-reset").addEventListener("click", () => {
    angle.value = angle.defaultValue;
    gap.value = gap.defaultValue;
    update();
  });
  canvas.addEventListener("pointerdown", event => {
    if (!event.isPrimary || event.button !== 0) return;
    drag = { id: event.pointerId, x: event.clientX, angle: angle.valueAsNumber };
    canvas.setPointerCapture(event.pointerId);
    canvas.classList.add("is-dragging");
  });
  canvas.addEventListener("pointermove", event => {
    if (!drag || event.pointerId !== drag.id) return;
    const delta = 270 * (event.clientX - drag.x) / canvas.clientWidth;
    const wrapped = ((drag.angle + delta + 180) % 360 + 360) % 360 - 180;
    angle.value = Math.round(wrapped);
    update();
  });
  canvas.addEventListener("lostpointercapture", () => {
    drag = null;
    canvas.classList.remove("is-dragging");
  });
  if ("ResizeObserver" in window) new ResizeObserver(update).observe(canvas);
  else window.addEventListener("resize", update);
})();
