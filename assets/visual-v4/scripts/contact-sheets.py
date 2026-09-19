"""Render side-by-side visual QA sheets; these are verification artifacts only."""
import json
from pathlib import Path
from PIL import Image, ImageDraw
root=Path(__file__).resolve().parents[1]
screens=json.loads((root/'screens.json').read_text())
for offset in range(0,len(screens),6):
    sheet=Image.new('RGB',(1500,1250),'#242424')
    draw=ImageDraw.Draw(sheet)
    for i,s in enumerate(screens[offset:offset+6]):
        x=(i%3)*500; y=(i//3)*625
        draw.text((x+10,y+10),s['name'],fill='white')
        draw.text((x+10,y+28),'Figma source     |     Browser implementation',fill='#cccccc')
        for j,p in enumerate([root/'verification'/('figma-'+s['referenceId'].replace(':','-')+'.png'),root/'verification'/('browser-'+s['key']+'.png')]):
            im=Image.open(p).convert('RGB');im.thumbnail((242,570))
            sheet.paste(im,(x+4+j*250,y+48))
    sheet.save(root/'verification'/f'comparison-sheet-{offset//6+1}.png')
