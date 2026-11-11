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
    s = {"favs": [], "have": [], "cands": []}
    s.update(kw); return s

HAVE = ["egg", "cabbage", "tofu", "scallion", "rice", "onion", "napa"]
D = 'openRecipe("tofu-mushroom-hotpot");'
STATES = {
    "01_today": (st(), ""),
    "02_today_cands": (st(cands=["beef-mushroom-shabu", "egg-soup"], favs=["egg-soup"]), ""),
    "03_today_low": (st(have=HAVE), "scrollTo(0,99999)"),
    "04_book": (st(), 'go("book")'),
    "05_book_filter": (st(have=HAVE, favs=["soft-tofu-stew"]), 'fTag="tofu";fKind="soup";go("book")'),
    "06_book_low": (st(), 'go("book");scrollTo(0,1500)'),
    "07_pantry": (st(have=HAVE), 'go("pantry")'),
    "08_detail": (st(have=HAVE, cands=["tofu-mushroom-hotpot"]), D),
    "09_detail_ing": (st(have=HAVE), D + 'checks[openId]={0:true,2:true};renderDetail();$("detail").scrollTop=560'),
    "10_detail_steps": (st(have=HAVE), D + '$("detail").scrollTop=1150'),
    "11_decide": (st(have=HAVE, cands=["beef-mushroom-shabu", "egg-soup", "cabbage-pork-steam"]),
                  'document.querySelector("[data-decide]").click();document.querySelector("[data-pick]").click()'),
    "12_detail_shabu": (st(), 'openRecipe("beef-mushroom-shabu")'),
    # every dish drawing on one sheet — look here after adding a recipe
    "13_gallery": (st(), 'document.body.innerHTML="<div style=\\"display:grid;grid-template-columns:repeat(4,1fr);gap:4px;padding:4px\\">"+RECIPES.map(r=>"<div style=\\"background:#D0E6FD;border-radius:8px;padding:3px\\">"+ART.dish(r.art)+"</div>").join("")+"</div>"'),
}
if only:
    STATES = {k: v for k, v in STATES.items() if only in k}
for name, (state, act) in STATES.items():
    # State is written into the page itself (not shared localStorage), so the iframes can't race each other;
    # Math.random is seeded so the three suggestions are the same on every run.
    init = "let __s=11;Math.random=()=>(__s=(__s*16807)%2147483647)/2147483647;let S = " + json.dumps(state) + ";"
    js = ("fetch('../index.html').then(r=>r.text()).then(h=>{"
          "h=h.replace('<head>','<head><base href=\"../\">')"
          ".replace('let S = MENU.load(localStorage, DATA);'," + json.dumps(init) + ")"
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
