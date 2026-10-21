// usage: node render.js out_dir fig1 fig2 ...   (each figN.js defines W, H, BG, draw(d))
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const [outDir, ...names] = process.argv.slice(2);
  const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
  const page = await browser.newPage({ deviceScaleFactor: 2, viewport: { width: 1800, height: 1400 } });
  const here = __dirname;
  for (const n of names) {
    const src = fs.readFileSync(path.join(here, n + '.js'), 'utf8');
    const html = `<!doctype html><html><head><meta charset="utf-8"><style>
      @font-face{font-family:Virgil;src:url(file://${here}/Virgil.woff2) format('woff2');}
      body{margin:0;background:transparent}
    </style><script src="file://${here}/node_modules/roughjs/bundled/rough.js"></script>
    <script src="file://${here}/lib.js"></script></head><body>
    <svg id="s" xmlns="http://www.w3.org/2000/svg"></svg>
    <script>${src}
      const svg=document.getElementById('s');svg.setAttribute('width',W);svg.setAttribute('height',H);
      svg.setAttribute('viewBox','0 0 '+W+' '+H);
      if (typeof BG!=='undefined' && BG){const r=document.createElementNS('http://www.w3.org/2000/svg','rect');r.setAttribute('width',W);r.setAttribute('height',H);r.setAttribute('fill',BG);svg.appendChild(r);}
      document.fonts.load('22px Virgil').then(()=>{draw(mk(svg, rough.svg(svg), 3)); window.done=true;});
    </script></body></html>`;
    const f = path.join(here, '_' + n + '.html');
    fs.writeFileSync(f, html);
    await page.goto('file://' + f);
    await page.waitForFunction('window.done===true');
    await page.locator('#s').screenshot({ path: path.join(outDir, n + '.png'), omitBackground: false });
    console.log('ok', n);
  }
  await browser.close();
})();
