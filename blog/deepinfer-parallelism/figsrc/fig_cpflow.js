const W = 1540, H = 620, BG = '#ffffff';
function draw(d) {
  const { C } = d;
  const row = (y, rank, chunks) => {
    d.rect(30, y, 1480, 210, { fill: C.lblue });
    d.text(50, y + 30, 'CP rank ' + rank, { size: 26, anchor: 'start' });
    d.box(50, y + 60, 190, 120, 'local tokens\n' + chunks, { fill: C.orange, size: 20 });
    d.arrow(240, y + 95, 300, y + 80);
    d.arrow(240, y + 145, 300, y + 160);
    d.box(300, y + 50, 220, 60, 'Q projection', { fill: C.yellow, size: 20 });
    d.box(300, y + 130, 220, 60, 'KV projection\n(pre-compression)', { fill: C.yellow, size: 18 });
    d.arrow(520, y + 160, 580, y + 160);
    d.box(880, y + 125, 260, 70, 'reorder (reverse idx)\n→ full-seq KV, compress', { fill: C.green, size: 18 });
    d.arrow(520, y + 80, 1180, y + 80);
    d.arrow(1140, y + 160, 1180, y + 125);
    d.box(1180, y + 55, 150, 110, 'attention\nlocal Q ×\nfull KV', { fill: C.yellow, size: 19 });
    d.arrow(1330, y + 110, 1370, y + 110);
    d.box(1370, y + 70, 120, 80, 'MoE\nvia EP', { fill: C.green, size: 20 });
  };
  row(20, 0, 'chunks 0, 3');
  row(390, 1, 'chunks 1, 2');
  // all-gather band, vertical
  d.box(580, 120, 270, 450, null, { fill: C.blue });
  d.text(715, 345, 'all-gather KV\n(DeepEP BucketBuffer)\n\nlaunched async;\noverlaps with\nQ projection', { size: 20 });
  d.arrow(850, 180, 880, 180);
  d.arrow(850, 550, 880, 550);
}
