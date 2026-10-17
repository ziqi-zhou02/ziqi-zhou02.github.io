import json, os, sys, urllib.request
out = '/tmp/claude-0/assets3d'
UA={'User-Agent':'ziqi-site-builder/1.0'}
def get(url): return json.load(urllib.request.urlopen(urllib.request.Request(url, headers=UA)))
def fetch(url, path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    if not os.path.exists(path):
        with urllib.request.urlopen(urllib.request.Request(url, headers=UA)) as r, open(path, 'wb') as fh: fh.write(r.read())
for mid in ['potted_plant_02', 'decorative_book_set_01', 'desk_lamp_arm_01', 'standing_picture_frame_01']:
    f = get(f'https://api.polyhaven.com/files/{mid}')['blend']['1k']['blend']
    base = os.path.join(out, mid)
    fetch(f['url'], os.path.join(base, os.path.basename(f['url'])))
    for rel, inc in f.get('include', {}).items(): fetch(inc['url'], os.path.join(base, rel))
    print('model', mid)
for tid, res in [('painted_plaster_wall', '2k'), ('wood_table_001', '2k')]:
    f = get(f'https://api.polyhaven.com/files/{tid}')
    for m in ['Diffuse', 'Rough', 'nor_gl']:
        if m in f:
            u = f[m][res]['jpg']['url']; fetch(u, os.path.join(out, tid, os.path.basename(u)))
    print('tex', tid, [k for k in f.keys()][:12])
h = get('https://api.polyhaven.com/files/shanghai_bund')['hdri']['4k']['hdr']['url']
fetch(h, os.path.join(out, 'shanghai_bund_4k.hdr')); print('hdri ok')
