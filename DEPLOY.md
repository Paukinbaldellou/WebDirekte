# Direkte — desplegar a Vercel

Web estàtica (HTML + CSS + JS). **No cal cap pas de build.** Només cal servir aquesta carpeta tal qual: `index.html` ja és la pàgina d'inici.

Estructura:
```
index.html      → Inici
about.html      → About
vals.html       → Regala Direkte
styles.css
script.js
assets/         → logos, imatges, premis
```

## Opció A — Arrossegar i deixar anar (la més ràpida, sense Git)
1. Entra a **vercel.com** i crea un compte gratuït.
2. Instal·la la CLI: obre el Terminal i escriu `npm i -g vercel` (cal tenir Node.js: nodejs.org).
3. Situa't dins d'aquesta carpeta i escriu `vercel`.
4. Accepta les preguntes amb Enter (Framework: **Other**, sense build command).
5. Vercel et dona una URL de previsualització a l'instant (p. ex. `direkte-xxxx.vercel.app`).

## Opció B — Amb GitHub (recomanada per anar actualitzant)
1. Puja aquesta carpeta a un repositori de GitHub.
2. A **vercel.com → Add New → Project**, importa el repo.
3. Framework Preset: **Other**. Build & Output: deixa-ho buit (Output Directory `.`).
4. **Deploy**. Cada cop que facis push, es torna a publicar sol.

## Notes
- Les fonts es carreguen de Google Fonts (cal connexió a internet).
- Pendents abans de la versió final: iframe de reserves (TheFork) i enllaços de pagament de Stripe als botons "Regalar" de `vals.html` (busca `data-stripe`).
