/* ===== 02 formulu kalkulators, mērvienības, teksta uzdevumu atpazīšana ===== */
(function () {
  const { esc, fmt, parseNum, store } = FZ;
  const Q = {
    length: { name: "Garums", si: "m", units: { m: 1, km: 1000, cm: 0.01, mm: 0.001 } },
    time: { name: "Laiks", si: "s", units: { s: 1, min: 60, h: 3600 } },
    mass: { name: "Masa", si: "kg", units: { kg: 1, g: 0.001, t: 1000 } },
    speed: { name: "Ātrums", si: "m/s", units: { "m/s": 1, "km/h": 1 / 3.6 } },
    accel: { name: "Paātrinājums", si: "m/s²", units: { "m/s²": 1 } },
    force: { name: "Spēks", si: "N", units: { N: 1, kN: 1000 } },
    energy: { name: "Enerģija / darbs", si: "J", units: { J: 1, kJ: 1000, MJ: 1e6 } },
    power: { name: "Jauda", si: "W", units: { W: 1, kW: 1000 } },
    voltage: { name: "Spriegums", si: "V", units: { V: 1, mV: 0.001, kV: 1000 } },
    current: { name: "Strāva", si: "A", units: { A: 1, mA: 0.001 } },
    resistance: { name: "Pretestība", si: "Ω", units: { "Ω": 1, "kΩ": 1000 } },
    density: { name: "Blīvums", si: "kg/m³", units: { "kg/m³": 1, "g/cm³": 1000 } },
    volume: { name: "Tilpums", si: "m³", units: { "m³": 1, l: 0.001, "cm³": 1e-6 } }
  };
  const V = (sym, name, q) => ({ sym, name, q });
  const formulas = [
    { id: "speed", name: "Ātrums", vars: { v: V("v", "ātrums", "speed"), s: V("s", "ceļš", "length"), t: V("t", "laiks", "time") },
      eq: { v: "v = s / t", s: "s = v · t", t: "t = s / v" }, tpl: { v: "{s} / {t}", s: "{v} · {t}", t: "{s} / {v}" },
      f: { v: x => x.s / x.t, s: x => x.v * x.t, t: x => x.s / x.v },
      kw: { v: ["atrum"], s: ["cel", "attalum", "nobrauc", "garum"], t: ["laik", "cik ilgi", "cik ilg"] } },
    { id: "accel", name: "Paātrinājums", vars: { a: V("a", "paātrinājums", "accel"), dv: V("Δv", "ātruma izmaiņa", "speed"), t: V("t", "laiks", "time") },
      eq: { a: "a = Δv / t", dv: "Δv = a · t", t: "t = Δv / a" }, tpl: { a: "{dv} / {t}", dv: "{a} · {t}", t: "{dv} / {a}" },
      f: { a: x => x.dv / x.t, dv: x => x.a * x.t, t: x => x.dv / x.a },
      kw: { a: ["paatr"], dv: ["izmain"], t: ["laik", "cik ilgi"] } },
    { id: "force", name: "Ņūtona 2. likums", vars: { F: V("F", "spēks", "force"), m: V("m", "masa", "mass"), a: V("a", "paātrinājums", "accel") },
      eq: { F: "F = m · a", m: "m = F / a", a: "a = F / m" }, tpl: { F: "{m} · {a}", m: "{F} / {a}", a: "{F} / {m}" },
      f: { F: x => x.m * x.a, m: x => x.F / x.a, a: x => x.F / x.m },
      kw: { F: ["spek"], m: ["masa", "masu", "masas", "masai"], a: ["paatr"] } },
    { id: "work", name: "Darbs", vars: { A: V("A", "darbs", "energy"), F: V("F", "spēks", "force"), s: V("s", "ceļš", "length") },
      eq: { A: "A = F · s", F: "F = A / s", s: "s = A / F" }, tpl: { A: "{F} · {s}", F: "{A} / {s}", s: "{A} / {F}" },
      f: { A: x => x.F * x.s, F: x => x.A / x.s, s: x => x.A / x.F },
      kw: { A: ["darb"], F: ["spek"], s: ["cel", "attalum"] } },
    { id: "power", name: "Jauda", vars: { P: V("P", "jauda", "power"), A: V("A", "darbs", "energy"), t: V("t", "laiks", "time") },
      eq: { P: "P = A / t", A: "A = P · t", t: "t = A / P" }, tpl: { P: "{A} / {t}", A: "{P} · {t}", t: "{A} / {P}" },
      f: { P: x => x.A / x.t, A: x => x.P * x.t, t: x => x.A / x.P },
      kw: { P: ["jaud"], A: ["darb"], t: ["laik"] } },
    { id: "ek", name: "Kinētiskā enerģija", vars: { E: V("E", "kinētiskā enerģija", "energy"), m: V("m", "masa", "mass"), v: V("v", "ātrums", "speed") },
      eq: { E: "E = m · v² / 2", m: "m = 2E / v²", v: "v = √(2E / m)" }, tpl: { E: "{m} · {v}² / 2", m: "2 · {E} / {v}²", v: "√(2 · {E} / {m})" },
      f: { E: x => x.m * x.v * x.v / 2, m: x => 2 * x.E / (x.v * x.v), v: x => Math.sqrt(2 * x.E / x.m) },
      kw: { E: ["energ", "kinetisk"], m: ["masa", "masu", "masas"], v: ["atrum"] } },
    { id: "density", name: "Blīvums", vars: { rho: V("ρ", "blīvums", "density"), m: V("m", "masa", "mass"), V: V("V", "tilpums", "volume") },
      eq: { rho: "ρ = m / V", m: "m = ρ · V", V: "V = m / ρ" }, tpl: { rho: "{m} / {V}", m: "{rho} · {V}", V: "{m} / {rho}" },
      f: { rho: x => x.m / x.V, m: x => x.rho * x.V, V: x => x.m / x.rho },
      kw: { rho: ["bliv"], m: ["masa", "masu", "masas"], V: ["tilpum"] } },
    { id: "ohm", name: "Oma likums", vars: { I: V("I", "strāva", "current"), U: V("U", "spriegums", "voltage"), R: V("R", "pretestība", "resistance") },
      eq: { I: "I = U / R", U: "U = I · R", R: "R = U / I" }, tpl: { I: "{U} / {R}", U: "{I} · {R}", R: "{U} / {I}" },
      f: { I: x => x.U / x.R, U: x => x.I * x.R, R: x => x.U / x.I },
      kw: { I: ["strav"], U: ["spriegum"], R: ["pretest"] } }
  ];

  function solve(fid, unk, inp, outUnit) {
    const f = formulas.find(x => x.id === fid);
    const si = {}, steps = [];
    for (const k of Object.keys(f.vars)) {
      if (k === unk) continue;
      const v = inp[k];
      if (!v || !isFinite(v.value)) return { ok: false, error: "Ieraksti skaitli laukā „" + f.vars[k].name + "”." };
      if (k !== "dv" && v.value <= 0) return { ok: false, error: "Lielumam „" + f.vars[k].name + "” jābūt lielākam par nulli." };
      si[k] = v.value * Q[f.vars[k].q].units[v.unit];
    }
    const val = f.f[unk](si);
    if (!isFinite(val)) return { ok: false, error: "Aprēķins nav iespējams (dalīšana ar nulli vai sakne no negatīva skaitļa)." };
    const q = f.vars[unk].q, siU = Q[q].si, out = outUnit || siU;
    steps.push("Meklējam: <b>" + esc(f.vars[unk].name) + " (" + esc(f.vars[unk].sym) + ")</b>.");
    steps.push("Formula: <code>" + esc(f.eq[unk]) + "</code>");
    const conv = Object.keys(si).filter(k => inp[k].unit !== Q[f.vars[k].q].si);
    if (conv.length) steps.push("Pārrēķinām SI vienībās: " + conv.map(k => esc(f.vars[k].sym) + " = " + fmt(inp[k].value) + " " + esc(inp[k].unit) + " = " + fmt(si[k]) + " " + esc(Q[f.vars[k].q].si)).join("; ") + ".");
    const filled = f.tpl[unk].replace(/\{(\w+)\}/g, (m, k) => fmt(si[k]));
    steps.push("Ievietojam skaitļus: <code>" + esc(f.vars[unk].sym) + " = " + esc(filled) + "</code>");
    steps.push("Rezultāts: <b>" + esc(f.vars[unk].sym) + " = " + fmt(val) + " " + esc(siU) + "</b>");
    let outVal = val;
    if (out !== siU) { outVal = val / Q[q].units[out]; steps.push("Pārrēķinām: <b>" + fmt(outVal) + " " + esc(out) + "</b>"); }
    return { ok: true, value: outVal, unit: out, valueSI: val, unitSI: siU, steps };
  }

  /* ---- teksta uzdevuma atpazīšana (skolotājam) ---- */
  const UNITMAP = {
    "km/h": ["speed", "km/h"], "m/s": ["speed", "m/s"], "m/s²": ["accel", "m/s²"], "m/s2": ["accel", "m/s²"], "m/s^2": ["accel", "m/s²"],
    "kg/m³": ["density", "kg/m³"], "g/cm³": ["density", "g/cm³"], kg: ["mass", "kg"], g: ["mass", "g"],
    kn: ["force", "kN"], n: ["force", "N"], kj: ["energy", "kJ"], mj: ["energy", "MJ"], j: ["energy", "J"],
    kw: ["power", "kW"], w: ["power", "W"], kv: ["voltage", "kV"], mv: ["voltage", "mV"], v: ["voltage", "V"],
    ma: ["current", "mA"], a: ["current", "A"], "ω": ["resistance", "Ω"], "kω": ["resistance", "kΩ"],
    km: ["length", "km"], cm: ["length", "cm"], mm: ["length", "mm"], m: ["length", "m"],
    min: ["time", "min"], h: ["time", "h"], s: ["time", "s"], l: ["volume", "l"]
  };
  const WORDS = [
    [/^sekund|^sek$/, "s"], [/^minūt/, "min"], [/^stund/, "h"], [/^kilometr/, "km"], [/^metr/, "m"],
    [/^kilogram/, "kg"], [/^gram/, "g"], [/^ņūton/, "n"], [/^džoul/, "j"], [/^vat/, "w"], [/^volt/, "v"], [/^ampēr/, "a"], [/^om/, "ω"]
  ];
  function extract(text) {
    const t = text.toLowerCase().replace(/(\d),(\d)/g, "$1.$2");
    const found = [];
    const re = /(-?\d+(?:\.\d+)?)\s*(km\/h|m\/s²|m\/s\^2|m\/s2|m\/s|kg\/m³|g\/cm³|kg|kn|kj|mj|kw|kv|mv|ma|kω|km|cm|mm|min|ω|n|j|w|v|a|g|h|s|m|l|[a-zāčēģīķļņšūž]+)(?![a-zāčēģīķļņšūž0-9²³\/])/g;
    let m;
    while ((m = re.exec(t))) {
      let u = m[2];
      if (!UNITMAP[u]) { const w = WORDS.find(x => x[0].test(u)); if (!w) continue; u = w[1]; }
      const [q, unit] = UNITMAP[u];
      found.push({ q, unit, value: parseFloat(m[1]) });
    }
    return found;
  }
  const strip = x => x.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ļ/g, "l");
  function kwHit(norm, kw) { return new RegExp("(^|[^a-z])" + kw).test(norm); }

  function analyse(text) {
    const ex = extract(text);
    if (ex.length < 1) return null;
    const norm = strip(text);
    const byQ = {};
    ex.forEach(e => { (byQ[e.q] = byQ[e.q] || []).push(e); });
    const cands = [];
    formulas.forEach(f => {
      Object.keys(f.vars).forEach(u => {
        const others = Object.keys(f.vars).filter(k => k !== u);
        const used = {}; let ok = true; const inp = {};
        others.forEach(k => {
          const q = f.vars[k].q; used[q] = (used[q] || 0);
          const e = byQ[q] && byQ[q][used[q]];
          if (!e) ok = false; else { inp[k] = { value: e.value, unit: e.unit }; used[q]++; }
        });
        if (!ok) return;
        let score = 0;
        if ((f.kw[u] || []).some(k => kwHit(norm, k))) score += 10;
        const unused = ex.length - others.length; score -= Math.max(0, unused) * 2;
        cands.push({ f, u, inp, score, hit: score >= 8 });
      });
    });
    cands.sort((a, b) => b.score - a.score);
    return { ex, cands };
  }

  /* ---- kalkulatora skats ---- */
  FZ.views.calc = function (root) {
    store.visit({ route: "kalkulators", title: "Formulu kalkulators" });
    let fid = formulas[0].id, unk = "v";
    root.innerHTML =
      '<div class="page-head"><h1>🧮 Formulu kalkulators</h1><p>Izvēlies formulu, norādi, ko meklē, ievadi pārējos lielumus — kalkulators parādīs risinājumu pa soļiem un pārrēķinās mērvienības.</p></div>' +
      '<div class="grid auto" id="cat"></div>' +
      '<div class="grid cols-2 mt2"><div class="card" id="calc"></div><div class="card" id="res"><h2>Risinājums</h2><p class="muted">Ievadi lielumus un nospied „Aprēķināt”.</p></div></div>' +
      '<div class="card mt2" id="conv"></div>';
    const cat = FZ.$("#cat", root), calc = FZ.$("#calc", root), res = FZ.$("#res", root);
    cat.innerHTML = formulas.map(f => '<div class="card link" data-f="' + f.id + '"><div class="muted">' + esc(f.name) + '</div><div class="formula">' + esc(f.eq[Object.keys(f.vars)[0]]) + "</div></div>").join("");
    cat.addEventListener("click", e => { const c = e.target.closest("[data-f]"); if (c) { fid = c.dataset.f; unk = Object.keys(formulas.find(x => x.id === fid).vars)[0]; draw(); } });

    function draw() {
      const f = formulas.find(x => x.id === fid);
      calc.innerHTML = "<h2>" + esc(f.name) + '</h2><div class="formula">' + esc(f.eq[unk]) + '</div><p class="muted" style="margin-top:12px">Ko aprēķināt?</p><div class="chips" id="unk">' +
        Object.keys(f.vars).map(k => '<button class="chip ' + (k === unk ? "on" : "") + '" data-k="' + k + '">' + esc(f.vars[k].sym) + " · " + esc(f.vars[k].name) + "</button>").join("") + '</div><div id="ins" style="margin-top:14px"></div>' +
        '<label class="f">Atbildi parādīt vienībās: <select id="outu">' + Object.keys(Q[f.vars[unk].q].units).map(u => "<option>" + esc(u) + "</option>").join("") + '</select></label><button class="btn primary" id="go">Aprēķināt</button>';
      FZ.$("#ins", calc).innerHTML = Object.keys(f.vars).filter(k => k !== unk).map(k => {
        const v = f.vars[k];
        return '<label class="f">' + esc(v.sym) + " — " + esc(v.name) + '<div class="row" style="flex-wrap:nowrap"><input type="text" inputmode="decimal" data-in="' + k + '" placeholder="0"><select data-un="' + k + '" style="width:110px">' +
          Object.keys(Q[v.q].units).map(u => "<option>" + esc(u) + "</option>").join("") + "</select></div></label>";
      }).join("");
      FZ.$("#unk", calc).onclick = e => { const b = e.target.closest("[data-k]"); if (b) { unk = b.dataset.k; draw(); } };
      FZ.$("#go", calc).onclick = run;
      FZ.$$("input", calc).forEach(i => i.addEventListener("keydown", e => { if (e.key === "Enter") run(); }));
    }
    function run() {
      const f = formulas.find(x => x.id === fid), inp = {};
      Object.keys(f.vars).filter(k => k !== unk).forEach(k => { inp[k] = { value: parseNum(FZ.$('[data-in="' + k + '"]', calc).value), unit: FZ.$('[data-un="' + k + '"]', calc).value }; });
      const r = solve(fid, unk, inp, FZ.$("#outu", calc).value);
      if (!r.ok) { res.innerHTML = "<h2>Risinājums</h2><p class='no'>" + esc(r.error) + "</p>"; return; }
      res.innerHTML = "<h2>Risinājums</h2><ol>" + r.steps.map(s => "<li>" + s + "</li>").join("") + '</ol><div class="big-word">' + fmt(r.value) + " " + esc(r.unit) + "</div>";
      store.flag("calc", 5, "kalkulators");
    }
    draw();

    const conv = FZ.$("#conv", root);
    conv.innerHTML = '<h2>🔁 Mērvienību pārveidotājs</h2><div class="grid cols-4"><label class="f">Lielums<select id="cq">' + Object.keys(Q).map(k => '<option value="' + k + '">' + esc(Q[k].name) + "</option>").join("") +
      '</select></label><label class="f">Vērtība<input type="text" id="cv" value="1"></label><label class="f">No<select id="cf"></select></label><label class="f">Uz<select id="ct"></select></label></div><div class="big-word" id="cr"></div>';
    const cq = FZ.$("#cq", conv), cf = FZ.$("#cf", conv), ct = FZ.$("#ct", conv), cv = FZ.$("#cv", conv), cr = FZ.$("#cr", conv);
    function fill() { const o = Object.keys(Q[cq.value].units).map(u => "<option>" + esc(u) + "</option>").join(""); cf.innerHTML = o; ct.innerHTML = o; if (ct.options.length > 1) ct.selectedIndex = 1; calcConv(); }
    function calcConv() { const x = parseNum(cv.value); if (isNaN(x)) { cr.textContent = "—"; return; } const u = Q[cq.value].units; cr.textContent = fmt(x * u[cf.value] / u[ct.value]) + " " + ct.value; }
    cq.onchange = fill; [cv, cf, ct].forEach(e => e.addEventListener("input", calcConv)); fill();
  };

  FZ.calc = { Q, formulas, solve, analyse, extract, strip, kwHit };
})();
