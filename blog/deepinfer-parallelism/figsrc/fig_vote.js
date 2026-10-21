const W = 1500, H = 720, BG = '#ffffff';
function draw(d) {
  const { C } = d;
  const x0 = 230, cw = 84, y0 = 120, rh = 88;
  // P = prefill, D = decode, E = empty ride-along prompt step
  const plan = [
    'DDDDDDPDDDEDD',
    'DDDDDDPDDDPDD',
    'DDDDDDPDDDEDD',
    'DDDDDDPDDDEDD',
  ];
  for (let j = 0; j < 13; j++) d.text(x0 + j * cw + cw / 2, y0 - 30, String(j + 1), { size: 20, color: '#666' });
  d.text(x0 - 20, y0 - 30, 'step', { size: 20, anchor: 'end', color: '#666' });
  plan.forEach((row, i) => {
    d.text(x0 - 20, y0 + i * rh + rh / 2, 'DP rank ' + i, { size: 24, anchor: 'end' });
    [...row].forEach((c, j) => {
      const fill = c === 'P' ? C.green : c === 'D' ? C.blue : C.grey;
      const x = x0 + j * cw + 6, y = y0 + i * rh + 8;
      d.rect(x, y, cw - 12, rh - 16, { fill, dash: c === 'E' ? [5, 6] : undefined });
      d.text(x + (cw - 12) / 2, y + (rh - 16) / 2, c === 'E' ? '∅' : c, { size: 26 });
    });
  });
  const vote = (j, title, wants, result) => {
    const x = x0 + j * cw + cw / 2;
    d.line(x, y0 + 4 * rh + 8, x, y0 + 4 * rh + 50, { dash: [4, 6] });
    d.box(x - 120, y0 + 4 * rh + 52, 240, 150, null, { fill: C.cream });
    d.text(x, y0 + 4 * rh + 80, title, { size: 22 });
    d.text(x, y0 + 4 * rh + 118, 'wants = ' + wants, { size: 20 });
    d.text(x, y0 + 4 * rh + 162, result, { size: 18 });
  };
  vote(3, 'ALL-point vote', '[1,0,1,1]', 'MIN → 0\nnobody prefills');
  vote(6, 'ALL-point vote', '[1,1,1,1]', 'MIN → 1\neveryone prefills');
  vote(10, 'ANY-point vote', '[0,1,0,0]', 'any → rank 1 prefills,\nothers ride along (∅)');
  // legend
  const ly = 52;
  [[C.blue, 'D  decode step'], [C.green, 'P  prefill step'], [C.grey, '∅  empty prompt step']].forEach(([f, t], k) => {
    const lx = 300 + k * 330;
    d.rect(lx, ly - 30, 30, 26, { fill: f, dash: k === 2 ? [4, 5] : undefined });
    d.text(lx + 44, ly - 17, t, { size: 20, anchor: 'start' });
  });
}
