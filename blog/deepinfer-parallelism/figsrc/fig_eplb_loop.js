const W = 1560, H = 500, BG = '#ffffff';
function draw(d) {
  const { C } = d;
  const bw = 215, gap = 42, y = 90, h = 200;
  const items = [
    [C.yellow, 'MoE dispatch\nkernel counts\ntokens per local\nexpert (free)'],
    [C.orange, 'ring window\n[W steps ×\nlayers × experts]'],
    [C.blue, 'every M steps:\nall-reduce\ncounts over EP'],
    [C.green, 'replicate hot\nexperts into\nredundant slots'],
    [C.green, 'pack replicas\nonto GPUs to\nminimize the\nper-step peak'],
    [C.purple, 'shuffle weights\nNVLink symm_mem,\none layer at\na time'],
  ];
  items.forEach(([f, t], i) => {
    const x = 30 + i * (bw + gap);
    if (i === 1) { d.rect(x + 14, y - 14, bw, h, { fill: '#fff4e6' }); d.rect(x + 7, y - 7, bw, h, { fill: '#ffe8cc' }); }
    d.box(x, y, bw, h, t, { fill: f, size: 20 });
    if (i < items.length - 1) d.arrow(x + bw + 4, y + h / 2, x + bw + gap - 4, y + h / 2);
  });
  d.text(30 + 3.5 * (bw + gap) + bw / 2 - 128, y - 40, 'solved on GPU, all layers at once', { size: 19, color: '#555' });
  const xe = 30 + 5 * (bw + gap) + bw / 2, xs = 30 + bw / 2;
  d.curveArrow([[xe, y + h + 5], [xe - 120, y + h + 140], [(xe + xs) / 2, y + h + 175], [xs + 120, y + h + 140], [xs, y + h + 8]], { sw: 2 });
  d.text((xe + xs) / 2, y + h + 115, 'new logical → physical table, consumed directly by the fused gate kernel', { size: 21 });
}
