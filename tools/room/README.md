# Rendering the room

The home page background is rendered offline with Blender's Python API (`bpy`) and Cycles.

```bash
python3 -m venv /tmp/claude-0/blender-venv && /tmp/claude-0/blender-venv/bin/pip install bpy pillow numpy
python3 ph_dl.py                         # Poly Haven models, textures and the Shanghai Bund HDRI (CC0)
/tmp/claude-0/blender-venv/bin/python -I make_wallpaper.py
for v in lamp_on lamp_off; do /tmp/claude-0/blender-venv/bin/python -I room_scene.py /tmp/claude-0/b3d/final 1920 128 $v; done
/tmp/claude-0/blender-venv/bin/python -I room_mask.py /tmp/claude-0/b3d/maskout 1920 16 lamp_off && cp /tmp/claude-0/b3d/maskout/mask.png /tmp/claude-0/b3d/final/
/tmp/claude-0/blender-venv/bin/python -I package.py   # writes assets/room/*.jpg, glass_mask.png, layout.js
```

- `room_scene.py` builds the room, the display, keyboard, lamp and props, renders one variant and writes `layout.json`: the projected corners of the screen and window and the bounding boxes of clickable objects, in pixels.
- `room_mask.py` renders a black/white mask of the visible window glass so the browser draws rain only there.
- Paths are absolute (`/tmp/claude-0/...`); change them if you render somewhere else. A 1920×1200 frame at 128 samples takes about 5 minutes on 4 CPU cores.
