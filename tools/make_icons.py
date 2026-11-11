# Draws the app icon: a powder-blue bowl of rice with a fried egg and a green leaf, royal-blue outlines on bone.
# Usage: python tools/make_icons.py <app dir>
import sys
from PIL import Image, ImageDraw
INK, BONE, SKY, PAPER, GOLD, GREEN = "#162660", "#F1E4D1", "#D0E6FD", "#fbf6ee", "#f3c766", "#a9d18e"
def icon(size):
    S = 4 * size
    im = Image.new("RGB", (S, S), BONE)
    d = ImageDraw.Draw(im)
    u = S / 100
    w = int(3.2 * u)
    box = lambda x0, y0, x1, y1: [x0 * u, y0 * u, x1 * u, y1 * u]
    d.ellipse(box(60, 22, 84, 46), fill=GREEN, outline=INK, width=w)          # leaf behind
    d.pieslice(box(22, 20, 78, 76), 180, 360, fill=PAPER, outline=INK, width=w)  # rice mound
    d.pieslice(box(20, 14, 80, 82), 0, 180, fill=SKY, outline=INK, width=w)     # bowl
    d.rounded_rectangle(box(17, 45, 83, 51), radius=3 * u, fill=SKY, outline=INK, width=w)  # rim
    d.ellipse(box(36, 24, 60, 44), fill=PAPER, outline=INK, width=w)            # egg white
    d.ellipse(box(43, 29, 54, 40), fill=GOLD, outline=INK, width=int(2.4 * u))  # yolk
    return im.resize((size, size), Image.LANCZOS)
out = sys.argv[1]
for name, s in [("icon-192.png", 192), ("icon-512.png", 512), ("apple-touch-icon.png", 180)]:
    icon(s).save(f"{out}/{name}")
