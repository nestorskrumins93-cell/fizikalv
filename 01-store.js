/* ===== FizikaLV · 01 glabātuve un palīgfunkcijas ===== */
window.FZ = window.FZ || { views: {} };
(function () {
  const KEY = "fizikalv:v2";
  const defaults = () => ({
    name: "", level: "8. klase", theme: "dark", xp: 0,
    lessonSeen: {}, completed: [], visited: [], lastTopic: null, lastStep: 0,
    solved: 0, streak: 0, bestStreak: 0, lastDay: "", xpLog: {}, history: [],
    tags: {}, flags: {}, daily: {}, ach: [], bestTest: 0
  });
  const pad = n => String(n).padStart(2, "0");
  const dayKey = (d = new Date()) => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  let s;
  try { s = Object.assign(defaults(), JSON.parse(localStorage.getItem(KEY) || "{}")); } catch (e) { s = defaults(); }

  function save() { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
  function level() { return Math.floor(s.xp / 100) + 1; }
  function touchDay() {
    const t = dayKey();
    if (s.lastDay === t) return;
    const y = new Date(); y.setDate(y.getDate() - 1);
    s.streak = s.lastDay === dayKey(y) ? s.streak + 1 : 1;
    s.lastDay = t;
    s.bestStreak = Math.max(s.bestStreak, s.streak);
  }
  function addXP(n, why) {
    const before = level();
    s.xp += n;
    s.xpLog[dayKey()] = (s.xpLog[dayKey()] || 0) + n;
    touchDay(); save();
    FZ.toast("+" + n + " XP" + (why ? " · " + why : ""));
    if (level() > before) FZ.toast("🎉 Jauns līmenis: " + level(), "good");
    checkAch(); FZ.refreshSide && FZ.refreshSide();
  }
  function flag(name, xp, why) {
    if (s.flags[name]) return false;
    s.flags[name] = true; save();
    if (xp) addXP(xp, why); else checkAch();
    return true;
  }
  function recordTag(tag, ok) {
    if (!tag) return;
    const t = s.tags[tag] || { ok: 0, total: 0 };
    t.total++; if (ok) t.ok++;
    s.tags[tag] = t; save();
  }
  function visit(entry) {
    s.visited = [entry].concat(s.visited.filter(v => v.route !== entry.route)).slice(0, 5);
    touchDay(); save();
  }
  function checkAch() {
    (FZ.achievements || []).forEach(a => {
      if (!s.ach.includes(a.id) && a.test(s)) {
        s.ach.push(a.id); save();
        FZ.toast("🏅 Sasniegums: " + a.title, "good");
      }
    });
  }
  function reset() { try { localStorage.removeItem(KEY); } catch (e) {} }

  FZ.store = { get: () => s, save, addXP, flag, level, dayKey, recordTag, visit, checkAch, reset, touchDay };

  FZ.$ = (q, r = document) => r.querySelector(q);
  FZ.$$ = (q, r = document) => Array.from(r.querySelectorAll(q));
  FZ.esc = x => String(x).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  FZ.shuffle = (arr, rng = Math.random) => { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; };
  FZ.rng = seed => { let a = seed >>> 0; return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
  FZ.hash = str => { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  FZ.fmt = x => {
    if (!isFinite(x)) return "—";
    if (x === 0) return "0";
    const a = Math.abs(x);
    let t;
    if (a >= 1e7 || a < 1e-4) t = x.toExponential(3).replace(/\.?0+e/, "e");
    else t = String(parseFloat(x.toPrecision(6)));
    return t.replace(".", ",");
  };
  FZ.parseNum = str => {
    const t = String(str).trim().replace(/\s/g, "").replace(",", ".");
    return /^-?\d+(\.\d+)?$/.test(t) ? parseFloat(t) : NaN;
  };
  FZ.toast = (msg, kind) => {
    const box = document.getElementById("toasts"); if (!box) return;
    const d = document.createElement("div"); d.className = "toast " + (kind || ""); d.textContent = msg;
    box.appendChild(d);
    setTimeout(() => { d.classList.add("out"); setTimeout(() => d.remove(), 450); }, 2600);
  };
  FZ.cleanups = [];
})();
