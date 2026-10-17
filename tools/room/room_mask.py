"""Build and render the desk scene for the room page.

Usage: python -I room_scene.py <out_dir> <width> <samples> [lamp_on|lamp_off] [world_yaw_deg]
Writes <out_dir>/render_<variant>.png and <out_dir>/layout.json (projected screen,
window and hotspot geometry in pixel coordinates).
"""
import bpy, bmesh, json, math, os, sys
from mathutils import Vector, Matrix
from bpy_extras.object_utils import world_to_camera_view

OUT = sys.argv[1]
W = int(sys.argv[2]); H = int(W * 10 / 16)
SAMPLES = int(sys.argv[3])
VARIANT = sys.argv[4] if len(sys.argv) > 4 else 'lamp_on'
YAW = float(sys.argv[5]) if len(sys.argv) > 5 else 234.0
A = '/tmp/claude-0/assets3d'
os.makedirs(OUT, exist_ok=True)

# ---------------------------------------------------------------- reset
bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
col = scene.collection

def mat(name, base=(0.8, 0.8, 0.8), rough=0.5, metal=0.0, coat=0.0, emit=None, emit_strength=0.0, transmission=0.0, ior=1.45, alpha=1.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*base, 1)
    b.inputs['Roughness'].default_value = rough
    b.inputs['Metallic'].default_value = metal
    b.inputs['Coat Weight'].default_value = coat
    b.inputs['Transmission Weight'].default_value = transmission
    b.inputs['IOR'].default_value = ior
    b.inputs['Alpha'].default_value = alpha
    if emit:
        b.inputs['Emission Color'].default_value = (*emit, 1)
        b.inputs['Emission Strength'].default_value = emit_strength
    return m

def textured(name, folder, stem, scale=1.0, tint=None, rough_mul=1.0):
    m = bpy.data.materials.new(name); m.use_nodes = True
    nt = m.node_tree; n = nt.nodes; l = nt.links
    b = n['Principled BSDF']
    tc = n.new('ShaderNodeTexCoord'); mp = n.new('ShaderNodeMapping')
    mp.inputs['Scale'].default_value = (scale, scale, scale)
    l.new(tc.outputs['Object'], mp.inputs['Vector'])
    def tex(kind, colorspace):
        t = n.new('ShaderNodeTexImage'); t.image = bpy.data.images.load(f'{A}/{folder}/{stem}_{kind}_2k.jpg')
        t.image.colorspace_settings.name = colorspace; t.projection = 'BOX'; t.projection_blend = 0.3
        l.new(mp.outputs['Vector'], t.inputs['Vector']); return t
    d = tex('diff', 'sRGB')
    if tint:
        mix = n.new('ShaderNodeMix'); mix.data_type = 'RGBA'; mix.blend_type = 'MULTIPLY'; mix.inputs['Factor'].default_value = 1.0
        l.new(d.outputs['Color'], mix.inputs['A']); mix.inputs['B'].default_value = (*tint, 1)
        l.new(mix.outputs['Result'], b.inputs['Base Color'])
    else:
        l.new(d.outputs['Color'], b.inputs['Base Color'])
    r = tex('rough', 'Non-Color')
    if rough_mul != 1.0:
        mm = n.new('ShaderNodeMath'); mm.operation = 'MULTIPLY'; mm.inputs[1].default_value = rough_mul
        l.new(r.outputs['Color'], mm.inputs[0]); l.new(mm.outputs[0], b.inputs['Roughness'])
    else:
        l.new(r.outputs['Color'], b.inputs['Roughness'])
    nm = tex('nor_gl', 'Non-Color'); nn = n.new('ShaderNodeNormalMap'); nn.inputs['Strength'].default_value = 0.6
    l.new(nm.outputs['Color'], nn.inputs['Color']); l.new(nn.outputs['Normal'], b.inputs['Normal'])
    return m

