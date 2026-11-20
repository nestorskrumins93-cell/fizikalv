# ⚛️ FizikaLV

**Interaktīva fizikas mācību lietotne latviešu valodā.** Teorija, simulācijas, formulu kalkulators, testi un "skolotājs", kas palīdz saprast uzdevumus. Viss darbojas pārlūkā, bez servera, bez konta un bez interneta.

Mērķauditorija: 8.–12. klases skolēni (pašlaik pieejama 8. klases pirmā tēma).

---

## Saturs

- [Iespējas](#iespējas)
- [Divas versijas](#divas-versijas)
- [Palaišana](#palaišana)
- [Projekta struktūra](#projekta-struktūra)
- [Kā papildināt saturu](#kā-papildināt-saturu)
- [Tehnoloģijas](#tehnoloģijas)
- [GitHub pamati](#github-pamati)

---

## Iespējas

Pilnā versija sastāv no astoņiem skatiem (adrese pēc `#/`):

| Skats | Adrese | Ko dara |
|---|---|---|
| 🏠 Sākums | `#/sakums` | Sveiciens, kopējais progress, XP grafiks pēdējām 7 dienām, dienas uzdevums, pēdējās apmeklētās lapas |
| 📚 Mācību tēmas | `#/temas` | Tēmu saraksts ar progresu; tēma "Ko māca fizika?" (8. klase, 10 soļi ar interaktīviem uzdevumiem un mini-eksperimentu) |
| 🧪 Simulācijas | `#/simulacijas` | 8 interaktīvas simulācijas ar slīdņiem un rādījumiem reāllaikā |
| 🧮 Formulu kalkulators | `#/kalkulators` | 8 formulas, risinājums pa soļiem, automātisks mērvienību pārrēķins, atsevišķs mērvienību pārveidotājs |
| 📝 Uzdevumi un testi | `#/uzdevumi` | 3 grūtības pakāpes, neobligāts taimeris, rezultātu vēsture, kļūdu pārskats |
| 🤖 Skolotājs | `#/skolotajs` | Čata veida palīgs, kas skaidro tēmas un vada cauri uzdevumiem |
| 🏆 Sasniegumi | `#/sasniegumi` | 13 nozīmītes, līmenis, XP, dienu sērija |
| 👤 Mans profils | `#/profils` | Vārds, klase, tumšais/gaišais izskats, statistika, progresa dzēšana |

### Simulācijas

🍎 Brīvā krišana · 🚗 Vienmērīga kustība · 🧱 Ņūtona likumi · 📐 Slīpā plakne · ⏱️ Svārsts · 🔦 Gaismas laušana (ar pilnīgo iekšējo atstarošanos) · 🌊 Viļņi · 🔌 Elektriskā ķēde (virknē / paralēli)

### Formulu kalkulators

Formulas: ātrums, paātrinājums, Ņūtona 2. likums, darbs, jauda, kinētiskā enerģija, blīvums, Oma likums. Katrai var izvēlēties, kuru lielumu meklēt, un kalkulators parāda: meklējamo lielumu, formulu, pārrēķinu uz SI, skaitļu ievietošanu un rezultātu. Atbalstītas 13 lielumu grupas (garums, laiks, masa, ātrums, spēks, enerģija, jauda, spriegums, strāva, pretestība, blīvums, tilpums u.c.).

### Testi

| Līmenis | Saturs |
|---|---|
| 🌱 Viegla | 8 nejauši jautājumi par pamatiem: parādības, nozares, mērījumi |
| ⚡ Vidēja | Formulu izvēle, iedaļas vērtība, mērvienību pārrēķini |
| 🔥 Grūta | 5 aprēķinu uzdevumi (ātrums, spēks, darbs, jauda, enerģija) |

Skaitļu uzdevumi tiek ģenerēti katru reizi citi. Pēc testa lietotne parāda, kuras tēmas skolēns jau saprot un kuras jāatkārto, ar saiti uz attiecīgo teoriju. Nepareizas atbildes saņem mērķtiecīgu mājienu (piemēram, ja atbilde atšķiras 1000 vai 3,6 reizes, tiek norādīts uz mērvienību kļūdu).

### Skolotājs

Skolotājs darbojas **pilnībā pārlūkā, bez interneta** un nav mākslīgā intelekta modelis. Tas:

- atbild uz jautājumiem par lietotnes tēmām (3 skaidrojuma līmeņi: vienkārši / vidēji / dziļāk);
- atpazīst teksta uzdevumus, piemēram, *"Auto brauc 20 m/s 10 s. Cik liels ir ceļš?"*, vispirms parāda, kā domāt, un risinājumu atklāj tikai pēc pieprasījuma;
- piedāvā treniņuzdevumus ar mājieniem.

### Motivācija

XP un līmeņi (katri 100 XP = jauns līmenis), dienu sērija, dienas uzdevums (+20 XP) un 13 sasniegumi.

### Datu glabāšana

Viss progress tiek saglabāts pārlūka `localStorage` ar atslēgu `fizikalv:v2`. Dati nekur netiek sūtīti. Progresu var dzēst profila lapā.

---

## Divas versijas

Repozitorijā atrodas divas lietotnes versijas.

| | Vienkāršā versija | Pilnā versija |
|---|---|---|
| Faili | `index.html`, `App.js`, `Style.css` | `index (1).html`, `01-store.js` … `08-app.js`, `style (1).css` |
| Mācības | 5 īsas formulu lapas | Tēma ar 10 interaktīviem soļiem |
| Simulācijas | Slīpi mesta ķermeņa kustība | 8 simulācijas |
| Tests | 6 jautājumi | 3 grūtības, ģenerēti uzdevumi, vēsture |
| Papildus | — | Kalkulators, skolotājs, XP, sasniegumi, profils |

---

## Palaišana

Nekas nav jāinstalē: vajag tikai pārlūku.

### Pilnā versija

Moduļi ir jāsaliek vienā `app.js` failā. Repozitorija mapē:

```bash
mkdir dist
cat 0*.js > dist/app.js                       # 01…08 tiek apvienoti pareizā secībā
cp "style (1).css" dist/style.css
cp "index (1).html" dist/index.html
```

Pēc tam atver `dist/index.html` pārlūkā.

> Moduļu secība ir svarīga: `01-store.js` izveido kopīgo objektu `FZ`, un pārējie faili to papildina.

### Vienkāršā versija

`index.html` ielādē `style.css` un `app.js` ar **mazajiem burtiem**, bet repozitorijā faili saucas `Style.css` un `App.js`. Windows un macOS tas nav šķērslis, taču GitHub Pages (Linux) lielie un mazie burti ir atšķirīgi, tāpēc faili jāpārdēvē uz `style.css` un `app.js`. Pēc tam atver `index.html`.

### Publicēšana internetā

Repozitorijā: **Settings → Pages → Branch: main → Save**. Pēc minūtes lietotne būs pieejama adresē `https://nestorskrumins93-cell.github.io/fizikalv/`. Lai Pages darbotos, mapes saknē jābūt gatavam `index.html`, `style.css` un `app.js`.

---

## Projekta struktūra

```
fizikalv/
├── index.html          # vienkāršā versija
├── App.js              # vienkāršās versijas loģika
├── Style.css           # vienkāršās versijas stili
│
├── index (1).html      # pilnās versijas lapa
├── style (1).css       # pilnās versijas stili (tumšā/gaišā tēma)
├── 01-store.js         # glabātuve (localStorage), XP, sērijas, palīgfunkcijas
├── 02-calc.js          # formulu kalkulators, mērvienības, teksta uzdevumu atpazīšana
├── 03-data.js          # jautājumu banka un sasniegumu saraksts
├── 04-tests.js         # uzdevumu ģeneratori, testu komponente, testu skats
├── 05-sims.js          # 8 simulācijas (canvas)
├── 06-lesson.js        # mācību tēma un soļu attēlošana
├── 07-tutor.js         # skolotājs (zināšanu bāze + uzdevumu risināšana)
└── 08-app.js           # maršrutēšana, sākums, tēmas, sasniegumi, profils
```

Visi moduļi pieslēdzas globālajam objektam `window.FZ`, un skati tiek reģistrēti kā `FZ.views.<nosaukums>`. Maršrutēšana notiek pēc `location.hash`.

---

## Kā papildināt saturu

**Jauns jautājums.** Failā `03-data.js` pievieno rindu masīvā `FZ.bank`. Pareizā atbilde vienmēr ir **pirmā**, jo atbildes tiek sajauktas attēlošanas brīdī:

```js
mc("Kādā mērvienībā mēra spēku?", ["Ņūtons (N)", "Džouls (J)", "Vats (W)", "Metrs (m)"], "Spēku mēra ņūtonos.", "Lielumi"),
```

**Jauna formula.** Failā `02-calc.js` pievieno objektu masīvam `formulas` (lielumi, formulas visiem trim variantiem, atslēgvārdi teksta uzdevumu atpazīšanai). Ja vajag jaunu mērvienību, papildini objektu `Q`.

**Jauna simulācija.** Failā `05-sims.js` pievieno objektu masīvam `sims` ar laukiem `id`, `icon`, `title`, `desc`, `theory`, `params`, `reset`, `step`, `draw` un `read`.

**Jauna tēma.** Failā `06-lesson.js` izveido jaunus soļus (`{ title, render }`), pievieno tēmu masīvam `FZ.topics` un izņem tās nosaukumu no saraksta `FZ.comingSoon`.

**Jauns sasniegums.** Failā `03-data.js` pievieno objektu masīvam `FZ.achievements` ar `id`, `icon`, `title`, `desc` un nosacījuma funkciju `test(s)`.

---

## Tehnoloģijas

- Tīrs HTML, CSS un JavaScript, bez ietvariem un bez atkarībām
- `<canvas>` simulācijām, SVG grafikiem un ikonām
- `localStorage` progresa glabāšanai
- Adaptīvs dizains (sānjosla pārvēršas izvēlnē mobilajās ierīcēs)

---

## GitHub pamati

<details>
<summary>Īss atgādinājums darbam ar Git un GitHub</summary>

### 1. Sagatavošanās

1. Izveido kontu: https://github.com
2. Instalē Git: https://git-scm.com
3. Vienreiz iestati savu vārdu un e-pastu:

   ```bash
   git config --global user.name "Tavs Vārds"
   git config --global user.email "tavs@epasts.lv"
   ```

### 2. Ikdienas darbs

```bash
git status                    # kas ir mainījies
git add .                     # sagatavo izmaiņas
git commit -m "Pievienots tests"
git push                      # nosūta uz GitHub
git pull                      # lejupielādē jaunākās izmaiņas
```

### 3. Zari (branches)

```bash
git switch -c jauna-funkcija  # izveido un pārslēdzas uz jaunu zaru
git push -u origin jauna-funkcija
```

Pēc tam GitHub lapā atver **Pull request**, lai izmaiņas apvienotu ar `main`.

### 4. Projekta lejupielāde

```bash
git clone https://github.com/nestorskrumins93-cell/fizikalv.git
```

### Terminu vārdnīca

| Termins | Nozīme |
|---|---|
| Repository | Projekta mape ar visu vēsturi |
| Commit | Saglabāts izmaiņu punkts |
| Branch | Atsevišķa izstrādes līnija |
| Push / Pull | Nosūtīt / saņemt izmaiņas |
| Pull request | Pieprasījums apvienot izmaiņas |
| Fork | Cita projekta kopija tavā kontā |

</details>
