import json, os, numpy as np
from PIL import Image
src = '/tmp/claude-0/b3d/final'; dst = '/home/user/ziqi-zhou02.github.io/assets/room'
os.makedirs(dst, exist_ok=True)
for v, name in [('lamp_on', 'night_on'), ('lamp_off', 'night_off')]:
    im = Image.open(f'{src}/render_{v}.png').convert('RGB')
    im.save(f'{dst}/{name}.jpg', quality=82, optimize=True, progressive=True)
    im.save(f'{dst}/{name}.webp', quality=78, method=6)
    im.save(f'{dst}/{name}.avif', quality=55, speed=4)
    print(name, {e: os.path.getsize(f'{dst}/{name}.{e}') // 1024 for e in ('jpg', 'webp', 'avif')}, 'KB')
m = np.asarray(Image.open(f'{src}/mask.png').convert('L'), dtype=np.float32) / 255
a = (np.clip((m - 0.05) / 0.9, 0, 1) * 255).astype(np.uint8)
out = Image.new('LA', (a.shape[1], a.shape[0])); out.putdata([(255, int(x)) for x in a.ravel()])
out = out.resize((a.shape[1] // 2, a.shape[0] // 2), Image.LANCZOS)
out.save(f'{dst}/glass_mask.png', optimize=True); print('mask', os.path.getsize(f'{dst}/glass_mask.png') // 1024, 'KB')
lay = json.load(open(f'{src}/layout.json'))
open(f'{dst}/layout.js', 'w').write('// Generated from the Blender scene: projected screen, window and hotspot geometry (pixels).\nwindow.ROOM_LAYOUT = ' + json.dumps(lay) + ';\n')
print('layout ok', lay['size'])
