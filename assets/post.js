// Article pages: theme toggle, contents scroll-spy, sticky chapter bar, pixel sky.
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- theme ---------- */
  const tbtn = $('#theme');
  if (tbtn) tbtn.addEventListener('click', () => {
    const cur = document.documentElement.dataset.theme ||
      (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('min-theme', next); } catch (e) {}
  });

  /* ---------- scroll-spy + chapter bar ---------- */
  const links = [...document.querySelectorAll('.ptoc a')];
  const heads = links.map(a => document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);
  const chap = $('#chap'), chN = $('#chap-n'), chT = $('#chap-t'), bar = $('#chap .bar'), headEnd = $('.pgrid');
  let last = -1;
  function spy() {
    const y = scrollY + 90;
    let i = -1;
    heads.forEach((h, k) => { if (h.getBoundingClientRect().top + scrollY <= y) i = k; });
    if (i !== last) {
      links.forEach((a, k) => a.classList.toggle('on', k === i));
      if (i >= 0) {
        chN.textContent = links[i].querySelector('.n').textContent;
        chT.textContent = links[i].querySelector('.t').textContent;
      }
      last = i;
    }
    chap.classList.toggle('on', headEnd.getBoundingClientRect().top < 0 && i >= 0);
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (max > 0 ? scrollY / max * 100 : 0) + '%';
  }
  if (chap && heads.length) { addEventListener('scroll', spy, { passive: true }); addEventListener('resize', spy); spy(); }

  /* ---------- pixel sky + click bursts (same as the home page) ---------- */
  const sky = $('#sky'); if (!sky) return;
  const g = sky.getContext('2d');
  let W, H, stars = [], bursts = [];
  function size() {
    const dpr = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight;
    sky.width = W * dpr; sky.height = H * dpr; sky.style.width = W + 'px'; sky.style.height = H + 'px';
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    stars = Array.from({ length: Math.round(W * H / 30000) }, () => ({ x: Math.random() * W | 0, y: Math.random() * H | 0, s: Math.random() < .2 ? 3 : 2, p: Math.random() * 6.28, v: .3 + Math.random() * .7 }));
  }
  size(); addEventListener('resize', size);
  addEventListener('pointerdown', e => {
    if (e.target.closest('a, button, svg, summary, table, pre')) return;
    bursts.push({ x: e.clientX, y: e.clientY, t: 0 });
  });
  function frame(ts) {
    g.clearRect(0, 0, W, H);
    const rgb = css('--dot');
    for (const s of stars) {
      const a = reduce ? .18 : .08 + .16 * (0.5 + 0.5 * Math.sin(ts / 1000 * s.v + s.p));
      g.fillStyle = `rgba(${rgb},${a})`; g.fillRect(s.x, s.y, s.s, s.s);
    }
    bursts = bursts.filter(b => b.t < 1);
    for (const b of bursts) {
      b.t += .022; const R = 8 + (1 - Math.pow(1 - b.t, 3)) * 54;
      g.fillStyle = `rgba(${rgb},${1 - b.t})`;
      for (let k = 0; k < 18; k++) {
        const a = k / 18 * 6.283, s = k % 3 ? 3 : 4;
        g.fillRect(Math.round((b.x + Math.cos(a) * R) / 3) * 3, Math.round((b.y + Math.sin(a) * R) / 3) * 3, s, s);
      }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
