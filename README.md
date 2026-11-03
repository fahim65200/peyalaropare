# Peyalar Opare website

Bilingual (বাংলা / English) site for GitHub Pages. Opens in Bangla by default.

## What to upload to GitHub
Upload everything EXCEPT the `for-later` folder:
`index.html`, `style.css`, `script.js`, `config.js`, `README.md`, `assets/`, `apps-script/`

## Everyday edits: only `config.js`
| What | Setting |
|---|---|
| Film (YouTube link or `assets/film.mp4`) | `heroVideo`, `films` |
| Money raised (if no Google Sheet) | `raised`, `donors`, `goal` |
| Public ledger | `ledgerCsvUrl` |
| Spending chart | `spending` |
| Calculator prices | `impactItems`, then `costsConfirmed: true` |
| Timeline progress | `timeline` ("done", "now", "next") |
| Partner names | `partners` |
| Forms | `formEndpoint` |

## Public ledger (Google Sheet)
1. New Google Sheet. Row 1: `Date | Amount | Method | Ref | Note`
2. One row per gift. `Ref` = last 3 digits of TrxID only. Never donor phone numbers or names unless they agree.
3. File > Share > Publish to web > pick the sheet > Comma-separated values (.csv) > Publish.
4. Paste the link into `ledgerCsvUrl`. The progress bar and donor count then update automatically.

## Forms (volunteer, donation confirmation, partners)
Follow the steps at the top of `apps-script/Code.gs`. Until then, forms open the visitor's email app.

## Payment logos
Save official logos as `assets/bkash-logo.png` and `assets/ebl-logo.png`. Without them, the names show as text.

## After buying peyalaropare.com
1. Upload `for-later/CNAME` to the main folder of the repo.
2. DNS: four A records for `@` (185.199.108.153, .109.153, .110.153, .111.153) and CNAME `www` → `<username>.github.io`. Check GitHub Pages docs for current IPs.
3. Settings > Pages > Custom domain: `peyalaropare.com`, then Enforce HTTPS.
