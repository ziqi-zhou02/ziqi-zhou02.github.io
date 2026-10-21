Figure sources for the DeepInfer post. Each `fig_*.js` is drawn with rough.js and rendered to PNG by `render.js` (Playwright + Chromium).

```bash
npm install roughjs@4.6.6 playwright
curl -sSL -o Virgil.woff2 https://unpkg.com/@excalidraw/excalidraw@0.17.6/dist/excalidraw-assets/Virgil.woff2
node render.js ../img fig_hero fig_dp_ep fig_vote fig_cp fig_cpflow fig_eplb_loop fig_eplb_toy fig_mega
# then strip the fig_ prefix from the output file names
```
