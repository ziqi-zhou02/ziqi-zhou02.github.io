const W = 1600, H = 720, BG = '#ffffff';
function draw(d) {
  const { C } = d;
  const rc = [C.blue, C.green, C.yellow, C.pink];
  const s = 52, n = 8;
  const panel = (px, owner, title, sub) => {
    d.text(px + 300, 40, title, { size: 28 });
    d.text(px + 300, 78, sub, { size: 19, color: '#555' });
    // sequence strip
    const sy = 120;
    d.text(px - 8, sy + s / 2, 'chunks', { size: 18, anchor: 'end', color: '#666' });
    for (let i = 0; i < n; i++) d.box(px + i * s, sy, s, s, 'r' + owner[i], { fill: rc[owner[i]], size: 18 });
    // causal grid
    const gy = 215;
    d.text(px, gy - 16, 'query chunk ↓', { size: 18, anchor: 'start', color: '#666' });
    d.text(px + 4 * s, gy + n * s + 24, 'key chunk  →', { size: 18, color: '#666' });
    d.rect(px, gy, n * s, n * s, { sw: 1.5, rough: 0.6 });
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < i; j++) d.rect(px + j * s + 3, gy + i * s + 3, s - 6, s - 6, { fill: rc[owner[i]], sw: 1, rough: 0.6 });
      d.poly([[px + i * s + 3, gy + i * s + 3], [px + i * s + 3, gy + (i + 1) * s - 3], [px + (i + 1) * s - 3, gy + (i + 1) * s - 3]], { fill: rc[owner[i]], sw: 1, rough: 0.6 });
    }
    // per-rank work bars
    const work = [0, 0, 0, 0];
    owner.forEach((r, i) => (work[r] += i + 0.5));
    const bx = px + n * s + 50, by = gy + 30, unit = 13;
    d.text(bx, gy - 16, 'attention work / rank', { size: 18, anchor: 'start', color: '#666' });
    work.forEach((w, r) => {
      d.rect(bx, by + r * 90, w * unit, 50, { fill: rc[r] });
      d.text(bx + w * unit + 10, by + r * 90 + 25, 'r' + r + ': ' + w, { size: 20, anchor: 'start' });
    });
    const mx = Math.max(...work), mean = work.reduce((a, b) => a + b) / 4;
    d.text(bx + 80, by + 4 * 90 + 40, 'max / mean = ' + (mx / mean).toFixed(2), { size: 22 });
  };
  panel(110, [0, 0, 1, 1, 2, 2, 3, 3], 'naive split', 'rank r gets one contiguous quarter');
  panel(900, [0, 1, 2, 3, 3, 2, 1, 0], 'mirror ("balanced") split', 'rank r gets chunk r and chunk 2·CP−1−r');
}