def box(name, size, loc, material, bevel=0.0, segments=4, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc, rotation=rot)
    o = bpy.context.active_object; o.name = name
    o.scale = size; bpy.ops.object.transform_apply(scale=True)
    if bevel:
        mod = o.modifiers.new('bevel', 'BEVEL'); mod.width = bevel; mod.segments = segments; mod.limit_method = 'NONE'
    o.data.materials.append(material)
    for p in o.data.polygons: p.use_smooth = True
    return o

def wedge(name, w, d, h_front, h_back, loc, material, bevel=0.002):
    # a slab whose top rises from h_front (toward camera, -y) to h_back (+y)
    o = box(name, (w, d, 1.0), (0, 0, 0), material)
    for v in o.data.vertices:
        t = (v.co.y + d / 2) / d
        v.co.z = 0.0 if v.co.z < 0 else h_front + (h_back - h_front) * t
    o.location = loc
    if bevel:
        mod = o.modifiers['bevel'] if 'bevel' in o.modifiers else o.modifiers.new('bevel', 'BEVEL')
        mod.width = bevel; mod.segments = 4; mod.limit_method = 'NONE'
    return o

def cyl(name, r, h, loc, material, verts=64, bevel=0.0):
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=r, depth=h, location=loc)
    o = bpy.context.active_object; o.name = name
    if bevel:
        mod = o.modifiers.new('bevel', 'BEVEL'); mod.width = bevel; mod.segments = 4; mod.limit_method = 'ANGLE'
    o.data.materials.append(material)
    for p in o.data.polygons: p.use_smooth = True
    return o

# ---------------------------------------------------------------- materials
M = {
    'alu': mat('aluminium', (0.66, 0.67, 0.7), rough=0.5, metal=1.0),
    'alu_dark': mat('aluminium dark', (0.5, 0.51, 0.53), rough=0.35, metal=1.0),
    'glass_black': mat('black glass', (0.004, 0.004, 0.005), rough=0.32, coat=0.25),
    'key': mat('key', (0.93, 0.93, 0.94), rough=0.45),
    'ceramic': mat('ceramic', (0.92, 0.92, 0.91), rough=0.12, coat=0.6),
    'coffee': mat('coffee', (0.06, 0.03, 0.015), rough=0.05),
    'fabric': mat('fabric', (0.12, 0.12, 0.13), rough=1.0),
    'frame': mat('window frame', (0.02, 0.02, 0.022), rough=0.4, metal=0.6),
    'steel': mat('steel black', (0.015, 0.015, 0.017), rough=0.35, metal=0.9),
    'lamp_white': mat('lamp white', (0.9, 0.9, 0.9), rough=0.25),
    'floor': mat('floor', (0.06, 0.055, 0.05), rough=0.6),
    'wall': textured('plaster', 'painted_plaster_wall', 'painted_plaster_wall', scale=0.6, tint=(0.33, 0.33, 0.36)),
    'wood': textured('oak', 'wood_table_001', 'wood_table_001', scale=1.4, tint=(0.62, 0.6, 0.58), rough_mul=0.75),
}
# glass: transparent for shadow rays so the city still lights the room
g = bpy.data.materials.new('window glass'); g.use_nodes = True
nt = g.node_tree; nt.nodes.clear()
out = nt.nodes.new('ShaderNodeOutputMaterial'); lp = nt.nodes.new('ShaderNodeLightPath')
gl = nt.nodes.new('ShaderNodeBsdfGlass'); gl.inputs['Roughness'].default_value = 0.0; gl.inputs['IOR'].default_value = 1.05
tr = nt.nodes.new('ShaderNodeBsdfTransparent'); mx = nt.nodes.new('ShaderNodeMixShader')
nt.links.new(lp.outputs['Is Shadow Ray'], mx.inputs['Fac']); nt.links.new(gl.outputs[0], mx.inputs[1]); nt.links.new(tr.outputs[0], mx.inputs[2])
nt.links.new(mx.outputs[0], out.inputs['Surface'])
M['glass'] = g

