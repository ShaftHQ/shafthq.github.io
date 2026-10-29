#!/usr/bin/env python3
"""Gate: community logo ink vs light tile bg >= 3:1 (mean) and failFrac <= 0.55."""
from __future__ import annotations
import json, re, sys
from pathlib import Path
from PIL import Image

ROOT = Path('static/img/community')
OUT = Path('audit/logo-contrast/gate-report.json')
TILE = (255, 255, 255)
MEAN_MIN = 3.0
FAIL_FRAC_MAX = 0.55

def rel_lum(rgb):
    def f(c):
        c = c / 255.0
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    return 0.2126 * f(rgb[0]) + 0.7152 * f(rgb[1]) + 0.0722 * f(rgb[2])

def contrast(l1, l2):
    a, b = max(l1, l2), min(l1, l2)
    return (a + 0.05) / (b + 0.05)

def raster_row(path: Path, Lbg: float) -> dict:
    im = Image.open(path).convert('RGBA')
    ink = fail = 0
    sum_l = 0.0
    for r, g, b, a in im.getdata():
        if a < 128:
            continue
        L = rel_lum((r, g, b))
        ink += 1
        sum_l += L
        if contrast(L, Lbg) < 3.0:
            fail += 1
    if ink == 0:
        return {'file': path.name, 'type': 'raster', 'ok': False, 'reason': 'NO_INK'}
    mean_c = contrast(sum_l / ink, Lbg)
    fail_frac = fail / ink
    ok = mean_c >= MEAN_MIN and fail_frac <= FAIL_FRAC_MAX
    return {'file': path.name, 'type': 'raster', 'ok': ok, 'meanC': round(mean_c, 2), 'failFrac': round(fail_frac, 3), 'ink': ink}

def svg_row(path: Path) -> dict:
    t = path.read_text(encoding='utf-8', errors='ignore')
    has_plate = '#102a31' in t.lower() or '#102A31' in t
    has_visible = bool(re.search(r'<path[^>]*fill=', t, re.I)) or bool(re.search(r'<rect[^>]*fill=', t, re.I))
    orphan = bool(re.search(r'<symbol', t, re.I)) and not re.search(r'<use', t, re.I) and not has_visible
    return {'file': path.name, 'type': 'svg', 'ok': not orphan, 'hasPlate': has_plate, 'orphanSymbol': orphan}

def referenced_files() -> set[str]:
    idx = Path('src/pages/index.tsx').read_text(encoding='utf-8')
    return set(re.findall(r"/img/community/([^'\"]+)", idx))

def main() -> int:
    Lbg = rel_lum(TILE)
    refs = referenced_files()
    rows = []
    for name in sorted(refs):
        p = ROOT / name
        if not p.exists():
            rows.append({'file': name, 'type': 'missing', 'ok': False, 'reason': 'MISSING'})
            continue
        ext = p.suffix.lower()
        if ext == '.svg':
            rows.append(svg_row(p))
        elif ext in {'.png', '.jpg', '.jpeg', '.webp', '.ico'}:
            rows.append(raster_row(p, Lbg))
        else:
            rows.append({'file': name, 'type': ext, 'ok': False, 'reason': 'UNSUPPORTED'})
    failed = [r for r in rows if not r['ok']]
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps({'tile': TILE, 'meanMin': MEAN_MIN, 'failFracMax': FAIL_FRAC_MAX, 'failed': len(failed), 'rows': rows}, indent=2) + '\n')
    print(json.dumps({'failed': len(failed), 'total': len(rows), 'fails': [r['file'] for r in failed]}, indent=2))
    return 1 if failed else 0

if __name__ == '__main__':
    sys.exit(main())
