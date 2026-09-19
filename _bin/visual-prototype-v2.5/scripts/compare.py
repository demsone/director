#!/usr/bin/env python3
"""Build review evidence from the supplied reference and browser screenshots."""
from pathlib import Path
import json
from PIL import Image, ImageDraw

root = Path(__file__).resolve().parents[1]
references = root.parent / 'director-design-pack/screenshots'
mapping = json.loads((root/'scripts/reference-map.json').read_text())
for name, reference in mapping.items():
    source = Image.open(references/reference)
    rendered = Image.open(root/'verification'/f'{name}.png')
    w = 600
    h = round(w*rendered.height/rendered.width)
    comparison = Image.new('RGB', (1200,h+26), '#eeeeee')
    draw = ImageDraw.Draw(comparison)
    draw.text((10,6), name+' | reference', fill='black')
    draw.text((610,6), 'HTML/CSS', fill='black')
    comparison.paste(source.resize((w,h)), (0,26))
    comparison.paste(rendered.resize((w,h)), (600,26))
    comparison.save(root/'verification'/f'compare-{name}.jpg',quality=93)
print(f'Prepared {len(mapping)} reference comparisons.')