# screen: emissive image (the page overlays the live UI on top of this)
scr = bpy.data.materials.new('screen'); scr.use_nodes = True
nt = scr.node_tree; nt.nodes.clear()
out = nt.nodes.new('ShaderNodeOutputMaterial'); em = nt.nodes.new('ShaderNodeEmission'); ti = nt.nodes.new('ShaderNodeTexImage')
ti.image = bpy.data.images.load('/tmp/claude-0/b3d/wallpaper.png'); em.inputs['Strength'].default_value = 1.4
nt.links.new(ti.outputs['Color'], em.inputs['Color']); nt.links.new(em.outputs[0], out.inputs['Surface'])
M['screen'] = scr

# ---------------------------------------------------------------- room
DESK_Z = 0.76
WALL_Y = 0.62
box('floor', (8, 8, 0.02), (0, 0, -0.01), M['floor'])
win = dict(x0=-1.5, x1=1.5, z0=0.92, z1=2.62)
# back wall built around the window opening
box('wall_left', (2.0, 0.12, 3.0), (win['x0'] - 1.0, WALL_Y + 0.06, 1.5), M['wall'])
box('wall_right', (2.0, 0.12, 3.0), (win['x1'] + 1.0, WALL_Y + 0.06, 1.5), M['wall'])
box('wall_below', (win['x1'] - win['x0'], 0.12, win['z0']), (0, WALL_Y + 0.06, win['z0'] / 2), M['wall'])
box('wall_above', (win['x1'] - win['x0'], 0.12, 3.0 - win['z1']), (0, WALL_Y + 0.06, (3.0 + win['z1']) / 2), M['wall'])
box('wall_side_l', (0.12, 4, 3), (-2.6, -1.3, 1.5), M['wall'])
box('wall_side_r', (0.12, 4, 3), (2.6, -1.3, 1.5), M['wall'])
box('ceiling', (6, 5, 0.1), (0, -1.0, 3.05), M['wall'])
# window frame + mullions + glass
fy = WALL_Y + 0.05
fw = 0.035
box('frame_b', (win['x1'] - win['x0'], 0.06, fw), (0, fy, win['z0'] + fw / 2), M['frame'])
box('frame_t', (win['x1'] - win['x0'], 0.06, fw), (0, fy, win['z1'] - fw / 2), M['frame'])
box('frame_l', (fw, 0.06, win['z1'] - win['z0']), (win['x0'] + fw / 2, fy, (win['z0'] + win['z1']) / 2), M['frame'])
box('frame_r', (fw, 0.06, win['z1'] - win['z0']), (win['x1'] - fw / 2, fy, (win['z0'] + win['z1']) / 2), M['frame'])
for mxp in (-0.5, 0.5):
    box(f'mullion_{mxp}', (0.025, 0.05, win['z1'] - win['z0']), (mxp, fy, (win['z0'] + win['z1']) / 2), M['frame'])
box('glass', (win['x1'] - win['x0'], 0.006, win['z1'] - win['z0']), (0, fy + 0.01, (win['z0'] + win['z1']) / 2), M['glass'])
box('sill', (win['x1'] - win['x0'] + 0.1, 0.16, 0.03), (0, WALL_Y - 0.02, win['z0'] - 0.015), M['wall'])

# desk
box('desk_top', (2.3, 0.86, 0.035), (0, 0.17, DESK_Z - 0.0175), M['wood'], bevel=0.004)
for sx in (-1.08, 1.08):
    box(f'leg_{sx}', (0.04, 0.7, 0.02), (sx, 0.17, 0.02), M['steel'])
    box(f'legv_{sx}', (0.04, 0.04, DESK_Z - 0.04), (sx, 0.17, (DESK_Z - 0.04) / 2 + 0.01), M['steel'])

