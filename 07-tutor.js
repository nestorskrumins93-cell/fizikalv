/* ===== 07 fizikas skolotājs (strādā pārlūkā, bez interneta) ===== */
(function () {
  const { esc, fmt, store } = FZ;
  const kb = [
    { keys: ["kermen", "viela", "paradib"], title: "Ķermenis, viela, parādība", l: [
      "Fizikālais ķermenis ir priekšmets (galds, bumba). Viela ir tas, no kā tas ir veidots (koks, dzelzs). Parādība ir pārmaiņa dabā (kušana, krišana).",
      "Piemērs: glāze ir ķermenis, stikls — viela. Ledus gabals ir ķermenis, ledus — viela, bet tā kušana — parādība. Biežākā kļūda ir sajaukt ķermeni ar vielu.",
      "Fizika pēta parādības, kurās viela nemainās par citu vielu. Ja viela pārvēršas citā (piem., rūsēšana), to pēta ķīmija."] },
    { keys: ["nozar", "mehanik", "fizika ir", "ko maca fizika"], title: "Fizikas nozares", l: [
      "Fizika pēta dabu. Nozares: mehānika (kustība un spēki), siltums, skaņa, gaisma, elektrība un magnētisms.",
      "Daudzas parādības pieder vairākām nozarēm: zibens ir gan elektrība, gan gaisma, gan skaņa.",
      "Vēlāk apgūsi arī optiku, svārstības un viļņus, atomu un kodolfiziku — tās izaug no šīm pamata nozarēm."] },
    { keys: ["mervien", "lielum", "mera", "meri", "meriju"], title: "Lielumi un mērvienības", l: [
      "Fizikālais lielums ir īpašība, ko var izmērīt: garums (m), masa (kg), laiks (s), temperatūra (°C). Mērījumam vienmēr ir skaitlis un mērvienība.",
      "Bez mērvienības skaitlis nav mērījums: 25 — centimetri vai metri? Garumu mēra ar lineālu, masu ar svariem, laiku ar hronometru, temperatūru ar termometru.",
      "Fizikā izmanto SI sistēmu: metrs, kilograms, sekunde, kelvins (ikdienā — °C), ampērs. Pirms aprēķiniem mērvienības pārvērš SI."] },
    { keys: ["iedal", "skala", "lineal"], title: "Skalas iedaļas vērtība", l: [
      "Iedaļas vērtība ir attālums starp divām blakus svītriņām. No 0 līdz 1 cm ir 10 iedaļas, tātad viena iedaļa ir 0,1 cm = 1 mm.",
      "Formula: iedaļas vērtība = (lielākais skaitlis − mazākais skaitlis) : iedaļu skaits starp tiem.",
      "Nolasot: novieto priekšmetu pie nulles, skaties taisni no augšas, noskaiti veselos centimetrus un tad iedaļas. Precizitāte ir pusiedaļa."] },
    { keys: ["hipotez", "eksperiment", "novero", "petis"], title: "Pētīšanas metode", l: [
      "Fiziķi pēta dabu četros soļos: novērojums, hipotēze, eksperiments, secinājums.",
      "Piemērs: novērojums — ledus peld. Hipotēze — ledus ir vieglāks par tikpat daudz ūdens. Eksperiments — nosver vienādus tilpumus. Secinājums — ledus blīvums ir mazāks.",
      "Hipotēze var izrādīties nepareiza, un arī tas ir vērtīgs rezultāts: tā mēs atmetam kļūdainus skaidrojumus."] },
    { keys: ["atrum"], title: "Ātrums", l: [
      "Ātrums parāda, cik tālu ķermenis nokļūst vienā laika vienībā. Formula: v = s / t.",
      "Piemērs: 200 m 10 s laikā → v = 200 / 10 = 20 m/s. Lai km/h pārvērstu m/s, dala ar 3,6.",
      "Šī formula dod vidējo ātrumu. Vienmērīgā kustībā ātrums nemainās, bet nevienmērīgā mainās, un tad runā par paātrinājumu."] },
    { keys: ["paatr"], title: "Paātrinājums", l: [
      "Paātrinājums rāda, cik ātri mainās ātrums. Formula: a = Δv / t.",
      "Ja auto 5 s laikā palielina ātrumu no 0 līdz 10 m/s, a = 10 / 5 = 2 m/s².",
      "Mērvienība m/s² nozīmē: ātrums mainās par tik m/s katrā sekundē. Brīvās krišanas paātrinājums uz Zemes ir g ≈ 9,81 m/s²."] },
    { keys: ["spek", "newton", "nuton"], title: "Spēks un Ņūtona likums", l: [
      "Spēks mainīt ķermeņa kustību. To mēra ņūtonos (N). Formula: F = m · a.",
      "Jo lielāka masa, jo grūtāk to paātrināt. Ja m = 5 kg un a = 2 m/s², tad F = 10 N.",
      "1 N ir spēks, kas 1 kg masai dod paātrinājumu 1 m/s². Ja darbojas vairāki spēki, rēķina to rezultējošo."] },
    { keys: ["darb"], title: "Mehāniskais darbs", l: [
      "Darbs rodas, kad spēks pārvieto ķermeni. Formula: A = F · s. Mēra džoulos (J).",
      "Piemērs: ar 20 N spēku bīda kasti 5 m → A = 100 J.",
      "Darbu rēķina tikai spēka virzienā. Ja spēks ir perpendikulārs kustībai, darbs ir nulle."] },
    { keys: ["jaud"], title: "Jauda", l: [
      "Jauda rāda, cik ātri tiek veikts darbs. Formula: P = A / t. Mēra vatos (W).",
      "Ja 100 J darbs veikts 5 s laikā, P = 20 W.",
      "1 W = 1 J/s. Lielākas jaudas mēra kilovatos: 1 kW = 1000 W."] },
    { keys: ["energ", "kinetisk"], title: "Kinētiskā enerģija", l: [
      "Kustīgam ķermenim ir kinētiskā enerģija: E = m · v² / 2. Mēra džoulos (J).",
      "Ātrums ir kvadrātā: divreiz lielāks ātrums dod četreiz lielāku enerģiju. Tāpēc ātra braukšana ir bīstama.",
      "Enerģija nerodas un nepazūd — tā tikai pāriet no viena veida citā (nezūdamības likums)."] },
    { keys: ["bliv", "peld", "tilpum"], title: "Blīvums", l: [
      "Blīvums rāda, cik liela masa ir vienā tilpuma vienībā: ρ = m / V. Ledus blīvums ir mazāks par ūdens blīvumu, tāpēc ledus peld.",
      "Ūdens ~1000 kg/m³, ledus ~917 kg/m³. Ķermenis peld, ja tā blīvums ir mazāks par šķidruma blīvumu. Tas būs nākamās tēmas pamatā.",
      "Pārrēķins: 1 g/cm³ = 1000 kg/m³. Tilpumu var izmērīt ar mērglāzi vai aprēķināt no izmēriem."] },
    { keys: ["oma likum", "strav", "spriegum", "pretest"], title: "Oma likums", l: [
      "Strāvas stiprums vadītājā: I = U / R. U — spriegums (V), R — pretestība (Ω), I — strāva (A).",
      "Ja U = 12 V un R = 4 Ω, tad I = 3 A. Lielāka pretestība nozīmē mazāku strāvu.",
      "Virknes slēgumā pretestības saskaita, paralēlā — kopējā pretestība ir mazāka par mazāko no tām. To vari izmēģināt simulācijā „Elektriskā ķēde”."] },
    { keys: ["brivas krisan", "brivaa krisan", "krisan", "smaguma", "gravit"], title: "Brīvā krišana", l: [
      "Brīvi krītošs ķermenis kustas arvien ātrāk: ātrums v = g · t, kur g ≈ 9,81 m/s².",
      "Nokrišanas augstums h = g · t² / 2. Gaisa pretestība ir tā, kas padara plakanu lapu krītam lēnāk par akmeni.",
      "Bez gaisa visi ķermeņi krīt vienādi neatkarīgi no masas. To var pārbaudīt simulācijā „Brīvā krišana”."] },
    { keys: ["gaisa pretest", "lapa", "gramat"], title: "Gaisa pretestība", l: [
      "Plakana lapa krīt lēni, jo tai ir liels laukums un gaiss to stipri bremzē. Saburzīta lapa krīt gandrīz kopā ar grāmatu.",
      "Lapa uz grāmatas krīt kopā ar grāmatu, jo grāmata atgrūž gaisu. Bez gaisa abi kristu vienlaikus.",
      "Gaisa pretestība pieaug ar ātrumu un ķermeņa laukumu — tāpēc izpletnim ir liels laukums."] },
    { keys: ["zibens", "perkon", "skana", "gaism"], title: "Gaisma un skaņa", l: [
      "Gaisma izplatās ap 300 000 km/s, skaņa tikai ap 340 m/s. Tāpēc zibeni redzam uzreiz, bet pērkonu dzirdam vēlāk.",
      "Attālumu līdz zibenim var novērtēt: skaitot sekundes starp zibeni un pērkonu, katrs 3 s ≈ 1 km.",
      "Gaisma var izplatīties vakuumā, skaņai vajadzīga viela (gaiss, ūdens, cietviela)."] }
  ];
  const norm = FZ.calc.strip;
  function lookup(text) {
    const n = norm(text); let best = null, bs = 0;
    kb.forEach(e => { const sc = e.keys.filter(k => FZ.calc.kwHit(n, k)).length; if (sc > bs) { bs = sc; best = e; } });
    return best;
  }

  FZ.views.tutor = function (root) {
    store.visit({ route: "skolotajs", title: "Skolotājs" });
    const s = store.get(); let level = s.tutorLevel || 2, pending = null, attempts = 0, hints = 0, lastF = null;
    root.innerHTML = '<div class="page-head"><h1>🤖 Fizikas skolotājs</h1><p>Uzdod jautājumu par fiziku vai ieraksti uzdevumu (piem., „Auto brauc 20 m/s 10 s. Cik liels ir ceļš?”). Skolotājs vispirms izskaidros, kā domāt, un risinājumu parādīs tikai tad, kad tu to pieprasīsi.</p></div>' +
      '<div class="card"><div class="row between"><div class="chips" id="lv"></div><button class="btn sm" id="tr">🎯 Treniņuzdevums</button></div><div class="chat"><div class="msgs" id="ms"></div>' +
      '<div class="chips" id="sg"></div><div class="chat-in"><input type="text" id="in" placeholder="Raksti jautājumu vai uzdevumu…" autocomplete="off"><button class="btn primary" id="go">Sūtīt</button></div></div></div>' +
      '<p class="muted mt">ℹ️ Šis skolotājs darbojas tavā pārlūkā bez interneta. Tas pārzina šīs platformas tēmas un var risināt uzdevumus ar formulām, bet nav pilnvērtīgs mākslīgā intelekta modelis.</p>';
    const ms = FZ.$("#ms", root), inp = FZ.$("#in", root);
    function add(who, html) { const d = document.createElement("div"); d.className = "msg " + who; d.innerHTML = html; ms.appendChild(d); ms.scrollTop = ms.scrollHeight; return d; }
    function lv() { FZ.$("#lv", root).innerHTML = ["Vienkārši", "Vidēji", "Dziļāk"].map((n, k) => '<button class="chip ' + (level === k + 1 ? "on" : "") + '" data-l="' + (k + 1) + '">' + n + "</button>").join(""); }
    lv();
    FZ.$("#lv", root).onclick = e => { const b = e.target.closest("[data-l]"); if (b) { level = +b.dataset.l; s.tutorLevel = level; store.save(); lv(); } };
    FZ.$("#sg", root).innerHTML = ["Kas ir ātrums?", "Kāpēc ledus peld?", "Kas ir hipotēze?", "Auto brauc 20 m/s 10 s. Cik liels ir ceļš?", "Ķermeņa masa 5 kg, paātrinājums 3 m/s². Cik liels ir spēks?"].map(x => '<button class="chip">' + esc(x) + "</button>").join("");
    FZ.$("#sg", root).onclick = e => { const b = e.target.closest(".chip"); if (b) { inp.value = b.textContent; send(); } };

    function newTask() {
      pending = (lastF && FZ.gens[lastF] && Math.random() < 0.7) ? FZ.gens[lastF](Math.random) : FZ.tasks.random(); attempts = 0; hints = 0;
      add("bot", "<b>Treniņuzdevums:</b><br>" + esc(pending.q) + "<br><span class='muted'>Ieraksti atbildi (tikai skaitli). Ja neprodi, uzraksti „palīdzi”.</span>");
    }
    function solveMsg(c) {
      const f = c.f, others = Object.keys(f.vars).filter(k => k !== c.u);
      const guide = "<b>Kā domāt par šo uzdevumu:</b><ol><li>Ko meklējam? <b>" + esc(f.vars[c.u].name) + " (" + esc(f.vars[c.u].sym) + ")</b></li><li>Ko zinām? " +
        others.map(k => esc(f.vars[k].sym) + " = " + fmt(c.inp[k].value) + " " + esc(c.inp[k].unit)).join(", ") + "</li><li>Kura formula saista šos lielumus? Tā ir saistīta ar tēmu „" + esc(f.name) + "”.</li><li>Vai visi lielumi ir SI vienībās? Ja nē, vispirms pārrēķini.</li></ol>Pamēģini pats, tad pārbaudi:";
      const el = add("bot", guide + '<br><button class="btn sm">Rādīt risinājumu</button>');
      FZ.$("button", el).onclick = ev => {
        const r = FZ.calc.solve(f.id, c.u, c.inp);
        ev.target.remove();
        el.insertAdjacentHTML("beforeend", r.ok ? "<ol>" + r.steps.map(x => "<li>" + x + "</li>").join("") + "</ol>" : "<p class='no'>" + esc(r.error) + "</p>");
        ms.scrollTop = ms.scrollHeight;
      };
      lastF = f.id === "speed" || f.id === "force" || f.id === "work" || f.id === "power" || f.id === "ek" || f.id === "ohm" ? f.id : lastF;
    }
    function send() {
      const text = inp.value.trim(); if (!text) return; inp.value = "";
      add("me", esc(text)); store.flag("tutor", 5, "skolotājs");
      if (pending) {
        if (/nezinu|palidz|palīdz|padoms|hint|nesaprotu/i.test(text)) {
          hints++;
          if (hints === 1) add("bot", "💡 Sāc ar to, ko meklē, un pieraksti formulu. Šis uzdevums ir par tēmu: <b>" + esc((FZ.calc.formulas.find(x => x.id === pending.formula) || { name: "formulām" }).name) + "</b>. Pārbaudi mērvienības!");
          else { add("bot", "Lūk, risinājums: <b>" + esc(pending.explain) + "</b>"); pending = null; }
          return;
        }
        const r = FZ.tasks.check(pending, text);
        if (!r.bad) {
          if (r.ok) { add("bot", "✅ Pareizi! " + esc(pending.explain)); const st = store.get(); st.solved++; store.save(); store.addXP(3, "uzdevums"); lastF = pending.formula || lastF; pending = null; }
          else { attempts++; if (attempts >= 2) { add("bot", "❌ Vēl ne. Apskatīsim kopā: <b>" + esc(pending.explain) + "</b>"); pending = null; } else add("bot", "❌ Nav gluži. " + esc(FZ.tasks.hint(pending, r.x)) + " Mēģini vēlreiz!"); }
          return;
        }
      }
      const a = FZ.calc.analyse(text);
      if (a && a.cands.length && a.cands[0].hit) { solveMsg(a.cands[0]); return; }
      if (a && a.ex.length >= 2) { add("bot", "Es atradu skaitļus: " + a.ex.map(e => esc(fmt(e.value) + " " + e.unit)).join(", ") + ". Ko tieši jāaprēķina — ceļš, ātrums, laiks, spēks, darbs, jauda vai kaut kas cits? Uzraksti to jautājumā."); return; }
      const e = lookup(text);
      if (e) { add("bot", "<b>" + esc(e.title) + "</b><br>" + esc(e.l[level - 1]) + (level < 3 ? "<br><span class='muted'>Ja vajag dziļāk, pārslēdz līmeni uz „Dziļāk”.</span>" : "")); return; }
      add("bot", "Šo es vēl nezinu 🤔. Pamēģini jautāt par: ātrumu, paātrinājumu, spēku, darbu, jaudu, enerģiju, blīvumu, Oma likumu, brīvo krišanu vai pētīšanas metodi. Vai ieraksti uzdevumu ar skaitļiem un mērvienībām.");
    }
    FZ.$("#go", root).onclick = send; inp.addEventListener("keydown", e => { if (e.key === "Enter") send(); });
    FZ.$("#tr", root).onclick = newTask;
    add("bot", "Sveiks! 👋 Es esmu tavs fizikas skolotājs. Es nedošu tikai gatavu atbildi — palīdzēšu saprast, kā to atrisināt. Ko gribi uzzināt?");
  };
})();
