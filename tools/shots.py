"""Phone screenshots of the app's screens via headless Edge (one 375px iframe per state).
Starts its own local server for the app folder.
Usage: python tools/shots.py <out.png> [height] [name filter]"""
import json, pathlib, subprocess, sys, time

app = pathlib.Path(__file__).resolve().parent.parent
out = pathlib.Path(sys.argv[1]).resolve()
H = int(sys.argv[2]) if len(sys.argv) > 2 else 780
only = sys.argv[3] if len(sys.argv) > 3 else ""
PORT = 8767
sd = app / "shots"; sd.mkdir(exist_ok=True)

def st(**kw):
    s = {"favs": [], "have": []}
    s.update(kw); return s

HAVE = ["egg", "cabbage", "tofu", "scallion", "rice", "onion", "napa"]
D = 'openRecipe("millefeuille-nabe");'
STATES = {
    "01_home": (st(favs=["egg-soup", "gambas"]), ""),
    "02_breakfast": (st(), 'go("meal:breakfast")'),
    "03_dinner_tofu": (st(have=HAVE, favs=["soft-tofu-stew"]), 'go("meal:dinner");fTag="tofu";render()'),
    "04_healthy": (st(), 'go("meal:healthy")'),
    "05_camping": (st(), 'go("meal:camping")'),
    "06_camping_low": (st(), 'go("meal:camping");scrollTo(0,1150)'),
    "07_detail": (st(), D),
    "08_detail_ing": (st(have=HAVE), D + 'checks[openId]={0:true,1:true};renderDetail();$("detail").scrollTop=470'),
    "09_detail_steps": (st(), D + '$("detail").scrollTop=1010'),
    "10_favs": (st(favs=["egg-soup", "gambas", "cabbage-jeon"]), 'go("favs")'),
    "11_pantry": (st(have=HAVE), 'go("pantry")'),
    "12_pantry_low": (st(have=HAVE), 'go("pantry");scrollTo(0,99999)'),
    # every dish drawing on one sheet — look here after adding a recipe
    "13_gallery": (st(), 'document.body.innerHTML="<div style=\\"display:grid;grid-template-columns:repeat(4,1fr);gap:4px;padding:4px\\">"+RECIPES.map(r=>"<div style=\\"background:#D0E6FD;border-radius:8px;padding:3px\\">"+ART.dish(r.art)+"</div>").join("")+"</div>"'),
}
if only:
    STATES = {k: v for k, v in STATES.items() if only in k}
for name, (state, act) in STATES.items():
    # State is written into the page itself (not shared localStorage), so the iframes can't race each other.
    js = ("fetch('../index.html').then(r=>r.text()).then(h=>{"
          "h=h.replace('<head>','<head><base href=\"../\">')"
          ".replace('let S = MENU.load(localStorage, DATA);'," + json.dumps("let S = " + json.dumps(state) + ";") + ")"
          ".replace('MENU.save(localStorage, S)','void 0')"
          ".replace('</body>','<script>setTimeout(()=>{' + " + json.dumps(act) + " + '},300)<\\/script></body>');"
          "document.open();document.write(h);document.close();});")
    (sd / f"{name}.html").write_text("<script>" + js + "</script>", encoding="utf-8")

frames = "".join(f'<iframe src="{n}.html" width="375" height="{H}" style="border:0;margin:6px"></iframe>' for n in STATES)
(sd / "wrap.html").write_text(f'<!doctype html><body style="margin:0;background:#666;white-space:nowrap">{frames}</body>', encoding="utf-8")
edge = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
out.unlink(missing_ok=True)
prof = out.parent / f"edge_profile_{time.time_ns()}"
server = subprocess.Popen([sys.executable, "-m", "http.server", str(PORT), "--bind", "127.0.0.1"], cwd=app, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
try:
    time.sleep(1)
    subprocess.run([edge, "--headless=new", "--disable-gpu", "--no-first-run", f"--user-data-dir={prof}", "--virtual-time-budget=6000",
                    "--hide-scrollbars", f"--window-size={len(STATES) * 387 + 12},{H + 12}", f"--screenshot={out}",
                    f"http://127.0.0.1:{PORT}/shots/wrap.html"], capture_output=True, timeout=120)
    for _ in range(20):
        if out.exists(): break
        time.sleep(0.5)
finally:
    server.terminate()
print("ok" if out.exists() else "failed", out)