# ---------------------------------------------------------------- display (27", 16:9)
SW, SH = 0.597, 0.336                  # active area
BW, BH, BD = 0.623, 0.362, 0.031      # body (Apple spec)
DX, DY, DZ = 0.0, 0.14, DESK_Z + 0.116 + BH / 2
body = box('display_body', (BW, BD, BH), (DX, DY, DZ), M['alu'], bevel=0.0035, segments=4)
front = box('display_glass', (BW - 0.0016, 0.0015, BH - 0.0016), (DX, DY - BD / 2 - 0.0008, DZ), M['glass_black'], bevel=0.0035, segments=4)
bpy.ops.mesh.primitive_plane_add(size=1, location=(DX, DY - BD / 2 - 0.0025, DZ), rotation=(math.pi / 2, 0, 0))
screen = bpy.context.active_object; screen.name = 'display_screen'; screen.scale = (SW, SH, 1)
bpy.ops.object.transform_apply(scale=True); screen.data.materials.append(M['screen'])
# stand: a bent aluminium sheet behind the display, plus its foot
# stand: one bent aluminium sheet. The arm runs from the back of the panel down and back to
# the bend; the foot runs forward from the bend under the display.
T = Vector((DX, DY + BD / 2 + 0.004, DZ - 0.03)); B = Vector((DX, DY + 0.155, DESK_Z + 0.008))
v = T - B; Ls = v.length; phi = math.atan2(-v.y, v.z)
box('stand_arm', (0.15, 0.008, Ls), (T + B) / 2, M['alu'], bevel=0.003, rot=(phi, 0, 0))
box('stand_foot', (0.15, 0.17, 0.006), (DX, DY + 0.07, DESK_Z + 0.003), M['alu'], bevel=0.0025)
cyl('stand_bend', 0.008, 0.15, (DX, DY + 0.155, DESK_Z + 0.009), M['alu']).rotation_euler = (0, math.pi / 2, 0)

# keyboard
KX, KY = -0.03, -0.12
wedge('kb_body', 0.279, 0.1149, 0.0041, 0.0095, (KX, KY, DESK_Z), M['alu'], bevel=0.002)
SLOPE = (0.0095 - 0.0041) / 0.1149
kw, gap = 0.0168, 0.0022
for r in range(6):
    cols = 14 if r < 5 else 10
    rowh = 0.0105 if r == 0 else kw
    y = KY + 0.046 - r * (kw + gap) + (0.003 if r == 0 else 0)
    x0 = KX - 0.1335
    widths = [1] * cols
    if r == 5: widths = [1, 1, 1, 1.4, 5.2, 1.4, 1, 1, 1, 1]
    x = x0
    for wd in widths:
        w = kw * wd + gap * (wd - 1)
        kz = DESK_Z + 0.0041 + (y - (KY - 0.1149 / 2)) * SLOPE + 0.0012
        box(f'key_{r}_{x:.3f}', (w, rowh, 0.0028), (x + w / 2, y, kz), M['key'], bevel=0.0011, segments=3, rot=(math.atan(SLOPE), 0, 0))
        x += w + gap
# trackpad
wedge('trackpad', 0.16, 0.1149, 0.0049, 0.0109, (0.25, -0.12, DESK_Z), M['alu'], bevel=0.0025)
wedge('trackpad_glass', 0.157, 0.1119, 0.0051, 0.0111, (0.25, -0.12, DESK_Z), mat('trackpad glass', (0.86, 0.86, 0.87), rough=0.22, coat=0.4), bevel=0.003)

# mug
MX, MY = -0.43, -0.02
mug = cyl('mug', 0.041, 0.095, (MX, MY, DESK_Z + 0.0475), M['ceramic'], bevel=0.004)
sol = mug.modifiers.new('hollow', 'SOLIDIFY'); sol.thickness = 0.004
bpy.ops.mesh.primitive_torus_add(major_radius=0.024, minor_radius=0.0055, location=(MX + 0.047, MY, DESK_Z + 0.05), rotation=(math.pi / 2, 0, 0))
h = bpy.context.active_object; h.name = 'mug_handle'; h.data.materials.append(M['ceramic'])
for p in h.data.polygons: p.use_smooth = True
cyl('coffee', 0.037, 0.002, (MX, MY, DESK_Z + 0.082), M['coffee'])

