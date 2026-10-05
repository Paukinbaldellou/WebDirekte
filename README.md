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
- **Segell K** processat amb transparència (`k-seal-bone.webp`):
  apareix al costat del hero, com a marca d'aigua a Reserves i a la Validesa dels vals.
- **El guiny de la cabra**: `goat-alpha.webp` (processada amb canal alfa) al peu de pàgina,
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
fotos timeline 2020/avui ·
llista col·laboradors · logo Macarfi · validació de copy en català per Arnau ·
xarxes socials reals · pàgines legals.

## Tècnic
- Sense dependències. HTML/CSS/JS vanilla. Es desplega igual que la it5 (Netlify Drop).
- Scrims de protecció sobre foto ara són divs reals (`.scrim`), no pseudo-elements.
- Reveals amb fallback: sense JS tot és visible (classe `.js` al root).
- `100dvh`, `loading="lazy"`, `prefers-reduced-motion` — es mantenen.

## Ronda 3 — revisió d'Arnau (setembre 2026)
- Totes les pàgines comencen amb foto: Regala Direkte passa a tenir hero fotogràfic (gift-teaser). Preload de la imatge de capçalera a Inici, About i Regala.
- Enllaços (linktree): títols en minúscula, sense majúscules forçades.
- Horari (bloc Menús i peu): «Funcionem amb torns · 19:30 i 21:45 · 13:00 i 15:15».
- About: 2018 «l'Arnau i una cuinera»; .direktevins només amb Antonio Lopo; 2020 «Pandèmia: adaptació total»; artesans: Takao Sakyo (Utuwazoshi), Tòquio.
- .direkteferments: text nou del taller, «Temps i paciència» (sense sal), llista ampliada i sense numeració.
- Premsa: cites noves de Regol, Arenós, Jolonch, Adrià, Broc i Casanovas (originals en CA/ES, traduïdes en EN/FR).

## Ronda 4 — octubre 2026
- Vals regal sense Stripe: «Regalar» obre un formulari (producte, maridatge, persones, dades, destinatari, data, dedicatòria) que envia la comanda a reserves@direkte.cat via FormSubmit. Si l'enviament falla, s'obre el correu amb la comanda ja escrita. Sense JS, el botó obre el correu.
- Textos legals actualitzats (Stripe → FormSubmit).
- El selector d'idioma es tanca en clicar fora o amb Esc.

## Ronda 4b — correccions d'auditoria (octubre 2026)
- Menú mòbil: la creu ja tanca (z-index del menú per sota de la capçalera). aria-label traduït a cada idioma.
- Mapa de Google carregat només en clicar «Veure el mapa» (sense cookies d'entrada). Afegit a la política de cookies.
- Imatges: cabra, segell i wordmark a WebP a mida real; hero de la Home a WebP (425 KB). Originals a `docs/masters/`.
- OG de Regala i About a 1200×630 (`og-vals.jpg`, `og-about.jpg`).
- Formulari: el maridatge es reinicia en canviar de menú; l'import no arrossega valors anteriors; si falla l'enviament es mostra l'adreça.
- Extres en graella, zona de toc més gran; horari alineat; jerarquia de títols; robots.txt sense Disallow; theme-color i apple-touch-icon; scroll-margin als ancoratges; transferència internacional (FormSubmit) a privacitat.

## Ronda 5 — mòbil condensat (octubre 2026)
- Capa pròpia per a ≤640 px al final de `styles.css`: ritme vertical més curt, menús amb nom i preu a la mateixa línia, horari en llista dia/hora, botons en graella de dos, cronologia compacta, vals més densos, peu en dues columnes.
- TheFork a tota l'amplada a ≤860 px (sense desbordament) i segell decoratiu de Reserves amagat.

## Ronda 6 — motion fi (octubre 2026)
- Títols de secció línia a línia, sortint de darrere d'una màscara (1,5 s, corba expo). Acabada l'animació es restaura l'HTML original.
- Reveals només amb opacitat i 10 px de recorregut, lents (1,4–1,6 s). Sense desenfocaments.
- Kickers: la regla es dibuixa després del text.
- Hero de la Home escalonat i lent. Menú mòbil i FAQ amb fosa suau. Subratllat de tinta al peu.
- Transició creuada entre pàgines (View Transitions; la capçalera queda fixa).
- Tot desactivat amb prefers-reduced-motion.

## Ronda 7 — auditoria mòbil + motion (octubre 2026)
- reduced-motion atura també els reveals; el títol dels heros d'About i Regala ja no parpelleja (ocult fins al split, espera màx. 700 ms a les fonts).
- Hero de Regala en mòbil amb scrim reforçat (kicker llegible).
- Menú mòbil sencer en < 0,5 s. Reveals i regla dels kickers a 0,9 s.
- Split: es torna a mesurar en redimensionar; salta títols amb marcatge intern.
- Mapa: focus a l'iframe en carregar; sense adreça duplicada. Cronologia: la línia acaba al marcador «Avui».
- Formulari: preu davant del nom al desplegable. Separadors «·» sense orfes. Premis del peu a 40 px. Data de cookies actualitzada.
