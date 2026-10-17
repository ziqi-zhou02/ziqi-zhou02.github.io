import numpy as np
from PIL import Image
W, H = 1600, 900
y, x = np.mgrid[0:H, 0:W] / np.array([H, W])[:, None, None]
def blob(cx, cy, rx, ry, col):
    d = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2
    return np.exp(-d * 1.6)[..., None] * np.array(col)
img = np.zeros((H, W, 3)) + np.array([0.10, 0.08, 0.25])
img += blob(.2, .3, .45, .6, [0.49, 0.36, 1.0]) * .9
img += blob(.8, .7, .5, .6, [1.0, 0.48, 0.78]) * .8
img += blob(.6, .2, .5, .5, [0.23, 0.51, 0.96]) * .7
Image.fromarray((np.clip(img, 0, 1) * 255).astype(np.uint8)).save('/tmp/claude-0/b3d/wallpaper.png')
print('ok')
