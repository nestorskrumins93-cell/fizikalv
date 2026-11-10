/* ===== 03 jautājumu banka un sasniegumi ===== */
(function () {
  /* pareizā atbilde vienmēr ir PIRMĀ — jautājumi tiek sajaukti, kad tos rāda */
  const mc = (q, options, explain, tag) => ({ type: "mc", q, options, explain, tag });

  FZ.finalQuiz = [
    mc("Kā sauc priekšmetu, piemēram, bumbu vai galdu?", ["Fizikālais ķermenis", "Viela", "Fizikālā parādība", "Fizikālais lielums"], "Priekšmetu ar savu formu un izmēriem sauc par fizikālo ķermeni.", "Pamati"),
    mc("Kura fizikas nozare pēta atbalsi?", ["Skaņa", "Gaisma", "Magnētisms", "Siltums"], "Atbalss ir skaņas parādība — skaņa atstarojas no šķēršļa.", "Nozares"),
    mc("Kādā mērvienībā mēra masu?", ["Kilograms (kg)", "Metrs (m)", "Sekunde (s)", "Grāds pēc Celsija (°C)"], "Masas mērvienība ir kilograms.", "Lielumi"),
    mc("Ar ko mēra temperatūru?", ["Termometrs", "Svari", "Lineāls", "Hronometrs"], "Temperatūru mēra ar termometru.", "Lielumi"),
    mc("Ar ko sākas fizikālā pētīšana?", ["Novērojums", "Secinājums", "Eksperiments", "Hipotēze"], "Pētīšana sākas ar novērojumu: ko es redzu?", "Metode"),
    mc("Starp 0 un 10 cm lineālam ir 100 iedaļas. Cik liela ir viena iedaļa?", ["0,1 cm jeb 1 mm", "1 cm", "0,01 cm", "10 mm"], "10 cm : 100 = 0,1 cm = 1 mm.", "Mērījumi")
  ];

  FZ.bank = FZ.finalQuiz.concat([
    mc("Kurš no šiem ir viela?", ["Ūdens", "Galds", "Bumba", "Zibens"], "Viela ir tas, no kā ķermenis ir veidots: ūdens, koks, dzelzs.", "Pamati"),
    mc("Kurš no šiem ir fizikāla parādība?", ["Kušana", "Zīmulis", "Dzelzs", "Galds"], "Parādība ir pārmaiņa dabā — kušana, krišana, zibens.", "Pamati"),
    mc("Kāpēc zibeni redzam agrāk nekā dzirdam pērkonu?", ["Gaisma izplatās daudz ātrāk nekā skaņa", "Zibens ir skaļāks par pērkonu", "Skaņa izplatās ātrāk nekā gaisma", "Pērkons rodas vēlāk par zibeni"], "Gaisma ~300 000 km/s, skaņa tikai ~340 m/s.", "Pamati"),
    mc("Kāpēc ledus peld uz ūdens?", ["Ledus blīvums ir mazāks nekā ūdenim", "Ledus ir auksts", "Ūdens ir smagāks par visu", "Ledus ir caurspīdīgs"], "Ledus blīvums (~917 kg/m³) ir mazāks nekā ūdenim (1000 kg/m³).", "Pamati"),
    mc("Kura nozare pēta kompasa adatas darbību?", ["Magnētisms", "Siltums", "Skaņa", "Mehānika"], "Kompass darbojas pateicoties Zemes magnētiskajam laukam.", "Nozares"),
    mc("Pie kuras nozares pieder ēna uz sienas?", ["Gaisma", "Skaņa", "Siltums", "Elektrība"], "Ēna rodas, jo gaisma izplatās taisnā līnijā un ķermenis to aizsedz.", "Nozares"),
    mc("No kā sastāv mērījuma rezultāts?", ["No skaitļa un mērvienības", "Tikai no skaitļa", "Tikai no mērvienības", "No instrumenta nosaukuma"], "Bez mērvienības skaitlis nav mērījums: 25 kas? cm vai m?", "Lielumi"),
    mc("Kāpēc plakana papīra lapa krīt lēnāk par grāmatu?", ["Gaiss to stipri bremzē", "Zeme to nepievelk", "Tā ir ļoti viegla un tāpēc nekrīt", "Tai nav masas"], "Lapai ir liels laukums, un gaiss to bremzē. Bez gaisa abi kristu vienlaikus.", "Metode")
  ]);

  FZ.formulaQs = [
    mc("Kuru formulu izmanto ātruma aprēķinam, ja zināms ceļš un laiks?", ["v = s / t", "v = s · t", "v = t / s", "v = s + t"], "Ātrums ir ceļš, kas veikts vienā laika vienībā: v = s / t.", "Formulas"),
    mc("Kura formula izsaka Ņūtona otro likumu?", ["F = m · a", "F = m / a", "F = a / m", "F = m + a"], "Spēks ir masa, kas reizināta ar paātrinājumu.", "Formulas"),
    mc("Kā aprēķina mehānisko darbu?", ["A = F · s", "A = F / s", "A = s / F", "A = F + s"], "Darbs ir spēks, kas reizināts ar ceļu spēka virzienā.", "Formulas"),
    mc("Kā aprēķina jaudu?", ["P = A / t", "P = A · t", "P = t / A", "P = A + t"], "Jauda parāda, cik liels darbs veikts vienā sekundē.", "Formulas"),
    mc("Kura formula dod kinētisko enerģiju?", ["E = m · v² / 2", "E = m · v", "E = m · a / 2", "E = m² · v"], "Enerģija ir proporcionāla ātruma kvadrātam.", "Formulas"),
    mc("Kā izsaka Oma likumu?", ["I = U / R", "I = U · R", "I = R / U", "I = U + R"], "Strāva ir proporcionāla spriegumam un apgriezti proporcionāla pretestībai.", "Formulas")
  ];

  FZ.achievements = [
    { id: "first", icon: "👣", title: "Pirmais solis", desc: "Atver pirmo mācību soli.", test: s => Object.keys(s.lessonSeen).length > 0 },
    { id: "topic1", icon: "🎓", title: "Fizikas pamati", desc: "Pabeidz tēmu „Ko māca fizika?”.", test: s => s.completed.includes("ko-maca-fizika") },
    { id: "sim3", icon: "🧪", title: "Eksperimentētājs", desc: "Izmēģini 3 simulācijas.", test: s => Object.keys(s.flags).filter(k => k.indexOf("sim:") === 0).length >= 3 },
    { id: "simall", icon: "🔬", title: "Laboratorija", desc: "Izmēģini visas simulācijas.", test: s => Object.keys(s.flags).filter(k => k.indexOf("sim:") === 0).length >= (FZ.sims ? FZ.sims.length : 99) },
    { id: "calc", icon: "🧮", title: "Skaitļotājs", desc: "Izmanto formulu kalkulatoru.", test: s => !!s.flags.calc },
    { id: "solved5", icon: "✏️", title: "Uzdevumu cienītājs", desc: "Atrisini 5 uzdevumus.", test: s => s.solved >= 5 },
    { id: "solved25", icon: "🏅", title: "Uzdevumu meistars", desc: "Atrisini 25 uzdevumus.", test: s => s.solved >= 25 },
    { id: "perfect", icon: "💯", title: "Bez kļūdām", desc: "Iegūsti 100% testā.", test: s => s.bestTest >= 100 },
    { id: "streak3", icon: "🔥", title: "3 dienu sērija", desc: "Mācies 3 dienas pēc kārtas.", test: s => s.bestStreak >= 3 },
    { id: "streak7", icon: "🌋", title: "Nedēļas sērija", desc: "Mācies 7 dienas pēc kārtas.", test: s => s.bestStreak >= 7 },
    { id: "daily", icon: "📅", title: "Dienas izaicinājums", desc: "Atrisini dienas uzdevumu.", test: s => Object.keys(s.daily).length > 0 },
    { id: "tutor", icon: "🤖", title: "Jautātājs", desc: "Uzdod jautājumu skolotājam.", test: s => !!s.flags.tutor },
    { id: "xp500", icon: "⚛️", title: "Zinātnieks", desc: "Savāc 500 XP.", test: s => s.xp >= 500 }
  ];
})();
