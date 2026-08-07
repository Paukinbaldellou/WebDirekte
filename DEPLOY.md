# Direkte — desplegar i actualitzar a Vercel

Web estàtica (HTML + CSS + JS). **No cal cap pas de build.** Només cal servir aquesta carpeta tal qual: `index.html` ja és la pàgina d'inici.

## Estructura

```
index.html        → Inici (català)
about.html        → About
vals.html         → Regala Direkte
reserva.html      → Reserva
enllacos.html     → Enllaços (pàgina tipus linktree)
privacitat.html · avis-legal.html · cookies.html
es/ · en/ · fr/    → mateixes pàgines en castellà, anglès i francès
styles.css
script.js
robots.txt · sitemap.xml
assets/           → logos, imatges, premis
```

---

## Com ACTUALITZAR la web (ja la tens publicada)

Si la vas publicar **des de GitHub** (Opció B), el flux és sempre el mateix:

1. Descomprimeix aquest zip.
2. Ves al teu repositori de GitHub al navegador.
3. Puja els fitxers nous a sobre dels antics: botó **Add file → Upload files**, arrossega el contingut de la carpeta (no la carpeta, el que hi ha a dins), i confirma amb **Commit changes**.
   - GitHub substitueix els fitxers amb el mateix nom i afegeix els nous.
4. Vercel detecta el canvi i torna a publicar automàticament en ~30 segons. Ho pots veure a **vercel.com → el projecte → Deployments**.

Si la vas publicar **amb la CLI** (Opció A, arrossegar/`vercel`), per actualitzar: entra a la carpeta des del Terminal i escriu `vercel --prod`.

> Truc: si no recordes com la vas publicar, entra al projecte a Vercel → **Settings → Git**. Si hi surt un repositori connectat, és l'Opció B.

---

## Primera publicació (per si algun dia has de començar de zero)

### Opció A — Arrossegar i deixar anar (la més ràpida, sense Git)
1. Entra a **vercel.com** i crea un compte gratuït.
2. Instal·la la CLI: obre el Terminal i escriu `npm i -g vercel` (cal tenir Node.js: nodejs.org).
3. Situa't dins d'aquesta carpeta i escriu `vercel`.
4. Accepta les preguntes amb Enter (Framework: **Other**, sense build command).
5. Vercel et dona una URL a l'instant (p. ex. `direkte-xxxx.vercel.app`).

### Opció B — Amb GitHub (recomanada per anar actualitzant)
1. Crea un repositori nou a **github.com → New repository** (pot ser privat).
2. Puja el contingut d'aquesta carpeta al repositori (**Add file → Upload files**).
3. A **vercel.com → Add New → Project**, importa el repo.
4. Framework Preset: **Other**. Build & Output: deixa-ho buit (Output Directory `.`).
5. **Deploy**. A partir d'aquí, cada canvi que pugis a GitHub es publica sol.

---

## Notes

- Les fonts es carreguen de Google Fonts (cal connexió a internet).
- `_opcions-hero.html` és un fitxer de treball intern (comparativa d'opcions). No forma part de la web pública; el pots esborrar abans de pujar-la.
- Pendents abans de la versió final: iframe de reserves (TheFork) i enllaços de pagament de Stripe als botons "Regalar" de `vals.html` (busca `data-stripe`).
- Quan tinguis el domini propi: **Vercel → projecte → Settings → Domains → Add**, i seguir les instruccions de DNS que et doni.
