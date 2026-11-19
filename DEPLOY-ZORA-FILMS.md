# ZORA FILMS — GitHub + Cloudflare Pages

## Ovaj paket

- Verzija stranice: **Lovable v8 + v10 usklađeni mobilni prijelaz Analog softness, digital precision**, nadograđen na posljednji V9 kompletan paket.
- Izvorni ZIP SHA-256: `39f8030034aa57d5c96982489e7e22e9eb59cf40602a79b050d6dd2518c3ed37`.
- Sve postojeće JavaScript, CSS, video, slikovne i font datoteke V9 paketa ostale su **bajtno nepromijenjene**.
- Dodana su samo dva nova resursa: `public/assets/zora-mobile-analog-reveal-v10.css` i `public/assets/zora-mobile-analog-reveal-v10.js`; početna datoteka `public/index.html` povezuje ih na stranicu.
- Na mobitelu bijela ploha, akvarel, naslov i odlomak koriste istu granicu prijelaza. Otkrivanje je glatko, tekst na bijelom postaje crn, a pri skrolanju natrag vraća se crna pozadina s bijelim tekstom.
- Početak i kraj otkrivanja koriste istu jednadžbu položaja skrolanja kao postojeća desktop verzija. Isključivo mobilna interpolacija uklanja trzanje pri skrolanju.
- Na desktopu se nove korekcije ne primjenjuju. Kompozicija, tipografija, veličine, razmaci i ostale animacije nisu mijenjani.
- Cijeli gotov statički build nalazi se unutar `public/`.
- `ORIGINAL-VERIFY-SHA256.txt` sadrži kontrolne zbrojeve svih datoteka ove završne verzije stranice.

## Struktura za postojeći GitHub repozitorij

```text
DEPLOY-ZORA-FILMS.md
ORIGINAL-VERIFY-SHA256.txt
public/
```

## Potpuna zamjena postojeće verzije

1. Raspakiraj ovaj ZIP.
2. U GitHub Desktopu otvori lokalni repozitorij `Zora-Guruji` (Repository → Show in Finder).
3. U toj mapi zamijeni **sva tri vidljiva postojeća elementa** istim elementima iz ovog ZIP-a.
4. **Ne briši skrivenu mapu `.git`** — ona čuva vezu s GitHub repozitorijem.
5. U GitHub Desktopu napravi **Commit to main → Push origin**.

Nemoj kopirati ZIP u mapu `public/`, niti stvarati dvostruku mapu `public/public/`.

## Postojeće postavke Cloudflare Pages

- Projekt: `zora-guruji`
- Produkcijska grana: `main`
- Framework preset: `None`
- Build command: `exit 0`
- Build output directory: `public`

Build je već gotov: ne treba `npm install`, `npm run build` ni promjena konfiguracije.
Ne mijenjaj DNS, domenu ili e-mail zapise.

## Neobavezna kontrola identičnosti

Iz korijena repozitorija:

```bash
sha256sum -c ORIGINAL-VERIFY-SHA256.txt
```

Provjera nije uvjet za deployment. Ovaj dokument i popis kontrolnih zbrojeva služe samo kao upute i dokaz o sadržaju.