# phone, face down: aluminium back with a camera bump
PX, PY = -0.27, -0.2
ph = box('phone', (0.072, 0.147, 0.008), (PX, PY, DESK_Z + 0.004), M['alu_dark'], bevel=0.009, segments=6, rot=(0, 0, math.radians(14)))
box('phone_cam', (0.03, 0.03, 0.002), (PX - 0.01, PY + 0.05, DESK_Z + 0.009), M['glass_black'], bevel=0.006, rot=(0, 0, math.radians(14)))

# speaker: a small fabric sphere with a glossy top
SX, SY = 0.66, 0.02
bpy.ops.mesh.primitive_uv_sphere_add(segments=64, ring_count=32, radius=0.05, location=(SX, SY, DESK_Z + 0.042))
sp = bpy.context.active_object; sp.name = 'speaker'; sp.scale = (1, 1, 0.85); sp.data.materials.append(M['fabric'])
for p in sp.data.polygons: p.use_smooth = True
cyl('speaker_top', 0.026, 0.002, (SX, SY, DESK_Z + 0.084), mat('speaker top', (0.02, 0.02, 0.025), rough=0.1, coat=1,
    emit=(0.55, 0.45, 1.0), emit_strength=0.0))

# minimal arc lamp
LX, LY = -0.66, 0.24
cyl('lamp_base', 0.075, 0.012, (LX, LY, DESK_Z + 0.006), M['lamp_white'], bevel=0.004)
curve = bpy.data.curves.new('lamp_arc', 'CURVE'); curve.dimensions = '3D'; curve.bevel_depth = 0.0055; curve.bevel_resolution = 4
spl = curve.splines.new('BEZIER'); spl.bezier_points.add(1)
p0, p1 = spl.bezier_points
p0.co = (LX, LY, DESK_Z + 0.01); p0.handle_left = (LX, LY, DESK_Z - 0.1); p0.handle_right = (LX, LY - 0.02, DESK_Z + 0.45)
p1.co = (LX + 0.34, LY - 0.12, DESK_Z + 0.56); p1.handle_left = (LX + 0.12, LY - 0.08, DESK_Z + 0.62); p1.handle_right = (LX + 0.45, LY - 0.14, DESK_Z + 0.52)
arc = bpy.data.objects.new('lamp_arc', curve); col.objects.link(arc); arc.data.materials.append(M['lamp_white'])
HEAD = Vector((LX + 0.36, LY - 0.125, DESK_Z + 0.555))
cyl('lamp_head', 0.075, 0.014, HEAD, M['lamp_white'], bevel=0.005)
lamp_on = VARIANT == 'lamp_on'
cyl('lamp_diffuser', 0.066, 0.002, HEAD - Vector((0, 0, 0.008)), mat('diffuser', (1, 0.95, 0.88), rough=0.5,
    emit=(1.0, 0.86, 0.68), emit_strength=40.0 if lamp_on else 0.0))
if lamp_on:
    ld = bpy.data.lights.new('lamp_light', 'SPOT'); ld.energy = 150; ld.spot_size = math.radians(120); ld.spot_blend = 0.7
    ld.color = (1.0, 0.82, 0.62); ld.shadow_soft_size = 0.06
    lo = bpy.data.objects.new('lamp_light', ld); lo.location = HEAD - Vector((0, 0, 0.012)); col.objects.link(lo)

# ---------------------------------------------------------------- Poly Haven props
def append_all(path, name, loc, scale=1.0, rot_z=0.0, keep=None):
    with bpy.data.libraries.load(path) as (src, dst):
        dst.objects = [n for n in src.objects if keep is None or keep(n)]
    root = bpy.data.objects.new(name, None); col.objects.link(root)
    for o in dst.objects:
        if o is None: continue
        col.objects.link(o)
        if o.parent is None: o.parent = root
    root.location = loc; root.scale = (scale, scale, scale); root.rotation_euler = (0, 0, rot_z)
    return root

