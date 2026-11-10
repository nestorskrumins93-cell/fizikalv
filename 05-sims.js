/* ===== 05 interaktīvās simulācijas ===== */
(function () {
  const { esc, fmt, store } = FZ;
  const PI = Math.PI;

  function pal() {
    const cs = getComputedStyle(document.documentElement), g = n => cs.getPropertyValue(n).trim();
    return { text: g("--text"), muted: g("--muted"), accent: g("--accent"), accent2: g("--accent2"), el: g("--electric"), good: g("--good"), bad: g("--bad"), warn: g("--warn"), border: g("--border-strong") };
  }
  function line(ctx, x1, y1, x2, y2, col, w) { ctx.strokeStyle = col; ctx.lineWidth = w || 1; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
  function dot(ctx, x, y, r, col) { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r, 0, PI * 2); ctx.fill(); }
  function text(ctx, t, x, y, col, size, align) { ctx.fillStyle = col; ctx.font = (size || 12) + "px system-ui, sans-serif"; ctx.textAlign = align || "left"; ctx.fillText(t, x, y); }
  function arrow(ctx, x1, y1, x2, y2, col, w) {
    const a = Math.atan2(y2 - y1, x2 - x1); line(ctx, x1, y1, x2, y2, col, w || 3);
    ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - 10 * Math.cos(a - 0.4), y2 - 10 * Math.sin(a - 0.4)); ctx.lineTo(x2 - 10 * Math.cos(a + 0.4), y2 - 10 * Math.sin(a + 0.4)); ctx.closePath(); ctx.fill();
  }
  function pathOf(pts) {
    const cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const total = cum[cum.length - 1];
    return { total, at(s) { s = ((s % total) + total) % total; let i = 1; while (i < cum.length - 1 && cum[i] < s) i++; const k = (s - cum[i - 1]) / (cum[i] - cum[i - 1] || 1); return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k]; } };
  }

  const sims = [
    /* ---------- Brīvā krišana ---------- */
    { id: "freefall", icon: "🍎", title: "Brīvā krišana", desc: "Maini augstumu un gravitācijas paātrinājumu — vēro, kā mainās krišanas laiks.",
      theory: "h = g·t²/2 · v = g·t",
      params: [{ id: "h", label: "Augstums", unit: "m", min: 5, max: 100, step: 1, value: 45 }, { id: "g", label: "Brīvās krišanas paātrinājums g", unit: "m/s²", min: 1, max: 25, step: 0.01, value: 9.81 }],
      reset: () => ({ t: 0, hold: 0 }),
      step(st, p, dt) { const T = Math.sqrt(2 * p.h / p.g); if (st.hold > 0) { st.hold -= dt; if (st.hold <= 0) st.t = 0; return; } st.t += dt; if (st.t >= T) { st.t = T; st.hold = 1.4; } },
      draw(ctx, W, H, p, st, c) {
        const gy = H - 30, top = 40, sc = (gy - 10 - top) / p.h, x = W * 0.35;
        line(ctx, 0, gy, W, gy, c.border, 2);
        const stepM = p.h <= 20 ? 5 : p.h <= 60 ? 10 : 20;
        for (let m = 0; m <= p.h; m += stepM) { const y = gy - 10 - m * sc; line(ctx, W - 70, y, W - 52, y, c.muted, 1); text(ctx, m + " m", W - 46, y + 4, c.muted); }
        for (let k = 0; k * 0.2 <= st.t; k++) { const tk = k * 0.2, yh = p.h - 0.5 * p.g * tk * tk; ctx.globalAlpha = 0.35; dot(ctx, x, gy - 10 - yh * sc, 3, c.muted); ctx.globalAlpha = 1; }
        const yh = Math.max(0, p.h - 0.5 * p.g * st.t * st.t), y = gy - 10 - yh * sc;
        dot(ctx, x, y, 10, c.accent);
        const v = p.g * st.t; if (v > 0.3) arrow(ctx, x + 24, y, x + 24, y + Math.min(90, v * 3), c.warn);
      },
      read: (p, st) => { const T = Math.sqrt(2 * p.h / p.g); return [["Krišanas laiks", fmt(T) + " s"], ["Ātrums zemē", fmt(p.g * T) + " m/s"], ["Augstums tagad", fmt(Math.max(0, p.h - 0.5 * p.g * st.t * st.t)) + " m"], ["Ātrums tagad", fmt(p.g * st.t) + " m/s"]]; } },

    /* ---------- Vienmērīga kustība ---------- */
    { id: "motion", icon: "🚗", title: "Vienmērīga kustība", desc: "Maini ātrumu un vēro, kā ceļš aug līdzmērīgi ar laiku.",
      theory: "s = v·t",
      params: [{ id: "v", label: "Ātrums", unit: "m/s", min: 1, max: 30, step: 1, value: 10 }],
      reset: () => ({ t: 0, hold: 0 }),
      step(st, p, dt) { if (st.hold > 0) { st.hold -= dt; if (st.hold <= 0) st.t = 0; return; } st.t += dt; if (st.t >= 10) { st.t = 10; st.hold = 1; } },
      draw(ctx, W, H, p, st, c) {
        const gw = Math.min(W - 120, 360), gx = 60, gy0 = 150, gh = 120, k = st.t / 10;
        line(ctx, gx, gy0, gx + gw, gy0, c.muted, 1); line(ctx, gx, gy0, gx, gy0 - gh, c.muted, 1);
        line(ctx, gx, gy0, gx + gw, gy0 - gh, c.accent2, 2);
        dot(ctx, gx + gw * k, gy0 - gh * k, 6, c.warn);
        text(ctx, "t (s)", gx + gw - 26, gy0 + 16, c.muted); text(ctx, "s (m)", gx - 40, gy0 - gh + 4, c.muted); text(ctx, "s–t grafiks", gx + gw + 10, gy0 - gh / 2, c.muted);
        const ry = H - 70, x0 = 60, rw = W - 120;
        line(ctx, x0, ry + 20, x0 + rw, ry + 20, c.border, 3);
        for (let i = 0; i <= 10; i += 2) { const xx = x0 + rw * i / 10; line(ctx, xx, ry + 20, xx, ry + 28, c.muted, 1); text(ctx, fmt(i * p.v) + " m", xx, ry + 44, c.muted, 11, "center"); }
        const cx = x0 + rw * k;
        ctx.fillStyle = c.accent; ctx.fillRect(cx - 22, ry - 2, 44, 18); ctx.fillRect(cx - 12, ry - 14, 24, 14);
        dot(ctx, cx - 12, ry + 18, 5, c.text); dot(ctx, cx + 12, ry + 18, 5, c.text);
      },
      read: (p, st) => [["Laiks", fmt(st.t) + " s"], ["Ātrums", fmt(p.v) + " m/s"], ["Nobrauktais ceļš", fmt(p.v * st.t) + " m"]] },

    /* ---------- Ņūtona likumi ---------- */
    { id: "newton", icon: "🧱", title: "Ņūtona likumi", desc: "Maini masu un spēkus — redzi, kā rodas paātrinājums (F = m·a).",
      theory: "a = (F − Fberzes) / m",
      params: [{ id: "F", label: "Vilcēja spēks F", unit: "N", min: 0, max: 60, step: 1, value: 20 }, { id: "Fb", label: "Berzes spēks", unit: "N", min: 0, max: 40, step: 1, value: 6 }, { id: "m", label: "Masa m", unit: "kg", min: 1, max: 20, step: 1, value: 4 }],
      reset: () => ({ t: 0 }),
      step(st, p, dt) { st.t += dt; const a = Math.max(0, p.F - p.Fb) / p.m; if (st.t > 8 || 0.5 * a * st.t * st.t > 30) st.t = 0; },
      draw(ctx, W, H, p, st, c) {
        const a = Math.max(0, p.F - p.Fb) / p.m, x = 0.5 * a * st.t * st.t, gy = H - 80, bw = 40 + p.m * 3, bh = 40 + p.m * 1.5;
        line(ctx, 20, gy, W - 20, gy, c.border, 3);
        const bx = 40 + Math.min(x, 30) / 30 * (W - 200 - bw);
        ctx.fillStyle = c.accent2; ctx.fillRect(bx, gy - bh, bw, bh);
        text(ctx, p.m + " kg", bx + bw / 2, gy - bh / 2 + 4, "#fff", 14, "center");
        arrow(ctx, bx + bw, gy - bh / 2, bx + bw + 8 + p.F * 2.2, gy - bh / 2, c.good); text(ctx, "F = " + p.F + " N", bx + bw + 10, gy - bh / 2 - 12, c.good, 13);
        if (p.Fb > 0) { arrow(ctx, bx, gy - 10, bx - 8 - p.Fb * 2.2, gy - 10, c.bad); text(ctx, "Fb = " + p.Fb + " N", bx - 10, gy + 20, c.bad, 13, "right"); }
        if (a === 0) text(ctx, "Vilcēja spēks nepārsniedz berzi — ķermenis paliek miera stāvoklī", W / 2, 40, c.warn, 14, "center");
      },
      read: (p, st) => { const a = Math.max(0, p.F - p.Fb) / p.m; return [["Rezultējošais spēks", fmt(Math.max(0, p.F - p.Fb)) + " N"], ["Paātrinājums a", fmt(a) + " m/s²"], ["Ātrums tagad", fmt(a * st.t) + " m/s"], ["Ceļš", fmt(0.5 * a * st.t * st.t) + " m"]]; } },

    /* ---------- Slīpā plakne ---------- */
    { id: "incline", icon: "📐", title: "Slīpā plakne", desc: "Maini slīpuma leņķi un berzi — vai kluči slīdēs?",
      theory: "a = g·(sin α − μ·cos α)",
      params: [{ id: "ang", label: "Leņķis α", unit: "°", min: 0, max: 60, step: 1, value: 30 }, { id: "mu", label: "Berzes koeficients μ", unit: "", min: 0, max: 1, step: 0.01, value: 0.2 }],
      reset: () => ({ s: 0, v: 0, hold: 0 }),
      acc: p => { const th = p.ang * PI / 180; return Math.max(0, 9.81 * (Math.sin(th) - p.mu * Math.cos(th))); },
      step(st, p, dt) {
        if (st.hold > 0) { st.hold -= dt; if (st.hold <= 0) { st.s = 0; st.v = 0; } return; }
        const a = this.acc(p); st.v += a * dt; st.s += st.v * dt; if (st.s >= 5) { st.s = 5; st.hold = 1; }
      },
      draw(ctx, W, H, p, st, c) {
        const th = Math.max(0.02, p.ang * PI / 180), Lpx = Math.min((W - 120) / Math.cos(th), (H - 90) / Math.sin(th));
        const Bx = W - 50, By = H - 40, Ax = Bx - Lpx * Math.cos(th), Ay = By - Lpx * Math.sin(th);
        ctx.fillStyle = "rgba(139,92,246,.18)"; ctx.beginPath(); ctx.moveTo(Ax, Ay); ctx.lineTo(Bx, By); ctx.lineTo(Ax, By); ctx.closePath(); ctx.fill();
        line(ctx, Ax, Ay, Bx, By, c.accent2, 3); line(ctx, Ax, By, Bx, By, c.border, 2);
        text(ctx, "α = " + p.ang + "°", Bx - 90, By - 8, c.text, 13);
        const d = 34 + st.s * (Lpx - 70) / 5, px = Ax + d * Math.cos(th), py = Ay + d * Math.sin(th);
        ctx.save(); ctx.translate(px, py); ctx.rotate(th); ctx.fillStyle = c.accent; ctx.fillRect(-20, -26, 40, 26); ctx.restore();
        if (this.acc(p) === 0) text(ctx, "Berze notur kluci — tas nekustas", W / 2, 30, c.warn, 14, "center");
      },
      read(p, st) { const a = this.acc(p); return [["Paātrinājums", fmt(a) + " m/s²"], ["Stāvoklis", a > 0 ? "slīd" : "stāv"], ["Ātrums", fmt(st.v) + " m/s"], ["Nogrieztais ceļš", fmt(st.s) + " m"]]; } },

    /* ---------- Svārsts ---------- */
    { id: "pendulum", icon: "⏱️", title: "Svārsts", desc: "Maini auklas garumu un gravitāciju — kā mainās svārstību periods?",
      theory: "T = 2π·√(L / g)",
      params: [{ id: "L", label: "Auklas garums L", unit: "m", min: 0.3, max: 3, step: 0.05, value: 1.5 }, { id: "g", label: "Gravitācija g", unit: "m/s²", min: 1, max: 25, step: 0.01, value: 9.81 }, { id: "a0", label: "Sākuma leņķis", unit: "°", min: 5, max: 80, step: 1, value: 30 }],
      reset: p => ({ th: p.a0 * PI / 180, w: 0 }),
      step(st, p, dt) { const n = 8, h = dt / n; for (let i = 0; i < n; i++) { st.w += -p.g / p.L * Math.sin(st.th) * h; st.th += st.w * h; } },
      draw(ctx, W, H, p, st, c) {
        const px = W / 2, py = 30, len = p.L * (H - 90) / 3;
        line(ctx, px - 60, py, px + 60, py, c.muted, 3);
        const bx = px + len * Math.sin(st.th), by = py + len * Math.cos(st.th);
        ctx.globalAlpha = .25; line(ctx, px, py, px, py + len, c.muted, 1); ctx.globalAlpha = 1;
        line(ctx, px, py, bx, by, c.text, 2); dot(ctx, bx, by, 16, c.accent2);
      },
      read: p => { const T = 2 * PI * Math.sqrt(p.L / p.g); return [["Periods T", fmt(T) + " s"], ["Frekvence f", fmt(1 / T) + " Hz"], ["Piezīme", "T aprēķināts mazu leņķu tuvinājumā"]]; } },

    /* ---------- Gaismas laušana ---------- */
    { id: "refraction", icon: "🔦", title: "Gaismas laušana", desc: "Maini vides un krišanas leņķi — atrodi pilnīgo iekšējo atstarošanos.",
      theory: "n₁·sin α = n₂·sin β",
      params: [{ id: "n1", label: "Laušanas koeficients n₁ (augšā)", unit: "", min: 1, max: 2.5, step: 0.01, value: 1 }, { id: "n2", label: "Laušanas koeficients n₂ (lejā)", unit: "", min: 1, max: 2.5, step: 0.01, value: 1.5 }, { id: "al", label: "Krišanas leņķis α", unit: "°", min: 0, max: 89, step: 1, value: 40 }],
      reset: () => ({}), step() {},
      calc(p) { const a = p.al * PI / 180, sb = p.n1 * Math.sin(a) / p.n2; return { a, sb, tir: sb > 1, b: sb > 1 ? null : Math.asin(sb) }; },
      draw(ctx, W, H, p, st, c) {
        const cx = W / 2, cy = H / 2, R = Math.min(W, H) / 2 - 24, r = this.calc(p);
        ctx.fillStyle = "rgba(59,130,255," + (0.05 + 0.06 * (p.n1 - 1)) + ")"; ctx.fillRect(0, 0, W, cy);
        ctx.fillStyle = "rgba(139,92,246," + (0.05 + 0.06 * (p.n2 - 1)) + ")"; ctx.fillRect(0, cy, W, H - cy);
        line(ctx, 0, cy, W, cy, c.border, 2); ctx.setLineDash([6, 6]); line(ctx, cx, cy - R, cx, cy + R, c.muted, 1); ctx.setLineDash([]);
        text(ctx, "n₁ = " + fmt(p.n1), 14, 24, c.text, 14); text(ctx, "n₂ = " + fmt(p.n2), 14, H - 14, c.text, 14);
        arrow(ctx, cx - R * Math.sin(r.a), cy - R * Math.cos(r.a), cx - 4 * Math.sin(r.a), cy - 4 * Math.cos(r.a), c.warn, 3);
        if (r.tir) arrow(ctx, cx, cy, cx + R * Math.sin(r.a), cy - R * Math.cos(r.a), c.bad, 3);
        else arrow(ctx, cx, cy, cx + R * Math.sin(r.b), cy + R * Math.cos(r.b), c.good, 3);
        text(ctx, "α", cx - 40, cy - 30, c.warn, 14); if (!r.tir) text(ctx, "β", cx + 22, cy + 42, c.good, 14);
        if (r.tir) text(ctx, "Pilnīgā iekšējā atstarošanās!", cx, cy + 40, c.bad, 15, "center");
      },
      read(p) { const r = this.calc(p), crit = p.n1 > p.n2 ? Math.asin(p.n2 / p.n1) * 180 / PI : null; return [["Laušanas leņķis β", r.tir ? "nav (atstarošanās)" : fmt(r.b * 180 / PI) + "°"], ["Kritiskais leņķis", crit ? fmt(crit) + "°" : "nav (n₁ ≤ n₂)"], ["n₁·sin α", fmt(p.n1 * Math.sin(r.a))], ["n₂·sin β", r.tir ? "—" : fmt(p.n2 * r.sb)]]; } },

    /* ---------- Viļņi ---------- */
    { id: "waves", icon: "🌊", title: "Viļņi", desc: "Maini frekvenci, amplitūdu un ātrumu — redzi viļņa garumu un periodu.",
      theory: "λ = v / f · T = 1 / f",
      params: [{ id: "f", label: "Frekvence f", unit: "Hz", min: 0.2, max: 3, step: 0.1, value: 1 }, { id: "A", label: "Amplitūda A", unit: "cm", min: 1, max: 10, step: 0.5, value: 5 }, { id: "v", label: "Viļņa ātrums v", unit: "m/s", min: 1, max: 10, step: 0.5, value: 4 }],
      reset: () => ({ t: 0 }), step(st, p, dt) { st.t += dt; },
      draw(ctx, W, H, p, st, c) {
        const lam = p.v / p.f, ox = 20, sc = (W - 40) / 10, my = H / 2, ap = p.A * 6;
        line(ctx, ox, my, W - 20, my, c.border, 1);
        ctx.strokeStyle = c.el; ctx.lineWidth = 3; ctx.beginPath();
        for (let x = 0; x <= W - 40; x += 2) { const y = my - ap * Math.sin(2 * PI * (x / sc / lam - p.f * st.t)); x ? ctx.lineTo(ox + x, y) : ctx.moveTo(ox + x, y); }
        ctx.stroke();
        dot(ctx, ox, my - ap * Math.sin(2 * PI * (-p.f * st.t)), 6, c.warn);
        const x0 = lam * (((0.25 + p.f * st.t) % 1 + 1) % 1);
        if (x0 + lam <= 10) { const xa = ox + x0 * sc, xb = ox + (x0 + lam) * sc, yy = my - ap - 22; line(ctx, xa, yy, xb, yy, c.warn, 2); text(ctx, "λ = " + fmt(lam) + " m", (xa + xb) / 2, yy - 6, c.warn, 13, "center"); }
        text(ctx, "A = " + p.A + " cm", ox + 4, my - ap - 8, c.muted, 12);
      },
      read: p => [["Periods T", fmt(1 / p.f) + " s"], ["Viļņa garums λ", fmt(p.v / p.f) + " m"], ["Frekvence f", fmt(p.f) + " Hz"], ["Ātrums v", fmt(p.v) + " m/s"]] },

    /* ---------- Elektriskā ķēde ---------- */
    { id: "circuit", icon: "🔌", title: "Elektriskā ķēde", desc: "Saslēdz rezistorus virknē vai paralēli un vēro strāvu (Oma likums).",
      theory: "I = U / R",
      params: [{ id: "U", label: "Baterijas spriegums U", unit: "V", min: 1, max: 24, step: 1, value: 12 }, { id: "R1", label: "Rezistors R₁", unit: "Ω", min: 1, max: 100, step: 1, value: 10 }, { id: "R2", label: "Rezistors R₂", unit: "Ω", min: 1, max: 100, step: 1, value: 20 },
        { id: "mode", type: "select", label: "Slēgums", options: [["series", "Virknē"], ["parallel", "Paralēli"]], value: "series" }],
      reset: () => ({ o1: 0, o2: 0 }),
      calc(p) {
        if (p.mode === "series") { const R = p.R1 + p.R2, I = p.U / R; return { R, I, I1: I, I2: I, U1: I * p.R1, U2: I * p.R2 }; }
        const R = p.R1 * p.R2 / (p.R1 + p.R2), I1 = p.U / p.R1, I2 = p.U / p.R2; return { R, I: I1 + I2, I1, I2, U1: p.U, U2: p.U };
      },
      step(st, p, dt) { const r = this.calc(p); st.o1 += Math.min(300, 25 + 35 * r.I1) * dt; st.o2 += Math.min(300, 25 + 35 * r.I2) * dt; },
      draw(ctx, W, H, p, st, c) {
        const r = this.calc(p), xl = 70, yt = 70, yb = H - 70;
        const wire = (a, b) => line(ctx, a[0], a[1], b[0], b[1], c.muted, 3);
        const res = (x, y, w, h, lab) => { ctx.fillStyle = "rgba(255,255,255,.06)"; ctx.fillRect(x - w / 2, y - h / 2, w, h); ctx.strokeStyle = c.accent2; ctx.lineWidth = 3; ctx.strokeRect(x - w / 2, y - h / 2, w, h); text(ctx, lab, x, y + 5, c.text, 13, "center"); };
        const battery = () => { const my = H / 2; ctx.fillStyle = "rgba(0,0,0,.0)"; ctx.clearRect(xl - 30, my - 18, 60, 36); line(ctx, xl - 18, my - 8, xl + 18, my - 8, c.good, 4); line(ctx, xl - 9, my + 8, xl + 9, my + 8, c.bad, 4); text(ctx, "+", xl + 26, my - 4, c.good, 14); text(ctx, p.U + " V", xl + 26, my + 18, c.text, 13); };
        const dots = (path, off) => { for (let s = 0; s < path.total; s += 28) { const q = path.at(s + off); dot(ctx, q[0], q[1], 3.5, c.warn); } };
        if (p.mode === "series") {
          const xr = W - 70;
          [[[xl, yb], [xl, yt]], [[xl, yt], [xr, yt]], [[xr, yt], [xr, yb]], [[xr, yb], [xl, yb]]].forEach(w => wire(w[0], w[1]));
          res(xl + (xr - xl) * 0.35, yt, 80, 34, "R₁ " + p.R1 + " Ω"); res(xl + (xr - xl) * 0.7, yt, 80, 34, "R₂ " + p.R2 + " Ω"); battery();
          dots(pathOf([[xl, yb], [xl, yt], [xr, yt], [xr, yb], [xl, yb]]), st.o1);
        } else {
          const x1 = W * 0.5, x2 = W - 70;
          [[[xl, yb], [xl, yt]], [[xl, yt], [x2, yt]], [[xl, yb], [x2, yb]], [[x1, yt], [x1, yb]], [[x2, yt], [x2, yb]]].forEach(w => wire(w[0], w[1]));
          res(x1, H / 2, 40, 80, "R₁ " + p.R1 + " Ω"); res(x2, H / 2, 40, 80, "R₂ " + p.R2 + " Ω"); battery();
          dots(pathOf([[xl, yb], [xl, yt], [x1, yt], [x1, yb], [xl, yb]]), st.o1); dots(pathOf([[xl, yb], [xl, yt], [x2, yt], [x2, yb], [xl, yb]]), st.o2);
        }
      },
      read(p) { const r = this.calc(p); return [["Kopējā pretestība", fmt(r.R) + " Ω"], ["Kopējā strāva I", fmt(r.I) + " A"], ["I₁ / U₁", fmt(r.I1) + " A / " + fmt(r.U1) + " V"], ["I₂ / U₂", fmt(r.I2) + " A / " + fmt(r.U2) + " V"], ["Jauda P = U·I", fmt(p.U * r.I) + " W"]]; } }
  ];
  FZ.sims = sims;

  function mount(sim, box) {
    const p = {}; sim.params.forEach(q => p[q.id] = q.value);
    box.innerHTML = '<div class="sim-wrap"><div class="card" id="ctl"></div><div><canvas class="sim"></canvas><div class="readout" id="ro"></div><div class="row mt"><button class="btn" id="pp">⏸ Pauze</button><button class="btn" id="rs">↺ No sākuma</button></div></div></div>';
    const ctl = FZ.$("#ctl", box), cv = FZ.$("canvas", box), ctx = cv.getContext("2d"), ro = FZ.$("#ro", box);
    ctl.innerHTML = '<p class="muted" style="margin-top:0">Formula: <span class="formula">' + esc(sim.theory) + "</span></p>" + sim.params.map(q => q.type === "select"
      ? '<label class="f">' + esc(q.label) + '<select data-p="' + q.id + '">' + q.options.map(o => '<option value="' + o[0] + '"' + (o[0] === q.value ? " selected" : "") + ">" + esc(o[1]) + "</option>").join("") + "</select></label>"
      : '<label class="f">' + esc(q.label) + ': <b id="v-' + q.id + '">' + q.value + "</b> " + esc(q.unit) + '<input type="range" data-p="' + q.id + '" min="' + q.min + '" max="' + q.max + '" step="' + q.step + '" value="' + q.value + '"></label>').join("");
    let st = sim.reset(p), running = true, last = performance.now(), raf, W = 600; const H = 360;
    function fit() { const w = cv.parentElement.clientWidth || 600, d = window.devicePixelRatio || 1; cv.width = w * d; cv.height = H * d; cv.style.height = H + "px"; ctx.setTransform(d, 0, 0, d, 0, 0); W = w; }
    fit(); window.addEventListener("resize", fit);
    ctl.addEventListener("input", e => {
      const k = e.target.dataset.p; if (!k) return;
      const q = sim.params.find(x => x.id === k); p[k] = q.type === "select" ? e.target.value : parseFloat(e.target.value);
      const lab = FZ.$("#v-" + k, ctl); if (lab) lab.textContent = p[k];
      st = sim.reset(p);
    });
    FZ.$("#pp", box).onclick = e => { running = !running; e.target.textContent = running ? "⏸ Pauze" : "▶ Atsākt"; };
    FZ.$("#rs", box).onclick = () => { st = sim.reset(p); };
    function frame(now) {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (running) sim.step(st, p, dt);
      ctx.clearRect(0, 0, W, H); sim.draw(ctx, W, H, p, st, pal());
      ro.innerHTML = sim.read(p, st).map(r => "<div><small>" + esc(r[0]) + "</small><b>" + esc(r[1]) + "</b></div>").join("");
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", fit); };
  }

  FZ.views.sims = function (root, rest) {
    const id = rest && rest[0], sim = sims.find(s => s.id === id);
    if (!sim) {
      store.visit({ route: "simulacijas", title: "Simulācijas" });
      root.innerHTML = '<div class="page-head"><h1>🧪 Simulācijas</h1><p>Eksperimentē ar fizikas likumiem: maini parametrus un redzi rezultātu uzreiz.</p></div><div class="grid auto">' +
        sims.map(s => '<a class="card link sim-card" href="#/simulacijas/' + s.id + '"><div class="icon-lg">' + s.icon + "</div><h3>" + esc(s.title) + '</h3><p class="muted">' + esc(s.desc) + "</p>" + (store.get().flags["sim:" + s.id] ? '<span class="tag good">Izmēģināts</span>' : "") + "</a>").join("") + "</div>";
      return;
    }
    store.visit({ route: "simulacijas/" + id, title: "Simulācija: " + sim.title });
    store.flag("sim:" + id, 5, "simulācija");
    root.innerHTML = '<div class="crumbs"><a href="#/simulacijas">← Visas simulācijas</a></div><div class="page-head"><h1>' + sim.icon + " " + esc(sim.title) + "</h1><p>" + esc(sim.desc) + '</p></div><div id="simbox"></div>';
    return mount(sim, FZ.$("#simbox", root));
  };
})();
