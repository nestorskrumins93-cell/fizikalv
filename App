// ---------- Cilnes ----------
document.querySelectorAll("nav button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("nav button").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

// ---------- Mācības ----------
const lessons = [
  {
    title: "1. Vienmērīga kustība",
    body: `<p>Ja ķermeņa ātrums nemainās, ceļu aprēķina šādi:</p>
           <div class="formula">s = v · t</div>
           <p>s – ceļš (m), v – ātrums (m/s), t – laiks (s).</p>
           <p><b>Piemērs:</b> auto brauc 20 m/s 10 s → s = 200 m.</p>`
  },
  {
    title: "2. Ņūtona otrais likums",
    body: `<p>Spēks ir vienāds ar masu, kas reizināta ar paātrinājumu:</p>
           <div class="formula">F = m · a</div>
           <p>F – spēks (N), m – masa (kg), a – paātrinājums (m/s²).</p>
           <p><b>Piemērs:</b> m = 5 kg, a = 2 m/s² → F = 10 N.</p>`
  },
  {
    title: "3. Brīvā krišana",
    body: `<p>Brīvi krītoša ķermeņa ātrums un nokrišanas augstums:</p>
           <div class="formula">v = g · t</div> <div class="formula">h = g · t² / 2</div>
           <p>g ≈ 9.81 m/s² uz Zemes.</p>`
  },
  {
    title: "4. Kinētiskā enerģija",
    body: `<p>Kustīga ķermeņa enerģija:</p>
           <div class="formula">Ek = m · v² / 2</div>
           <p>Mēra džoulos (J).</p>`
  },
  {
    title: "5. Oma likums",
    body: `<p>Strāvas stiprums vadītājā:</p>
           <div class="formula">I = U / R</div>
           <p>I – strāva (A), U – spriegums (V), R – pretestība (Ω).</p>`
  }
];

const listEl = document.getElementById("lesson-list");
const viewEl = document.getElementById("lesson-view");
lessons.forEach(l => {
  const d = document.createElement("div");
  d.className = "card";
  d.textContent = l.title;
  d.onclick = () => { viewEl.innerHTML = `<h2>${l.title}</h2>${l.body}`; };
  listEl.appendChild(d);
});

// ---------- Simulācija ----------
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const $ = id => document.getElementById(id);
let anim = null;

[["v0", "v-val"], ["angle", "a-val"], ["g", "g-val"]].forEach(([inp, out]) => {
  $(inp).addEventListener("input", () => { $(out).textContent = $(inp).value; });
});

function drawGround() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#475569";
  ctx.beginPath();
  ctx.moveTo(0, canvas.height - 20);
  ctx.lineTo(canvas.width, canvas.height - 20);
  ctx.stroke();
}

function launch() {
  cancelAnimationFrame(anim);
  const v0 = +$("v0").value;
  const ang = (+$("angle").value * Math.PI) / 180;
  const g = +$("g").value;
  const vx = v0 * Math.cos(ang);
  const vy = v0 * Math.sin(ang);

  const tFlight = (2 * vy) / g;
  const range = vx * tFlight;
  const hMax = (vy * vy) / (2 * g);

  // mērogs, lai viss ietilptu kadrā
  const scale = Math.min((canvas.width - 40) / range, (canvas.height - 60) / hMax, 20);
  const speed = 2; // simulācijas ātrums
  let t = 0;
  const trail = [];

  function step() {
    t += 0.016 * speed;
    if (t > tFlight) t = tFlight;
    const x = vx * t;
    const y = vy * t - 0.5 * g * t * t;
    trail.push([20 + x * scale, canvas.height - 20 - y * scale]);

    drawGround();
    ctx.strokeStyle = "#38bdf8";
    ctx.beginPath();
    trail.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)));
    ctx.stroke();

    const [bx, by] = trail[trail.length - 1];
    ctx.fillStyle = "#f97316";
    ctx.beginPath();
    ctx.arc(bx, by, 8, 0, Math.PI * 2);
    ctx.fill();

    if (t < tFlight) anim = requestAnimationFrame(step);
  }
  step();

  $("sim-result").innerHTML =
    `Lidojuma laiks: <b>${tFlight.toFixed(2)} s</b> · ` +
    `Tālums: <b>${range.toFixed(1)} m</b> · ` +
    `Maksimālais augstums: <b>${hMax.toFixed(1)} m</b>`;
}
$("launch").addEventListener("click", launch);
drawGround();

// ---------- Tests ----------
const questions = [
  { q: "Kāda ir brīvās krišanas paātrinājuma vērtība uz Zemes?", o: ["1.6 m/s²", "9.81 m/s²", "98.1 m/s²"], a: 1 },
  { q: "Ar kuru formulu aprēķina spēku?", o: ["F = m · a", "F = m / a", "F = a / m"], a: 0 },
  { q: "Kādās vienībās mēra spēku?", o: ["Džoulos", "Vatos", "Ņūtonos"], a: 2 },
  { q: "Auto brauc 10 m/s 5 s. Cik liels ir nobrauktais ceļš?", o: ["2 m", "50 m", "15 m"], a: 1 },
  { q: "Kurš leņķis dod vislielāko tālumu (bez gaisa pretestības)?", o: ["30°", "45°", "60°"], a: 1 },
  { q: "Kāda ir Oma likuma formula?", o: ["I = U · R", "I = R / U", "I = U / R"], a: 2 }
];

let qi = 0, score = 0;
const box = $("quiz-box");

function showQuestion() {
  if (qi >= questions.length) {
    box.innerHTML = `<h3>Rezultāts: ${score} / ${questions.length}</h3>
                     <button class="opt" id="restart">Mēģināt vēlreiz</button>`;
    $("restart").onclick = () => { qi = 0; score = 0; showQuestion(); };
    return;
  }
  const cur = questions[qi];
  box.innerHTML = `<h3>${qi + 1}. ${cur.q}</h3>`;
  cur.o.forEach((text, i) => {
    const b = document.createElement("button");
    b.className = "opt";
    b.textContent = text;
    b.onclick = () => {
      box.querySelectorAll(".opt").forEach(x => (x.disabled = true));
      if (i === cur.a) { b.classList.add("correct"); score++; }
      else {
        b.classList.add("wrong");
        box.querySelectorAll(".opt")[cur.a].classList.add("correct");
      }
      setTimeout(() => { qi++; showQuestion(); }, 1000);
    };
    box.appendChild(b);
  });
}
showQuestion();
