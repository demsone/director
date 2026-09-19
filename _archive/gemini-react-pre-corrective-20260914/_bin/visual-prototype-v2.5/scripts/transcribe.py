#!/usr/bin/env python3
"""Emit fixed-size, static HTML/CSS from the approved v2.5 export.

The export is a design input at build time, never product data at runtime.
Visible Figma text remains real HTML text. Shapes remain CSS, vectors use
the supplied SVGs. No API, persistence, or application behavior is added.
"""
import html
import json
import re
import struct
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT.parent / 'director-design-pack/director-v2-5-naming-cleaned-figma-export.json'
D = json.loads(SOURCE.read_text())
SCREENS = [
    'Director / New Feedback', 'Director / Feedback + Chat',
    'Director / New Compare', 'Director / Compare',
    'Darkroom / Library', 'Darkroom / Quick View', 'Darkroom / Feedback + Chat',
    'Projects / All', 'Projects / Quick View', 'Projects / Detail / Overview',
    'Projects / Detail / Feedback', 'Project / Settings', 'Feedback / Detail',
    'Prompts / All', 'Prompts / Edit', 'Settings / Models',
    'Settings / Personalisation', 'Settings / Appearance', 'Compare / Result',
]
FRAMES = {n['name']: n for p in D['pages'] for n in p['nodes'] if n['name'] in SCREENS}
assert set(FRAMES) == set(SCREENS)
WEIGHTS = {'Light': 300, 'Regular': 400, 'Medium': 500, 'SemiBold': 600, 'Bold': 700, 'ExtraBold': 800}
CSS = []
STYLE_IDS = {}
ISSUES = set()
PHOTO_MAP = json.loads((ROOT/'assets/photo-map.json').read_text()) if (ROOT/'assets/photo-map.json').exists() else {}

def slug(name):
    return re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')

def esc(value):
    return html.escape(str(value), quote=True)

def px(n):
    return f'{round(float(n), 3):g}px'

def visible_paints(paints):
    return [p for p in paints if p.get('visible', True)] if isinstance(paints, list) else []

def rgba(p):
    c = p.get('color', p)
    return 'rgba(%s,%s,%s,%s)' % (round(c.get('r', 0)*255), round(c.get('g', 0)*255), round(c.get('b', 0)*255), round(c.get('a', 1)*p.get('opacity', 1), 4))

VARIABLES = {v['id']: v for c in D['localVariables'] for v in c.get('variables', [])}
VAR_NAMES = {v['id']: '--' + slug(c['name'] + '/' + v['name']) for c in D['localVariables'] for v in c.get('variables', [])}

def color(p):
    alias = p.get('boundVariables', {}).get('color', {}).get('id')
    # Paint opacity belongs to the paint; leave it literal when not opaque.
    if alias in VAR_NAMES and p.get('opacity', 1) == 1:
        return f'var({VAR_NAMES[alias]}, {rgba(p)})'
    return rgba(p)

def var_value(v):
    x = next(iter(v.get('valuesByMode', {}).values()), None)
    if isinstance(x, dict) and x.get('type') == 'VARIABLE_ALIAS':
        return f'var({VAR_NAMES[x["id"]]})' if x['id'] in VAR_NAMES else None
    if isinstance(x, dict) and 'r' in x:
        return rgba(x)
    if isinstance(x, str): return json.dumps(x)
    if isinstance(x, (int, float)) and not isinstance(x, bool): return str(x)
    return None

tokens = [f'  {VAR_NAMES[k]}: {var_value(v)};' for k,v in VARIABLES.items() if var_value(v) is not None]
(ROOT / 'tokens.css').write_text('/* Supplied Director Figma variables; names retain collection and path. */\n:root {\n'+'\n'.join(tokens)+'\n}\n')

