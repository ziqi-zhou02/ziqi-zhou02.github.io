(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const accent = () => getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();

  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- typing effect: edit ROLES to change the rotating lines ---------- */
  const ROLES = ['student & builder', 'machine learning tinkerer', 'web developer', 'lifelong learner'];
  const typed = $('#typed');
  if (!typed) {
    // not the home page
  } else if (reduceMotion) {
    typed.textContent = ROLES[0];
  } else {
    let r = 0, i = 0, deleting = false;
    const tick = () => {
      const word = ROLES[r];
      i += deleting ? -1 : 1;
      typed.textContent = word.slice(0, i);
      let delay = deleting ? 35 : 70;
      if (!deleting && i === word.length) { deleting = true; delay = 1600; }
      else if (deleting && i === 0) { deleting = false; r = (r + 1) % ROLES.length; delay = 300; }
      setTimeout(tick, delay);
    };
    setTimeout(tick, 500);
  }

  /* ---------- text scramble on hover ---------- */
  const GLYPHS = '!<>-_\\/[]{}—=+*^?#01';
  $$('[data-scramble]').forEach(el => {
    // Only scramble the last text node so the "01." prefix span stays intact.
    const node = [...el.childNodes].reverse().find(n => n.nodeType === 3 && n.textContent.trim());
    if (!node) return;
    const original = node.textContent;
    let raf = null;
    el.addEventListener('mouseenter', () => {
      if (reduceMotion) return;
      cancelAnimationFrame(raf);
      let frame = 0;
      const run = () => {
        const done = Math.floor(frame / 2);
        node.textContent = [...original].map((ch, k) =>
          k < done ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]).join('');
        frame++;
        if (done < original.length) raf = requestAnimationFrame(run);
        else node.textContent = original;
      };
      run();
    });
  });

  /* ---------- nav: border on scroll, hide on scroll down ---------- */
  const nav = $('.nav');
  let lastY = scrollY;
  addEventListener('scroll', () => {
    const y = scrollY;
    nav.classList.toggle('scrolled', y > 10);
    nav.classList.toggle('hidden', y > lastY && y > 200);
    lastY = y;
  }, { passive: true });

  /* ---------- reading progress (blog posts) ---------- */
  const progress = $('.progress');
  if (progress) {
    const upd = () => {
      const h = document.documentElement.scrollHeight - innerHeight;
      progress.style.width = `${h > 0 ? (scrollY / h) * 100 : 0}%`;
    };
    addEventListener('scroll', upd, { passive: true }); upd();
  }

  /* ---------- reveal on scroll ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  $$('.reveal').forEach(el => io.observe(el));

  /* ---------- 3D tilt + spotlight ---------- */
  if (finePointer && !reduceMotion) {
    $$('.tilt').forEach(el => {
      const max = el.classList.contains('card') ? 6 : 10;
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        el.style.transform = `perspective(800px) rotateX(${(0.5 - py) * max}deg) rotateY(${(px - 0.5) * max}deg)`;
        el.style.setProperty('--mx', `${px * 100}%`);
        el.style.setProperty('--my', `${py * 100}%`);
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- custom cursor ---------- */
  if (finePointer) {
    const dot = $('.cursor-dot'), ring = $('.cursor-ring');
    let mx = -100, my = -100, rx = -100, ry = -100;
    addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      document.body.classList.add('has-cursor');
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    });
    document.addEventListener('mouseleave', () => document.body.classList.remove('has-cursor'));
    const follow = () => {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      requestAnimationFrame(follow);
    };
    follow();
    document.addEventListener('mouseover', e => ring.classList.toggle('hover', !!e.target.closest('a, button, .card')));
  }

  /* ---------- click burst: particles + expanding ring ---------- */
  const canvas = $('#fx'), ctx = canvas.getContext('2d');
  const dpr = Math.min(devicePixelRatio || 1, 2);
  const resize = () => {
    canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize(); addEventListener('resize', resize);
  const parts = [], rings = [];
  let animating = false;
  const loop = () => {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    const c = accent();
    ctx.fillStyle = c; ctx.strokeStyle = c; ctx.font = '12px JetBrains Mono, monospace';
    for (let k = rings.length - 1; k >= 0; k--) {
      const g = rings[k]; g.r += 3; g.a -= 0.04;
      if (g.a <= 0) { rings.splice(k, 1); continue; }
      ctx.globalAlpha = g.a; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2); ctx.stroke();
    }
    for (let k = parts.length - 1; k >= 0; k--) {
      const p = parts[k]; p.x += p.vx; p.y += p.vy; p.vy += 0.12; p.vx *= 0.97; p.life -= 0.022;
      if (p.life <= 0) { parts.splice(k, 1); continue; }
      ctx.globalAlpha = p.life;
      if (p.ch) ctx.fillText(p.ch, p.x, p.y); else ctx.fillRect(p.x, p.y, 2.5, 2.5);
    }
    ctx.globalAlpha = 1;
    if (parts.length || rings.length) requestAnimationFrame(loop); else animating = false;
  };
  const burst = (x, y) => {
    rings.push({ x, y, r: 4, a: 0.9 });
    for (let k = 0; k < 14; k++) {
      const ang = Math.random() * Math.PI * 2, sp = 1.5 + Math.random() * 3.5;
      parts.push({
        x, y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 1.5, life: 1,
        ch: Math.random() < 0.45 ? '01{}<>/;'[Math.floor(Math.random() * 8)] : null,
      });
    }
    if (!animating) { animating = true; requestAnimationFrame(loop); }
  };
  if (!reduceMotion) addEventListener('pointerdown', e => { if (!e.target.closest('.term')) burst(e.clientX, e.clientY); });

  /* ---------- theme toggle ---------- */
  const setTheme = t => {
    document.documentElement.dataset.theme = t;
    try { localStorage.setItem('theme', t); } catch (e) {}
  };
  $('#theme-toggle').addEventListener('click', () =>
    setTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light'));

  /* ---------- mini terminal ---------- */
  const term = $('#term'), body = $('#term-body'), input = $('#term-cmd');
  if (!term) return;
  const history = []; let hIdx = 0;
  const print = (html, cls = 'out') => {
    const div = document.createElement('div'); div.className = cls; div.innerHTML = html;
    body.appendChild(div); body.scrollTop = body.scrollHeight;
  };
  const goto = id => { closeTerm(); $(id).scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }); };
  const COMMANDS = {
    help: () => print('available commands:\n  about      jump to about\n  projects   list projects\n  writing    list blog posts\n  contact    jump to contact\n  github     open github profile\n  theme      toggle light / dark\n  whoami     who is this?\n  clear      clear screen\n  exit       close terminal'),
    about: () => goto('#about'),
    contact: () => goto('#contact'),
    projects: () => print($$('.card h3').map((h, k) => `  [${k}] ${h.textContent}`).join('\n') + '\n\ntype "projects go" to scroll there'),
    'projects go': () => goto('#projects'),
    writing: () => print($$('.post-item').map(li => `  ${li.querySelector('.post-date').textContent}  <a class="hi" href="${li.querySelector('a').getAttribute('href')}">${li.querySelector('h3').textContent}</a>`).join('\n')),
    blog: () => COMMANDS.writing(),
    github: () => { open('https://github.com/ziqi-zhou02', '_blank', 'noopener'); print('opening github…'); },
    theme: () => { $('#theme-toggle').click(); print(`theme → ${document.documentElement.dataset.theme}`); },
    whoami: () => print('ziqi zhou — ' + ROLES.join(' / ')),
    ls: () => print('about/  projects/  writing/  contact/  README.md'),
    'cat readme.md': () => print('# hi 👋\nthanks for poking around. try "help".'),
    sudo: () => print('nice try. this incident will be reported.', 'err'),
    clear: () => { body.innerHTML = ''; },
    exit: () => closeTerm(),
  };
  const openTerm = () => {
    term.hidden = false;
    if (!body.childElementCount) print('welcome. type <span class="hi">help</span> to see commands.');
    setTimeout(() => input.focus(), 0);
  };
  const closeTerm = () => { term.hidden = true; };
  $('#term-open').addEventListener('click', openTerm);
  term.addEventListener('click', e => { if (e.target === term) closeTerm(); });
  $('#term-form').addEventListener('submit', e => {
    e.preventDefault();
    const raw = input.value.trim(); input.value = '';
    if (!raw) return;
    history.push(raw); hIdx = history.length;
    print(`<span class="hi">$</span> ${raw.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))}`, '');
    const cmd = raw.toLowerCase();
    (COMMANDS[cmd] || COMMANDS[cmd.split(' ')[0]] || (() => print(`command not found: ${cmd.split(' ')[0].replace(/[&<>]/g, '')}`, 'err')))();
  });
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp' && hIdx > 0) { input.value = history[--hIdx]; e.preventDefault(); }
    else if (e.key === 'ArrowDown') { hIdx = Math.min(hIdx + 1, history.length); input.value = history[hIdx] || ''; e.preventDefault(); }
    else if (e.key === 'Tab') {
      e.preventDefault();
      const hit = Object.keys(COMMANDS).find(c => c.startsWith(input.value.toLowerCase()));
      if (hit && input.value) input.value = hit;
    }
  });
  addEventListener('keydown', e => {
    if (e.key === 'Escape' && !term.hidden) closeTerm();
    else if ((e.key === '/' || (e.key === 'k' && (e.metaKey || e.ctrlKey))) && term.hidden &&
             !/input|textarea/i.test(document.activeElement.tagName)) { e.preventDefault(); openTerm(); }
  });
})();
