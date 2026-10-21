const W = 1600, H = 720, BG = '#D97757';
function draw(d) {
  const svg = document.getElementById('s');
  const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  p.setAttribute('d', 'M330,150 C470,40 820,70 1040,95 C1250,118 1390,170 1360,330 C1335,470 1400,600 1150,640 C900,680 640,650 430,615 C230,580 170,470 205,350 C230,260 230,220 330,150 Z');
  p.setAttribute('fill', '#FAF9F5');
  svg.appendChild(p);
  const rc = rough.svg(svg);
  const o = (s, extra = {}) => ({ stroke: '#141413', strokeWidth: 7, roughness: 1.6, bowing: 1.5, seed: s, ...extra });
  const L = (x1, y1, x2, y2, s, w = 7) => svg.appendChild(rc.line(x1, y1, x2, y2, o(s, { strokeWidth: w })));
  // fulcrum + beam
  svg.appendChild(rc.polygon([[800, 360], [740, 560], [860, 560]], o(3, { fill: '#141413', fillStyle: 'solid' })));
  L(640, 565, 960, 565, 4);
  L(470, 360, 1130, 352, 5, 9);
  // hanging strings + pans
  for (const [cx, s] of [[540, 10], [1060, 20]]) {
    L(cx, 358, cx - 85, 470, s);
    L(cx, 358, cx + 85, 470, s + 1);
    svg.appendChild(rc.arc(cx, 470, 230, 70, 0, Math.PI, false, o(s + 2)));
    // stacked cubes (experts)
    const cube = (x, y, k) => svg.appendChild(rc.rectangle(x, y, 46, 46, o(s + k, { strokeWidth: 5, fill: '#FAF9F5', fillStyle: 'solid' })));
    cube(cx - 75, 424, 3); cube(cx - 23, 424, 4); cube(cx + 29, 424, 5);
    cube(cx - 49, 378, 6); cube(cx + 3, 378, 7);
  }
  // little tokens falling in
  const dot = (x, y, s) => svg.appendChild(rc.circle(x, y, 18, o(s, { strokeWidth: 5, fill: '#141413', fillStyle: 'solid' })));
  dot(520, 200, 31); dot(575, 250, 32); dot(1040, 215, 33); dot(1095, 160, 34); dot(800, 170, 35);
}
