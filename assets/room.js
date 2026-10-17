(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const NS = 'http://www.w3.org/2000/svg';
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const stage = $('#stage'), tv = $('#tv'), tip = $('#tip');

  // Stage geometry (stage pixels) of the CRT screen, used for zooming.
  const SCREEN = { x: 636, y: 336, w: 328, h: 248 };
  const FOCUS = { x: 800, y: 470 };
  const state = { ch: null, zoom: false, lamp: true, sound: false };

  /* ---------------- data: tapes on the desk (edit me) ---------------- */
  const TAPES = [
    { id: 'tokenomy', label: 'TOKENOMY', year: '2026', color: '#a78bfa', kind: 'post',
      title: 'FOLLOWING A DOLLAR THROUGH THE TOKENOMY', meta: 'essay · 15 min',
      text: 'How neoclouds and token sellers make money, who keeps what along the value chain, and how the money circles back.',
      href: 'posts/tokenomy.html', cta: '▶ PLAY (READ)' },
    { id: 'owner', label: 'ONE OWNER', year: '2026', color: '#f0abfc', kind: 'post',
      title: 'ONE OWNER, MANY AGENTS', meta: 'essay · 9 min',
      text: 'Notes on the future of organizations, and why context flows better when one person working with agents owns the loop.',
      href: 'posts/one-owner-many-agents.html', cta: '▶ PLAY (READ)' },
    { id: 'alpha', label: 'PROJECT ALPHA', year: '—', color: '#7dd3fc', kind: 'project',
      title: 'PROJECT ALPHA', meta: 'Python · PyTorch',
      text: 'A one-line pitch of what this project does and why it is interesting.', href: 'https://github.com/ziqi-zhou02', cta: '▶ SOURCE' },
    { id: 'beta', label: 'PROJECT BETA', year: '—', color: '#fde68a', kind: 'project',
      title: 'PROJECT BETA', meta: 'React · Node',
      text: 'A full-stack web app. Describe the problem, your approach and the result.', href: 'https://github.com/ziqi-zhou02', cta: '▶ SOURCE' },
    { id: 'gamma', label: 'PROJECT GAMMA', year: '—', color: '#86efac', kind: 'project',
      title: 'PROJECT GAMMA', meta: 'Rust · CLI',
      text: 'A CLI tool, research experiment or hackathon build. Keep it short.', href: 'https://github.com/ziqi-zhou02', cta: '▶ SOURCE' },
    { id: 'delta', label: 'PROJECT DELTA', year: '—', color: '#fca5a5', kind: 'project',
      title: 'PROJECT DELTA', meta: 'D3 · SQL',
      text: 'A data visualization or analysis project with a link to a live demo.', href: 'https://github.com/ziqi-zhou02', cta: '▶ SOURCE' },
  ];
  const CH_NAMES = ['MENU', 'ABOUT', 'PROJECTS', 'WRITING', 'CONTACT'];
  const HASH = { about: 1, projects: 2, writing: 3, contact: 4 };

  // Small seeded RNG so the skyline looks the same on every visit.
  let seed = 7;
  const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const el = (tag, attrs, parent) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); if (parent) parent.appendChild(n); return n; };

  /* ---------------- the city outside ---------------- */
  const city = $('#city');
  const lights = [];
  const layer = (cls, minTop, maxTop, minW, maxW, litRate, warm) => {
    const g = el('g', {}, city);
    const gb = el('g', { class: cls }, g), gw = el('g', { class: 'wins' }, g);
    let x = 300;
    while (x < 1300) {
      const w = minW + rnd() * (maxW - minW), top = minTop + rnd() * (maxTop - minTop);
      el('rect', { x: x.toFixed(1), y: top.toFixed(1), width: w.toFixed(1), height: (640 - top).toFixed(1) }, gb);
      for (let wy = top + 10; wy < 600; wy += 14) {
        for (let wx = x + 6; wx < x + w - 8; wx += 11) {
          if (rnd() < litRate) {
            const c = warm && rnd() < 0.7 ? '#ffcf8a' : '#c4b5fd';
            lights.push(el('rect', { x: wx.toFixed(1), y: wy.toFixed(1), width: 5, height: 7, fill: c, opacity: (0.35 + rnd() * 0.55).toFixed(2) }, gw));
          }
        }
      }
      x += w + 2 + rnd() * 10;
    }
    return g;
  };
  layer('b1', 360, 470, 40, 90, 0.05, false);
  layer('b2', 250, 430, 36, 80, 0.12, true);
  layer('b3', 380, 520, 50, 120, 0.18, true);
  // a neon sign and a blinking light on the skyline
  const neon = el('text', { x: 1010, y: 404, 'font-family': 'Inter', 'font-weight': 700, 'font-size': 30, 'letter-spacing': 3, fill: '#f0abfc', filter: 'url(#neon)', class: 'neon' }, city);
  neon.textContent = 'NEOCLOUD';
  el('rect', { x: 1000, y: 376, width: 190, height: 38, fill: 'none', stroke: '#f0abfc', 'stroke-width': 2, opacity: .5, filter: 'url(#neon)', class: 'neon' }, city);
  const beacon = el('circle', { cx: 488, cy: 252, r: 4, fill: '#ff5f7a', filter: 'url(#neon)' }, city);
  if (!reduceMotion) {
    setInterval(() => { const l = lights[(rnd() * lights.length) | 0]; if (l) l.setAttribute('opacity', rnd() < 0.5 ? '0.08' : (0.4 + rnd() * 0.5).toFixed(2)); }, 700);
    setInterval(() => beacon.setAttribute('opacity', beacon.getAttribute('opacity') === '0.15' ? '1' : '0.15'), 900);
    setInterval(() => { neon.setAttribute('opacity', '0.35'); setTimeout(() => neon.setAttribute('opacity', '1'), 90); }, 5200);
  }

  /* ---------------- tapes ---------------- */
  const tapesG = $('#tapes');
  TAPES.slice().reverse().forEach((t, i) => {
    const w = 196 + (i % 3) * 8, x = 1052 + ((i * 37) % 3) * 6, y = 672 - i * 24;
    const g = el('g', { class: 'tape', tabindex: 0, 'data-tape': t.id, 'data-label': `tape · ${t.title.toLowerCase()}` }, tapesG);
    el('rect', { x, y, width: w, height: 22, rx: 3, fill: '#1b1724' }, g);
    el('rect', { x: x + 12, y: y + 4, width: w - 54, height: 14, rx: 2, fill: t.color }, g);
    el('rect', { x: x + w - 36, y: y + 6, width: 24, height: 10, rx: 2, fill: '#2c2638' }, g);
    const label = el('text', { x: x + 18, y: y + 15, 'font-family': 'JetBrains Mono', 'font-size': 10, 'font-weight': 500, fill: '#16121f' }, g);
    label.textContent = t.label;
    const yr = el('text', { x: x + w - 50, y: y + 15, 'text-anchor': 'end', 'font-family': 'JetBrains Mono', 'font-size': 9, fill: '#16121f', opacity: .7 }, g);
    yr.textContent = t.year;
  });

  /* ---------------- layout: cover + zoom ---------------- */
  // Parallax: the room drifts a little with the pointer and the city drifts the other way,
  // which reads as depth even though everything is flat.
  const parallaxOn = !reduceMotion && matchMedia('(hover: hover) and (pointer: fine)').matches;
  const par = { x: 0, y: 0, tx: 0, ty: 0 };
  let zoomAnimUntil = 0;
  const layout = (animate = true) => {
    const vw = innerWidth, vh = innerHeight;
    let s, tx, ty;
    if (state.zoom) {
      const availH = vh - 150;
      s = Math.min((vw * 0.92) / SCREEN.w, (availH * 0.95) / SCREEN.h);
      tx = vw / 2 - s * (SCREEN.x + SCREEN.w / 2);
      ty = 70 + availH / 2 - s * (SCREEN.y + SCREEN.h / 2);
    } else {
      s = Math.max(vw / 1600, vh / 1000) * (parallaxOn ? 1.03 : 1);
      tx = Math.min(0, Math.max(vw - 1600 * s, vw / 2 - s * FOCUS.x));
      ty = Math.min(0, Math.max(vh - 1000 * s, vh / 2 - s * FOCUS.y));
      const mx = Math.min(-tx, 1600 * s - vw - (-tx)), my = Math.min(-ty, 1000 * s - vh - (-ty));
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

  /* ---------------- TV ---------------- */
  const staticCanvas = $('#static'), sctx = staticCanvas.getContext('2d');
  staticCanvas.width = 164; staticCanvas.height = 124;
  const burstStatic = (ms = 240) => {
    if (reduceMotion) return;
    staticCanvas.classList.add('on');
    const img = sctx.createImageData(164, 124), end = performance.now() + ms;
    const frame = () => {
      for (let i = 0; i < img.data.length; i += 4) { const v = (Math.random() * 255) | 0; img.data[i] = v * .8; img.data[i + 1] = v * .8; img.data[i + 2] = v; img.data[i + 3] = 255; }
      sctx.putImageData(img, 0, 0);
      if (performance.now() < end) requestAnimationFrame(frame); else staticCanvas.classList.remove('on');
    };
    frame();
  };
  const show = (html, osd) => {
    burstStatic();
    setTimeout(() => {
      tv.innerHTML = html; tv.scrollTop = 0;
      tv.classList.remove('tv-enter'); void tv.offsetWidth; tv.classList.add('tv-enter');
      $('#osdCh').textContent = osd;
    }, reduceMotion ? 0 : 160);
  };
  const markNav = n => {
    $$('.hud-top nav a').forEach(a => a.classList.toggle('on', +a.dataset.ch === n));
    $$('.crt-buttons button').forEach(b => b.classList.toggle('on', +b.dataset.ch === n));
  };
  const setChannel = (n, { zoom = true } = {}) => {
    state.ch = n;
    show($(`#ch-${n}`).innerHTML, `CH 0${n}`);
    $('#osdLeft').textContent = n === 0 ? '▶ PLAY' : `▶ ${CH_NAMES[n]}`;
    markNav(n);
    $$('.tape').forEach(t => t.classList.remove('inserted'));
    const name = Object.keys(HASH).find(k => HASH[k] === n);
    try { history.replaceState(null, '', name ? `#${name}` : location.pathname); } catch (e) {}
    if (zoom !== state.zoom && (zoom || n === 0)) setZoom(zoom);
  };
  const playTape = id => {
    const t = TAPES.find(x => x.id === id);
    if (!t) return;
    $$('.tape').forEach(g => g.classList.toggle('inserted', g.dataset.tape === id));
    const src = $(`.tape[data-tape="${id}"]`);
    if (src && !reduceMotion) {
      const bb = src.getBBox(), ghost = src.cloneNode(true);
      ghost.removeAttribute('tabindex'); ghost.setAttribute('class', 'tape-ghost');
      src.parentNode.appendChild(ghost);
      const dx = 715 - (bb.x + bb.width / 2), dy = 675 - (bb.y + bb.height / 2);
      ghost.animate([
        { transform: 'translate(0,0) scale(1)', opacity: 1 },
        { transform: `translate(${dx * 0.6}px, ${dy - 60}px) scale(.9)`, opacity: 1, offset: .55 },
        { transform: `translate(${dx}px, ${dy}px) scale(.82)`, opacity: 0 }
      ], { duration: 700, easing: 'cubic-bezier(.5,0,.3,1)' }).onfinish = () => ghost.remove();
    }
    const ext = t.href.startsWith('http') ? ' target="_blank" rel="noopener"' : '';
    show(`<div class="tape-view"><h2>${t.title}</h2><p class="dim">${t.meta}</p><p>${t.text}</p><a class="btn" href="${t.href}"${ext}>${t.cta}</a></div>`, t.kind === 'post' ? 'VHS · ESSAY' : 'VHS · PROJECT');
    $('#osdLeft').textContent = '▶ VHS';
    markNav(-1);
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
    $('#dark').setAttribute('opacity', on ? 0 : 0.42);
  };

  /* sound: filtered-noise rain plus a slow lo-fi chord loop, all generated */
  let audio = null;
  const startAudio = () => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);
    master.gain.linearRampToValueAtTime(0.9, ctx.currentTime + 1.5);
    const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate), d = buf.getChannelData(0);
    let last = 0; for (let i = 0; i < d.length; i++) { const w = Math.random() * 2 - 1; last = (last + 0.04 * w) / 1.04; d[i] = last * 3 + w * 0.04; }
    const noise = ctx.createBufferSource(); noise.buffer = buf; noise.loop = true;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1600;
    const rg = ctx.createGain(); rg.gain.value = 0.22;
    noise.connect(lp).connect(rg).connect(master); noise.start();
    const pad = ctx.createBiquadFilter(); pad.type = 'lowpass'; pad.frequency.value = 900; pad.connect(master);
    const chords = [[261.6, 329.6, 392, 493.9], [220, 261.6, 329.6, 392], [174.6, 220, 261.6, 329.6], [196, 246.9, 293.7, 349.2]];
    let step = 0;
    const play = () => {
      const t0 = ctx.currentTime;
      chords[step++ % chords.length].forEach((f, i) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'triangle'; o.frequency.value = f / 2; o.detune.value = (i - 1.5) * 4;
        g.gain.setValueAtTime(0, t0); g.gain.linearRampToValueAtTime(0.045, t0 + 0.6); g.gain.linearRampToValueAtTime(0, t0 + 3.6);
        o.connect(g).connect(pad); o.start(t0); o.stop(t0 + 3.8);
      });
    };
    play(); const timer = setInterval(play, 3200);
    return { ctx, master, timer };
  };
  const setSound = on => {
    state.sound = on;
    $('#soundBtn').textContent = on ? '♪ SOUND ON' : '♪ SOUND OFF';
    $$('#reelL, #reelR').forEach(r => r.classList.toggle('spin', on));
    if (on && !audio) { try { audio = startAudio(); } catch (e) { state.sound = false; } }
    else if (!on && audio) {
      const a = audio; audio = null;
      a.master.gain.linearRampToValueAtTime(0, a.ctx.currentTime + 0.6);
      setTimeout(() => { clearInterval(a.timer); a.ctx.close(); }, 700);
    }
  };

  const act = (action, ev) => {
    const x = ev && ev.clientX ? ev.clientX : innerWidth / 2, y = ev && ev.clientY ? ev.clientY : innerHeight / 2;
    if (action.startsWith('ch:')) setChannel(+action.slice(3));
    else if (action.startsWith('tape:')) playTape(action.slice(5));
    else if (action === 'lamp') { setLamp(!state.lamp); say(state.lamp ? 'click. light on' : 'click. moody now', x, y); }
    else if (action === 'plant') { const l = $('#leaves'); l.classList.remove('wiggle'); void l.getBBox(); l.classList.add('wiggle'); say('watered. it looks happier', x, y); }
    else if (action === 'mug') { const s = $('#steam'); s.style.opacity = 0.9; setTimeout(() => (s.style.opacity = ''), 1200); say('still warm', x, y); }
    else if (action === 'term') openTerminal();
    else if (action === 'next') { setChannel(state.ch && state.ch < 4 ? state.ch + 1 : 1); }
    else if (action === 'zoom') { if (state.ch === null) setChannel(0); else setZoom(!state.zoom); }
    else if (action === 'sound') { setSound(!state.sound); say(state.sound ? 'rain + lo-fi, generated live' : 'quiet again', x, y); }
  };

  /* ---------------- time of day (follows the visitor's clock) ---------------- */
  const PHASES = ['dawn', 'day', 'dusk', 'night'];
  const phaseFor = h => (h >= 5 && h < 8 ? 'dawn' : h >= 8 && h < 17 ? 'day' : h >= 17 && h < 20 ? 'dusk' : 'night');
  let phaseOverride = null;
  const setPhase = ph => {
    document.body.dataset.phase = ph;
    const d = new Date(), hh = String(d.getHours()).padStart(2, '0'), mm = String(d.getMinutes()).padStart(2, '0');
    $('#phaseLabel').textContent = phaseOverride ? `${ph} · press N to cycle` : `your time ${hh}:${mm} · ${ph}`;
  };
  const cyclePhase = () => {
    const cur = document.body.dataset.phase;
    phaseOverride = PHASES[(PHASES.indexOf(cur) + 1) % 4];
    setPhase(phaseOverride);
  };
  setPhase(phaseFor(new Date().getHours()));
  setInterval(() => { if (!phaseOverride) setPhase(phaseFor(new Date().getHours())); }, 60000);

  /* ---------------- a small terminal inside the CRT ---------------- */
  const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  let termLog = [];
  const termPrint = line => { termLog.push(line); const out = $('#termOut'); if (out) { out.insertAdjacentHTML('beforeend', `<div>${line}</div>`); tv.scrollTop = tv.scrollHeight; } };
  const TERM = {
    help: () => 'commands: ls, cat about.txt, open &lt;name&gt;, lamp, rain, sound, time, phase, whoami, clear, exit',
    ls: () => 'about.txt  projects/  writing/  contact.txt\n' + TAPES.map(t => t.id + '.vhs').join('  '),
    'cat about.txt': () => esc($('#ch-1').content.textContent.replace(/\s+/g, ' ').trim().replace(/^ABOUT /, '')),
    'cat contact.txt': () => 'github.com/ziqi-zhou02',
    whoami: () => 'a guest in ziqi\'s room',
    time: () => new Date().toLocaleString(),
    phase: () => { cyclePhase(); return 'sky → ' + document.body.dataset.phase; },
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
    termPrint(`<span class="pr">guest@room:~$</span> ${esc(raw)}`);
    if (cmd.startsWith('open ')) {
      const t = TAPES.find(x => x.id === cmd.slice(5).replace('.vhs', '').trim());
      if (t) { setTimeout(() => playTape(t.id), 250); termPrint('inserting tape…'); } else termPrint('no such tape. try ls');
      return;
    }
    const f = TERM[cmd] || TERM[cmd.split(' ')[0]];
    const out = f ? f() : `command not found: ${esc(cmd.split(' ')[0])}`;
    if (out) out.split('\n').forEach(l => termPrint(l));
  };
  const openTerminal = () => {
    state.ch = 5; markNav(-1);
    show(`<div class="term"><div id="termOut"></div><form id="termForm" autocomplete="off"><span class="pr">guest@room:~$</span><input id="termIn" spellcheck="false" aria-label="terminal input"></form></div>`, 'CH 05');
    $('#osdLeft').textContent = '▶ TERMINAL';
    setTimeout(() => {
      if (!termLog.length) termPrint('ROOM-OS 1.0 · type <b>help</b>');
      else $('#termOut').innerHTML = termLog.map(l => `<div>${l}</div>`).join('');
      $('#termForm').addEventListener('submit', e => { e.preventDefault(); const i = $('#termIn'); runCmd(i.value); i.value = ''; });
      $('#termIn').focus({ preventScroll: true });
    }, reduceMotion ? 0 : 200);
    if (!state.zoom) setZoom(true);
  };

  /* ---------------- events ---------------- */
  document.addEventListener('click', e => {
    const ch = e.target.closest('[data-ch]');
    if (ch) { e.preventDefault(); setChannel(+ch.dataset.ch); return; }
    const tape = e.target.closest('[data-tape]');
    if (tape) { playTape(tape.dataset.tape); return; }
    const hot = e.target.closest('.hot');
    if (hot) { act(hot.dataset.action, e); return; }
    // clicking the room while zoomed steps back out
    if (state.zoom && !e.target.closest('.screen, .hud-top, .hud-bottom')) setZoom(false);
  });
  document.addEventListener('keydown', e => {
    const t = e.target.closest && e.target.closest('.hot, .tape');
    if (t && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); t.classList.contains('tape') ? playTape(t.dataset.tape) : act(t.dataset.action); return; }
    if (e.target.id === 'termIn') { if (e.key === 'Escape') { e.target.blur(); setZoom(false); } return; }
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key.toLowerCase();
    if (/^[0-4]$/.test(k)) setChannel(+k);
    else if (k === 'z') act('zoom');
    else if (k === 'l') act('lamp');
    else if (k === 'm') act('sound');
    else if (k === 't') openTerminal();
    else if (k === 'n') cyclePhase();
    else if (k === 'r') { rainOn = !rainOn; }
    else if (k === 'escape' && state.zoom) setZoom(false);
  });
  $('#soundBtn').addEventListener('click', () => setSound(!state.sound));
  $('#creditsBtn').addEventListener('click', e => { e.stopPropagation(); const c = $('#credits'); c.hidden = !c.hidden; });
  document.addEventListener('click', e => { if (!e.target.closest('#credits, #creditsBtn')) $('#credits').hidden = true; });
  document.addEventListener('pointerover', e => {
    const h = e.target.closest('.hot, .tape');
    if (h) say(h.dataset.label, e.clientX, e.clientY, 0);
  });
  document.addEventListener('pointermove', e => {
    if (e.target.closest('.hot, .tape')) { tip.style.left = `${e.clientX}px`; tip.style.top = `${e.clientY}px`; }
  });
  document.addEventListener('pointerout', e => {
    if (e.target.closest('.hot, .tape') && !(e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('.hot, .tape'))) tip.classList.remove('show');
  });

  /* ---------------- rain on the glass ---------------- */
  const rain = $('#rain'), rctx = rain.getContext('2d');
  rain.width = 960; rain.height = 540;
  const drops = Array.from({ length: 260 }, () => ({ x: Math.random() * 1000, y: Math.random() * 540, l: 10 + Math.random() * 18, v: 9 + Math.random() * 9 }));
  const beads = Array.from({ length: 70 }, () => ({ x: Math.random() * 960, y: Math.random() * 540, r: 1 + Math.random() * 2.4, v: 0 }));
  let rainOn = true;
  const drawRain = () => {
    rctx.clearRect(0, 0, 960, 540);
    if (!rainOn) { requestAnimationFrame(drawRain); return; }
    rctx.strokeStyle = 'rgba(200, 190, 255, .28)'; rctx.lineWidth = 1;
    rctx.beginPath();
    for (const d of drops) {
      rctx.moveTo(d.x, d.y); rctx.lineTo(d.x - d.l * 0.18, d.y + d.l);
      if (!reduceMotion) { d.y += d.v; d.x -= d.v * 0.18; if (d.y > 540) { d.y = -20; d.x = Math.random() * 1000; } }
    }
    rctx.stroke();
    rctx.fillStyle = 'rgba(220, 210, 255, .35)';
    for (const b of beads) {
      rctx.beginPath(); rctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); rctx.fill();
      if (!reduceMotion) {
        if (b.v === 0 && Math.random() < 0.002) b.v = 0.6 + Math.random() * 1.6;
        b.y += b.v; if (b.v) b.v *= 0.995;
        if (b.y > 545) { b.y = Math.random() * 200; b.v = 0; }
      }
    }
    if (!reduceMotion) requestAnimationFrame(drawRain);
  };
  drawRain();

  /* ---------------- LED clock ---------------- */
  const clock = $('#clock');
  const tick = () => { const d = new Date(), c = d.getSeconds() % 2 ? ' ' : ':'; clock.textContent = `${String(d.getHours()).padStart(2, '0')}${c}${String(d.getMinutes()).padStart(2, '0')}`; };
  tick(); setInterval(tick, 1000);

  addEventListener('hashchange', () => { const n = HASH[location.hash.slice(1)]; if (n && n !== state.ch) setChannel(n); });

  /* ---------------- boot ---------------- */
  layout(false);
  setLamp(true);
  const target = HASH[location.hash.slice(1)];
  if (target) {
    setChannel(target);
  } else if (reduceMotion) {
    setChannel(0, { zoom: false });
  } else {
    // a short VHS-style loading screen, then the menu
    let p = 0;
    $('#osdCh').textContent = 'CH 00'; $('#osdLeft').textContent = '▶▶ LOADING';
    const bar = () => {
      p = Math.min(100, p + 7 + Math.random() * 9);
      const n = Math.round(p / 6.25);
      tv.innerHTML = `<div class="loading"><p>&nbsp;</p><p class="bar">${'█'.repeat(n)}${'░'.repeat(16 - n)} ${Math.round(p)}%</p></div>`;
      if (p < 100) setTimeout(bar, 90); else setTimeout(() => setChannel(0, { zoom: false }), 250);
    };
    bar();
  }
})();
