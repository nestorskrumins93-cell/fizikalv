/* ===== 04 uzdevumi, testu komponente un testu skats ===== */
(function () {
  const { esc, fmt, parseNum, store, shuffle } = FZ;
  const ri = (r, a, b) => a + Math.floor(r() * (b - a + 1));
  const num = (q, answer, unit, explain, tag, extra) => Object.assign({ type: "num", q, answer, unit, explain, tag: tag || "Aprēķini" }, extra || {});

  FZ.gens = {
    speed(r) {
      const v = ri(r, 2, 25), t = ri(r, 2, 12), s = v * t;
      if (r() < 0.5) return num("Skolēns noskrien " + s + " m " + t + " s laikā ar nemainīgu ātrumu. Cik liels ir ātrums? (m/s)", v, "m/s", "v = s / t = " + s + " / " + t + " = " + v + " m/s", "Aprēķini", { formula: "speed" });
      return num("Velosipēdists brauc ar ātrumu " + v + " m/s " + t + " s. Cik liels ceļš nobraukts? (m)", s, "m", "s = v · t = " + v + " · " + t + " = " + s + " m", "Aprēķini", { formula: "speed" });
    },
    force(r) { const m = ri(r, 2, 20), a = ri(r, 1, 9); return num("Ķermeņa masa ir " + m + " kg, tā paātrinājums — " + a + " m/s². Cik liels spēks darbojas? (N)", m * a, "N", "F = m · a = " + m + " · " + a + " = " + m * a + " N", "Aprēķini", { formula: "force" }); },
    work(r) { const F = ri(r, 5, 50), s = ri(r, 2, 20); return num("Ķermeni ar spēku " + F + " N pārvieto " + s + " m garumā spēka virzienā. Cik liels darbs veikts? (J)", F * s, "J", "A = F · s = " + F + " · " + s + " = " + F * s + " J", "Aprēķini", { formula: "work" }); },
    power(r) { const P = ri(r, 20, 200), t = ri(r, 2, 10); return num("Darbs " + P * t + " J veikts " + t + " s laikā. Cik liela ir jauda? (W)", P, "W", "P = A / t = " + P * t + " / " + t + " = " + P + " W", "Aprēķini", { formula: "power" }); },
    ek(r) { const v = ri(r, 2, 10), m = 2 * ri(r, 1, 10); return num("Ķermeņa masa ir " + m + " kg, ātrums — " + v + " m/s. Cik liela ir kinētiskā enerģija? (J)", m * v * v / 2, "J", "E = m · v² / 2 = " + m + " · " + v + "² / 2 = " + m * v * v / 2 + " J", "Aprēķini", { formula: "ek" }); },
    ohm(r) { const R = ri(r, 2, 20), I = ri(r, 1, 6); return num("Spriegums vadītāja galos ir " + R * I + " V, pretestība — " + R + " Ω. Cik liela ir strāva? (A)", I, "A", "I = U / R = " + R * I + " / " + R + " = " + I + " A", "Aprēķini", { formula: "ohm" }); },
    scale(r) {
      const pairs = [[1, 10], [2, 10], [5, 10], [1, 5], [10, 20], [10, 100]];
      const pr = pairs[ri(r, 0, pairs.length - 1)], top = pr[0], n = pr[1], val = top / n;
      return num("Starp 0 un " + fmt(top) + " cm uz lineāla ir " + n + " iedaļas. Cik liela ir viena iedaļa? (cm)", val, "cm", "Iedaļas vērtība = (" + fmt(top) + " − 0) / " + n + " = " + fmt(val) + " cm", "Mērījumi");
    },
    conv(r) {
      const opts = [
        () => { const x = ri(r, 2, 9) / 2; return num(fmt(x) + " km = ? m", x * 1000, "m", "1 km = 1000 m, tātad " + fmt(x) + " · 1000 = " + fmt(x * 1000) + " m", "Mērvienības"); },
        () => { const x = ri(r, 2, 9) / 2; return num(fmt(x) + " kg = ? g", x * 1000, "g", "1 kg = 1000 g, tātad " + fmt(x) + " · 1000 = " + fmt(x * 1000) + " g", "Mērvienības"); },
        () => { const x = ri(r, 2, 9); return num(x + " min = ? s", x * 60, "s", "1 min = 60 s, tātad " + x + " · 60 = " + x * 60 + " s", "Mērvienības"); },
        () => { const x = ri(r, 2, 9) * 10; return num(x + " cm = ? m", x / 100, "m", "1 cm = 0,01 m, tātad " + x + " / 100 = " + fmt(x / 100) + " m", "Mērvienības"); },
        () => { const x = ri(r, 1, 6) * 36; return num(x + " km/h = ? m/s", x / 3.6, "m/s", "km/h pārvērš m/s, dalot ar 3,6: " + x + " / 3,6 = " + fmt(x / 3.6) + " m/s", "Mērvienības"); }
      ];
      return opts[ri(r, 0, opts.length - 1)]();
    }
  };
  const calcGens = ["speed", "force", "work", "power", "ek", "ohm"];
  FZ.tasks = {
    random(r) { r = r || Math.random; return FZ.gens[calcGens[Math.floor(r() * calcGens.length)]](r); },
    daily() { const r = FZ.rng(FZ.hash(store.dayKey())); return FZ.gens[calcGens[Math.floor(r() * calcGens.length)]](r); },
    check(q, given) {
      const x = parseNum(given);
      if (isNaN(x)) return { ok: false, bad: true };
      return { ok: Math.abs(x - q.answer) <= Math.max(Math.abs(q.answer) * 0.01, 1e-9), x };
    },
    hint(q, x) {
      const a = q.answer;
      if (!isFinite(x) || a === 0) return "";
      const rt = x / a;
      if (Math.abs(rt - 1000) < 1 || Math.abs(rt - 0.001) < 1e-6) return "Atbilde atšķiras 1000 reizes — pārbaudi mērvienību pārrēķinu (k = 1000).";
      if (Math.abs(rt - 100) < 0.5 || Math.abs(rt - 0.01) < 1e-4) return "Atbilde atšķiras 100 reizes — pārbaudi cm ↔ m pārrēķinu.";
      if (Math.abs(rt - 3.6) < 0.01 || Math.abs(rt - 1 / 3.6) < 0.01) return "Pārbaudi, vai pareizi pārvērsi km/h un m/s (dala vai reizina ar 3,6).";
      if (Math.abs(rt - 2) < 0.01 || Math.abs(rt - 0.5) < 0.01) return "Atbilde atšķiras 2 reizes — vai neaizmirsi dalīt ar 2 (vai nepievienoji to lieki)?";
      if (Math.abs(rt - 1 / a / a) < 1e-9 || Math.abs(x - 1 / a) < 1e-6 * Math.max(1, 1 / a)) return "Šķiet, tu apgriezi attiecību (dalīji otrādi). Pārbaudi, kurš lielums jādala ar kuru.";
      return "Pamēģini vēlreiz: pieraksti formulu, ievieto skaitļus un pārbaudi mērvienības.";
    }
  };

  /* ---- testu komponente ---- */
  FZ.quiz = {
    mount(root, questions, opts) {
      opts = opts || {};
      const qs = questions.map(q => q.type === "mc"
        ? Object.assign({}, q, { opts: shuffle(q.options.map((t, k) => ({ t, ok: k === 0 }))) }) : q);
      let i = 0, res = [], answered = false, left = opts.seconds || 0, timer = null, finished = false;

      function fin() {
        if (finished) return; finished = true; clearInterval(timer);
        while (res.length < qs.length) res.push({ q: qs[res.length], ok: false, given: "—", skipped: true });
        opts.onFinish && opts.onFinish(res);
      }
      function tick() {
        left--; const el = FZ.$(".timer", root);
        if (el) el.textContent = "⏱ " + Math.floor(left / 60) + ":" + String(left % 60).padStart(2, "0");
        if (left <= 0) { FZ.toast("Laiks beidzies!"); fin(); }
      }
      function answer(ok, given, hint) {
        if (answered) return; answered = true;
        const q = qs[i]; res.push({ q, ok, given });
        store.recordTag(q.tag, ok);
        const fb = FZ.$(".fb", root);
        const right = q.type === "mc" ? q.opts.find(o => o.ok).t : fmt(q.answer) + " " + (q.unit || "");
        fb.innerHTML = '<div class="box">' + (ok ? '<span class="ok">✅ Pareizi!</span> ' : '<span class="no">❌ Nepareizi.</span> Pareizā atbilde: <b>' + esc(right) + "</b>. ") +
          esc(q.explain || "") + (hint ? '<br><span class="muted">💡 ' + esc(hint) + "</span>" : "") + "</div>";
        FZ.$(".actions", root).innerHTML = '<button class="btn primary" id="nx">' + (i + 1 < qs.length ? "Tālāk →" : "Pabeigt") + "</button>";
        FZ.$("#nx", root).onclick = () => { i++; answered = false; if (i < qs.length) render(); else fin(); };
        FZ.$("#nx", root).focus();
      }
      function render() {
        const q = qs[i];
        root.innerHTML = '<div class="quiz"><div class="quiz-top"><span>Jautājums ' + (i + 1) + " / " + qs.length + '</span><span class="timer"></span></div><div class="bar"><i style="width:' + (i / qs.length * 100) + '%"></i></div><h3 style="margin-top:14px">' + esc(q.q) + '</h3><div class="opts"></div><div class="fb"></div><div class="actions"></div></div>';
        const box = FZ.$(".opts", root);
        if (opts.seconds) { const el = FZ.$(".timer", root); el.textContent = "⏱ " + Math.floor(left / 60) + ":" + String(left % 60).padStart(2, "0"); }
        if (q.type === "mc") {
          q.opts.forEach(o => {
            const b = document.createElement("button"); b.className = "opt"; b.textContent = o.t;
            b.onclick = () => {
              FZ.$$(".opt", box).forEach(x => { x.disabled = true; if (q.opts.find(p => p.t === x.textContent).ok) x.classList.add("right"); });
              if (!o.ok) b.classList.add("wrong");
              answer(o.ok, o.t);
            };
            box.appendChild(b);
          });
        } else {
          box.innerHTML = '<div class="row" style="flex-wrap:nowrap"><input type="text" inputmode="decimal" id="ni" placeholder="Ieraksti skaitli" autocomplete="off"><button class="btn primary" id="nb">Atbildēt</button></div>';
          const inp = FZ.$("#ni", box), go = () => {
            if (answered) return;
            const r = FZ.tasks.check(q, inp.value);
            if (r.bad) { FZ.toast("Ieraksti tikai skaitli (piem., 12,5)"); return; }
            inp.disabled = true; FZ.$("#nb", box).disabled = true;
            answer(r.ok, inp.value, r.ok ? "" : FZ.tasks.hint(q, r.x));
          };
          FZ.$("#nb", box).onclick = go; inp.addEventListener("keydown", e => { if (e.key === "Enter") go(); }); inp.focus();
        }
      }
      if (opts.seconds) timer = setInterval(tick, 1000);
      render();
      return { destroy() { clearInterval(timer); finished = true; } };
    }
  };

  /* ---- testu skats ---- */
  const DIFF = {
    easy: { name: "Viegla", icon: "🌱", desc: "8 jautājumi par pamatiem: parādības, nozares, mērījumi.", build: () => shuffle(FZ.bank.slice()).slice(0, 8) },
    medium: { name: "Vidēja", icon: "⚡", desc: "Formulu izvēle, iedaļas vērtība un mērvienību pārrēķini.", build: () => shuffle(FZ.formulaQs.slice()).slice(0, 3).concat([FZ.gens.scale(Math.random), FZ.gens.conv(Math.random), FZ.gens.conv(Math.random)]) },
    hard: { name: "Grūta", icon: "🔥", desc: "5 aprēķinu uzdevumi ar formulām (ātrums, spēks, darbs, jauda, enerģija).", build: () => shuffle(calcGens.slice()).slice(0, 5).map(k => FZ.gens[k](Math.random)) }
  };
  const TAG_STEP = { Pamati: 1, Nozares: 2, Lielumi: 4, Mērījumi: 5, Metode: 6, Mērvienības: 4 };

  FZ.views.tests = function (root) {
    store.visit({ route: "uzdevumi", title: "Uzdevumi un testi" });
    let cur = null; const s = store.get();
    function home() {
      root.innerHTML = '<div class="page-head"><h1>📝 Uzdevumi un testi</h1><p>Izvēlies grūtības pakāpi. Pēc testa redzēsi, kuras tēmas jau saproti un kuras vēl jāatkārto.</p></div>' +
        '<div class="grid cols-3">' + Object.keys(DIFF).map(k => '<div class="card link" data-d="' + k + '"><div class="icon-lg">' + DIFF[k].icon + "</div><h2>" + DIFF[k].name + '</h2><p class="muted">' + DIFF[k].desc + "</p></div>").join("") + "</div>" +
        '<div class="card mt"><label class="f" style="margin:0">Laika ierobežojums: <select id="tm" style="max-width:220px;display:inline-block"><option value="0">Bez ierobežojuma</option><option value="120">2 minūtes</option><option value="300">5 minūtes</option><option value="600">10 minūtes</option></select></label></div>' +
        '<div class="card mt2"><h2>Rezultātu vēsture</h2>' + (s.history.length ? '<table><tr><th>Datums</th><th>Tests</th><th>Rezultāts</th></tr>' + s.history.slice(0, 8).map(h => "<tr><td>" + esc(h.date) + "</td><td>" + esc(h.name) + '</td><td><span class="tag ' + (h.pct >= 70 ? "good" : "bad") + '">' + h.score + " / " + h.total + " (" + h.pct + "%)</span></td></tr>").join("") + "</table>" : '<p class="muted">Vēl nav neviena testa. Sāc ar vieglo!</p>') + "</div>";
      root.onclick = e => { const c = e.target.closest("[data-d]"); if (c) start(c.dataset.d); };
    }
    function start(d) {
      root.onclick = null;
      const secs = parseInt((FZ.$("#tm", root) || { value: 0 }).value, 10) || 0;
      root.innerHTML = '<div class="page-head"><h1>' + DIFF[d].icon + " " + DIFF[d].name + ' tests</h1></div><div class="card" id="qbox"></div>';
      cur = FZ.quiz.mount(FZ.$("#qbox", root), DIFF[d].build(), { seconds: secs, onFinish: r => done(d, r) });
    }
    function done(d, res) {
      const ok = res.filter(r => r.ok).length, total = res.length, pct = Math.round(ok / total * 100);
      const now = new Date();
      s.history.unshift({ date: now.toLocaleDateString("lv-LV") + " " + now.toLocaleTimeString("lv-LV", { hour: "2-digit", minute: "2-digit" }), name: DIFF[d].name, score: ok, total, pct });
      s.history = s.history.slice(0, 30);
      s.solved += ok; s.bestTest = Math.max(s.bestTest, pct); store.save();
      store.addXP(ok * 3 + (pct === 100 ? 10 : 0), "tests");
      const tg = {}; res.forEach(r => { const t = r.q.tag; tg[t] = tg[t] || { ok: 0, n: 0 }; tg[t].n++; if (r.ok) tg[t].ok++; });
      root.innerHTML = '<div class="page-head"><h1>Rezultāts</h1></div><div class="card glow center"><div class="big-word" style="border:0;background:none;font-size:3rem">' + ok + " / " + total + '</div><p>' + (pct >= 90 ? "Teicami! 🌟" : pct >= 70 ? "Labi padarīts! 👍" : "Vēl nedaudz jāpiestrādā 💪") + "</p></div>" +
        '<div class="card mt"><h2>Ko tu saproti?</h2><table>' + Object.keys(tg).map(t => {
          const p = Math.round(tg[t].ok / tg[t].n * 100);
          return "<tr><td>" + esc(t) + '</td><td><span class="tag ' + (p >= 70 ? "good" : "bad") + '">' + (p >= 70 ? "Saprot" : "Jāatkārto") + "</span></td><td>" + tg[t].ok + " / " + tg[t].n + '</td><td>' +
            (p < 70 ? (TAG_STEP[t] ? '<a href="#/tema/ko-maca-fizika/' + TAG_STEP[t] + '">Atkārtot teoriju →</a>' : '<a href="#/kalkulators">Atvērt kalkulatoru →</a>') : "") + "</td></tr>";
        }).join("") + "</table></div>" +
        '<div class="card mt"><h2>Kļūdu pārskats</h2>' + (res.filter(r => !r.ok).length ? res.filter(r => !r.ok).map(r => '<p><b>' + esc(r.q.q) + '</b><br><span class="muted">' + esc(r.q.explain || "") + "</span></p>").join("") : "<p>Kļūdu nav! 🎉</p>") + "</div>" +
        '<div class="row mt"><button class="btn primary" id="again">Jauns tests</button></div>';
      FZ.$("#again", root).onclick = home;
    }
    home();
    return () => cur && cur.destroy();
  };
})();
