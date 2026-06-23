# Direkte — Preview · Iteració 6 «Tinta sobre negre»

Evolució de disseny sobre la it5. Mateixa estructura de continguts validada amb Arnau,
elevada en materialitat de marca, ritme editorial i micro-interaccions.

- **`index.html`** — Home
- **`about.html`** — About
- **`vals.html`** — Regala Direkte
- **`_opcions-hero.html`** — INTERN: 3 tractaments del hero per triar (A aplicada per defecte)

## Què canvia respecte a la it5

### Identitat / materialitat
- **Hero amb el wordmark oficial** (PNG estampat d'Arnau) en lloc de recompondre DIREKTE
  amb Special Elite. La tinta real torna a ser la protagonista. (Opcions B i C a `_opcions-hero.html`.)
- **Gra fotogràfic** subtil a tota la pàgina (SVG noise via CSS, opacitat 0.05).
- **Segell K** processat amb transparència (`k-seal-bone.png`, `k-seal-red.png`):
  apareix al costat del hero, com a marca d'aigua a Reserves i a la Validesa dels vals.
- **El guiny de la cabra**: `goat-alpha.png` (processada amb canal alfa) al peu de pàgina,
  petita i al 40% — amb tooltip "Carrer de les Cabres, 13". Discreta, com va demanar.
- **Botons quadrats** (radius 0), hover que inverteix a tinta blanca. Estètica de segell.

### Layout
- Composició **asimètrica a peu de pàgina** als heros (wordmark a baix-esquerra,
  segell + scroll a la dreta), en lloc del centrat simètric.
- **Menús com a llibre de comptes**: línies grans numerades (01/02/03), preu en vermell,
  regla vermella que creix al hover. Sense punts de guia (més net).
- **Banda de fotos asimètrica** (3 altures diferents, desacoblada dels menús — es manté
  el criteri d'Arnau de no associar foto↔menú).
- **Cinta de dades** sota el hero: "14 places per torn · Dos torns per nit · Cuina vista".
  Dades pures, estil tiquet de cuina.
- **Numeració de seccions** (kickers "01 — Els menús") a totes les pàgines.
- Timeline amb **marcadors com a segells** (anells girats −6°).
- Gallery strip amb altures alternades (ritme).

### Motion (nivell mitjà, respecta `prefers-reduced-motion`)
- Reveals en scroll (IntersectionObserver, stagger per --rv-delay).
- Zoom subtil de les imatges al hover (1.03, 1.1s).
- Subratllat de tinta als enllaços editorials.
- Vals: el toggle de maridatge actualitza els preus (+45 €) amb micro-transició,
  i la casella es marca amb una **K estampada**.
- Menú mòbil de pantalla completa amb enllaços numerats.

### Copy (curat, criteri "sec i directe")
- "Selecció de la nostra cellera" → "Selecció del nostre celler" (correcció).
- "antel·lació" → "antelació" (meta description).
- Horari unificat: "Dt–Ds sopars · Ds migdia · Dg i Dl tancat".
- Timeline 2018: ara cita el carrer de les Cabres, 13 (l'origen de la cabra, sense explicar-lo).
- FAQ: "sota disponibilitat" → "segons disponibilitat"; "afegir carta de vins" → "afegir-hi maridatge".

## Assets nous (processats)
- `assets/logo/k-seal-bone.png` — segell K blanc trencat amb transparència
- `assets/logo/k-seal-red.png` — segell K vermell amb transparència
- `assets/logo/goat-alpha.png` — cabra amb canal alfa real (sense blend-mode)

## Pendents (hereta de la it5)
Iframe TheFork · links Stripe als botons "Regalar" · fotos timeline 2020/avui ·
llista col·laboradors · logo Macarfi · validació de copy en català per Arnau ·
xarxes socials reals · pàgines legals.

## Tècnic
- Sense dependències. HTML/CSS/JS vanilla. Es desplega igual que la it5 (Netlify Drop).
- Scrims de protecció sobre foto ara són divs reals (`.scrim`), no pseudo-elements.
- Reveals amb fallback: sense JS tot és visible (classe `.js` al root).
- `100dvh`, `loading="lazy"`, `prefers-reduced-motion` — es mantenen.
