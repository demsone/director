#!/usr/bin/env python3
"""Extract only photograph fills from supplied reference exports.

This recovers the actual approved visible crops when an original image hash
is missing. It does not rasterize typography, cards, forms, or other UI.
"""
import hashlib
import json
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
pack = root.parent / 'director-design-pack'
doc = json.loads((pack / 'director-v2-5-naming-cleaned-figma-export.json').read_text())
refs = json.loads((root / 'scripts/reference-map.json').read_text())
frames = {n['name']: n for p in doc['pages'] for n in p['nodes']}
screens = json.loads((root / 'screens.json').read_text())
assets = {}
variants = {}

def walk(n):
    if not n.get('visible', True): return
    yield n
    for c in n.get('children', []): yield from walk(c)

for screen in screens:
    reference = refs.get(screen['path'].removesuffix('.html'))
    if not reference: continue
    image = Image.open(pack / 'screenshots' / reference)
    frame = frames[screen['name']]
    origin = frame['absoluteBoundingBox']
    scale = image.width / origin['width']
    for node in walk(frame):
        paints = node.get('fills', [])
        if not isinstance(paints, list): continue
        for paint in paints:
            if paint.get('type') != 'IMAGE' or not paint.get('visible', True): continue
            if paint['imageHash'] not in ['b981913e54cf80fc0f1ad334466adde221cc8563', 'db48795d10e120f671cfc659fad7de2d1034bb47']: continue
            b = node['absoluteBoundingBox']
            key = json.dumps([paint['imageHash'], paint.get('scaleMode'), paint.get('imageTransform'), b['width'], b['height']])
            if key not in variants:
                filename = 'photo-' + hashlib.sha256(key.encode()).hexdigest()[:12] + '.png'
                x,y = (b['x']-origin['x'])*scale, (b['y']-origin['y'])*scale
                crop = image.crop((round(x),round(y),round(x+b['width']*scale),round(y+b['height']*scale)))
                crop.save(root / 'assets/images' / filename)
                variants[key] = {'path':'assets/images/'+filename,'reference':reference,'sourceNode':node['id'],'sourceBox':b}
            assets[node['id']] = variants[key]['path']

(root/'assets/photo-map.json').write_text(json.dumps(assets,indent=2)+'\n')
(root/'assets/photo-provenance.json').write_text(json.dumps(list(variants.values()),indent=2)+'\n')
print(f'Extracted {len(variants)} approved photograph crops for {len(assets)} visible image nodes.')
