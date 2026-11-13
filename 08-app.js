/* ===== 08 galvenā lietotne: maršrutēšana, sākums, tēmas, sasniegumi, profils ===== */
(function () {
  const { $, $$, esc, fmt, store } = FZ;
  const s = store.get();

  function overall() {
    const lp = FZ.topics.reduce((a, t) => a + FZ.topicProgress(t), 0) / FZ.topics.length;
    return Math.round((lp * 0.7 + (s.bestTest / 100) * 0.3) * 100);
  }
  FZ.refreshSide = function () {
    const lvl = store.level(), p = s.xp % 100;
    const mini = $("#xp-mini"); if (mini) mini.textContent = "Lv " + lvl + " · " + s.xp + " XP";
    const sc = $("#side-card");
    if (sc) sc.innerHTML = "<b>Līmenis " + lvl + '</b> <span class="muted">· ' + s.xp + ' XP</span><div class="bar" style="margin:8px 0"><i style="width:' + p + '%"></i></div><span>🔥 Sērija: <b>' + s.streak + "</b> d.</span>";
  };

  /* ---------- Sākums ---------- */
  FZ.views.dashboard = function (root) {
    const h = new Date().getHours(), hello = h < 5 ? "Labu nakti" : h < 12 ? "Labrīt" : h < 18 ? "Labdien" : "Labvakar";
    const prog = overall(), cont = s.lastTopic ? "#/tema/" + s.lastTopic + "/" + s.lastStep : "#/tema/ko-maca-fizika/0";
    const done = s.completed.length, today = store.dayKey(), task = FZ.tasks.daily();
    const days = []; for (let k = 6; k >= 0; k--) { const d = new Date(); d.setDate(d.getDate() - k); days.push([["Sv", "P", "O", "T", "C", "Pk", "S"][d.getDay()], s.xpLog[store.dayKey(d)] || 0]); }
    const mx = Math.max(20, ...days.map(d => d[1]));
    const chart = '<svg viewBox="0 0 420 170" style="width:100%">' + days.map((d, i) => { const hh = Math.round(d[1] / mx * 110), x = 15 + i * 58; return '<rect x="' + x + '" y="' + (130 - hh) + '" width="38" height="' + hh + '" rx="8" fill="url(#gr)"/><text x="' + (x + 19) + '" y="152" text-anchor="middle" font-size="13" fill="currentColor" opacity=".7">' + d[0] + '</text><text x="' + (x + 19) + '" y="' + (124 - hh) + '" text-anchor="middle" font-size="12" fill="currentColor">' + (d[1] || "") + "</text>"; }).join("") +
      '<defs><linearGradient id="gr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b82ff"/><stop offset="1" stop-color="#8b5cf6"/></linearGradient></defs></svg>';
    root.innerHTML =
      '<div class="hero"><svg class="atom" viewBox="0 0 48 48"><g fill="none" stroke="#8b5cf6" stroke-width="1"><ellipse cx="24" cy="24" rx="20" ry="8"/><ellipse cx="24" cy="24" rx="20" ry="8" transform="rotate(60 24 24)"/><ellipse cx="24" cy="24" rx="20" ry="8" transform="rotate(120 24 24)"/></g><circle cx="24" cy="24" r="2.5" fill="#22d3ee"/></svg>' +
      "<h1>" + hello + ", " + esc(s.name || "skolēn") + "! 👋</h1><p class='muted'>Šodien ir lieliska diena, lai uzzinātu kaut ko jaunu par fiziku.</p>" +
      '<div class="row"><a class="btn primary" href="' + cont + '">▶ Turpināt mācīties</a><a class="btn" href="#/simulacijas">🧪 Simulācijas</a>' +
      (s.name ? "" : '<input type="text" id="nm" placeholder="Kā tevi sauc?" style="max-width:200px">') + "</div></div>" +
      '<div class="grid cols-4 mt"><div class="card row" style="flex-wrap:nowrap"><div class="ring" style="--p:' + prog + '"><b>' + prog + '%</b></div><div class="stat"><span class="l">Kopējais progress</span></div></div>' +
      '<div class="card stat"><span class="n">' + done + " / " + FZ.topics.length + '</span><span class="l">Apgūtās tēmas</span></div>' +
      '<div class="card stat"><span class="n">' + s.solved + '</span><span class="l">Atrisinātie uzdevumi</span></div>' +
      '<div class="card stat"><span class="n">Lv ' + store.level() + '</span><span class="l">' + s.xp + " XP · 🔥 " + s.streak + " d. sērija</span></div></div>" +
      '<div class="grid cols-2 mt"><div class="card"><h2>📈 XP pēdējās 7 dienās</h2>' + chart + '</div><div class="card glow" id="daily"></div></div>' +
      '<div class="grid cols-2 mt"><div class="card"><h2>🕘 Pēdējās apmeklētās</h2>' + (s.visited.length ? s.visited.map(v => '<p style="margin:.3em 0"><a href="#/' + esc(v.route) + '">' + esc(v.title) + "</a></p>").join("") : '<p class="muted">Vēl nekas nav apmeklēts — sāc ar pirmo tēmu!</p>') + "</div>" +
      '<div class="card"><h2>🏆 Sasniegumi</h2><div class="chips">' + FZ.achievements.filter(a => s.ach.includes(a.id)).map(a => '<span class="tag good">' + a.icon + " " + esc(a.title) + "</span>").join("") + (s.ach.length ? "" : '<span class="muted">Vēl nav — atver pirmo nodarbību!</span>') + '</div><p class="mt"><a href="#/sasniegumi">Skatīt visus →</a></p></div></div>';
    const nm = $("#nm", root);
    if (nm) nm.addEventListener("change", () => { s.name = nm.value.trim(); store.save(); FZ.views.dashboard(root); });
    const dc = $("#daily", root);
    function drawDaily() {
      dc.innerHTML = "<h2>🎯 Dienas uzdevums</h2>" + (s.daily[today] ? '<p class="ok">✅ Šodien atrisināts! Atgriezies rīt.</p><p class="muted">' + esc(task.explain) + "</p>" :
        "<p>" + esc(task.q) + '</p><div class="row" style="flex-wrap:nowrap"><input type="text" id="da" inputmode="decimal" placeholder="Atbilde"><button class="btn primary" id="db">Pārbaudīt</button></div><div id="dm" class="mt"></div>');
      const b = $("#db", dc); if (!b) return;
      const go = () => {
        const r = FZ.tasks.check(task, $("#da", dc).value);
        if (r.bad) { $("#dm", dc).innerHTML = '<span class="muted">Ieraksti skaitli.</span>'; return; }
        if (r.ok) { s.daily[today] = true; s.solved++; store.save(); store.addXP(20, "dienas uzdevums"); drawDaily(); }
        else $("#dm", dc).innerHTML = '<span class="no">Nav gluži.</span> <span class="muted">' + esc(FZ.tasks.hint(task, r.x)) + "</span>";
      };
      b.onclick = go; $("#da", dc).addEventListener("keydown", e => { if (e.key === "Enter") go(); });
    }
    drawDaily();
  };

  /* ---------- Tēmas ---------- */
  FZ.views.topics = function (root) {
    store.visit({ route: "temas", title: "Mācību tēmas" });
    root.innerHTML = '<div class="page-head"><h1>📚 Mācību tēmas</h1><p>Katrai tēmai ir teorija, formulas, piemēri, interaktīvi uzdevumi un pašpārbaude.</p></div><div class="grid auto">' +
      FZ.topics.map(t => { const p = Math.round(FZ.topicProgress(t) * 100); return '<a class="card link glow" href="#/tema/' + t.id + '"><div class="icon-lg">' + t.icon + '</div><span class="tag">' + esc(t.grade) + "</span><h2>" + t.no + ". " + esc(t.title) + '</h2><p class="muted">' + esc(t.desc) + '</p><div class="bar"><i style="width:' + p + '%"></i></div><small class="muted">' + p + "% apgūts" + (s.completed.includes(t.id) ? " · ✔ pabeigta" : "") + "</small></a>"; }).join("") + "</div>" +
      '<h2 class="mt2">Drīzumā</h2><div class="chips">' + FZ.comingSoon.map(x => '<span class="chip" style="cursor:default;opacity:.55">🔒 ' + esc(x) + "</span>").join("") + "</div>";
  };

  /* ---------- Sasniegumi ---------- */
  FZ.views.ach = function (root) {
    store.visit({ route: "sasniegumi", title: "Sasniegumi" });
    const lvl = store.level();
    root.innerHTML = '<div class="page-head"><h1>🏆 Sasniegumi</h1><p>Mācies katru dienu, risini uzdevumus un vāc XP.</p></div>' +
      '<div class="grid cols-4"><div class="card stat"><span class="n">Lv ' + lvl + '</span><span class="l">Līmenis</span><div class="bar" style="margin-top:8px"><i style="width:' + (s.xp % 100) + '%"></i></div></div><div class="card stat"><span class="n">' + s.xp + '</span><span class="l">Kopā XP</span></div><div class="card stat"><span class="n">🔥 ' + s.streak + '</span><span class="l">Sērija (rekords ' + s.bestStreak + ')</span></div><div class="card stat"><span class="n">' + s.bestTest + '%</span><span class="l">Personīgais testa rekords</span></div></div>' +
      '<div class="grid auto mt2">' + FZ.achievements.map(a => { const on = s.ach.includes(a.id); return '<div class="card badge ' + (on ? "" : "off") + '"><div class="em">' + a.icon + "</div><b>" + esc(a.title) + "</b><small>" + esc(a.desc) + "</small>" + (on ? '<span class="tag good">Iegūts</span>' : "") + "</div>"; }).join("") + "</div>";
  };

  /* ---------- Profils ---------- */
  FZ.views.profile = function (root) {
    store.visit({ route: "profils", title: "Mans profils" });
    root.innerHTML = '<div class="page-head"><h1>👤 Mans profils</h1></div><div class="grid cols-2"><div class="card"><h2>Iestatījumi</h2>' +
      '<label class="f">Vārds<input type="text" id="pn" value="' + esc(s.name) + '" placeholder="Tavs vārds"></label>' +
      '<label class="f">Mācību līmenis<select id="pl">' + ["8. klase", "9. klase", "10.–12. klase"].map(x => "<option" + (x === s.level ? " selected" : "") + ">" + x + "</option>").join("") + "</select></label>" +
      '<label class="f">Izskats</label><div class="chips" id="th"><button class="chip ' + (s.theme === "dark" ? "on" : "") + '" data-t="dark">🌙 Tumšais</button><button class="chip ' + (s.theme === "light" ? "on" : "") + '" data-t="light">☀️ Gaišais</button></div>' +
      '<label class="f mt">Valoda<select disabled><option>Latviešu</option></select></label><p class="muted">Citas valodas tiks pievienotas vēlāk.</p>' +
      '<button class="btn danger mt" id="rs">Dzēst visu progresu</button></div>' +
      '<div class="card"><h2>Statistika</h2><table><tr><td>Līmenis</td><td><b>' + store.level() + "</b> (" + s.xp + " XP)</td></tr><tr><td>Pabeigtās tēmas</td><td><b>" + s.completed.length + " / " + FZ.topics.length + "</b></td></tr><tr><td>Atrisinātie uzdevumi</td><td><b>" + s.solved + "</b></td></tr><tr><td>Sasniegumi</td><td><b>" + s.ach.length + " / " + FZ.achievements.length + "</b></td></tr><tr><td>Labākais tests</td><td><b>" + s.bestTest + "%</b></td></tr></table></div></div>" +
      '<div class="card mt"><h2>Testu rezultāti</h2>' + (s.history.length ? "<table><tr><th>Datums</th><th>Tests</th><th>Rezultāts</th></tr>" + s.history.slice(0, 10).map(x => "<tr><td>" + esc(x.date) + "</td><td>" + esc(x.name) + "</td><td>" + x.score + " / " + x.total + " (" + x.pct + "%)</td></tr>").join("") + "</table>" : '<p class="muted">Vēl nav rezultātu.</p>') + "</div>";
    $("#pn", root).addEventListener("change", e => { s.name = e.target.value.trim(); store.save(); FZ.toast("Vārds saglabāts"); });
    $("#pl", root).addEventListener("change", e => { s.level = e.target.value; store.save(); });
    $("#th", root).onclick = e => { const b = e.target.closest("[data-t]"); if (!b) return; s.theme = b.dataset.t; document.documentElement.dataset.theme = s.theme; store.save(); $$("#th .chip", root).forEach(x => x.classList.toggle("on", x === b)); };
    $("#rs", root).onclick = () => { if (confirm("Vai tiešām dzēst visu progresu? To nevar atsaukt.")) { store.reset(); location.hash = "#/sakums"; location.reload(); } };
  };

  /* ---------- Maršrutēšana ---------- */
  const routes = { sakums: "dashboard", temas: "topics", tema: "lesson", simulacijas: "sims", kalkulators: "calc", uzdevumi: "tests", skolotajs: "tutor", sasniegumi: "ach", profils: "profile" };
  let cleanup = null;
  function route() {
    if (cleanup) { try { cleanup(); } catch (e) {} cleanup = null; }
    const parts = location.hash.replace(/^#\/?/, "").split("/"), name = parts[0] || "sakums", key = routes[name] || "dashboard";
    $$("#nav a").forEach(a => a.classList.toggle("active", a.dataset.route === name || (name === "tema" && a.dataset.route === "temas")));
    const root = $("#view"); root.innerHTML = "";
    const c = FZ.views[key](root, parts.slice(1)); if (typeof c === "function") cleanup = c;
    FZ.refreshSide(); closeMenu();
    if (key !== "lesson") window.scrollTo(0, 0);
  }
  function closeMenu() { $("#sidebar").classList.remove("open"); $("#scrim").classList.remove("show"); }

  document.documentElement.dataset.theme = s.theme;
  $("#menu-btn").onclick = () => { $("#sidebar").classList.toggle("open"); $("#scrim").classList.toggle("show"); };
  $("#scrim").onclick = closeMenu;
  window.addEventListener("hashchange", route);
  route();
})();
