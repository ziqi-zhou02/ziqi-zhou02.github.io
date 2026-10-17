(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const NS = 'http://www.w3.org/2000/svg';
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const stage = $('#stage'), tv = $('#tv'), win = $('#win'), tip = $('#tip');

  // Stage geometry (stage pixels) of the display's screen, used for zooming.
  const SCREEN = { x: 536, y: 266, w: 528, h: 297 };
  const FOCUS = { x: 800, y: 470 };
  const state = { ch: null, zoom: false, lamp: true, sound: false };

  /* ---------------- data: books on the desk (edit me) ---------------- */
  const BOOKS = [
    { id: 'tokenomy', spine: 'TOKENOMY', color: '#ece9f7', ink: '#1f1f25', h: 122, w: 30, kind: 'Essay',
      title: 'Following a Dollar Through the Tokenomy', meta: 'Essay · 15 min read',
      text: 'How neoclouds and token sellers make money, who keeps what along the value chain, and how the money circles back.',
      href: 'posts/tokenomy.html', cta: 'Read essay' },
    { id: 'owner', spine: 'ONE OWNER', color: '#8b7bff', ink: '#ffffff', h: 110, w: 26, kind: 'Essay',
      title: 'One Owner, Many Agents', meta: 'Essay · 9 min read',
      text: 'Notes on the future of organizations, and why context flows better when one person working with agents owns the loop.',
      href: 'posts/one-owner-many-agents.html', cta: 'Read essay' },
    { id: 'alpha', spine: 'ALPHA', color: '#26262e', ink: '#e7e7ee', h: 128, w: 32, kind: 'Project',
      title: 'Project Alpha', meta: 'Project · Python · PyTorch',
      text: 'A one-line pitch of what this project does and why it is interesting.', href: 'https://github.com/ziqi-zhou02', cta: 'View source' },
    { id: 'beta', spine: 'BETA', color: '#c7d2fe', ink: '#1f1f25', h: 104, w: 28, kind: 'Project',
      title: 'Project Beta', meta: 'Project · React · Node',
      text: 'A full-stack web app. Describe the problem, your approach and the result.', href: 'https://github.com/ziqi-zhou02', cta: 'View source' },
    { id: 'gamma', spine: 'GAMMA', color: '#f5d0fe', ink: '#1f1f25', h: 118, w: 26, kind: 'Project',
      title: 'Project Gamma', meta: 'Project · Rust · CLI',
      text: 'A CLI tool, research experiment or hackathon build. Keep it short.', href: 'https://github.com/ziqi-zhou02', cta: 'View source' },
    { id: 'delta', spine: 'DELTA', color: '#3a3a46', ink: '#e7e7ee', h: 98, w: 30, kind: 'Project',
      title: 'Project Delta', meta: 'Project · D3 · SQL',
      text: 'A data visualization or analysis project with a link to a live demo.', href: 'https://github.com/ziqi-zhou02', cta: 'View source' },
  ];
  const CH_NAMES = ['Home', 'About', 'Projects', 'Writing', 'Contact'];
  const HASH = { about: 1, projects: 2, writing: 3, contact: 4 };

  // Small seeded RNG so the skyline looks the same on every visit.
  let seed = 11;
  const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const el = (tag, attrs, parent) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); if (parent) parent.appendChild(n); return n; };

  /* ---------------- the city outside ---------------- */
  const city = $('#city');
  const lights = [];
  const layer = (cls, minTop, maxTop, minW, maxW, litRate, warm) => {
    const g = el('g', {}, city);
    const gb = el('g', { class: cls }, g), gw = el('g', { class: 'wins' }, g);
    let x = 230;
    while (x < 1370) {
      const w = minW + rnd() * (maxW - minW), top = minTop + rnd() * (maxTop - minTop);
      el('rect', { x: x.toFixed(1), y: top.toFixed(1), width: w.toFixed(1), height: (660 - top).toFixed(1) }, gb);
      for (let wy = top + 10; wy < 630; wy += 14) {
        for (let wx = x + 6; wx < x + w - 8; wx += 11) {
          if (rnd() < litRate) {
            const c = warm && rnd() < 0.55 ? '#ffe1b0' : '#cfc6ff';
            lights.push(el('rect', { x: wx.toFixed(1), y: wy.toFixed(1), width: 5, height: 7, fill: c, opacity: (0.35 + rnd() * 0.55).toFixed(2) }, gw));
          }
        }
      }
      x += w + 2 + rnd() * 10;
    }
  };
  layer('b1', 360, 480, 40, 90, 0.05, false);
  layer('b2', 230, 440, 36, 80, 0.12, true);
  layer('b3', 380, 540, 50, 120, 0.16, true);
  const neon = el('text', { x: 1112, y: 330, 'font-family': 'Inter', 'font-weight': 600, 'font-size': 26, 'letter-spacing': 6, fill: '#d8ccff', filter: 'url(#neon)', class: 'neon' }, city);
  neon.textContent = 'NEOCLOUD';
  const beacon = el('circle', { cx: 470, cy: 236, r: 4, fill: '#ff5f7a', filter: 'url(#neon)' }, city);
  if (!reduceMotion) {
    setInterval(() => { const l = lights[(rnd() * lights.length) | 0]; if (l) l.setAttribute('opacity', rnd() < 0.5 ? '0.08' : (0.4 + rnd() * 0.5).toFixed(2)); }, 700);
    setInterval(() => beacon.setAttribute('opacity', beacon.getAttribute('opacity') === '0.15' ? '1' : '0.15'), 900);
  }

  /* ---------------- books ---------------- */
  const booksG = $('#books');
  let bx = 1134;
  BOOKS.forEach(b => {
    const y = 694 - b.h;
    const g = el('g', { class: 'book', tabindex: 0, 'data-book': b.id, 'data-label': `${b.kind.toLowerCase()} · ${b.title.toLowerCase()}` }, booksG);
    el('rect', { x: bx, y, width: b.w, height: b.h, rx: 2.5, fill: b.color }, g);
    el('rect', { x: bx, y: y + 10, width: b.w, height: 1.5, fill: b.ink, opacity: .25 }, g);
    el('rect', { x: bx, y: y + b.h - 12, width: b.w, height: 1.5, fill: b.ink, opacity: .25 }, g);
    const t = el('text', { x: bx + b.w / 2 + 3.5, y: y + b.h / 2, 'text-anchor': 'middle', transform: `rotate(-90 ${bx + b.w / 2 + 3.5} ${y + b.h / 2})`, 'font-family': 'Inter', 'font-weight': 600, 'font-size': 9.5, 'letter-spacing': 1.6, fill: b.ink }, g);
    t.textContent = b.spine;
    bx += b.w + 2;
  });
  // a brushed-aluminium bookend
  el('path', { d: `M${bx + 2} 694 L${bx + 2} 590 L${bx + 8} 590 L${bx + 8} 688 L${bx + 40} 688 L${bx + 40} 694 Z`, fill: 'url(#alu)' }, booksG);

  /* ---------------- layout: cover + zoom + parallax ---------------- */
  // The room drifts a little with the pointer and the city drifts the other way,
  // which reads as depth even though everything is flat.
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
      s = Math.max(vw / 1600, vh / 1000) * (parallaxOn ? 1.03 : 1);
      tx = Math.min(0, Math.max(vw - 1600 * s, vw / 2 - s * FOCUS.x));
      ty = Math.min(0, Math.max(vh - 1000 * s, vh / 2 - s * FOCUS.y));
      const mx = Math.min(-tx, 1600 * s - vw + tx), my = Math.min(-ty, 1000 * s - vh + ty);
      tx += Math.max(-mx, Math.min(mx, -par.x * 14));
      ty += Math.max(-my, Math.min(my, -par.y * 8));
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
        par.x += dx * 0.06; par.y += dy * 0.06;
        city.setAttribute('transform', `translate(${(par.x * 22).toFixed(2)} ${(par.y * 8).toFixed(2)})`);
        if (!state.zoom && performance.now() > zoomAnimUntil) layout(false);
      }
      requestAnimationFrame(loop);
    };
    loop();
  }

  /* ---------------- the screen ---------------- */
  const show = (html, title, { term = false } = {}) => {
    tv.innerHTML = html; tv.scrollTop = 0;
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
    show($(`#ch-${n}`).innerHTML, CH_NAMES[n]);
    markNav(n);
    $$('.book').forEach(t => t.classList.remove('inserted'));
    const name = Object.keys(HASH).find(k => HASH[k] === n);
    try { history.replaceState(null, '', name ? `#${name}` : location.pathname); } catch (e) {}
    if (zoom !== state.zoom) setZoom(zoom);
  };
  const playBook = id => {
    const b = BOOKS.find(x => x.id === id);
    if (!b) return;
    $$('.book').forEach(g => g.classList.toggle('inserted', g.dataset.book === id));
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
    state.lamp = on;
    $('#lampGlow').style.opacity = on ? 1 : 0;
    $('#bulbEdge').style.opacity = on ? 1 : 0;
    $('#dark').setAttribute('opacity', on ? 0 : 0.45);
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
    $('.hot[data-action="sound"]').classList.toggle('playing', on);
    if (on && !audio) { try { audio = startAudio(); } catch (e) { state.sound = false; } }
    else if (!on && audio) {
      const a = audio; audio = null;
      a.master.gain.linearRampToValueAtTime(0, a.ctx.currentTime + 0.6);
      setTimeout(() => { clearInterval(a.timer); a.ctx.close(); }, 700);
    }
  };

  /* ---------------- time of day (follows the visitor's clock) ---------------- */
  const PHASES = ['dawn', 'day', 'dusk', 'night'];
  const phaseFor = h => (h >= 5 && h < 8 ? 'dawn' : h >= 8 && h < 17 ? 'day' : h >= 17 && h < 20 ? 'dusk' : 'night');
  let phaseOverride = null;
  const setPhase = ph => {
    document.body.dataset.phase = ph;
    const d = new Date(), hh = String(d.getHours()).padStart(2, '0'), mm = String(d.getMinutes()).padStart(2, '0');
    $('#phaseLabel').textContent = phaseOverride ? `${ph} · press N to cycle` : `Your time ${hh}:${mm} · ${ph}`;
  };
  const cyclePhase = () => {
    phaseOverride = PHASES[(PHASES.indexOf(document.body.dataset.phase) + 1) % 4];
    setPhase(phaseOverride);
  };
  setPhase(phaseFor(new Date().getHours()));
  setInterval(() => { if (!phaseOverride) setPhase(phaseFor(new Date().getHours())); }, 60000);

  /* ---------------- terminal ---------------- */
  let rainOn = true;
  const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  let termLog = [];
  const termPrint = line => { termLog.push(line); const out = $('#termOut'); if (out) { out.insertAdjacentHTML('beforeend', `<div>${line}</div>`); tv.scrollTop = tv.scrollHeight; } };
  const TERM = {
    help: () => 'commands: ls, cat about.txt, open <name>, lamp, rain, sound, sky, time, whoami, clear, exit'.replace(/</g, '&lt;').replace(/>/g, '&gt;'),
    ls: () => 'about.txt  contact.txt\n' + BOOKS.map(t => t.id).join('  '),
    'cat about.txt': () => esc($('#ch-1').content.textContent.replace(/\s+/g, ' ').trim().replace(/^About /, '')),
    'cat contact.txt': () => 'github.com/ziqi-zhou02',
    whoami: () => "a guest in ziqi's room",
    time: () => new Date().toLocaleString(),
    sky: () => { cyclePhase(); return 'sky → ' + document.body.dataset.phase; },
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
    else if (action.startsWith('book:')) playBook(action.slice(5));
    else if (action === 'lamp') { setLamp(!state.lamp); say(state.lamp ? 'Light on' : 'Light off', x, y); }
    else if (action === 'plant') { const l = $('#leaves'); l.classList.remove('wiggle'); void l.getBBox(); l.classList.add('wiggle'); say('Watered', x, y); }
    else if (action === 'mug') { const s = $('#steam'); s.style.opacity = 0.9; setTimeout(() => (s.style.opacity = ''), 1200); say('Still warm', x, y); }
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
    const hot = e.target.closest('.hot');
    if (hot) { act(hot.dataset.action, e); return; }
    // clicking the room while zoomed steps back out
    if (state.zoom && !e.target.closest('.screen, .hud-top, .hud-bottom, .credits')) setZoom(false);
  });
  document.addEventListener('keydown', e => {
    if (e.target.id === 'termIn') { if (e.key === 'Escape') { e.target.blur(); setZoom(false); } return; }
    const t = e.target.closest && e.target.closest('.hot, .book');
    if (t && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); t.classList.contains('book') ? playBook(t.dataset.book) : act(t.dataset.action); return; }
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key.toLowerCase();
    if (/^[0-4]$/.test(k)) setChannel(+k);
    else if (k === 'z') act('zoom');
    else if (k === 'l') act('lamp');
    else if (k === 'm') act('sound');
    else if (k === 't') openTerminal();
    else if (k === 'n') cyclePhase();
    else if (k === 'r') rainOn = !rainOn;
    else if (k === 'escape' && state.zoom) setZoom(false);
  });
  $('#soundBtn').addEventListener('click', () => setSound(!state.sound));
  $('#creditsBtn').addEventListener('click', e => { e.stopPropagation(); const c = $('#credits'); c.hidden = !c.hidden; });
  document.addEventListener('pointerover', e => {
    const h = e.target.closest('.hot, .book');
    if (h) say(h.dataset.label, e.clientX, e.clientY, 0);
  });
  document.addEventListener('pointermove', e => {
    if (e.target.closest('.hot, .book')) { tip.style.left = `${e.clientX}px`; tip.style.top = `${e.clientY}px`; }
  });
  document.addEventListener('pointerout', e => {
    if (e.target.closest('.hot, .book') && !(e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('.hot, .book'))) tip.classList.remove('show');
  });
  addEventListener('hashchange', () => { const n = HASH[location.hash.slice(1)]; if (n && n !== state.ch) setChannel(n); });

  /* ---------------- rain on the glass ---------------- */
  const rain = $('#rain'), rctx = rain.getContext('2d');
  const RW = 1104, RH = 592;
  rain.width = RW; rain.height = RH;
  const drops = Array.from({ length: 240 }, () => ({ x: Math.random() * (RW + 60), y: Math.random() * RH, l: 10 + Math.random() * 18, v: 9 + Math.random() * 9 }));
  const beads = Array.from({ length: 70 }, () => ({ x: Math.random() * RW, y: Math.random() * RH, r: 1 + Math.random() * 2.2, v: 0 }));
  const drawRain = () => {
    rctx.clearRect(0, 0, RW, RH);
    if (rainOn) {
      rctx.strokeStyle = 'rgba(220, 220, 255, .22)'; rctx.lineWidth = 1;
      rctx.beginPath();
      for (const d of drops) {
        rctx.moveTo(d.x, d.y); rctx.lineTo(d.x - d.l * 0.16, d.y + d.l);
        if (!reduceMotion) { d.y += d.v; d.x -= d.v * 0.16; if (d.y > RH) { d.y = -20; d.x = Math.random() * (RW + 60); } }
      }
      rctx.stroke();
      rctx.fillStyle = 'rgba(235, 235, 255, .3)';
      for (const b of beads) {
        rctx.beginPath(); rctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); rctx.fill();
        if (!reduceMotion) {
          if (b.v === 0 && Math.random() < 0.002) b.v = 0.6 + Math.random() * 1.6;
          b.y += b.v; if (b.v) b.v *= 0.995;
          if (b.y > RH + 5) { b.y = Math.random() * 200; b.v = 0; }
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

  /* ---------------- boot ---------------- */
  layout(false);
  setLamp(true);
  const target = HASH[location.hash.slice(1)];
  const finishBoot = () => { $('#boot').classList.add('done'); if (target) setChannel(target); else setChannel(0, { zoom: false }); };
  if (reduceMotion || target) finishBoot();
  else {
    let p = 0;
    const step = () => {
      p = Math.min(100, p + 8 + Math.random() * 12);
      $('#bootBar').style.width = `${p}%`;
      if (p < 100) setTimeout(step, 110); else setTimeout(finishBoot, 250);
    };
    setTimeout(step, 300);
  }
})();
