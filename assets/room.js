(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const stage = $('#stage'), tv = $('#tv'), win = $('#win'), tip = $('#tip'), screenEl = $('#screen');

  // Projected geometry exported from the Blender scene (assets/room/layout.js).
  const L = window.ROOM_LAYOUT;
  const [SW, SH] = L.size;
  stage.style.width = `${SW}px`; stage.style.height = `${SH}px`;
  const state = { ch: null, zoom: false, lamp: true, sound: false };

  /* ---------------- data: books on the desk (edit me) ---------------- */
  const BOOKS = [
    { id: 'tokenomy', kind: 'Essay', title: 'Following a Dollar Through the Tokenomy', meta: 'Essay · 15 min read',
      text: 'How neoclouds and token sellers make money, who keeps what along the value chain, and how the money circles back.',
      href: 'posts/tokenomy.html', cta: 'Read essay' },
    { id: 'owner', kind: 'Essay', title: 'One Owner, Many Agents', meta: 'Essay · 9 min read',
      text: 'Notes on the future of organizations, and why context flows better when one person working with agents owns the loop.',
      href: 'posts/one-owner-many-agents.html', cta: 'Read essay' },
    { id: 'alpha', kind: 'Project', title: 'Project Alpha', meta: 'Project · Python · PyTorch',
      text: 'A one-line pitch of what this project does and why it is interesting.', href: 'https://github.com/ziqi-zhou02', cta: 'View source' },
    { id: 'beta', kind: 'Project', title: 'Project Beta', meta: 'Project · React · Node',
      text: 'A full-stack web app. Describe the problem, your approach and the result.', href: 'https://github.com/ziqi-zhou02', cta: 'View source' },
    { id: 'gamma', kind: 'Project', title: 'Project Gamma', meta: 'Project · Rust · CLI',
      text: 'A CLI tool, research experiment or hackathon build. Keep it short.', href: 'https://github.com/ziqi-zhou02', cta: 'View source' },
    { id: 'delta', kind: 'Project', title: 'Project Delta', meta: 'Project · D3 · SQL',
      text: 'A data visualization or analysis project with a link to a live demo.', href: 'https://github.com/ziqi-zhou02', cta: 'View source' },
  ];
  const CH_NAMES = ['Home', 'About', 'Projects', 'Writing', 'Contact'];
  const HASH = { about: 1, projects: 2, writing: 3, contact: 4 };

  /* ---------------- map the live screen onto the rendered display ---------------- */
  // Standard 2D projective mapping: find the 3×3 homography that takes the four
  // corners of a 1280×720 box onto the four projected screen corners.
  const adj = m => [m[4] * m[8] - m[5] * m[7], m[2] * m[7] - m[1] * m[8], m[1] * m[5] - m[2] * m[4],
    m[5] * m[6] - m[3] * m[8], m[0] * m[8] - m[2] * m[6], m[2] * m[3] - m[0] * m[5],
    m[3] * m[7] - m[4] * m[6], m[1] * m[6] - m[0] * m[7], m[0] * m[4] - m[1] * m[3]];
  const mulMM = (a, b) => { const c = []; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) { let s = 0; for (let k = 0; k < 3; k++) s += a[3 * i + k] * b[3 * k + j]; c[3 * i + j] = s; } return c; };
  const mulMV = (m, v) => [m[0] * v[0] + m[1] * v[1] + m[2] * v[2], m[3] * v[0] + m[4] * v[1] + m[5] * v[2], m[6] * v[0] + m[7] * v[1] + m[8] * v[2]];
  const basis = p => { const m = [p[0][0], p[1][0], p[2][0], p[0][1], p[1][1], p[2][1], 1, 1, 1]; const v = mulMV(adj(m), [p[3][0], p[3][1], 1]); return mulMM(m, [v[0], 0, 0, 0, v[1], 0, 0, 0, v[2]]); };
  const homography = (src, dst) => { const t = mulMM(basis(dst), adj(basis(src))); for (let i = 0; i < 9; i++) t[i] /= t[8]; return t; };
  {
    const PW = 1280, PH = 720;
    const t = homography([[0, 0], [PW, 0], [PW, PH], [0, PH]], L.screen);
    screenEl.style.transform = `matrix3d(${[t[0], t[3], 0, t[6], t[1], t[4], 0, t[7], 0, 0, 1, 0, t[2], t[5], 0, t[8]].join(',')})`;
  }
  const xs = L.screen.map(p => p[0]), ys = L.screen.map(p => p[1]);
  const SCREEN = { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) };
  const FOCUS = { x: SCREEN.x + SCREEN.w / 2, y: SCREEN.y + SCREEN.h * 0.7 };

  /* ---------------- hotspots from the render ---------------- */
  const hot = $('#hotspots');
  const zone = (rect, attrs, pad = 8) => {
    const [x0, y0, x1, y1] = rect, d = document.createElement('div');
    d.className = 'hz'; d.tabIndex = 0;
    Object.assign(d.style, { left: `${x0 - pad}px`, top: `${y0 - pad}px`, width: `${x1 - x0 + 2 * pad}px`, height: `${y1 - y0 + 2 * pad}px` });
    for (const k in attrs) d.dataset[k] = attrs[k];
    hot.appendChild(d); return d;
  };
  const H = L.hot;
  zone(H.lamp, { action: 'lamp', label: 'Lamp · toggle (L)' });
  zone(H.plant, { action: 'plant', label: 'Plant' });
  zone(H.mug, { action: 'mug', label: 'Coffee · still warm' });
  zone(H.keyboard, { action: 'term', label: 'Keyboard · terminal (T)' }, 4);
  zone(H.trackpad, { action: 'next', label: 'Trackpad · next section' }, 4);
  zone(H.phone, { action: 'ch:4', label: 'Phone · contact' }, 4);
  zone(H.speaker, { action: 'sound', label: 'Speaker · rain and music (M)' });
  zone(H.frame, { action: 'ch:1', label: 'Photo · about me' });
  H.books.slice(0, BOOKS.length).forEach((r, i) => {
    const z = zone(r, { book: BOOKS[i].id, label: `${BOOKS[i].kind} · ${BOOKS[i].title}` }, 1);
    z.classList.add('book');
  });
  {
    const [mx0, my0, mx1] = H.mug, steam = $('#steam'), w = (mx1 - mx0) * 0.9;
    Object.assign(steam.style, { left: `${(mx0 + mx1) / 2 - w / 2 - (mx1 - mx0) * 0.12}px`, top: `${my0 - w * 2}px`, width: `${w}px`, height: `${w * 2}px` });
    const [sx0, sy0, sx1] = H.speaker, g = $('#speakerGlow'), sw = (sx1 - sx0) * 0.75;
    Object.assign(g.style, { left: `${(sx0 + sx1) / 2 - sw / 2}px`, top: `${sy0 - sw * 0.28}px`, width: `${sw}px`, height: `${sw * 0.55}px` });
  }

  /* ---------------- layout: cover + zoom + gentle parallax ---------------- */
  const parallaxOn = !reduceMotion && matchMedia('(hover: hover) and (pointer: fine)').matches;
  const par = { x: 0, y: 0, tx: 0, ty: 0 };
  let zoomAnimUntil = 0;
  const layout = (animate = true) => {
    const vw = innerWidth, vh = innerHeight;
    let s, tx, ty;
    if (state.zoom) {
      const availH = vh - 150;
      s = Math.min((vw * (vw < 700 ? 0.98 : 0.84)) / SCREEN.w, (availH * 0.94) / SCREEN.h);
      tx = vw / 2 - s * (SCREEN.x + SCREEN.w / 2);
      ty = 76 + availH / 2 - s * (SCREEN.y + SCREEN.h / 2);
    } else {
      s = Math.max(vw / SW, vh / SH) * (parallaxOn ? 1.04 : 1);
      tx = Math.min(0, Math.max(vw - SW * s, vw / 2 - s * FOCUS.x));
      ty = Math.min(0, Math.max(vh - SH * s, vh / 2 - s * FOCUS.y));
      const mx = Math.min(-tx, SW * s - vw + tx), my = Math.min(-ty, SH * s - vh + ty);
      tx += Math.max(-mx, Math.min(mx, -par.x * 16));
      ty += Math.max(-my, Math.min(my, -par.y * 9));
    }
    stage.classList.toggle('no-anim', !animate);
    stage.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`;
  };
  addEventListener('resize', () => layout(false));
  const setZoom = on => { state.zoom = on; zoomAnimUntil = performance.now() + 950; layout(true); };
  if (parallaxOn) {
    addEventListener('pointermove', e => { par.tx = e.clientX / innerWidth * 2 - 1; par.ty = e.clientY / innerHeight * 2 - 1; });
    const loop = () => {
      const dx = par.tx - par.x, dy = par.ty - par.y;
      if (Math.abs(dx) + Math.abs(dy) > 0.001) {
        par.x += dx * 0.05; par.y += dy * 0.05;
        if (!state.zoom && performance.now() > zoomAnimUntil) layout(false);
      }
      requestAnimationFrame(loop);
    };
    loop();
  }

  /* ---------------- the screen ---------------- */
  const show = (html, title, { term = false, wide = false } = {}) => {
    tv.innerHTML = html; tv.scrollTop = 0;
    win.classList.toggle('wide', wide);
    const today = tv.querySelector('[data-today]');
    if (today) today.textContent = new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    $('#winTitle').textContent = title;
    $('#mbApp').textContent = title;
    win.classList.toggle('term-mode', term);
    win.classList.remove('swap'); void win.offsetWidth; win.classList.add('swap');
  };
  const markNav = n => {
    $$('.hud-top nav a').forEach(a => a.classList.toggle('on', +a.dataset.ch === n));
    $$('.dock button').forEach(b => b.classList.toggle('on', n === 'term' ? b.hasAttribute('data-term') : +b.dataset.ch === n));
  };
  const setChannel = (n, { zoom = true } = {}) => {
    state.ch = n;
    show($(`#ch-${n}`).innerHTML, n === 0 ? 'The Ziqi Digest' : CH_NAMES[n], { wide: n === 0 });
    markNav(n);
    $$('.hz.book').forEach(t => t.classList.remove('active'));
    const name = Object.keys(HASH).find(k => HASH[k] === n);
    try { history.replaceState(null, '', name ? `#${name}` : location.pathname); } catch (e) {}
    if (zoom !== state.zoom) setZoom(zoom);
  };
  const playBook = id => {
    const b = BOOKS.find(x => x.id === id);
    if (!b) return;
    $$('.hz.book').forEach(g => g.classList.toggle('active', g.dataset.book === id));
    const ext = b.href.startsWith('http') ? ' target="_blank" rel="noopener"' : '';
    show(`<p class="meta">${b.meta}</p><h2>${b.title}</h2><p>${b.text}</p><a class="btn" href="${b.href}"${ext}>${b.cta} →</a>`, b.kind);
    markNav(b.kind === 'Essay' ? 3 : 2);
    if (!state.zoom) setZoom(true);
  };

  /* ---------------- room objects ---------------- */
  let tipTimer;
  const say = (text, x, y, ms = 1600) => {
    tip.textContent = text; tip.style.left = `${x}px`; tip.style.top = `${y}px`; tip.classList.add('show');
    clearTimeout(tipTimer); if (ms) tipTimer = setTimeout(() => tip.classList.remove('show'), ms);
  };
  const setLamp = on => {
    state.lamp = on; document.body.classList.toggle('lamp-off', !on);
    if (!on && !$('#photoOff').getAttribute('src')) loadOff();
  };

  /* sound: filtered-noise rain plus a slow ambient chord loop, all generated */
  let audio = null;
  const startAudio = () => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
    master.gain.linearRampToValueAtTime(0.9, ctx.currentTime + 1.5);
    const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate), d = buf.getChannelData(0);
    let last = 0; for (let i = 0; i < d.length; i++) { const w = Math.random() * 2 - 1; last = (last + 0.04 * w) / 1.04; d[i] = last * 3 + w * 0.04; }
    const noise = ctx.createBufferSource(); noise.buffer = buf; noise.loop = true;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1600;
    const rg = ctx.createGain(); rg.gain.value = 0.2;
    noise.connect(lp).connect(rg).connect(master); noise.start();
    const pad = ctx.createBiquadFilter(); pad.type = 'lowpass'; pad.frequency.value = 1100; pad.connect(master);
    const chords = [[261.6, 329.6, 392, 493.9], [220, 261.6, 329.6, 392], [174.6, 220, 261.6, 329.6], [196, 246.9, 293.7, 349.2]];
    let step = 0;
    const play = () => {
      const t0 = ctx.currentTime;
      chords[step++ % chords.length].forEach((f, i) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine'; o.frequency.value = f; o.detune.value = (i - 1.5) * 5;
        g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(0.035, t0 + 0.9); g.gain.linearRampToValueAtTime(0, t0 + 3.8);
        o.connect(g).connect(pad); o.start(t0); o.stop(t0 + 4);
      });
    };
    play(); const timer = setInterval(play, 3400);
    return { ctx, master, timer };
  };
  const setSound = on => {
    state.sound = on;
    $('#soundBtn').textContent = on ? 'Sound on' : 'Sound off';
    $('#speakerGlow').classList.toggle('playing', on);
    if (on && !audio) { try { audio = startAudio(); } catch (e) { state.sound = false; } }
    else if (!on && audio) {
      const a = audio; audio = null;
      a.master.gain.linearRampToValueAtTime(0, a.ctx.currentTime + 0.6);
      setTimeout(() => { clearInterval(a.timer); a.ctx.close(); }, 700);
    }
  };

  /* ---------------- terminal ---------------- */
  let rainOn = true;
  const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  let termLog = [];
  const termPrint = line => { termLog.push(line); const out = $('#termOut'); if (out) { out.insertAdjacentHTML('beforeend', `<div>${line}</div>`); tv.scrollTop = tv.scrollHeight; } };
  const TERM = {
    help: () => esc('commands: ls, cat about.txt, open <name>, lamp, rain, sound, time, whoami, clear, exit'),
    ls: () => 'about.txt  contact.txt\n' + BOOKS.map(t => t.id).join('  '),
    'cat about.txt': () => esc($('#ch-1').content.textContent.replace(/\s+/g, ' ').trim().replace(/^About /, '')),
    'cat contact.txt': () => 'github.com/ziqi-zhou02',
    whoami: () => "a guest in ziqi's room",
    time: () => new Date().toLocaleString(),
    lamp: () => { setLamp(!state.lamp); return state.lamp ? 'lamp on' : 'lamp off'; },
    rain: () => { rainOn = !rainOn; return rainOn ? 'rain on' : 'rain stopped'; },
    sound: () => { setSound(!state.sound); return state.sound ? 'sound on' : 'sound off'; },
    sudo: () => 'nice try',
    clear: () => { termLog = []; const out = $('#termOut'); if (out) out.innerHTML = ''; return null; },
    exit: () => { setChannel(0); return null; },
  };
  const runCmd = raw => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;
    termPrint(`<span class="pr">guest@room ~ %</span>${esc(raw)}`);
    if (cmd.startsWith('open ')) {
      const t = BOOKS.find(x => x.id === cmd.slice(5).trim());
      if (t) { setTimeout(() => playBook(t.id), 250); termPrint('opening…'); } else termPrint('no such item. try ls');
      return;
    }
    const f = TERM[cmd] || TERM[cmd.split(' ')[0]];
    const out = f ? f() : `zsh: command not found: ${esc(cmd.split(' ')[0])}`;
    if (out) out.split('\n').forEach(l => termPrint(l));
  };
  const openTerminal = () => {
    state.ch = 5; markNav('term');
    show(`<div class="term"><div id="termOut"></div><form id="termForm" autocomplete="off"><span class="pr">guest@room ~ %</span><input id="termIn" spellcheck="false" aria-label="terminal input"></form></div>`, 'Terminal', { term: true });
    if (!termLog.length) termPrint('Last login: today on ttys001 · type <b>help</b>');
    else $('#termOut').innerHTML = termLog.map(l => `<div>${l}</div>`).join('');
    $('#termForm').addEventListener('submit', e => { e.preventDefault(); const i = $('#termIn'); runCmd(i.value); i.value = ''; });
    setTimeout(() => $('#termIn') && $('#termIn').focus({ preventScroll: true }), 60);
    if (!state.zoom) setZoom(true);
  };

  const act = (action, ev) => {
    const x = ev && ev.clientX ? ev.clientX : innerWidth / 2, y = ev && ev.clientY ? ev.clientY : innerHeight / 2;
    if (action.startsWith('ch:')) setChannel(+action.slice(3));
    else if (action === 'lamp') { setLamp(!state.lamp); say(state.lamp ? 'Light on' : 'Light off', x, y); }
    else if (action === 'plant') say('Watered', x, y);
    else if (action === 'mug') { const s = $('#steam'); s.classList.add('puff'); setTimeout(() => s.classList.remove('puff'), 1400); say('Still warm', x, y); }
    else if (action === 'term') openTerminal();
    else if (action === 'next') setChannel(state.ch >= 1 && state.ch < 4 ? state.ch + 1 : 1);
    else if (action === 'zoom') { if (state.ch === null) setChannel(0); else setZoom(!state.zoom); }
    else if (action === 'sound') { setSound(!state.sound); say(state.sound ? 'Rain and ambient chords, generated live' : 'Quiet', x, y); }
  };

  /* ---------------- events ---------------- */
  document.addEventListener('click', e => {
    if (!e.target.closest('#credits, #creditsBtn')) $('#credits').hidden = true;
    const ch = e.target.closest('[data-ch]');
    if (ch) { e.preventDefault(); setChannel(+ch.dataset.ch); return; }
    if (e.target.closest('[data-term]')) { openTerminal(); return; }
    const book = e.target.closest('[data-book]');
    if (book) { playBook(book.dataset.book); return; }
    const z = e.target.closest('.hz');
    if (z) { act(z.dataset.action, e); return; }
    if (state.zoom && !e.target.closest('.screen, .hud-top, .hud-bottom, .credits')) setZoom(false);
  });
  document.addEventListener('keydown', e => {
    if (e.target.id === 'termIn') { if (e.key === 'Escape') { e.target.blur(); setZoom(false); } return; }
    const z = e.target.closest && e.target.closest('.hz');
    if (z && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); z.dataset.book ? playBook(z.dataset.book) : act(z.dataset.action); return; }
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key.toLowerCase();
    if (/^[0-4]$/.test(k)) setChannel(+k);
    else if (k === 'z') act('zoom');
    else if (k === 'l') act('lamp');
    else if (k === 'm') act('sound');
    else if (k === 't') openTerminal();
    else if (k === 'r') rainOn = !rainOn;
    else if (k === 'escape' && state.zoom) setZoom(false);
  });
  $('#soundBtn').addEventListener('click', () => setSound(!state.sound));
  $('#creditsBtn').addEventListener('click', e => { e.stopPropagation(); const c = $('#credits'); c.hidden = !c.hidden; });
  document.addEventListener('pointerover', e => { const h = e.target.closest('.hz'); if (h) say(h.dataset.label, e.clientX, e.clientY, 0); });
  document.addEventListener('pointermove', e => { if (e.target.closest('.hz')) { tip.style.left = `${e.clientX}px`; tip.style.top = `${e.clientY}px`; } });
  document.addEventListener('pointerout', e => {
    if (e.target.closest('.hz') && !(e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('.hz'))) tip.classList.remove('show');
  });
  addEventListener('hashchange', () => { const n = HASH[location.hash.slice(1)]; if (n && n !== state.ch) setChannel(n); });

  /* ---------------- rain on the glass (masked to visible glass in CSS) ---------------- */
  const rain = $('#rain'), rctx = rain.getContext('2d');
  const RS = 0.5, RW = Math.round(SW * RS), RH = Math.round(SH * RS);
  rain.width = RW; rain.height = RH;
  const wx = L.window.map(p => p[0] * RS), wy = L.window.map(p => p[1] * RS);
  const box = { x0: Math.min(...wx), x1: Math.max(...wx), y0: Math.min(...wy), y1: Math.max(...wy) };
  const bw = box.x1 - box.x0, bh = box.y1 - box.y0;
  const drops = Array.from({ length: 220 }, () => ({ x: box.x0 + Math.random() * (bw + 40), y: box.y0 + Math.random() * bh, l: 6 + Math.random() * 12, v: 5 + Math.random() * 6 }));
  const beads = Array.from({ length: 90 }, () => ({ x: box.x0 + Math.random() * bw, y: box.y0 + Math.random() * bh, r: 0.6 + Math.random() * 1.6, v: 0 }));
  const drawRain = () => {
    rctx.clearRect(0, 0, RW, RH);
    if (rainOn) {
      rctx.strokeStyle = 'rgba(225, 225, 255, .2)'; rctx.lineWidth = 0.8;
      rctx.beginPath();
      for (const d of drops) {
        rctx.moveTo(d.x, d.y); rctx.lineTo(d.x - d.l * 0.12, d.y + d.l);
        if (!reduceMotion) { d.y += d.v; d.x -= d.v * 0.12; if (d.y > box.y1) { d.y = box.y0 - 10; d.x = box.x0 + Math.random() * (bw + 40); } }
      }
      rctx.stroke();
      for (const b of beads) {
        const g = rctx.createRadialGradient(b.x - b.r * .3, b.y - b.r * .3, 0, b.x, b.y, b.r);
        g.addColorStop(0, 'rgba(255,255,255,.55)'); g.addColorStop(1, 'rgba(200,200,255,.05)');
        rctx.fillStyle = g; rctx.beginPath(); rctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); rctx.fill();
        if (!reduceMotion) {
          if (b.v === 0 && Math.random() < 0.0015) b.v = 0.3 + Math.random() * 0.9;
          b.y += b.v; if (b.v) b.v *= 0.996;
          if (b.y > box.y1) { b.y = box.y0 + Math.random() * bh * 0.4; b.v = 0; }
        }
      }
    }
    if (!reduceMotion) requestAnimationFrame(drawRain);
  };
  drawRain();

  /* ---------------- menu bar clock ---------------- */
  const clock = $('#mbClock');
  const tick = () => { clock.textContent = new Date().toLocaleString([], { weekday: 'short', hour: 'numeric', minute: '2-digit' }); };
  tick(); setInterval(tick, 15000);

  /* ---------------- boot: wait for the render to load ---------------- */
  layout(false);
  const target = HASH[location.hash.slice(1)];
  // Only the lamp-on render blocks the reveal; the lamp-off one loads afterwards.
  const main = $('#photoOn'), bar = $('#loadBar');
  const loadOff = () => {
    // use whichever format the browser already picked for the lamp-on render
    const off = $('#photoOff'), ext = (main.currentSrc.match(/\.(avif|webp|jpg)$/) || [, 'jpg'])[1];
    off.src = off.dataset[ext];
  };
  const ready = () => {
    $('#loader').classList.add('done');
    setTimeout(loadOff, 300);
    // phones start on the screen; the full desk is one tap (or Esc) away
    if (target) setChannel(target); else setChannel(0, { zoom: innerWidth < 700 });
  };
  bar.style.width = '35%';
  const onLoad = () => { bar.style.width = '100%'; (main.decode ? main.decode().catch(() => {}) : Promise.resolve()).then(() => setTimeout(ready, 120)); };
  if (main.complete && main.naturalWidth) onLoad(); else { main.addEventListener('load', onLoad); main.addEventListener('error', ready); }
})();
