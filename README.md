# fizikalv
Fizikas macišānas līdzeklis lai macītos fiziku lietojot aplikāciju
# FizikaLV – fizikas mācību lietotne

Vienkārša tīmekļa lietotne fizikas mācīšanās: īsas mācības, slīpi mesta ķermeņa simulācija un tests.

## Palaišana
Atver `index.html` pārlūkā. Nekas nav jāinstalē.

---

# GitHub pamati

## 1. Sagatavošanās
1. Izveido kontu: https://github.com
2. Instalē Git: https://git-scm.com
3. Vienreiz iestati savu vārdu un e-pastu:
   ```bash
   git config --global user.name "Tavs Vārds"
   git config --global user.email "tavs@epasts.lv"
   ```

## 2. Pirmais projekts augšupielādēšana
1. GitHub lapā nospied **New repository**, nosauc to (piem. `fizikalv`), nospied **Create**.
2. Termināli projekta mapē:
   ```bash
   git init                      # izveido lokālu repozitoriju
   git add .                     # pievieno visus failus
   git commit -m "Pirmā versija" # saglabā izmaiņas
   git branch -M main
   git remote add origin https://github.com/TAVS-LIETOTAJVARDS/fizikalv.git
   git push -u origin main       # nosūta uz GitHub
   ```

## 3. Ikdienas darbs
```bash
git status                    # kas ir mainījies
git add .                     # sagatavo izmaiņas
git commit -m "Pievienots tests"
git push                      # nosūta uz GitHub
git pull                      # lejupielādē jaunākās izmaiņas
```

## 4. Zari (branches)
```bash
git switch -c jauna-funkcija  # izveido un pārslēdzas uz jaunu zaru
git push -u origin jauna-funkcija
```
Pēc tam GitHub lapā atver **Pull request**, lai izmaiņas apvienotu ar `main`.

## 5. Citu projekta lejupielāde
```bash
git clone https://github.com/lietotajs/projekts.git
```

## 6. Publicēšana internetā (GitHub Pages)
Repozitorijā: **Settings → Pages → Branch: main → Save**.
Pēc minūtes lietotne būs pieejama: `https://TAVS-LIETOTAJVARDS.github.io/fizikalv/`

## Terminu vārdnīca
| Termins | Nozīme |
|---|---|
| Repository | Projekta mape ar visu vēsturi |
| Commit | Saglabāts izmaiņu punkts |
| Branch | Atsevišķa izstrādes līnija |
| Push / Pull | Nosūtīt / saņemt izmaiņas |
| Pull request | Pieprasījums apvienot izmaiņas |
| Fork | Cita projekta kopija tavā kontā |
