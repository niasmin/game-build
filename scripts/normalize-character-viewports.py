"""Derive consistent character viewports from visible pixels in recovered idle sheets.
Requires Pillow. Does not change source animations or sprite-sheet pixels.
"""
import json
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
manifest_path = root / 'public/assets/recovered/characters/sprite-sheets.json'
manifest = json.loads(manifest_path.read_text())
for character in manifest['characters']:
    idle = character['animations']['idle']
    image = Image.open(root / idle['file'])
    width, height = character['frame_width'], character['frame_height']
    boxes = [image.crop((i * width, 0, (i + 1) * width, height)).getbbox()
             for i in range(idle['frames'])]
    boxes = [box for box in boxes if box]
    if not boxes:
        raise ValueError(f"Empty idle animation: {character['id']}")
    left = max(0, min(box[0] for box in boxes) - 10)
    top = max(0, min(box[1] for box in boxes) - 10)
    right = min(width, max(box[2] for box in boxes) + 10)
    bottom = min(height, max(box[3] for box in boxes) + 10)
    character['crop'] = dict(x=left, y=top, width=right-left, height=bottom-top)
manifest_path.write_text(json.dumps(manifest, indent=2))
print(f"Normalized {len(manifest['characters'])} original character viewports")
