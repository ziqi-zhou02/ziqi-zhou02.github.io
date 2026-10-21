// Tiny Excalidraw-ish drawing helpers on top of rough.js (runs in the browser page).
const C = {
  ink: '#1e1e1e',
  blue: '#a5d8ff', lblue: '#e7f5ff', green: '#b2f2bb', yellow: '#ffec99',
  orange: '#ffd8a8', red: '#ffc9c9', grey: '#e9ecef', purple: '#d0bfff',
  cream: '#fbf8ec', teal: '#96f2d7', pink: '#fcc2d7',
};

function mk(svg, rc, seed0 = 1) {
  let seed = seed0;
  const nextSeed = () => (seed = (seed * 9301 + 49297) % 233280) || 7;
  const base = (o = {}) => ({
    roughness: 1, bowing: 1, stroke: C.ink, strokeWidth: 2,
    fillStyle: 'solid', seed: nextSeed(), ...o,
  });
  const add = (n) => (svg.appendChild(n), n);

  const api = {
    C,
    rect(x, y, w, h, o = {}) {
      const { fill = 'none', dash, sw = 2, rough = 1 } = o;
      const opts = base({ fill: fill === 'none' ? undefined : fill, strokeWidth: sw, roughness: rough });
      if (dash) opts.strokeLineDash = dash;
      return add(rc.rectangle(x, y, w, h, opts));
    },
    line(x1, y1, x2, y2, o = {}) {
      const opts = base({ strokeWidth: o.sw || 2, stroke: o.color || C.ink, roughness: o.rough ?? 1 });
      if (o.dash) opts.strokeLineDash = o.dash;
      return add(rc.line(x1, y1, x2, y2, opts));
    },
    poly(pts, o = {}) {
      return add(rc.polygon(pts, base({ fill: o.fill, strokeWidth: o.sw || 2, roughness: o.rough ?? 1, stroke: o.stroke || C.ink })));
    },
    ellipse(cx, cy, w, h, o = {}) {
      return add(rc.ellipse(cx, cy, w, h, base({ fill: o.fill, strokeWidth: o.sw || 2 })));
    },
    arrow(x1, y1, x2, y2, o = {}) {
      const { sw = 2, both = false, head = 13, color = C.ink, dash } = o;
      api.line(x1, y1, x2, y2, { sw, color, dash });
      const hd = (ax, ay, bx, by) => {
        const a = Math.atan2(by - ay, bx - ax);
        for (const s of [-1, 1]) {
          const t = a + Math.PI + s * 0.45;
          api.line(bx, by, bx + head * Math.cos(t), by + head * Math.sin(t), { sw, color });
        }
      };
      hd(x1, y1, x2, y2);
      if (both) hd(x2, y2, x1, y1);
    },
    curveArrow(pts, o = {}) {
      const { sw = 2, head = 13 } = o;
      add(rc.curve(pts, base({ strokeWidth: sw })));
      const [ax, ay] = pts[pts.length - 2], [bx, by] = pts[pts.length - 1];
      const a = Math.atan2(by - ay, bx - ax);
      for (const s of [-1, 1]) {
        const t = a + Math.PI + s * 0.45;
        api.line(bx, by, bx + head * Math.cos(t), by + head * Math.sin(t), { sw });
      }
    },
    text(x, y, str, o = {}) {
      const { size = 22, anchor = 'middle', color = C.ink, weight = 400, font = 'Virgil', italic = false } = o;
      const lines = String(str).split('\n');
      const lh = size * 1.25;
      const y0 = y - ((lines.length - 1) * lh) / 2;
      lines.forEach((ln, i) => {
        const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        t.setAttribute('x', x);
        t.setAttribute('y', y0 + i * lh);
        t.setAttribute('text-anchor', anchor);
        t.setAttribute('dominant-baseline', 'central');
        t.setAttribute('font-family', font === 'mono' ? 'Geist Mono, monospace' : 'Virgil');
        t.setAttribute('font-size', size);
        t.setAttribute('font-weight', weight);
        if (italic) t.setAttribute('font-style', 'italic');
        t.setAttribute('fill', color);
        t.textContent = ln;
        add(t);
      });
    },
    box(x, y, w, h, label, o = {}) {
      api.rect(x, y, w, h, o);
      if (label != null) api.text(x + w / 2, y + h / 2, label, { size: o.size || 22, color: o.tcolor });
    },
    dots(x, y, n = 3, gap = 18, r = 7) {
      for (let i = 0; i < n; i++) api.ellipse(x + i * gap, y, r, r, { fill: C.ink, sw: 1 });
    },
  };
  return api;
}