def font_metrics(family, style):
    stem = {'Plus Jakarta Sans':'PlusJakartaSans', 'IBM Plex Mono':'IBMPlexMono'}.get(family)
    file = ROOT/'assets/fonts'/f'{stem}-{style}.ttf'
    if family=='JetBrains Mono': file=ROOT/'assets/fonts/JetBrainsMono-Variable.ttf'
    if not file.exists(): return (1, .75, 1.04, -.3)
    b = file.read_bytes()
    tables = {}
    for i in range(struct.unpack_from('>H', b, 4)[0]):
        tag, _, offset, length = struct.unpack_from('>4sIII', b, 12+i*16)
        tables[tag.decode()] = offset
    units = struct.unpack_from('>H',b,tables['head']+18)[0]
    asc, desc = struct.unpack_from('>hh',b,tables['hhea']+4)
    cap = struct.unpack_from('>h',b,tables['OS/2']+88)[0]
    return units, cap/units, asc/units, desc/units

def type_style(s):
    font = s.get('fontName', {'family':'Plus Jakarta Sans','style':'Regular'})
    family, style = font['family'], font['style']
    size = s.get('fontSize', 14)
    lh = s.get('lineHeight', {})
    line = lh.get('value', size*1.3) if lh.get('unit') == 'PIXELS' else size*lh.get('value',130)/100
    letter = s.get('letterSpacing', {})
    spacing = letter.get('value', 0)*(size/100 if letter.get('unit')=='PERCENT' else 1)
    paints = visible_paints(s.get('fills', []))
    variations=font.get('variationSettings',{})
    d = {'font-family': f'"{family}"' + (',-apple-system,BlinkMacSystemFont' if family=='SF Pro' else ''), 'font-weight': str(variations.get('wght',WEIGHTS.get(style,400))), 'font-size':px(size), 'line-height':px(line), 'letter-spacing':px(spacing)}
    if variations: d['font-variation-settings']=','.join(f'"{axis}" {value}' for axis,value in variations.items())
    if paints: d['color'] = color(paints[-1])
    if s.get('textDecoration') == 'UNDERLINE': d['text-decoration']='underline'
    if s.get('textCase') in ['UPPER','LOWER','TITLE']: d['text-transform']={'UPPER':'uppercase','LOWER':'lowercase','TITLE':'capitalize'}[s['textCase']]
    return d

def css_class(d):
    key = ';'.join(f'{k}:{v}' for k,v in d.items())
    if key not in STYLE_IDS:
        name = 'f' + str(len(STYLE_IDS))
        STYLE_IDS[key] = name
        CSS.append(f'.{name}'+'{'+key+'}')
    return STYLE_IDS[key]

def text_content(n):
    return ''.join(c.get('text',{}).get('characters','') for c in walk(n))

def walk(n):
    yield n
    for c in n.get('children',[]):
        if c.get('visible',True): yield from walk(c)

def route(n, screen, ancestry):
    name = n['name']
    copy = text_content(n).strip()
    if name == 'Navigation / Item':
        return {'Director':'Director / New Feedback','Darkroom':'Darkroom / Library','Projects':'Projects / All','Prompts':'Prompts / All','Settings':'Settings / Models'}.get(copy)
    if name == 'Navigation / Tab' or (n['type']=='TEXT' and any('tab' in a.lower() or 'setting' in a.lower() for a in ancestry)):
        if screen.startswith('Settings /'):
            return {'Model':'Settings / Models','Models':'Settings / Models','Personalisation':'Settings / Personalisation','Appearance':'Settings / Appearance','Prompts':'Prompts / All'}.get(copy)
        if screen.startswith('Projects / Detail'):
            return {'Overview':'Projects / Detail / Overview','Feedback':'Projects / Detail / Feedback'}.get(copy)
        if screen.startswith('Director /'):
            return {'Feedback':'Director / New Feedback','Compare':'Director / New Compare'}.get(copy)
    if name == 'UI / File Thumb':
        return 'Projects / Quick View' if screen.startswith('Projects /') else 'Darkroom / Quick View'
    if name == 'UI / Card' and screen == 'Projects / All': return 'Projects / Detail / Overview'
    if name == 'UI / Card' and screen == 'Prompts / All': return 'Prompts / Edit'
    if name == 'button-close' or (name == 'UI / Icon' and 'button-close' in [c['name'] for c in walk(n)]):
        return {'Prompts / Edit':'Prompts / All','Projects / Quick View':'Projects / Detail / Overview','Darkroom / Quick View':'Darkroom / Library'}.get(screen)
    if name == 'UI / Button':
        if copy.upper() == 'ADD NEW FEEDBACK': return 'Director / New Feedback'
        if copy.upper() == 'ADD PROMPT': return 'Prompts / Edit'
        if copy.upper() in ['VIEW FFULL FEEDBACK','VIEW FULL FEEDBACK']:
            return 'Feedback / Detail' if screen.startswith('Projects') else 'Darkroom / Feedback + Chat'
        if screen == 'Project / Settings' and copy.upper() in ['CANCEL','SAVE']: return 'Projects / Detail / Overview'
        if screen == 'Prompts / Edit' and copy.upper() == 'CANCEL': return 'Prompts / All'
    if name == 'pencil' and screen.startswith('Projects / Detail'): return 'Project / Settings'
    if name == 'pencil' and screen == 'Prompts / All': return 'Prompts / Edit'
    return None

