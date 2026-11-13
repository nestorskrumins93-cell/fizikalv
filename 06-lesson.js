/* ===== 06 mācību tēmas un nodarbību dzinējs ===== */
(function () {
  const { esc, fmt, parseNum, store, shuffle } = FZ;
  const NOZARES = ["mehānika", "siltums", "skaņa", "gaisma", "elektrība", "magnētisms"];

  function record(name, res) {
    const s = store.get(), ok = res.filter(r => r.ok).length, total = res.length, pct = Math.round(ok / total * 100), now = new Date();
    s.history.unshift({ date: now.toLocaleDateString("lv-LV") + " " + now.toLocaleTimeString("lv-LV", { hour: "2-digit", minute: "2-digit" }), name, score: ok, total, pct });
    s.history = s.history.slice(0, 30); s.solved += ok; s.bestTest = Math.max(s.bestTest, pct); store.save();
    store.addXP(ok * 3 + (pct === 100 ? 10 : 0), "tests");
    return { ok, total, pct };
  }

  const steps = [
    /* 0 · Trīs jautājumi */
    { title: "Trīs jautājumi", render(r) {
      const qs = [
        ["⚡", "Kāpēc zibeni redzam agrāk nekā dzirdam pērkonu?", "Gaisma izplatās ap 300 000 km/s, skaņa tikai ap 340 m/s. Zibens uzplaiksnījums atnāk uzreiz, pērkons — vēlāk."],
        ["🧊", "Kāpēc ledus peld uz ūdens?", "Ledus blīvums (ap 917 kg/m³) ir mazāks nekā ūdenim (1000 kg/m³)."],
        ["🏀", "Kāpēc izmesta bumba krīt lejup?", "Zeme pievelk visus ķermeņus — to sauc par smaguma spēku."]
      ];
      r.innerHTML = "<h2>Trīs jautājumi</h2><p class='muted'>Fizika meklē atbildes uz tādiem jautājumiem. Vispirms pamēģini minēt — neviena atbilde vēl nav „nepareiza”!</p><div class='grid'>" +
        qs.map(q => '<div class="card qcard"><div class="row"><span class="icon-lg">' + q[0] + "</span><h3 style='margin:0'>" + esc(q[1]) + '</h3></div><textarea placeholder="Mans minējums…" style="margin-top:10px"></textarea><button class="btn sm reveal" style="margin-top:8px">Rādīt atbildi</button><div class="ans">' + esc(q[2]) + "</div></div>").join("") + "</div>";
      FZ.$$(".reveal", r).forEach(b => b.onclick = () => { b.nextElementSibling.classList.toggle("show"); });
    } },

    /* 1 · Fizika pēta dabu */
    { title: "Fizika pēta dabu", render(r) {
      r.innerHTML = "<h2>Fizika pēta dabu</h2><p><b>Fizika</b> ir dabaszinātne, kas pēta dabas parādības un to likumus.</p>" +
        '<div class="grid cols-3"><div class="card"><div class="icon-lg">⚽</div><h3>Fizikālais ķermenis</h3><p class="muted">Priekšmets ar savu formu un izmēriem.</p><span class="tag">galds, bumba, zīmulis</span></div>' +
        '<div class="card"><div class="icon-lg">🧱</div><h3>Viela</h3><p class="muted">Tas, no kā ķermenis ir veidots.</p><span class="tag">koks, dzelzs, ūdens</span></div>' +
        '<div class="card"><div class="icon-lg">🌩️</div><h3>Fizikālā parādība</h3><p class="muted">Pārmaiņas, kas notiek dabā.</p><span class="tag">kušana, krišana, zibens</span></div></div>' +
        "<p class='muted' style='margin-top:12px'>Piemērs: ledus ir viela, ledus gabals ir ķermenis, un tā kušana ir parādība.</p>" +
        '<h3 class="mt">🎮 Spēle: ķermenis, viela vai parādība?</h3><div id="game" class="card"></div>';
      const items = [["ledus gabals", "ķermenis"], ["ledus", "viela"], ["kušana", "parādība"], ["glāze", "ķermenis"], ["stikls", "viela"], ["zibens", "parādība"], ["ūdens", "viela"], ["bumba", "ķermenis"]];
      const cats = ["ķermenis", "viela", "parādība"], g = FZ.$("#game", r);
      let order, k, score;
      function start() { order = shuffle(items.slice()); k = 0; score = 0; show(); }
      function show() {
        if (k >= order.length) {
          g.innerHTML = '<div class="center"><div class="big-word">' + score + " / " + order.length + "</div><p>" + (score >= 6 ? "Lieliski! 🌟" : "Pamēģini vēlreiz 💪") + '</p><button class="btn primary" id="again">Spēlēt vēlreiz</button></div>';
          if (score >= 6) store.flag("sort", 5, "šķirošana");
          FZ.$("#again", g).onclick = start; return;
        }
        g.innerHTML = '<p class="muted center">' + (k + 1) + " / " + order.length + '</p><div class="big-word">' + esc(order[k][0]) + '</div><div class="row" style="justify-content:center;margin-top:14px">' + cats.map(c => '<button class="btn" data-c="' + c + '">' + c + "</button>").join("") + '</div><div class="fb center" style="margin-top:12px"></div>';
        FZ.$$("[data-c]", g).forEach(b => b.onclick = () => {
          const ok = b.dataset.c === order[k][1]; if (ok) score++;
          FZ.$$("[data-c]", g).forEach(x => x.disabled = true);
          FZ.$(".fb", g).innerHTML = (ok ? '<span class="ok">✅ Pareizi!</span>' : '<span class="no">❌ Nē — tas ir: ' + order[k][1] + "</span>") + '<br><button class="btn sm" id="nx" style="margin-top:8px">Tālāk →</button>';
          FZ.$("#nx", g).onclick = () => { k++; show(); };
        });
      }
      start();
    } },

    /* 2 · Nozares */
    { title: "Fizikas nozares", render(r) {
      const n = [["⚙️", "Mehānika", "Kustība un spēki", "ripojoša bumba, krītošs ābols"], ["🔥", "Siltums", "Karsts un auksts", "ledus kūst, ūdens vārās"], ["🔊", "Skaņa", "Skaņas izplatīšanās", "atbalss, mūzika, pērkons"],
        ["💡", "Gaisma", "Gaismas izplatīšanās", "ēna, varavīksne, spogulis"], ["⚡", "Elektrība", "Lādiņi un strāva", "zibens, baterija, spuldze"], ["🧲", "Magnētisms", "Magnēti un to lauks", "kompass, magnēts uz ledusskapja"]];
      r.innerHTML = "<h2>Fizikas nozares</h2><p class='muted'>Šīs sešas nozares ir pamats. Vēlāk mācīsies arī optiku un atomu fiziku. Daudzas parādības pieder vairākām nozarēm — piemēram, zibens ir gan elektrība, gan gaisma, gan skaņa.</p><div class='grid cols-3'>" +
        n.map(x => '<div class="card"><div class="icon-lg">' + x[0] + "</div><h3>" + x[1] + '</h3><p>' + x[2] + '</p><span class="tag">' + x[3] + "</span></div>").join("") + "</div>";
    } },

    /* 3 · Kura nozare? */
    { title: "Kura nozare?", render(r) {
      const rows = [["Bumba ripo lejup pa kalnu", ["mehānika"]], ["Ledus kūst saulē", ["siltums"]], ["Atbalss kalnos", ["skaņa"]], ["Ēna uz sienas", ["gaisma"]], ["Zibens debesīs", ["elektrība", "gaisma", "skaņa"]], ["Kompasa adata rāda uz ziemeļiem", ["magnētisms"]]];
      r.innerHTML = "<h2>Uzdevums pārī: kura nozare?</h2><p class='muted'>Pārrunā ar blakussēdētāju vai izvēlies pats, pie kuras nozares pieder katra parādība.</p><div class='grid'>" +
        rows.map((x, i) => '<div class="card"><div class="row between"><b>' + (i + 1) + ". " + esc(x[0]) + '</b><select data-i="' + i + '" style="max-width:200px"><option value="">— izvēlies —</option>' + NOZARES.map(z => "<option>" + z + "</option>").join("") + "</select></div></div>").join("") +
        '</div><div class="row mt"><button class="btn primary" id="chk">Pārbaudīt</button><span id="msg"></span></div><p class="muted">Zibenim derēs vairākas nozares — tā ir laba diskusija!</p>';
      FZ.$("#chk", r).onclick = () => {
        let ok = 0;
        FZ.$$("select", r).forEach(s => { const good = rows[s.dataset.i][1].includes(s.value); s.classList.remove("sel-ok", "sel-no"); s.classList.add(good ? "sel-ok" : "sel-no"); if (good) ok++; });
        FZ.$("#msg", r).innerHTML = ok === rows.length ? '<span class="ok">🎉 Viss pareizi!</span>' : '<span class="muted">Pareizi: ' + ok + " / " + rows.length + "</span>";
        if (ok === rows.length) store.flag("pairs", 5, "nozares");
      };
    } },

    /* 4 · Lielumi un mērvienības */
    { title: "Lielumi un mērvienības", render(r) {
      const rows = [["Garums", "metrs (m)", "lineāls, mērlente"], ["Masa", "kilograms (kg)", "svari"], ["Laiks", "sekunde (s)", "hronometrs, pulkstenis"], ["Temperatūra", "grāds pēc Celsija (°C)", "termometrs"]];
      const units = ["metrs (m)", "kilograms (kg)", "sekunde (s)", "grāds pēc Celsija (°C)"];
      r.innerHTML = "<h2>Fizikālie lielumi un mērvienības</h2><p>Fizikālais lielums ir īpašība, ko var izmērīt. Mērījuma rezultāts ir <b>skaitlis un mērvienība</b>, piemēram, garums <span class='formula'>l = 25 cm</span>. Bez mērvienības skaitlis nav mērījums!</p>" +
        "<table><tr><th>Lielums</th><th>Mērvienība</th><th>Ar ko mēra</th></tr>" + rows.map(x => "<tr><td>" + x[0] + "</td><td>" + x[1] + "</td><td>" + x[2] + "</td></tr>").join("") + "</table>" +
        '<h3 class="mt">Pārbaudi sevi: pievieno mērvienību</h3><div class="grid cols-2">' + rows.map((x, i) => '<label class="f">' + x[0] + '<select data-i="' + i + '"><option value="">—</option>' + units.map(u => "<option>" + u + "</option>").join("") + "</select></label>").join("") +
        '</div><div class="row"><button class="btn primary" id="chk">Pārbaudīt</button><span id="msg"></span></div>';
      FZ.$("#chk", r).onclick = () => {
        let ok = 0; FZ.$$("select", r).forEach(s => { const g = s.value === rows[s.dataset.i][1]; s.classList.remove("sel-ok", "sel-no"); s.classList.add(g ? "sel-ok" : "sel-no"); if (g) ok++; });
        FZ.$("#msg", r).innerHTML = ok === 4 ? '<span class="ok">🎉 Pareizi!</span>' : '<span class="muted">Pareizi: ' + ok + " / 4</span>";
        if (ok === 4) store.flag("units", 5, "mērvienības");
      };
    } },

    /* 5 · Mērījuma nolasīšana */
    { title: "Kā nolasīt mērījumu?", render(r) {
      let L = 4.3;
      function ruler(len) {
        let t = '<rect x="20" y="72" width="720" height="92" rx="8" fill="rgba(59,130,255,.12)" stroke="currentColor" stroke-opacity=".4"/>';
        for (let i = 0; i <= 100; i++) {
          const x = 30 + i * 7, h = i % 10 === 0 ? 30 : i % 5 === 0 ? 22 : 14;
          t += '<line x1="' + x + '" y1="72" x2="' + x + '" y2="' + (72 + h) + '" stroke="currentColor" stroke-width="' + (i % 10 === 0 ? 2 : 1) + '"/>';
          if (i % 10 === 0) t += '<text x="' + x + '" y="124" text-anchor="middle" font-size="15" fill="currentColor">' + (i / 10) + "</text>";
        }
        const px = 30 + len * 70;
        return '<svg viewBox="0 0 760 175" style="width:100%;color:var(--text)">' + t + '<text x="740" y="150" text-anchor="end" font-size="14" fill="currentColor">cm</text>' +
          '<rect x="30" y="22" width="' + (px - 30 - 16) + '" height="30" fill="#f59e0b"/><polygon points="' + (px - 16) + ",22 " + px + ",37 " + (px - 16) + ',52" fill="#fcd9a0"/>' +
          '<line x1="' + px + '" y1="52" x2="' + px + '" y2="72" stroke="#ef4444" stroke-dasharray="3 3"/></svg>';
      }
      r.innerHTML = "<h2>Kā nolasīt mērījumu?</h2><p><b>Skalas iedaļas vērtība:</b> starpību starp diviem blakus skaitļiem dala ar iedaļu skaitu starp tiem. No 0 līdz 1 cm ir 10 iedaļas: 1 cm : 10 = 0,1 cm = 1 mm.</p>" +
        '<div class="card" id="rl"></div><div class="row mt"><label class="f" style="margin:0;flex:1;min-width:200px">Cik gara ir zīmulis? (cm)<input type="text" id="ans" inputmode="decimal" placeholder="piem., 4,3"></label><button class="btn primary" id="chk">Pārbaudīt</button><button class="btn" id="nw">Jauns zīmulis</button></div><div id="msg" class="mt"></div>' +
        "<p class='muted'>Padomi: 1) novieto priekšmetu pie nulles, 2) skaties taisni no augšas, 3) nosaki iedaļas vērtību, 4) pieraksti skaitli ar mērvienību.</p>";
      const rl = FZ.$("#rl", r), msg = FZ.$("#msg", r), inp = FZ.$("#ans", r); rl.innerHTML = ruler(L);
      FZ.$("#chk", r).onclick = () => {
        const x = parseNum(inp.value); if (isNaN(x)) { msg.innerHTML = '<span class="muted">Ieraksti skaitli, piem., 4,3</span>'; return; }
        if (Math.abs(x - L) < 0.051) {
          msg.innerHTML = '<span class="ok">✅ Pareizi! Garums l = ' + fmt(L) + " cm.</span>";
          const s = store.get(); s.solved++; store.save(); store.flag("ruler", 5, "lineāls");
        } else msg.innerHTML = '<span class="no">❌ Vēl ne.</span> <span class="muted">Skaties, pie kuras iedaļas beidzas zīmulis: katra iedaļa ir 0,1 cm.</span>';
      };
      FZ.$("#nw", r).onclick = () => { L = Math.round((Math.random() * 89 + 10)) / 10; rl.innerHTML = ruler(L); inp.value = ""; msg.innerHTML = ""; };
    } },

    /* 6 · Pētīšanas metode */
    { title: "Kā fiziķi pēta dabu", render(r) {
      const st = [["Novērojums", "Ko es redzu?", "Ledus peld uz ūdens."], ["Hipotēze", "Kā es domāju, kāpēc tā notiek?", "Ledus ir vieglāks par tikpat daudz ūdens."], ["Eksperiments", "Pārbaude ar mērījumiem.", "Nosver vienādus ledus un ūdens tilpumus."], ["Secinājums", "Vai hipotēze apstiprinājās?", "Ledus masa ir mazāka, tātad tā blīvums ir mazāks."]];
      r.innerHTML = "<h2>Kā fiziķi pēta dabu</h2><p class='muted'>Fizika nav tikai formulas: zināšanas iegūst, pārbaudot minējumus. Arī nepareiza hipotēze ir rezultāts!</p><div class='timeline'>" +
        st.map(x => '<div class="st"><b>' + x[0] + '</b> — ' + x[1] + '<div class="ex">Piemērs ar ledu: ' + x[2] + "</div></div>").join("") + "</div>";
    } },

    /* 7 · Mini-eksperiments */
    { title: "Mini-eksperiments", render(r) {
      let scen = "flat", pred = "";
      const info = { flat: "Plakana lapa un grāmata", crumpled: "Saburzīta lapa un grāmata", onbook: "Lapa uz grāmatas" };
      r.innerHTML = "<h2>Mini-eksperiments: kas krīt ātrāk?</h2><p class='muted'>1) Pieraksti prognozi. 2) Nomet. 3) Salīdzini ar savu minējumu.</p>" +
        '<div class="chips" id="sc">' + Object.keys(info).map(k => '<button class="chip' + (k === "flat" ? " on" : "") + '" data-k="' + k + '">' + info[k] + "</button>").join("") + "</div>" +
        '<p class="mt"><b>Prognoze — kas nokritīs pirmais?</b></p><div class="chips" id="pr"><button class="chip" data-p="book">Grāmata</button><button class="chip" data-p="paper">Lapa</button><button class="chip" data-p="same">Vienlaikus</button></div>' +
        '<div class="row mt"><button class="btn primary" id="drop">⬇ Nomest</button></div><canvas class="sim" style="margin-top:12px;height:320px"></canvas><div id="res" class="mt"></div>';
      const cv = FZ.$("canvas", r), ctx = cv.getContext("2d"); let W = 600; const H = 320;
      function fit() { const w = cv.parentElement.clientWidth || 600, d = window.devicePixelRatio || 1; cv.width = w * d; cv.height = H * d; cv.style.height = H + "px"; ctx.setTransform(d, 0, 0, d, 0, 0); W = w; }
      fit(); window.addEventListener("resize", fit);
      let sim = null, raf = null;
      const G = 9.81, HH = 2;
      function colors() { const cs = getComputedStyle(document.documentElement); return { text: cs.getPropertyValue("--text").trim(), muted: cs.getPropertyValue("--muted").trim(), accent: cs.getPropertyValue("--accent2").trim(), warn: cs.getPropertyValue("--warn").trim(), border: cs.getPropertyValue("--border-strong").trim() }; }
      function draw() {
        const c = colors(), fl = H - 30, sc = (fl - 40) / HH; ctx.clearRect(0, 0, W, H);
        ctx.strokeStyle = c.border; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, fl); ctx.lineTo(W, fl); ctx.stroke();
        ctx.fillStyle = c.muted; ctx.font = "12px system-ui"; ctx.textAlign = "left"; ctx.fillText("2 m", 8, fl - HH * sc - 4);
        const by = sim ? sim.book.y : HH, py = sim ? sim.paper.y : HH, bx = scen === "onbook" ? W * 0.5 : W * 0.35, px = scen === "onbook" ? W * 0.5 : W * 0.65;
        ctx.fillStyle = c.accent; ctx.fillRect(bx - 40, fl - by * sc - 14, 80, 14);
        ctx.fillStyle = c.warn;
        if (scen === "crumpled") { ctx.beginPath(); ctx.arc(px, fl - py * sc - 9, 9, 0, Math.PI * 2); ctx.fill(); }
        else ctx.fillRect(px - 32, fl - py * sc - (scen === "onbook" ? 17 : 3), 64, 3);
        ctx.fillStyle = c.text; ctx.textAlign = "center"; ctx.fillText("grāmata", bx, fl + 18); if (scen !== "onbook") ctx.fillText("lapa", px, fl + 18);
      }
      function run() {
        cancelAnimationFrame(raf);
        const k = scen === "flat" ? 14 : 0.35;
        sim = { t: 0, book: { y: HH, v: 0, done: 0 }, paper: { y: HH, v: 0, done: 0 } }; let last = performance.now();
        function frame(now) {
          let dt = Math.min(0.05, (now - last) / 1000); last = now;
          for (let n = 0; n < 10; n++) {
            const h = dt / 10; sim.t += h;
            if (!sim.book.done) { sim.book.v += G * h; sim.book.y -= sim.book.v * h; if (sim.book.y <= 0) { sim.book.y = 0; sim.book.done = sim.t; } }
            if (scen === "onbook") { sim.paper.y = sim.book.y; sim.paper.done = sim.book.done; }
            else if (!sim.paper.done) { sim.paper.v += (G - k * sim.paper.v) * h; sim.paper.y -= sim.paper.v * h; if (sim.paper.y <= 0) { sim.paper.y = 0; sim.paper.done = sim.t; } }
          }
          draw();
          if (sim.book.done && sim.paper.done) { finish(); return; }
          raf = requestAnimationFrame(frame);
        }
        raf = requestAnimationFrame(frame);
      }
      function finish() {
        const b = sim.book.done, p = sim.paper.done, truth = scen === "flat" ? "book" : "same";
        const why = scen === "flat" ? "Plakano lapu stipri bremzē gaiss — tai ir liels laukums." : scen === "crumpled" ? "Saburzītu lapu gaiss bremzē mazāk, tāpēc tā krīt gandrīz kopā ar grāmatu." : "Grāmata atgrūž gaisu, tāpēc lapa krīt kopā ar to.";
        const good = pred === truth;
        FZ.$("#res", r).innerHTML = '<div class="card glow"><p>Grāmata nokrita pēc <b>' + fmt(b) + " s</b>" + (scen === "onbook" ? "" : ", lapa — pēc <b>" + fmt(p) + " s</b>") + ".</p><p>" + esc(why) + " <b>Bez gaisa abi kristu vienlaikus.</b></p>" +
          (pred ? "<p>" + (good ? '<span class="ok">Tava prognoze bija pareiza! ✅</span>' : '<span class="no">Prognoze nesakrita — tieši tāpēc eksperimenti ir vērtīgi.</span>') + "</p>" : '<p class="muted">Nākamreiz vispirms izvēlies prognozi!</p>') + "</div>";
        store.flag("exp", 5, "eksperiments");
      }
      FZ.$("#sc", r).onclick = e => { const b = e.target.closest("[data-k]"); if (!b) return; scen = b.dataset.k; FZ.$$("#sc .chip", r).forEach(x => x.classList.toggle("on", x === b)); cancelAnimationFrame(raf); sim = null; FZ.$("#res", r).innerHTML = ""; draw(); };
      FZ.$("#pr", r).onclick = e => { const b = e.target.closest("[data-p]"); if (!b) return; pred = b.dataset.p; FZ.$$("#pr .chip", r).forEach(x => x.classList.toggle("on", x === b)); };
      FZ.$("#drop", r).onclick = () => { FZ.$("#res", r).innerHTML = ""; run(); };
      draw();
      return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", fit); };
    } },

    /* 8 · Pašpārbaude */
    { title: "Pārbaudi sevi", render(r) {
      function go() {
        r.innerHTML = "<h2>Pārbaudi sevi</h2><div id='qz' class='card'></div>";
        FZ.quiz.mount(FZ.$("#qz", r), FZ.finalQuiz, { onFinish(res) {
          const o = record("Tēma 1: pašpārbaude", res);
          r.innerHTML = '<h2>Pašpārbaude</h2><div class="card glow center"><div class="big-word" style="border:0;background:none;font-size:3rem">' + o.ok + " / " + o.total + "</div><p>" + (o.pct >= 80 ? "Teicami! Tu esi gatavs nākamajai tēmai." : "Atkārto nodarbības soļus un pamēģini vēlreiz.") + '</p><button class="btn primary" id="rt">Mēģināt vēlreiz</button></div>';
          FZ.$("#rt", r).onclick = go;
        } });
      }
      go();
    } },

    /* 9 · Ko atcerēties */
    { title: "Ko atcerēties", render(r) {
      const done = store.get().completed.includes("ko-maca-fizika");
      r.innerHTML = "<h2>Ko atcerēties</h2><div class='timeline'>" + [
        "Fizika pēta dabas parādības un to likumus.", "Nozares: mehānika, siltums, skaņa, gaisma, elektrība, magnētisms.",
        "Lielumus mēra ar instrumentiem, un rezultātam vienmēr ir mērvienība.", "Zināšanas iegūst ar novērojumu, hipotēzi, eksperimentu un secinājumu."].map(x => '<div class="st">' + x + "</div>").join("") +
        '</div><p class="mt">Atgriezies pie sākuma jautājumiem: pie kuras nozares tie pieder? (1 — skaņa un gaisma, 2 — mehānika un siltums, 3 — mehānika.)</p><p class="muted">Nākamajā tēmā: <b>Tilpums. Masa. Blīvums</b></p>' +
        '<div class="row mt">' + (done ? '<span class="tag good">✔ Tēma pabeigta</span>' : '<button class="btn primary" id="fin">✅ Pabeigt tēmu</button>') + '<a class="btn" href="#/uzdevumi">📝 Uz testiem</a><a class="btn" href="#/simulacijas">🧪 Uz simulācijām</a></div>';
      const f = FZ.$("#fin", r);
      if (f) f.onclick = () => { const s = store.get(); s.completed.push("ko-maca-fizika"); store.save(); store.addXP(50, "tēma pabeigta"); FZ.toast("🎓 Tēma pabeigta!", "good"); step9(r); };
      function step9(root) { steps[9].render(root); }
    } }
  ];

  FZ.topics = [{ id: "ko-maca-fizika", no: 1, icon: "⚛️", title: "Ko māca fizika?", grade: "8. klase", desc: "Dabas parādības, mērījumi un pirmais eksperiments.", steps }];
  FZ.comingSoon = ["Mehānika", "Kinemātika", "Dinamika", "Spēki un Ņūtona likumi", "Darbs, enerģija un jauda", "Siltumfizika", "Elektrība un magnētisms", "Optika", "Svārstības un viļņi", "Atomu un kodolfizika"];

  FZ.topicProgress = t => { const seen = store.get().lessonSeen[t.id] || {}; return Object.keys(seen).filter(k => seen[k]).length / t.steps.length; };

  FZ.views.lesson = function (root, rest) {
    const t = FZ.topics.find(x => x.id === (rest && rest[0])), s = store.get();
    if (!t) { root.innerHTML = '<p>Tēma nav atrasta. <a href="#/temas">← Atpakaļ uz tēmām</a></p>'; return; }
    let i = rest[1] !== undefined ? parseInt(rest[1], 10) : (s.lastTopic === t.id ? s.lastStep : 0);
    i = Math.min(Math.max(isNaN(i) ? 0 : i, 0), t.steps.length - 1);
    let clean = null;
    function show() {
      if (clean) { clean(); clean = null; }
      s.lessonSeen[t.id] = s.lessonSeen[t.id] || {}; s.lessonSeen[t.id][i] = true; s.lastTopic = t.id; s.lastStep = i; store.save(); store.checkAch();
      store.visit({ route: "tema/" + t.id + "/" + i, title: t.title + " · " + t.steps[i].title });
      history.replaceState(null, "", "#/tema/" + t.id + "/" + i); FZ.refreshSide && FZ.refreshSide();
      root.innerHTML = '<div class="crumbs"><a href="#/temas">Mācību tēmas</a> › ' + esc(t.title) + "</div><h1>" + t.icon + " " + esc(t.title) + ' <span class="tag">' + esc(t.grade) + "</span></h1>" +
        '<div class="bar"><i style="width:' + Math.round(FZ.topicProgress(t) * 100) + '%"></i></div>' +
        '<div class="steps">' + t.steps.map((x, k) => '<button title="' + esc(x.title) + '" data-k="' + k + '" class="' + (k === i ? "cur" : (s.lessonSeen[t.id][k] ? "seen" : "")) + '">' + (k + 1) + "</button>").join("") + "</div>" +
        '<div class="card lesson-body" id="lb"></div><div class="lesson-nav"><button class="btn" id="pv"' + (i === 0 ? " disabled" : "") + '>← Atpakaļ</button><span class="muted">' + (i + 1) + " / " + t.steps.length + " · " + esc(t.steps[i].title) + '</span><button class="btn primary" id="nx"' + (i === t.steps.length - 1 ? " disabled" : "") + ">Tālāk →</button></div>";
      const c = t.steps[i].render(FZ.$("#lb", root)); if (typeof c === "function") clean = c;
      FZ.$(".steps", root).onclick = e => { const b = e.target.closest("[data-k]"); if (b) { i = +b.dataset.k; show(); window.scrollTo(0, 0); } };
      FZ.$("#pv", root).onclick = () => { i--; show(); window.scrollTo(0, 0); };
      FZ.$("#nx", root).onclick = () => { i++; show(); window.scrollTo(0, 0); };
    }
    show();
    return () => { if (clean) clean(); };
  };
})();
