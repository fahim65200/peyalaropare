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


  /* ---------- News from beyond the cup ----------
     One entry per report. tag: "winter", "wages" or "women".
     orig: which language the headline was originally published in ("en" or "bn");
     the other language is marked as a translation on the site.
     archive: true for older reports (shown with an "Archive" label). */
  news: [
    { tag: "wages", orig: "bn", outlet: { en: "Shomoyer Alo", bn: "সময়ের আলো" }, date: { en: "9 Oct 2026", bn: "৯ অক্টোবর ২০২৬" },
      head: { en: "A household runs on Tk 178 wages; tea leaves become part of the meal", bn: "১৭৮ টাকা মজুরিতে চলে সংসার, খাবারে চা-পাতার চাটনি" },
      sum: { en: "Low earnings and household food stress. Wage figures differ between reports; this is the figure reported at the time.", bn: "কম আয় আর সংসারে খাবারের টানাপোড়েন। বিভিন্ন প্রতিবেদনে মজুরির অঙ্ক ভিন্ন; এটি প্রতিবেদনের সময়কার অঙ্ক।" },
      url: "https://www.shomoyeralo.com/news/388841" },
    { tag: "wages", orig: "en", outlet: { en: "The Daily Star", bn: "দ্য ডেইলি স্টার" }, date: { en: "17 Aug 2026", bn: "১৭ আগস্ট ২০২৬" },
      head: { en: "Tea workers intensify protests for Tk 500 daily wage", bn: "দৈনিক ৫০০ টাকা মজুরির দাবিতে চা-শ্রমিকদের আন্দোলন জোরদার" },
      sum: { en: "Workers renew their demand for a higher daily wage. Tk 500 is the demand, not the current wage.", bn: "উচ্চতর দৈনিক মজুরির দাবিতে শ্রমিকদের আন্দোলন। ৫০০ টাকা দাবি, বর্তমান মজুরি নয়।" },
      url: "https://www.thedailystar.net/news/bangladesh/news/tea-workers-intensify-protests-tk-500-daily-wage-4249716" },
    { tag: "women", orig: "bn", outlet: { en: "Ajker Patrika", bn: "আজকের পত্রিকা" }, date: { en: "1 May 2026", bn: "১ মে ২০২৬" },
      head: { en: "Women tea-garden workers face wage inequality and demand their rights", bn: "চা-বাগানের নারী শ্রমিকেরা মজুরি-বৈষম্যের শিকার, অধিকার বাস্তবায়নের দাবি" },
      sum: { en: "Women workers in Moulvibazar's gardens on unequal pay, work targets and rights that exist on paper.", bn: "মৌলভীবাজারের বাগানে নারী শ্রমিকদের মজুরি-বৈষম্য, কাজের লক্ষ্যমাত্রা আর অধিকার বাস্তবায়নের দাবি।" },
      url: "https://www.ajkerpatrika.com/bangladesh/moulvibazar/ajpqiuvzhqcpb" },
    { tag: "winter", orig: "en", outlet: { en: "bdnews24.com", bn: "বিডিনিউজ২৪" }, date: { en: "8 Jan 2026", bn: "৮ জানুয়ারি ২০২৬" },
      head: { en: "Temperature drops to 7°C in Sreemangal as winter chill descends", bn: "শ্রীমঙ্গলে তাপমাত্রা নামল ৭ ডিগ্রিতে, জেঁকে বসেছে শীত" },
      quote: { en: "“Our hands are freezing as we try to pluck tea leaves amid this cold.”", bn: "“এই ঠান্ডায় চা-পাতা তুলতে গিয়ে আমাদের হাত জমে যাচ্ছে।”" },
      sum: { en: "A Sreemangal tea-garden worker, quoted in the report.", bn: "প্রতিবেদনে উদ্ধৃত শ্রীমঙ্গলের এক চা-শ্রমিক।" },
      url: "https://bdnews24.com/bangladesh/7e97630fe550" },
    { tag: "winter", orig: "bn", outlet: { en: "Ajker Patrika", bn: "আজকের পত্রিকা" }, date: { en: "29 Dec 2025", bn: "২৯ ডিসেম্বর ২০২৫" },
      head: { en: "Tea workers suffer in bone-chilling cold, with no warm clothes to wear", bn: "হাড়কাঁপানো শীতে চা-শ্রমিকদের দুর্ভোগ, পরনে নেই গরম কাপড়" },
      sum: { en: "Work in the cold without warm clothing, and illness among children and older people. The report also notes some official distribution.", bn: "গরম পোশাক ছাড়া ঠান্ডায় কাজ, শিশু ও বয়স্কদের অসুস্থতা। প্রশাসনের কিছু সহায়তা বিতরণের কথাও প্রতিবেদনে আছে।" },
      url: "https://www.ajkerpatrika.com/bangladesh/moulvibazar/ajpw1rqy72sso" },
    { tag: "winter", orig: "en", archive: true, outlet: { en: "The Daily Star", bn: "দ্য ডেইলি স্টার" }, date: { en: "Jan 2023", bn: "জানুয়ারি ২০২৩" },
      head: { en: "They need warm clothes", bn: "তাদের দরকার গরম কাপড়" },
      sum: { en: "Families lighting fires for warmth, and cold-related illness among children and older people.", bn: "উষ্ণতার জন্য আগুন জ্বালানো পরিবার, শিশু ও বয়স্কদের শীতজনিত অসুস্থতা।" },
      url: "https://www.thedailystar.net/news/bangladesh/news/they-need-warm-clothes-3211396" }
  ],

  /* Videos: link out to the original channel. search: true = link opens a YouTube search, not the exact video. */
  voices: [
    { title: "How are the tea workers of Sylhet?", channel: "Hridoy Explore", url: "https://www.youtube.com/watch?v=1W_XL9oFnYU",
      moments: [
        { t: 21, en: "Walking the rows with baskets", bn: "ঝুড়ি নিয়ে বাগানের সারিতে" },
        { t: 57, en: "A worker on work and earnings", bn: "কাজ আর আয় নিয়ে এক শ্রমিক" },
        { t: 151, en: "Working through every kind of weather", bn: "সব আবহাওয়ায় কাজ" }
      ] },
    { title: "Tea Workers: Lives, Struggles and Deprivation", channel: "The Daily Sylheter Dak Multimedia", search: true,
      url: "https://www.youtube.com/results?search_query=Tea+Workers+Lives+Struggles+Deprivation+The+Daily+Sylheter+Dak+Multimedia",
      moments: [ { t: 8, en: "A mother on paying for her children's education", bn: "সন্তানের পড়াশোনার খরচ নিয়ে এক মা" } ] },
    { title: "Life of Workers in a Tea Garden", channel: "Panorama Documentary", search: true,
      url: "https://www.youtube.com/results?search_query=Life+of+Workers+in+a+Tea+Garden+Panorama+Documentary+tea+workers",
      moments: [ { t: 4, en: "Hands picking tea leaves", bn: "চা-পাতা তোলা হাত" } ] },
    { title: "Tea Garden and Tea Workers: Rare Footage 1999–2007", channel: "Panorama Documentary", search: true, archive: true,
      url: "https://www.youtube.com/results?search_query=Tea+Garden+and+Tea+Workers+Rare+Footage+1999+2007+Panorama+Documentary",
      moments: [ { t: 9, en: "Archival footage of plucking", bn: "পাতা তোলার পুরোনো দৃশ্য" } ] }
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