def render(n, parent, screen, ancestry=(), in_link=False):
    if not n.get('visible',True): return ''
    b = n['absoluteBoundingBox']
    x, y = b['x']-parent['x'], b['y']-parent['y']
    w, h = b['width'], b['height']
    d = {'left':px(x),'top':px(y),'width':px(w),'height':px(h)}
    if n.get('opacity',1) != 1: d['opacity']=str(n['opacity'])
    if n.get('layout',{}).get('clipsContent'): d['overflow']='hidden'
    radii = n.get('radii')
    if radii: d['border-radius']=' '.join(px(radii[k]) for k in ['topLeft','topRight','bottomRight','bottomLeft'])
    elif isinstance(n.get('cornerRadius'), (int,float)): d['border-radius']=px(n['cornerRadius'])
    if n['type']=='ELLIPSE': d['border-radius']='50%'
    fills = visible_paints(n.get('fills',[]))
    strokes = visible_paints(n.get('strokes',[]))
    inner = ''
    is_text = n['type']=='TEXT'
    is_icon = n['type'] in ['VECTOR','BOOLEAN_OPERATION','STAR'] and (ROOT/'assets/icons'/f'{n["name"]}.svg').exists()
    # These are bitmap backdrops in Figma itself. Only their visible portion is
    # extracted from the reference; all foreground panels stay HTML/CSS.
    is_backdrop = n['name']=='preview-image' and any(f.get('imageHash')=='9244974c80c3e214220cd730870ff524b6c0895c' for f in fills)
    if is_backdrop:
        d.update({'width':'952px','background-image':'url("assets/images/quick-view-backdrop.jpg")','background-size':'952px 1644px'})
    elif n['name']=='model-background' and screen in ['Darkroom / Quick View','Projects / Quick View','Prompts / Edit']:
        return ''  # The available reference backdrop already includes this veil.
    elif not is_text and not is_icon:
        backgrounds=[]
        for f in reversed(fills):
            if f['type']=='SOLID': backgrounds.append(f'linear-gradient({color(f)},{color(f)})')
            elif f['type']=='IMAGE':
                if f['imageHash']=='d252e1e2efd3c430498ecc702b93928826f4f47c':
                    ISSUES.add('Project / Settings: original bitmap backdrop d252e1e2efd3c430498ecc702b93928826f4f47c is absent; no substitute background screen has been invented.')
                else:
                    photo=PHOTO_MAP.get(n['id'], 'assets/images/image.jpg.jpg')
                    backgrounds.append(f'url("{photo}")')
                    d['background-size']='100% 100%' if n['id'] in PHOTO_MAP else 'cover'
                    d['background-position']='center'
                    if f['imageHash']=='db48795d10e120f671cfc659fad7de2d1034bb47' and n['id'] not in PHOTO_MAP:
                        ISSUES.add('Library image fill db48795d10e120f671cfc659fad7de2d1034bb47 has no original asset; the supplied 549 × 330 photograph is used. Original full-resolution crop cannot be verified.')
        if backgrounds: d['background-image']=','.join(backgrounds)
    if strokes and not is_icon:
        weight=n.get('strokeWeight',1)
        if weight=='MIXED':
            if n['name']=='sidebar':d['box-shadow']=f'inset -1px 0 {color(strokes[-1])}'
            elif n['name']=='Navigation / Item':d['box-shadow']=f'inset 2px 0 {color(strokes[-1])}'
            elif n['name']=='Navigation / Tab':d['box-shadow']=f'inset 0 -2px {color(strokes[-1])}'
            elif n['name']=='Quick View / Drawer':d['box-shadow']=f'inset 1px 0 {color(strokes[-1])}'
            elif n['name'] in ['Navigation / Tabs','tab navigation','top-bar','activity box','feedback-title','Settings / Details']:
                d['box-shadow']=f'inset 0 -1px {color(strokes[-1])}'
            else:ISSUES.add(f'Mixed edge stroke omitted from export for {n["name"]}; reference checked where available.')
        elif weight:
            if n['type']=='LINE': d['height']=px(weight);d['background-color']=color(strokes[-1])
            else: d['box-shadow']=f'inset 0 0 0 {px(weight)} {color(strokes[-1])}'
    if not is_icon:
        effects=[]
        for fx in n.get('effects',[]):
            if not fx.get('visible',True): continue
            if fx['type'] in ['DROP_SHADOW','INNER_SHADOW']:
                off=fx.get('offset',{})
                effects.append(('inset ' if fx['type']=='INNER_SHADOW' else '')+f'{px(off.get("x",0))} {px(off.get("y",0))} {px(fx["radius"])} {px(fx.get("spread",0))} {rgba(fx["color"])}')
            if fx['type']=='BACKGROUND_BLUR': d['backdrop-filter']=f'blur({px(fx["radius"])})'
            if fx['type']=='LAYER_BLUR': d['filter']=f'blur({px(fx["radius"])})'
        if effects:d['box-shadow']=','.join(([d['box-shadow']] if 'box-shadow' in d else [])+effects)
    if is_text:
        if n['id']=='I4013:3176;4013:3111;88:1185':
            d['overflow']='hidden'
            ISSUES.add('Prompts / All: first description has 318 characters in a fixed 31px-high text box. Bounds and full copy are preserved with overflow clipped; exact Figma truncation treatment is absent from the JSON and has no supplied screenshot.')
        segments=n['text'].get('segments',[])
        d.update(type_style(segments[0]) if segments else {})
        d.update({'white-space':'pre-wrap','overflow-wrap':'normal'})
        spans=''.join(f'<span class="{css_class(type_style(s))}">{esc(s["characters"])}</span>' for s in segments)
        if not segments:spans=esc(n['text']['characters'])
        # Figma uses cap-height trim on most of these text styles. The JSON
        # includes the trimmed geometry but not text-box-trim, so recover its
        # baseline from the bundled font's real hhea and OS/2 metrics.
        if segments:
            s=segments[0];sz=s['fontSize'];font=s['fontName'];line=float(type_style(s)['line-height'][:-2])
            _,cap,asc,desc=font_metrics(font['family'],font['style'])
            remainder=h%line
            trimmed=abs(remainder-sz*cap)<1.1 or h<line-2 or n['id']=='I4013:3176;4013:3111;88:1185'
            offset=(line-sz*(asc-desc))/2+sz*asc-sz*cap if trimmed else 0
            # Exported text boxes are rounded to integer pixels. A 1px text
            # layout allowance preserves Figma's line breaks at that rounding
            # boundary; the actual positioned node box remains unchanged.
            text_d={'display':'block','position':'relative','top':px(-offset),'width':'calc(100% + 1px)'}
            inner=f'<span class="{css_class(text_d)}">{spans}</span>'
        else: inner=spans
        fills=[]
    elif is_icon:
        # Exported SVG bounds include stroke/effect extents, unlike the node box.
        if n['name']=='status-active':
            d.update({'left':px(x-3),'top':px(y-3),'width':px(w+6),'height':px(h+6)})
        inner=f'<img src="assets/icons/{esc(n["name"])}.svg" alt="" width="{w}" height="{h}" draggable="false">'
    target=None if in_link else route(n,screen,ancestry)
    if not is_text and not is_icon and not is_backdrop:
        inner += ''.join(render(c,b,screen,ancestry+(n['name'],),in_link or bool(target)) for c in n.get('children',[]))
    tag='a' if target else 'div'
    attr=f' href="{slug(target)}.html" aria-label="{esc(target)}"' if target else ''
    return f'<{tag} class="node {css_class(d)}" data-node="{esc(n["id"])}" data-name="{esc(n["name"])}"{attr}>{inner}</{tag}>'

