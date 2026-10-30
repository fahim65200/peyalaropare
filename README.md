# Peyalar Opare website

Bilingual (English / Bangla) static site for GitHub Pages.

## Files
- `index.html` : all page content (every text has an English and a Bangla span)
- `style.css` : design
- `script.js` : language switch, donation amount, menu
- `config.js` : **edit this** for payment links, wallet numbers, bank, email, socials
- `CNAME` : custom domain (peyalaropare.com)
- `assets/` : add `logo.png`, `hero.jpg` (optional), `bkash-qr.png` (optional)

## Publish on GitHub Pages
1. Create a repo (e.g. `peyalaropare-site`), upload all files and the `assets` folder.
2. Settings > Pages > Source: `main` branch, `/ (root)`.
3. At your domain registrar, add DNS:
   - A records for `@`: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
   - CNAME for `www`: `<your-github-username>.github.io`
   (Check GitHub Pages docs for the current IPs.)
4. Back in Settings > Pages, enter `peyalaropare.com` and tick "Enforce HTTPS".

## Editing text
Find the sentence in `index.html`; change the `<span lang="en">` and `<span lang="bn">` versions.

## Turning on payments
Fill `gatewayUrl`, `wallets`, `bank`, `reportFormUrl` in `config.js`. Empty values stay hidden.

## Payment logos
Download the official logos and save them as:
- `assets/bkash-logo.png` (bKash brand/press page)
- `assets/ebl-logo.png` (Eastern Bank website)
If a file is missing, the site simply hides that logo.
