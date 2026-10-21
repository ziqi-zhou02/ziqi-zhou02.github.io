const W = 1520, H = 970, BG = '#ffffff';
function draw(d) {
  const { C } = d;
  const cols = [60, 400, 740, 1160];
  const cw = 300;
  const names = ['GPU 0', 'GPU 1', 'GPU 2', 'GPU 63'];
  const reqs = ['req a, b, c', 'req d, e', 'req f, g, h', 'req x, y'];
  const ex = [['e0', 'e1', 'e2'], ['e3', 'e4', 'e5'], ['e6', 'e7', 'e8'], ['…', '…', '…']];
  const rep = ['e7′', 'e0′', 'e2′', 'e4′'];
  cols.forEach((x, i) => {
    d.rect(x, 40, cw, 860, { fill: C.lblue });
    d.text(x + 18, 78, names[i], { size: 30, anchor: 'start' });
    d.box(x + 25, 110, cw - 50, 90, 'Attention\n(full weights, no TP)', { fill: C.yellow, size: 22 });
    d.box(x + 25, 215, cw - 50, 64, 'own ' + reqs[i] + '\n+ their KV cache', { fill: C.orange, size: 19 });
    d.box(x + 70, 300, cw - 140, 50, 'router top-k', { fill: C.grey, size: 20 });
    d.arrow(x + cw / 2, 350, x + cw / 2, 405);
    // experts
    ex[i].forEach((e, k) => d.box(x + 20 + k * 68, 520, 58, 70, e, { fill: C.green, size: 20 }));
    d.box(x + 20 + 3 * 68, 520, 58, 70, rep[i], { fill: C.purple, size: 20, dash: [6, 6] });
    d.arrow(x + cw / 2, 460, x + cw / 2, 515);
    d.arrow(x + cw / 2, 595, x + cw / 2, 650);
    d.arrow(x + cw / 2, 712, x + cw / 2, 770);
    d.box(x + 40, 775, cw - 80, 80, 'back to own tokens\n→ next layer', { fill: C.grey, size: 20 });
  });
  d.dots(1078, 470, 3, 22, 9);
  // bands drawn on top
  d.box(40, 405, 1440, 56, 'dispatch: all-to-all over NVLink (DeepEP / Mega MoE)', { fill: C.blue, size: 24 });
  d.box(40, 652, 1440, 60, 'combine: all-to-all back to the owner rank (+ shared expert)', { fill: C.blue, size: 24 });
  d.rect(1010, 922, 34, 30, { fill: C.purple, dash: [5, 5] });
  d.text(1054, 937, '= redundant replica of a hot expert (EPLB)', { size: 18, anchor: 'start', color: '#444' });
}
