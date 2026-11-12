"""Turns dish photos into the app's format.
Put images in  사진원본/  named after the dish ("김치찌개.png", "짜장면.jpg" ... or the recipe id), then run:
    python tools/photos.py
Each one is cropped to 4:3, shrunk to 800x600 and saved as photos/<id>.jpg; photos.js (the list the app reads) is rewritten.
Dishes without a photo keep their drawing."""
import json, pathlib, subprocess, sys
from PIL import Image, ImageOps

app = pathlib.Path(__file__).resolve().parent.parent
src, out = app / "사진원본", app / "photos"
src.mkdir(exist_ok=True); out.mkdir(exist_ok=True)
recipes = json.loads(subprocess.run(
    ["node", "-e", "process.stdout.write(JSON.stringify(require('./recipes.js').RECIPES.map(r=>[r.id,r.name])))"],
    cwd=app, capture_output=True, check=True).stdout.decode("utf-8"))
key = lambda s: "".join(s.lower().split())
by = {}
for rid, name in recipes:
    by[key(rid)] = rid; by[key(name)] = rid

made, unknown = [], []
for f in sorted(src.iterdir()):
    if f.suffix.lower() not in (".png", ".jpg", ".jpeg", ".webp"): continue
    rid = by.get(key(f.stem))
    if not rid: unknown.append(f.name); continue
    im = ImageOps.exif_transpose(Image.open(f)).convert("RGB")
    ImageOps.fit(im, (800, 600), Image.LANCZOS).save(out / (rid + ".jpg"), quality=82, optimize=True)
    made.append(rid)

ids = [rid for rid, _ in recipes if (out / (rid + ".jpg")).exists()]
for f in out.glob("*.jpg"):
    if f.stem not in ids: print("요리 목록에 없는 사진(지워도 됨):", f.name)
(app / "photos.js").write_text(
    "// 사진이 있는 요리 목록. 직접 고치지 말고  python tools/photos.py  로 다시 만든다.\n"
    "(function (root) {\n  const P = " + json.dumps(ids) + ";\n"
    "  if (typeof module !== \"undefined\" && module.exports) module.exports = P; else root.PHOTOS = P;\n"
    "})(typeof self !== \"undefined\" ? self : this);\n", encoding="utf-8", newline="\n")
names = dict(recipes)
print(f"이번에 바꾼 사진 {len(made)}장 · 사진 있는 요리 {len(ids)}/{len(recipes)}")
if unknown: print("이름이 요리와 안 맞아 건너뜀:", ", ".join(unknown))
if "--missing" in sys.argv: print("사진 없는 요리:", ", ".join(names[r] for r, _ in recipes if r not in ids))
