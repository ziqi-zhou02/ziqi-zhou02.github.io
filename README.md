# ziqi-zhou02.github.io

Personal site — minimal, dark, violet, terminal-flavoured. Includes a small blog (`posts/`). Pure HTML/CSS/JS, no build step.
Live at **https://ziqi-zhou02.github.io** (GitHub Pages, deployed from `main`).

Design inspired by [bchiang7/v4](https://github.com/bchiang7/v4) and
[lilweb-template](https://github.com/Cod-e-Codes/lilweb-template); blog layout inspired by
Thinking Machines' *Connectionism* and Lilian Weng's *Lil'Log*. Code written from scratch.

## 两个版本

- `index.html` 是“房间”版：一张夜晚雨天的书桌，CRT 电视就是导航（频道 1–4），桌上的 VHS 磁带是项目和文章，台灯、植物、咖啡、键盘、遥控器、随身听都可以点。
- `lofi.html` 是原来的极简版。
- 房间的内容在 `index.html` 底部的 `<template id="ch-N">` 里，磁带数据在 `assets/room.js` 顶部的 `TAPES`。

## 怎么改内容

| 想改什么 | 改哪里 |
| --- | --- |
| 名字、一句话介绍、About、项目卡片、联系方式 | `index.html`（搜 `TODO`） |
| 头像 | 把照片放到 `images/avatar.jpg`，然后把 `index.html` 里的 `images/avatar.svg` 改成 `images/avatar.jpg` |
| 打字机轮播的身份标签 | `assets/main.js` 顶部的 `ROLES` |
| 颜色 / 字体 | `assets/style.css` 顶部的 `:root` 变量 |
| 终端命令 | `assets/main.js` 里的 `COMMANDS` |
| 写新博客 | 复制 `posts/one-owner-many-agents.html` 改内容，再在 `index.html` 的 writing 区复制一个 `<li class="post-item">` 指过去 |

## 交互彩蛋

- 自定义光标 + 点击时的粒子/代码字符爆裂效果
- 导航文字 hover 乱码解码、名字 hover glitch
- 项目卡片 3D 倾斜 + 跟随鼠标的光斑
- 按 `/` 或 `⌘K` 打开迷你终端（`help` 查看命令，支持 Tab 补全和 ↑↓ 历史）
- 右上角切换深色 / 浅色

## 本地预览

```bash
python3 -m http.server 8000   # 然后打开 http://localhost:8000
```
