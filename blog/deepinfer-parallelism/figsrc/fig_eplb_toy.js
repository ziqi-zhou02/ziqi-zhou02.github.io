const W = 1540, H = 640, BG = '#ffffff';
function draw(d) {
  const { C } = d;
  const u = 34, base = 450;
  const s1 = C.blue, s2 = C.orange;
  // panel 1: per-expert loads
  d.text(230, 50, 'per-step expert loads', { size: 26 });
  const loads = { A: [4, 0], B: [4, 0], C: [0, 4], D: [0, 4] };
  Object.entries(loads).forEach(([e, [a, b]], i) => {
    const x = 60 + i * 95;
    if (a) d.rect(x, base - a * u, 34, a * u, { fill: s1 });
    if (b) d.rect(x + 38, base - b * u, 34, b * u, { fill: s2 });
    d.text(x + 36, base + 28, e, { size: 26 });
  });
  d.line(40, base, 440, base, { sw: 2 });
  d.line(40, base - 2 * u, 440, base - 2 * u, { dash: [6, 8], color: '#c92a2a' });
  d.text(240, 120, '- - -  average = 2 for every expert', { size: 18, color: '#c92a2a' });
  d.rect(70, 560, 26, 22, { fill: s1 }); d.text(106, 571, 'step 1', { size: 19, anchor: 'start' });
  d.rect(240, 560, 26, 22, { fill: s2 }); d.text(276, 571, 'step 2', { size: 19, anchor: 'start' });
  const layout = (px, title, g0, g1, v1, v2) => {
    d.text(px + 250, 50, title, { size: 26 });
    d.text(px + 250, 88, 'GPU0 = { ' + g0 + ' }    GPU1 = { ' + g1 + ' }', { size: 20, color: '#555' });
    [[v1, 'step 1', s1], [v2, 'step 2', s2]].forEach(([v, lab, f], k) => {
      const x = px + 40 + k * 240;
      v.forEach((val, g) => {
        if (val) d.rect(x + g * 80, base - val * u, 64, val * u, { fill: f });
        d.text(x + g * 80 + 32, base + 26, 'GPU' + g, { size: 18 });
      });
      d.text(x + 72, base + 58, lab, { size: 20, color: '#555' });
    });
    d.line(px + 20, base, px + 500, base, { sw: 2 });
    const cost = Math.max(...v1) + Math.max(...v2);
    d.box(px + 110, 548, 280, 56, 'Σ max = ' + Math.max(...v1) + ' + ' + Math.max(...v2) + ' = ' + cost, { fill: cost > 8 ? C.red : C.green, size: 22 });
  };
  layout(500, 'layout X', 'A, B', 'C, D', [8, 0], [0, 8]);
  layout(1020, 'layout Y', 'A, C', 'B, D', [4, 4], [4, 4]);
}