font_css=[]
font_css.append('@font-face{font-family:"JetBrains Mono";src:url("assets/fonts/JetBrainsMono-Variable.ttf") format("truetype");font-weight:100 800;font-style:normal;font-display:block}')
for family, stem in [('Plus Jakarta Sans','PlusJakartaSans'),('IBM Plex Mono','IBMPlexMono')]:
    for style,weight in WEIGHTS.items():
        f=f'{stem}-{style}.ttf'
        if (ROOT/'assets/fonts'/f).exists():font_css.append(f'@font-face{{font-family:"{family}";src:url("assets/fonts/{f}") format("truetype");font-weight:{weight};font-style:normal;font-display:block}}')

manifest=[]
for name in SCREENS:
    root=FRAMES[name];b=root['absoluteBoundingBox']
    body=render(root,b,name)
    doc=f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>{esc(name)} — Director v2.5 visual prototype</title><link rel="stylesheet" href="tokens.css"><link rel="stylesheet" href="prototype.css"></head>
<body><main aria-label="{esc(name)}" class="source-frame" style="width:{px(b['width'])};height:{px(b['height'])}">{body}</main></body></html>'''
    (ROOT/f'{slug(name)}.html').write_text(doc)
    manifest.append({'name':name,'path':slug(name)+'.html','nodeId':root['id'],'width':b['width'],'height':b['height']})

base='''/* Fixed Figma geometry. No responsive reinterpretation or product logic. */
*{box-sizing:border-box}html,body{margin:0;padding:0;background:#171717;color:#f2f0ed;-webkit-font-smoothing:antialiased}body{font-family:"Plus Jakarta Sans"}.source-frame{position:relative;isolation:isolate}.node{position:absolute;margin:0;padding:0;border:0;text-decoration:none;color:inherit}.node>img{display:block;width:100%;height:100%}a.node{cursor:pointer}a.node:focus-visible{outline:2px solid #b95a36;outline-offset:2px}img{user-select:none}
'''
(ROOT/'prototype.css').write_text(base+'\n'.join(font_css)+'\n'+'\n'.join(CSS)+'\n')
(ROOT/'screens.json').write_text(json.dumps(manifest,indent=2)+'\n')
links=''.join(f'<li><a href="{x["path"]}">{esc(x["name"])}</a> <small>{x["width"]:g} × {x["height"]:g}</small></li>' for x in manifest)
(ROOT/'index.html').write_text(f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Director v2.5 — Screen index</title><link rel="stylesheet" href="prototype.css"><style>body{{padding:40px;max-width:1000px}}h1{{font-size:28px}}p{{color:#a8a6a3;line-height:1.7}}li{{margin:14px 0}}a{{color:#f2f0ed}}small{{color:#a8a6a3;margin-left:12px}}</style></head><body><h1>Director v2.5 — Visual prototype</h1><p>Review index, outside the product UI. Each link opens one approved static state at its original 1512px width. Use browser Back to return here. Narrow windows scroll horizontally; the design does not reflow. Product controls are static except links between designed states.</p><ol>{links}</ol><p>Source checks pending: the Project Settings bitmap backdrop is absent, and the first Prompts card's text truncation is unspecified. See <a href="SOURCE-NOTES.md">source notes</a>.</p></body></html>''')
(ROOT/'verification/export-issues.json').write_text(json.dumps(sorted(ISSUES),indent=2)+'\n')
print(f'Emitted {len(manifest)} static screens, {len(STYLE_IDS)} exact geometry/type styles, and {len(tokens)} source tokens.')
print('\n'.join(sorted(ISSUES)))
