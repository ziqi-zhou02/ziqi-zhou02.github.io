const W = 1540, H = 470, BG = '#ffffff';
function draw(d) {
  const { C } = d;
  d.text(40, 50, 'classic EP layer', { size: 26, anchor: 'start' });
  const y1 = 80, y2 = 160, h = 60;
  d.text(200, y1 + h / 2, 'compute', { size: 19, anchor: 'end', color: '#666' });
  d.text(200, y2 + h / 2, 'comm', { size: 19, anchor: 'end', color: '#666' });
  let x = 215;
  const seg = (lane, w, label, fill, dash) => { d.box(x, lane, w, h, label, { fill, size: 19, dash }); x += w + 8; };
  seg(y1, 110, 'gate', C.yellow);
  seg(y2, 200, 'dispatch', C.blue);
  seg(y1, 190, 'GEMM 1', C.green);
  seg(y1, 120, 'SwiGLU', C.green);
  seg(y1, 190, 'GEMM 2', C.green);
  seg(y2, 220, 'combine', C.blue);
  d.text(x + 10, (y1 + y2 + h) / 2, 'separate kernels,\nhand-offs via HBM,\nSMs split comm / compute', { size: 18, anchor: 'start', color: '#555' });
  d.text(40, 290, 'Mega MoE (inside one NVLink domain)', { size: 26, anchor: 'start' });
  d.box(215, 330, 760, 90, 'one fused kernel on a symmetric buffer:\ngate · dispatch · grouped GEMMs · combine · shared expert', { fill: C.purple, size: 20 });
  d.text(1000, 375, '← tiles of tokens stream through;\n    NVLink traffic overlaps with tensor cores', { size: 18, anchor: 'start', color: '#555' });
}