plant = append_all(f'{A}/potted_plant_02/potted_plant_02_1k.blend', 'plant', (-0.98, 0.34, DESK_Z), scale=0.62, rot_z=math.radians(20))
picks = ['book_hardcover_01_cover34', 'book_hardcover_01_cover41', 'book_hardcover_01_cover65', 'book_hardcover_01_cover48',
         'book_hardcover_01_cover80', 'book_hardcover_01_cover29', 'book_hardcover_01_cover62']
with bpy.data.libraries.load(f'{A}/decorative_book_set_01/decorative_book_set_01_1k.blend') as (src, dst):
    dst.objects = [n for n in src.objects if n in picks]
books = []
bx = 0.42
for o in dst.objects:
    col.objects.link(o)
    hw = max(abs(v[0]) for v in o.bound_box)
    o.rotation_euler = (0, 0, 0)
    o.location = (bx + hw, 0.3, DESK_Z)
    bx += 2 * hw + 0.002
    books.append(o)
box('bookend', (0.004, 0.13, 0.17), (bx + 0.004, 0.3, DESK_Z + 0.085), M['alu'], bevel=0.0015)
frame = append_all(f'{A}/standing_picture_frame_01/standing_picture_frame_01_1k.blend', 'photo_frame', (0.86, 0.12, DESK_Z), scale=0.9, rot_z=math.radians(-24))

# ---------------------------------------------------------------- world + fill light
world = bpy.data.worlds.new('world'); scene.world = world; world.use_nodes = True
nt = world.node_tree; nt.nodes.clear()
wo = nt.nodes.new('ShaderNodeOutputWorld'); bg = nt.nodes.new('ShaderNodeBackground'); et = nt.nodes.new('ShaderNodeTexEnvironment')
tc = nt.nodes.new('ShaderNodeTexCoord'); mp = nt.nodes.new('ShaderNodeMapping')
et.image = bpy.data.images.load(f'{A}/shanghai_bund_4k.hdr')
mp.inputs['Rotation'].default_value = (0, 0, math.radians(YAW))
mp.inputs['Location'].default_value = (0, 0, -0.04)
nt.links.new(tc.outputs['Generated'], mp.inputs['Vector']); nt.links.new(mp.outputs['Vector'], et.inputs['Vector'])
nt.links.new(et.outputs['Color'], bg.inputs['Color']); bg.inputs['Strength'].default_value = 0.55
nt.links.new(bg.outputs[0], wo.inputs['Surface'])
fd = bpy.data.lights.new('fill', 'AREA'); fd.energy = 6 if lamp_on else 2.5; fd.size = 2.5; fd.color = (0.75, 0.78, 1.0)
fo = bpy.data.objects.new('fill', fd); fo.location = (0, -1.2, 2.9); col.objects.link(fo)

# ---------------------------------------------------------------- camera
cd = bpy.data.cameras.new('cam'); cd.lens = 34; cd.sensor_width = 36
cd.dof.use_dof = True; cd.dof.aperture_fstop = 3.2
cam = bpy.data.objects.new('cam', cd); col.objects.link(cam); scene.camera = cam
cam.location = (0.0, -1.62, 1.2)
target = Vector((0.0, 0.3, 1.0))
cam.rotation_euler = (target - cam.location).to_track_quat('-Z', 'Y').to_euler()
cd.dof.focus_distance = (Vector((DX, DY, DZ)) - cam.location).length

# ---------------------------------------------------------------- render settings
scene.render.engine = 'CYCLES'
scene.cycles.device = 'CPU'
scene.cycles.samples = SAMPLES
scene.cycles.use_denoising = True
scene.cycles.denoiser = 'OPENIMAGEDENOISE'
scene.cycles.max_bounces = 8
scene.cycles.caustics_reflective = False; scene.cycles.caustics_refractive = False
scene.cycles.blur_glossy = 1.0
scene.render.resolution_x = W; scene.render.resolution_y = H; scene.render.resolution_percentage = 100
scene.view_settings.view_transform = 'AgX'
scene.view_settings.look = 'AgX - Medium High Contrast'
scene.view_settings.exposure = 0.0
scene.render.image_settings.file_format = 'PNG'
scene.render.filepath = os.path.join(OUT, f'render_{VARIANT}.png')
bpy.context.view_layer.update()

