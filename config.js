/* =========================================================
   PEYALAR OPARE : SITE SETTINGS
   Edit this file to update details. No other file needs editing.
   Leave a value as "" (or 0) to hide that part.
   ========================================================= */
window.SITE_CONFIG = {

  /* ---------- Contact ---------- */
  email: "peyalaropare@gmail.com",
  phone: "01407112246",
  socials: {
    "Facebook": "",
    "Instagram": "",
    "YouTube": ""
  },

  /* ---------- Video ----------
     heroVideo: the film that plays from the "Watch our film" button.
     autoPopupVideo: true = film opens by itself on a visitor's first visit. */
  heroVideo: "assets/film.mp4",
  autoPopupVideo: false,
  films: [
    {
      video: "assets/film.mp4",
      poster: "assets/film-poster.jpg",
      en: "Watch: Peyalar Opare", bn: "দেখুন: পেয়ালার ওপারে",
      caption: {
        bn: "এবারের শীতে উষ্ণতা পৌঁছাক তাদের ঘরেও যারা অনবরত প্রশ্রান্তি জোগায় আমাদের। চলুন যাই পেয়ালার ওপারে-",
        en: "This winter, let warmth reach the homes of those who bring us comfort every day. Come, let's go beyond the cup."
      }
    }
  ],

  /* ---------- Donations ----------
     Wallets and banks appear on the site in the order listed here.
     logo: file in the assets folder. If the file is missing, the name shows as text. */
  wallets: [
    { name: "bKash",  number: "01407112246", logo: "assets/bkash-logo.png",  color: "#e2136e" },
    { name: "Nagad",  number: "01707288507", logo: "assets/nagad-logo.png",  color: "#f26a21" },
    { name: "Rocket", number: "01552399877", logo: "assets/rocket-logo.png", color: "#8c3494" }
  ],
  banks: [
    { bankName: "Eastern Bank PLC (EBL)", logo: "assets/ebl-logo.png",
      accountName: "MOHAMMED FAHIM", accountNo: "1361560003738", branch: "Dhanmondi", routing: "095261188" },
    { bankName: "BRAC Bank PLC", logo: "assets/brac-logo.png",
      accountName: "Tasnuva Tabassum Sristi", accountNo: "1072115660001", branch: "New Market", routing: "" },
    { bankName: "Eastern Bank PLC (EBL)", logo: "assets/ebl-logo.png",
      accountName: "Mahir Tajwar Rahman", accountNo: "1361440030208", branch: "Dhanmondi", routing: "095261188" }
  ],
  gatewayUrl: "",                 // card payment page link, once you have one

  /* ---------- Progress bar ----------
     If ledgerCsvUrl is set, "raised" and "donors" are calculated from the sheet.
     Otherwise the numbers below are used. Set goal after the needs assessment. */
  goal: 0,
  raised: 0,
  donors: 0,

  /* ---------- Public ledger (Google Sheet) ----------
     Sheet columns (row 1): Date | Amount | Method | Ref | Note
     "Ref" = last 3 digits of the Transaction ID. Never put donor phone numbers.
     File > Share > Publish to web > choose the sheet > CSV > copy link here. */
  ledgerCsvUrl: "",

  /* ---------- Partners shown publicly (with their permission) ---------- */
  partners: [
    // "Company name"
  ],

  /* ---------- Spending breakdown (fill in after purchases) ---------- */
  spending: [
    // { en: "Blankets", bn: "কম্বল", amount: 0 },
    // { en: "Transport and delivery", bn: "পরিবহন ও বিতরণ", amount: 0 },
    // { en: "Assessment and monitoring", bn: "যাচাই ও পর্যবেক্ষণ", amount: 0 }
  ],

  /* ---------- Impact calculator ----------
     IMPORTANT: these costs are EXAMPLES. Replace with real local quotations.
     Set costsConfirmed to true once they are real; the "example" label disappears. */
  costsConfirmed: false,
  impactItems: [
    { key: "blanket", en: "warm blanket", bn: "উষ্ণ কম্বল", cost: 650 },
    { key: "shawl",   en: "shawl or sweater", bn: "চাদর বা সোয়েটার", cost: 450 },
    { key: "cap",     en: "cap and socks for a child", bn: "শিশুর টুপি ও মোজা", cost: 180 }
  ],

  /* ---------- Timeline status: "done", "now" or "next" ---------- */
  timeline: ["now", "next", "next", "next"],

  /* ---------- Forms ----------
     Paste your Google Apps Script web-app URL here (see apps-script/Code.gs).
     Without it, forms open the visitor's email app instead. */
  formEndpoint: "",

  /* ---------- Live cold map ---------- */
  places: [
    { en: "Sylhet",       bn: "সিলেট",        lat: 24.90, lon: 91.87 },
    { en: "Sreemangal",   bn: "শ্রীমঙ্গল",     lat: 24.31, lon: 91.73 },
    { en: "Kamalganj",    bn: "কমলগঞ্জ",       lat: 24.36, lon: 91.86 },
    { en: "Kulaura",      bn: "কুলাউড়া",       lat: 24.52, lon: 92.04 },
    { en: "Moulvibazar",  bn: "মৌলভীবাজার",    lat: 24.48, lon: 91.78 },
    { en: "Chunarughat",  bn: "চুনারুঘাট",      lat: 24.21, lon: 91.52 },
    { en: "Fatikchhari",  bn: "ফটিকছড়ি",       lat: 22.69, lon: 91.79 },
    { en: "Panchagarh",   bn: "পঞ্চগড়",        lat: 26.33, lon: 88.55 }
  ]
};