# ---------------------------------------------------------------- layout export
def px(v):
    c = world_to_camera_view(scene, cam, Vector(v))
    return [round(c.x * W, 2), round((1 - c.y) * H, 2)]
def corners(o):
    return [o.matrix_world @ Vector(c) for c in o.bound_box]
def rect_of(objs):
    pts = [px(v) for o in objs for v in corners(o)]
    xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
    return [round(min(xs)), round(min(ys)), round(max(xs)), round(max(ys))]
def descendants(root):
    return [o for o in bpy.data.objects if o.type == 'MESH' and (o.parent == root or (o.parent and o.parent.parent == root))]
sy = DY - BD / 2 - 0.0025
layout = {
    'size': [W, H],
    'screen': [px((DX - SW / 2, sy, DZ + SH / 2)), px((DX + SW / 2, sy, DZ + SH / 2)), px((DX + SW / 2, sy, DZ - SH / 2)), px((DX - SW / 2, sy, DZ - SH / 2))],
    'window': [px((win['x0'], fy, win['z1'])), px((win['x1'], fy, win['z1'])), px((win['x1'], fy, win['z0'])), px((win['x0'], fy, win['z0']))],
    'hot': {
        'lamp': rect_of([o for o in bpy.data.objects if o.name.startswith('lamp_') and o.type in ('MESH', 'CURVE')]),
        'plant': rect_of(descendants(plant)),
        'mug': rect_of([bpy.data.objects['mug'], bpy.data.objects['mug_handle']]),
        'keyboard': rect_of([bpy.data.objects['kb_body']]),
        'trackpad': rect_of([bpy.data.objects['trackpad']]),
        'phone': rect_of([bpy.data.objects['phone']]),
        'speaker': rect_of([bpy.data.objects['speaker']]),
        'frame': rect_of(descendants(frame)),
        'books': [rect_of([b]) for b in books],
    },
}
# ---- mask variant: glass = white, everything else = black (emission only, so a few samples are clean)
black = bpy.data.materials.new('mask_black'); black.use_nodes = True
nt = black.node_tree; nt.nodes.clear(); o_ = nt.nodes.new('ShaderNodeOutputMaterial'); e_ = nt.nodes.new('ShaderNodeEmission')
e_.inputs['Color'].default_value = (0, 0, 0, 1); nt.links.new(e_.outputs[0], o_.inputs['Surface'])
white = bpy.data.materials.new('mask_white'); white.use_nodes = True
nt = white.node_tree; nt.nodes.clear(); o_ = nt.nodes.new('ShaderNodeOutputMaterial'); e_ = nt.nodes.new('ShaderNodeEmission')
e_.inputs['Color'].default_value = (1, 1, 1, 1); nt.links.new(e_.outputs[0], o_.inputs['Surface'])
for ob in bpy.data.objects:
    if ob.type in ('MESH', 'CURVE'):
        mats = ob.data.materials
        for i in range(len(mats)): mats[i] = white if ob.name == 'glass' else black
        for slot in ob.material_slots: slot.link = 'DATA'
    if ob.type == 'LIGHT': ob.hide_render = True
bg.inputs['Strength'].default_value = 0.0
scene.cycles.samples = 16; scene.cycles.use_denoising = False
scene.view_settings.view_transform = 'Standard'; scene.view_settings.look = 'None'; scene.view_settings.exposure = 0
scene.render.filepath = os.path.join(OUT, 'mask.png')
bpy.ops.render.render(write_still=True)
print('done', scene.render.filepath)

print('done', scene.render.filepath)
