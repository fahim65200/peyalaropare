(() => {
  "use strict";
  const cfg = window.SITE_CONFIG || {};
  const root = document.documentElement;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* =============== language =============== */
  const lang = () => root.getAttribute("data-lang");
  const L = (en, bn) => (lang() === "bn" ? bn : en);
  const fmt = n => new Intl.NumberFormat(lang() === "bn" ? "bn-BD" : "en-IN").format(Math.round(n));
  const tk = n => "৳" + fmt(n);
  const rerenders = [];
  function setLang(l) {
    root.setAttribute("data-lang", l);
    root.setAttribute("lang", l);
    store.set("lang", l);
    rerenders.forEach(f => f());
  }
  const savedLang = store.get("lang");
  root.setAttribute("data-lang", savedLang || "bn");
  root.setAttribute("lang", savedLang || "bn");
  $("#langToggle").addEventListener("click", () => setLang(lang() === "en" ? "bn" : "en"));

  const escHtml = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* =============== toast =============== */
  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2400);
  }

  /* =============== header + menu =============== */
  const bar = $("#bar");
  const onScroll = () => bar.classList.toggle("solid", scrollY > 40);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  const nav = $("#nav"), menuBtn = $("#menuBtn");
  menuBtn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open);
  });
  $$("#nav a").forEach(a => a.addEventListener("click", () => { nav.classList.remove("open"); menuBtn.setAttribute("aria-expanded", false); }));

  /* =============== hero: word-by-word tagline =============== */
  const tag = $(".tagline");
  let i = 0;
  tag.innerHTML = tag.innerHTML.split(/(<br>)/).map(part =>
    part === "<br>" ? part : part.split(" ").filter(Boolean)
      .map(w => `<span class="w" style="animation-delay:${0.5 + 0.22 * i++}s">${w}</span>`).join(" ")
  ).join("");

  /* =============== hero: background clips on a loop =============== */
  (function heroVideos() {
    const vids = $$(".hero-media .hv");
    if (!vids.length) return;
    if (reduced) { vids[0].classList.add("on"); return; }
    let cur = 0;
    const show = k => {
      vids.forEach((v, n) => v.classList.toggle("on", n === k));
      const v = vids[k];
      if (v.preload !== "auto") { v.preload = "auto"; }
      try { v.currentTime = 0; } catch (e) {}
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
      // fetch only the next clip in the background, not all of them at once
      const next = vids[(k + 1) % vids.length];
      if (next.preload !== "auto") { next.preload = "auto"; next.load(); }
    };
    vids.forEach((v, n) => {
      // start the cross-fade a little before the clip ends so there is no black gap
      v.addEventListener("timeupdate", () => {
        if (n === cur && v.duration && v.currentTime > v.duration - 1.2) {
          cur = (cur + 1) % vids.length;
          show(cur);
        }
      });
    });
    // pause when the hero is off screen to save battery and data
    new IntersectionObserver(e => {
      const v = vids[cur];
      if (e[0].isIntersecting) { const p = v.play(); if (p && p.catch) p.catch(() => {}); } else v.pause();
    }).observe($(".hero"));
    show(0);
  })();

  /* =============== modals =============== */
  let lastFocus;
  function openModal(id) {
    const m = document.getElementById(id);
    if (!m) return;
    lastFocus = document.activeElement;
    m.hidden = false;
    document.body.style.overflow = "hidden";
    const f = m.querySelector("input, select, textarea, button:not(.modal-x)") || m.querySelector("button");
    setTimeout(() => f && f.focus(), 50);
  }
  function closeModal(m) {
    m.hidden = true;
    document.body.style.overflow = "";
    if (m.id === "videoModal") $("#videoFrame").innerHTML = "";
    if (m.id === "postModal") $("#postMedia").innerHTML = "";
    lastFocus && lastFocus.focus();
  }
  $$(".modal").forEach(m => {
    m.addEventListener("click", e => { if (e.target === m || e.target.closest("[data-close]")) closeModal(m); });
  });
  addEventListener("keydown", e => {
    if (e.key === "Escape") { const m = $(".modal:not([hidden])"); if (m) closeModal(m); }
  });
  $$("[data-open]").forEach(b => b.addEventListener("click", () => openModal(b.dataset.open)));

  /* =============== video =============== */
  function ytId(url) {
    const m = String(url).match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
    return m ? m[1] : null;
  }
  function playVideo(src) {
    const id = ytId(src);
    $("#videoFrame").innerHTML = id
      ? `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen title="Film"></iframe>`
      : `<video src="${src}" controls autoplay playsinline></video>`;
    openModal("videoModal");
  }
  const watch = $("#watchBtn");
  if (cfg.heroVideo) {
    $(".hero").classList.add("has-video");
    watch.addEventListener("click", () => playVideo(cfg.heroVideo));
    if (cfg.autoPopupVideo && !store.get("seenFilm")) {
      setTimeout(() => { store.set("seenFilm", "1"); playVideo(cfg.heroVideo); }, 3200);
    }
  } else {
    watch.setAttribute("aria-disabled", "true");
    watch.addEventListener("click", () => toast(L("Our first film is on its way.", "আমাদের প্রথম ফিল্ম আসছে শীঘ্রই।")));
  }

  function renderFilms() {
    const g = $("#filmGrid");
    const films = (cfg.films || []).filter(f => f.video);
    if (!films.length) {
      g.innerHTML = `<div class="film placeholder"><p>${L("Our first film arrives soon", "আমাদের প্রথম ফিল্ম আসছে শীঘ্রই")}<small>${L("Stories from the gardens, told with consent.", "বাগানের গল্প, সম্মতি নিয়েই বলা।")}</small></p></div>`;
      return;
    }
    g.classList.toggle("single", films.length === 1);
    const play = '<i><svg width="16" height="16" viewBox="0 0 16 16"><path d="M4 2.5v11l9-5.5z" fill="#13241f"/></svg></i>';
    g.innerHTML = films.map((f, k) => {
      const id = ytId(f.video);
      const src = f.poster || (id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : "");
      const thumb = src ? `<img src="${src}" alt="" loading="lazy">` : "";
      const cap = f.caption ? `<figcaption class="film-caption">${L(f.caption.en || f.caption.bn, f.caption.bn || f.caption.en)}</figcaption>` : "";
      return `<figure class="film-item"><button class="film" type="button" data-k="${k}">${thumb}<span class="play">${play}${L(f.en, f.bn)}</span></button>${cap}</figure>`;
    }).join("");
    $$(".film[data-k]", g).forEach(b => b.addEventListener("click", () => playVideo(films[b.dataset.k].video)));
  }
  renderFilms(); rerenders.push(renderFilms);

  /* =============== story: scroll-driven sky =============== */
  (function story() {
    const sky = $("#storySky"), time = $("#clockTime"), part = $("#clockPart");
    const steps = $$(".step");
    const parts = [["Before dawn", "ভোরের আগে"], ["Morning", "সকাল"], ["Midday", "দুপুর"], ["Night", "রাত"]];
    let cur = 0;
    const paint = () => {
      const s = steps[cur];
      time.textContent = lang() === "bn" ? s.dataset.timeBn : s.dataset.timeEn;
      part.textContent = L(...parts[cur]);
    };
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        cur = +e.target.dataset.step;
        steps.forEach(s => s.classList.toggle("active", s === e.target));
        sky.dataset.step = cur;
        $$(".shot", sky).forEach(im => im.classList.toggle("on", +im.dataset.step === cur));
        paint();
      });
    }, { rootMargin: "-45% 0px -45% 0px" });
    steps.forEach(s => io.observe(s));
    steps[0].classList.add("active");
    paint(); rerenders.push(paint);
  })();

  /* =============== news from beyond the cup =============== */
  (function news() {
    const board = $("#newsBoard"), voicesEl = $("#voices");
    if (!board) return;
    const items = cfg.news || [], voices = cfg.voices || [];
    let filter = "all";
    const tagName = { winter: ["Winter", "শীত"], wages: ["Wages", "মজুরি"], women: ["Women", "নারী"] };
    // a torn paper edge, the same every time for a given card
    const torn = seed => {
      let x = seed * 9301 + 49297;
      const rnd = () => ((x = (x * 9301 + 49297) % 233280) / 233280);
      const top = [], bot = [];
      for (let p = 0; p <= 100; p += 4) top.push(`${p}% ${(rnd() * 2.2).toFixed(2)}%`);
      for (let p = 100; p >= 0; p -= 4) bot.push(`${p}% ${(97.8 + rnd() * 2.2).toFixed(2)}%`);
      return `polygon(${top.join(",")},${bot.join(",")})`;
    };
    const ext = '<svg width="13" height="13" viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3H3v10h10v-3M9 2h5v5M14 2 7 9" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';
    function render() {
      const lang2 = lang();
      board.innerHTML = items.map((n, k) => {
        if (filter !== "all" && n.tag !== filter) return "";
        const translated = n.orig && n.orig !== lang2;
        const labels = [L(...tagName[n.tag] || ["", ""])];
        if (n.archive) labels.push(L("Archive", "আর্কাইভ"));
        if (translated) labels.push(L("Translated", "অনূদিত"));
        return `<article class="clip" style="--tilt:${[-1.4, 0.9, -0.6, 1.3, -1, 0.5][k % 6]}deg">
          <span class="tape" aria-hidden="true"></span>
          <div class="paper" style="clip-path:${torn(k + 3)}">
            <header class="clip-top"><b>${escHtml(L(n.outlet.en, n.outlet.bn))}</b><time>${escHtml(L(n.date.en, n.date.bn))}</time></header>
            <p class="clip-tags">${labels.map(t => `<span>${escHtml(t)}</span>`).join("")}</p>
            <h3 class="clip-head">${escHtml(L(n.head.en, n.head.bn))}</h3>
            ${n.quote ? `<p class="clip-quote">${escHtml(L(n.quote.en, n.quote.bn))}</p>` : ""}
            <p class="clip-sum">${escHtml(L(n.sum.en, n.sum.bn))}</p>
            <a class="clip-link" href="${escHtml(n.url)}" target="_blank" rel="noopener">${L("Read the original report", "মূল প্রতিবেদন পড়ুন")} ${ext}</a>
          </div>
        </article>`;
      }).join("");
      const mmss = t => `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
      voicesEl.innerHTML = voices.map(v => {
        const chips = (v.moments || []).map(m => {
          const label = `<b>${mmss(m.t)}</b> ${escHtml(L(m.en, m.bn))}`;
          return v.search ? `<span class="moment">${label}</span>`
            : `<a class="moment" href="${escHtml(v.url)}&t=${m.t}s" target="_blank" rel="noopener">${label}</a>`;
        }).join("");
        return `<article class="voice">
          <span class="voice-icon" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 16 16"><path d="M4 2.5v11l9-5.5z" fill="currentColor"/></svg></span>
          <div>
            <h4>${escHtml(v.title)}${v.archive ? ` <small>${L("Archive", "আর্কাইভ")}</small>` : ""}</h4>
            <p class="voice-ch">${escHtml(v.channel)}</p>
            <div class="moments">${chips}</div>
          </div>
          <a class="btn btn-line voice-go" href="${escHtml(v.url)}" target="_blank" rel="noopener">${v.search ? L("Search on YouTube", "ইউটিউবে খুঁজুন") : L("Watch on YouTube", "ইউটিউবে দেখুন")}</a>
        </article>`;
      }).join("");
    }
    $$("#newsFilter button").forEach(b => b.addEventListener("click", () => {
      filter = b.dataset.f;
      $$("#newsFilter button").forEach(x => x.classList.toggle("on", x === b));
      render();
    }));
    render(); rerenders.push(render);
  })();

  /* =============== posts / updates =============== */
  (function posts() {
    const grid = $("#postGrid"), moreBtn = $("#postMore");
    if (!grid) return;
    const list = (window.SITE_POSTS || []).filter(p => p && (p.images || p.video));
    const PAGE = 6;
    let shown = PAGE;
    const fmtDate = iso => {
      const d = new Date(iso + "T00:00:00");
      if (isNaN(d)) return iso;
      return d.toLocaleDateString(lang() === "bn" ? "bn-BD" : "en-GB", { day: "numeric", month: "long", year: "numeric" });
    };
    const caption = p => (p.text ? L(p.text.en || p.text.bn, p.text.bn || p.text.en) : "");
    const playIcon = '<svg width="22" height="22" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5v11l9-5.5z" fill="currentColor"/></svg>';
    const stackIcon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="7" y="7" width="13" height="13" rx="2"/><path d="M4 16V5a1 1 0 0 1 1-1h11"/></svg>';
    function render() {
      if (!list.length) {
        grid.innerHTML = `<p class="post-empty">${L("Our first update is on its way.", "আমাদের প্রথম আপডেট আসছে শীঘ্রই।")}</p>`;
        moreBtn.hidden = true;
        return;
      }
      grid.innerHTML = list.slice(0, shown).map((p, k) => {
        const cover = p.images ? p.images[0] : (p.poster || "");
        const badge = p.video ? `<span class="post-badge">${playIcon}</span>`
          : (p.images.length > 1 ? `<span class="post-badge">${stackIcon}${fmt(p.images.length)}</span>` : "");
        return `<button class="post-card" type="button" data-k="${k}">
          <span class="post-thumb">${cover ? `<img src="${escHtml(cover)}" alt="" loading="lazy">` : ""}${badge}</span>
          <span class="post-meta"><time>${escHtml(fmtDate(p.date))}</time><span class="post-text">${escHtml(caption(p))}</span></span>
        </button>`;
      }).join("");
      moreBtn.hidden = list.length <= shown;
      $$(".post-card", grid).forEach(b => b.addEventListener("click", () => openPost(+b.dataset.k)));
    }
    let cur = null, idx = 0;
    function paintMedia() {
      const p = cur, media = $("#postMedia");
      if (p.video) {
        media.innerHTML = `<video src="${escHtml(p.video)}" ${p.poster ? `poster="${escHtml(p.poster)}"` : ""} controls autoplay playsinline></video>`;
        return;
      }
      const n = p.images.length;
      media.innerHTML = `<img src="${escHtml(p.images[idx])}" alt="">` + (n > 1 ? `
        <button class="post-nav prev" type="button" aria-label="Previous">‹</button>
        <button class="post-nav next" type="button" aria-label="Next">›</button>
        <div class="post-dots">${p.images.map((_, i) => `<i class="${i === idx ? "on" : ""}"></i>`).join("")}</div>` : "");
      if (n > 1) {
        $(".post-nav.prev", media).addEventListener("click", () => { idx = (idx - 1 + n) % n; paintMedia(); });
        $(".post-nav.next", media).addEventListener("click", () => { idx = (idx + 1) % n; paintMedia(); });
      }
    }
    function openPost(k) {
      cur = list[k]; idx = 0;
      paintMedia();
      const link = cur.link && cur.link.url
        ? `<a class="btn btn-line dark" href="${escHtml(cur.link.url)}" target="_blank" rel="noopener">${escHtml(L(cur.link.en || "Open", cur.link.bn || "খুলুন"))}</a>` : "";
      $("#postBody").innerHTML = `<time>${escHtml(fmtDate(cur.date))}</time><p>${escHtml(caption(cur))}</p>
        <div class="post-actions">${link}<a class="btn btn-ember" href="#donate">${L("Send warmth", "উষ্ণতা পাঠান")}</a></div>`;
      $("#postBody .btn-ember").addEventListener("click", () => { const m = $("#postModal"); m.hidden = true; document.body.style.overflow = ""; $("#postMedia").innerHTML = ""; });
      openModal("postModal");
    }
    // swipe and arrow keys inside the viewer
    let sx = null;
    $("#postMedia").addEventListener("touchstart", e => { sx = e.touches[0].clientX; }, { passive: true });
    $("#postMedia").addEventListener("touchend", e => {
      if (sx === null || !cur || !cur.images || cur.images.length < 2) return;
      const dx = e.changedTouches[0].clientX - sx; sx = null;
      if (Math.abs(dx) > 40) { const n = cur.images.length; idx = (idx + (dx < 0 ? 1 : -1) + n) % n; paintMedia(); }
    });
    addEventListener("keydown", e => {
      if ($("#postModal").hidden || !cur || !cur.images || cur.images.length < 2) return;
      const n = cur.images.length;
      if (e.key === "ArrowRight") { idx = (idx + 1) % n; paintMedia(); }
      if (e.key === "ArrowLeft") { idx = (idx - 1 + n) % n; paintMedia(); }
    });
    moreBtn.addEventListener("click", () => { shown += PAGE; render(); });
    render(); rerenders.push(render);
  })();

  /* =============== live cold map =============== */
  const places = cfg.places || [];
  let weather = null, selPlace = -1;
  const FROST = [143, 179, 194], EMBER = [227, 161, 74];
  const tempColor = t => {
    const k = Math.max(0, Math.min(1, (t - 8) / 20));
    return `rgb(${FROST.map((c, j) => Math.round(c + (EMBER[j] - c) * k)).join(",")})`;
  };
  async function loadWeather() {
    if (!places.length) return;
    try {
      const cached = sessionStorage.getItem("wx");
      if (cached) {
        const c = JSON.parse(cached);
        if (Date.now() - c.t < 30 * 60e3) { weather = c.d; return renderWeather(); }
      }
    } catch (e) {}
    const url = "https://api.open-meteo.com/v1/forecast?latitude=" + places.map(p => p.lat).join(",") +
      "&longitude=" + places.map(p => p.lon).join(",") +
      "&current=temperature_2m,apparent_temperature,relative_humidity_2m&daily=temperature_2m_min,temperature_2m_max&timezone=Asia%2FDhaka&forecast_days=1";
    try {
      const r = await fetch(url);
      if (!r.ok) throw new Error(r.status);
      let d = await r.json();
      if (!Array.isArray(d)) d = [d];
      weather = d.map(x => ({
        now: x.current.temperature_2m, feels: x.current.apparent_temperature,
        hum: x.current.relative_humidity_2m, min: x.daily.temperature_2m_min[0], max: x.daily.temperature_2m_max[0]
      }));
      try { sessionStorage.setItem("wx", JSON.stringify({ t: Date.now(), d: weather })); } catch (e) {}
    } catch (e) { weather = "error"; }
    renderWeather();
  }
  const deg = n => fmt(Math.round(n)) + "°";
  function renderWeather() {
    const ticker = $("#ticker"), list = $("#coldList");
    if (weather === "error" || !weather) {
      ticker.classList.add("static");
      ticker.innerHTML = `<span class="muted">${L("Live temperatures are unavailable right now. Try again later.", "এখন সরাসরি তাপমাত্রা পাওয়া যাচ্ছে না। পরে আবার চেষ্টা করুন।")}</span>`;
      list.innerHTML = "";
      drawMap();
      return;
    }
    const items = places.map((p, k) => ({ ...p, ...weather[k], k }));
    const one = items.map(p => `<span><b>${L(p.en, p.bn)}</b><span class="t">${deg(p.now)}</span></span>`).join("");
    ticker.classList.remove("static");
    ticker.innerHTML = one + one;
    const sorted = [...items].sort((a, b) => a.now - b.now);
    list.innerHTML = sorted.map(p => `<li><button type="button" data-k="${p.k}" class="${p.k === selPlace ? "sel" : ""}">
      <span class="cname">${L(p.en, p.bn)}</span>
      <span class="ctemp" style="color:${tempColor(p.now)}">${deg(p.now)}</span>
      <span class="cbar"><i style="width:${Math.max(6, Math.min(100, (p.now - 4) / 30 * 100))}%;background:${tempColor(p.now)}"></i></span>
    </button></li>`).join("");
    $$("button", list).forEach(b => b.addEventListener("click", () => selectPlace(+b.dataset.k)));
    drawMap(items);
    if (selPlace < 0) selectPlace(sorted[0].k, true);
    else selectPlace(selPlace, true);
  }
  function selectPlace(k, quiet) {
    selPlace = k;
    if (!weather || weather === "error") return;
    const p = { ...places[k], ...weather[k] };
    $$("#coldList button").forEach(b => b.classList.toggle("sel", +b.dataset.k === k));
    $$("#coldMap .dot").forEach(d => d.classList.toggle("sel", +d.dataset.k === k));
    $("#coldDetail").innerHTML = `<strong>${L(p.en, p.bn)}</strong>
      ${L("Now", "এখন")} ${deg(p.now)} · ${L("feels like", "অনুভূত")} ${deg(p.feels)}<br>
      ${L("Today's low", "আজকের সর্বনিম্ন")} ${deg(p.min)} · ${L("high", "সর্বোচ্চ")} ${deg(p.max)}`;
  }
  function drawMap(items) {
    const svg = $("#coldMap");
    const X = lon => 30 + (lon - 88.0) / 4.8 * 440;
    const Y = lat => 610 - (lat - 20.6) / 6.2 * 580;
    const belt = p => p.lat > 24.1 && p.lon > 91.4;
    const IC = { x: 170, y: 470, r: 140, lon: 91.78, lat: 24.55, s: 250 };
    const IX = lon => IC.x + (lon - IC.lon) * IC.s;
    const IY = lat => IC.y - (lat - IC.lat) * IC.s;
    let g = '<g class="grid">';
    for (let lon = 88; lon <= 92.5; lon += .5) g += `<line x1="${X(lon)}" y1="20" x2="${X(lon)}" y2="620"/>`;
    for (let lat = 21; lat <= 26.5; lat += .5) g += `<line x1="20" y1="${Y(lat)}" x2="480" y2="${Y(lat)}"/>`;
    g += "</g>";
    const pts = items || places.map((p, k) => ({ ...p, k }));
    const coldest = items ? [...items].sort((a, b) => a.now - b.now)[0].k : -1;
    const bx = X(91.78), by = Y(24.55);
    g += `<circle cx="${bx}" cy="${by}" r="34" fill="none" stroke="rgba(227,161,74,.5)" stroke-dasharray="3 5"/>
      <line x1="${bx - 24}" y1="${by + 24}" x2="${IC.x + 90}" y2="${IC.y - 90}" stroke="rgba(227,161,74,.35)" stroke-dasharray="3 5"/>
      <circle cx="${IC.x}" cy="${IC.y}" r="${IC.r}" fill="rgba(13,26,22,.55)" stroke="rgba(227,161,74,.4)"/>
      <text x="${IC.x}" y="${IC.y + IC.r + 24}" text-anchor="middle" fill="#a9bbb4" font-size="14" font-family="Hind Siliguri, sans-serif">${L("Sylhet tea belt (zoomed)", "সিলেট চা অঞ্চল (বড় করে)")}</text>`;
    const dot = (p, x, y, labelSide) => {
      const col = items ? tempColor(p.now) : "#8fb3c2";
      const anchor = labelSide === "l" ? "end" : "start";
      const dx = labelSide === "l" ? -14 : 14;
      return `<g class="dot" data-k="${p.k}" tabindex="0" role="button" aria-label="${p.en}">
        ${p.k === coldest ? `<circle class="pulse" cx="${x}" cy="${y}" r="9" fill="none" stroke="${col}" stroke-width="2"/>` : ""}
        <circle cx="${x}" cy="${y}" r="7" fill="${col}"/>
        <text x="${x + dx}" y="${y - 2}" text-anchor="${anchor}">${L(p.en, p.bn)}</text>
        ${items ? `<text class="tv" x="${x + dx}" y="${y + 20}" text-anchor="${anchor}">${deg(p.now)}</text>` : ""}
      </g>`;
    };
    pts.forEach(p => {
      if (belt(p)) {
        const lx = IX(p.lon), ly = IY(p.lat);
        g += `<circle cx="${X(p.lon)}" cy="${Y(p.lat)}" r="2.5" fill="rgba(227,161,74,.8)"/>`;
        g += dot(p, lx, ly, p.lon < IC.lon + 0.05 ? "l" : "r");
      } else {
        g += dot(p, X(p.lon), Y(p.lat), X(p.lon) > 380 ? "l" : "r");
      }
    });
    svg.innerHTML = g;
    $$(".dot", svg).forEach(d => {
      const go = () => selectPlace(+d.dataset.k);
      d.addEventListener("click", go);
      d.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
      if (+d.dataset.k === selPlace) d.classList.add("sel");
    });
  }
  drawMap();
  loadWeather();
  rerenders.push(() => renderWeather());

  /* =============== timeline status =============== */
  function renderTimeline() {
    const st = cfg.timeline || [];
    const labels = { done: ["Done", "সম্পন্ন"], now: ["In progress", "চলছে"], next: ["Coming up", "সামনে"] };
    $$("#timeline li").forEach((li, k) => {
      const s = st[k] || "next";
      li.className = s;
      $(".path-status", li).textContent = L(...labels[s]);
    });
  }
  renderTimeline(); rerenders.push(renderTimeline);

  /* =============== impact calculator =============== */
  const ICONS = {
    blanket: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"><path d="M8 14h28a6 6 0 0 1 0 12H12a4 4 0 0 0 0 8h28"/><path d="M8 14v20M14 20h18M14 30h22"/></svg>',
    shawl: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"><path d="M10 10h28l-4 22-10 8-10-8z"/><path d="M14 32l-2 8M20 37l-1 5M28 37l1 5M34 32l2 8"/><path d="M16 18h16M18 25h12"/></svg>',
    cap: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"><path d="M12 31c0-11 5-19 12-19s12 8 12 19"/><rect x="10" y="31" width="28" height="7" rx="2"/><path d="M16 31v7M21 31v7M27 31v7M32 31v7"/><circle cx="24" cy="9" r="3"/><path d="M15 23c5-2 13-2 18 0"/></svg>'
  };
  const items = cfg.impactItems || [];
  let amount = 1000, selItem = 0, prevCount = -1;
  const range = $("#amountRange"), out = $("#amountOut"), custom = $("#amountCustom");
  const MIN = 100, MAX = 50000;
  const toAmt = v => {
    const raw = MIN * Math.pow(MAX / MIN, v / 100);
    const step = raw < 1000 ? 50 : raw < 10000 ? 100 : 500;
    return Math.round(raw / step) * step;
  };
  const toPos = a => Math.round(Math.log(Math.max(MIN, Math.min(MAX, a)) / MIN) / Math.log(MAX / MIN) * 100);

  function renderTabs() {
    $("#itemTabs").innerHTML = items.map((it, k) => `
      <button class="item-tab" role="tab" type="button" aria-selected="${k === selItem}" data-k="${k}">
        ${ICONS[it.key] || ICONS.blanket}
        <span>${L(it.en.charAt(0).toUpperCase() + it.en.slice(1), it.bn)}<small>${L("about", "প্রায়")} ${tk(it.cost)} ${L("each", "প্রতিটি")}</small></span>
        <span class="count">${fmt(Math.floor(amount / it.cost))}</span>
      </button>`).join("");
    $$(".item-tab").forEach(b => b.addEventListener("click", () => { selItem = +b.dataset.k; prevCount = -1; renderImpact(); }));
  }
  function renderImpact(fromUser) {
    if (!items.length) return;
    out.textContent = fmt(amount);
    renderTabs();
    $$("#chips button").forEach(b => b.classList.toggle("on", +b.dataset.v === amount));
    const it = items[selItem];
    const n = Math.floor(amount / it.cost);
    const s = $("#impactSentence");
    if (n >= 1) {
      s.innerHTML = L(`${tk(amount)} could provide about <b>${fmt(n)}</b> ${it.en}${n > 1 && !/s$/.test(it.en) ? "s" : ""}.`,
        `${tk(amount)} দিয়ে প্রায় <b>${fmt(n)}টি</b> ${it.bn} দেওয়া যেতে পারে।`);
    } else {
      s.innerHTML = L(`${tk(amount)} joins with other gifts to buy a ${it.en}. Every taka counts.`,
        `${tk(amount)} অন্যদের দানের সঙ্গে মিলে একটি ${it.bn} কেনা যাবে। প্রতিটি টাকাই গুরুত্বপূর্ণ।`);
    }
    const field = $("#iconField");
    const shown = Math.min(n, 24);
    if (n !== prevCount) {
      const keep = prevCount >= 0 && prevCount <= 24 ? Math.min(prevCount, shown) : 0;
      const existing = $$("svg", field).slice(0, keep).map(x => x.outerHTML.replace(/style="[^"]*"/, 'style="animation:none"'));
      let html = existing.join("");
      for (let k = keep; k < shown; k++) html += (ICONS[it.key] || ICONS.blanket).replace("<svg ", `<svg style="animation-delay:${(k - keep) * 35}ms" `);
      if (n > 24) html += `<span class="more">+${fmt(n - 24)}</span>`;
      field.innerHTML = html;
      prevCount = n;
    }
    const heat = Math.min(1, Math.log(amount / MIN) / Math.log(MAX / MIN));
    $("#warmthFill").style.width = Math.max(4, heat * 100) + "%";
    $(".impact-visual").style.setProperty("--heat", (0.12 + heat * 0.45).toFixed(2));
    $("#impactNote").textContent = cfg.costsConfirmed
      ? L("Costs are based on local quotations.", "খরচ স্থানীয় দরপত্রের ভিত্তিতে।")
      : L("Example prices for illustration. Final costs and items will follow the needs assessment and local quotations.",
          "উদাহরণ হিসেবে দেওয়া দাম। চূড়ান্ত খরচ ও সামগ্রী নির্ধারিত হবে চাহিদা যাচাই ও স্থানীয় দরপত্রের পর।");
    $("#impactDonate").textContent = L(`Give ${tk(amount)}`, `${tk(amount)} দান করুন`);
    if (fromUser !== "range") range.value = toPos(amount);
  }
  range.addEventListener("input", () => { amount = toAmt(+range.value); custom.value = ""; renderImpact("range"); });
  $$("#chips button").forEach(b => b.addEventListener("click", () => { amount = +b.dataset.v; custom.value = ""; renderImpact(); }));
  custom.addEventListener("input", () => { const v = +custom.value; if (v >= 50) { amount = v; renderImpact(); } });
  $("#impactDonate").addEventListener("click", () => {
    const c = $("#chosenAmount");
    c.hidden = false;
    c.textContent = L(`You chose ${tk(amount)}. Send it by bKash or bank below, then confirm your gift.`,
      `আপনি ${tk(amount)} বেছে নিয়েছেন। নিচে বিকাশ বা ব্যাংকে পাঠিয়ে দান নিশ্চিত করুন।`);
    $("#rfAmount").value = amount;
  });
  renderImpact(); rerenders.push(() => { prevCount = -1; renderImpact(); });

  /* =============== donate: wallets + banks + copy =============== */
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const logoTag = (src, name, cls) => src
    ? `<img src="${esc(src)}" alt="${esc(name)}" class="${cls}" loading="lazy" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'pay-word',textContent:this.alt}))">`
    : `<span class="pay-word">${esc(name)}</span>`;
  function renderPay() {
    const wallets = (cfg.wallets || []).filter(w => w.number);
    $("#wallets").innerHTML = wallets.map((w, k) => `
      <article class="pay-card wallet" style="--brand:${esc(w.color || "#8fb3c2")}">
        <header>${logoTag(w.logo, w.name, "pay-logo")}<span class="pay-kind">${esc(w.name)} · ${L("Personal", "পার্সোনাল")}</span></header>
        <div class="copy-row big">
          <span class="copy-val" id="w_${k}">${esc(w.number)}</span>
          <button class="copy" type="button" data-copy-from="w_${k}">${L("Copy", "কপি")}</button>
        </div>
      </article>`).join("");
    const rows = [
      ["accountName", "Account name", "অ্যাকাউন্টের নাম"],
      ["accountNo", "Account no.", "অ্যাকাউন্ট নম্বর"],
      ["bankName", "Bank", "ব্যাংক"],
      ["branch", "Branch", "শাখা"],
      ["routing", "Routing no.", "রাউটিং নম্বর"]
    ];
    const banks = (cfg.banks || []).filter(b => b.accountNo);
    $("#banks").innerHTML = banks.map((bk, n) => `
      <article class="pay-card bank">
        <header>${logoTag(bk.logo, bk.bankName, "pay-logo")}<span class="pay-kind">${L("Account", "অ্যাকাউন্ট")} ${fmt(n + 1)}</span></header>
        <dl class="bank-rows">${rows.filter(r => bk[r[0]]).map(r => `<div><dt>${L(r[1], r[2])}</dt>
          <dd id="b${n}_${r[0]}">${esc(bk[r[0]])}</dd>
          <button class="copy" type="button" data-copy-from="b${n}_${r[0]}">${L("Copy", "কপি")}</button></div>`).join("")}</dl>
        <button class="btn btn-line" type="button" data-copy-bank="${n}">${L("Copy all details", "সব তথ্য কপি করুন")}</button>
      </article>`).join("");
    $$("[data-copy-bank]").forEach(btn => btn.addEventListener("click", e => {
      const bk = banks[+btn.dataset.copyBank];
      const t = [`Account name: ${bk.accountName}`, `Account no: ${bk.accountNo}`, `Bank: ${bk.bankName}`,
        `Branch: ${bk.branch}`, bk.routing ? `Routing no: ${bk.routing}` : ""].filter(Boolean).join("\n");
      copyText(t, e.currentTarget);
    }));
    bindCopy();
  }
  async function copyText(text, btn) {
    try { await navigator.clipboard.writeText(text); }
    catch (e) {
      const ta = Object.assign(document.createElement("textarea"), { value: text });
      document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove();
    }
    if (btn) {
      btn.classList.add("ok");
      const old = btn.innerHTML;
      btn.textContent = L("Copied", "কপি হয়েছে");
      setTimeout(() => { btn.classList.remove("ok"); btn.innerHTML = old; }, 1600);
    }
    toast(L("Copied: ", "কপি হয়েছে: ") + text.split("\n")[0]);
  }
  function bindCopy() {
    $$("[data-copy-from]").forEach(b => {
      if (b.dataset.bound) return;
      b.dataset.bound = 1;
      b.addEventListener("click", () => copyText(document.getElementById(b.dataset.copyFrom).textContent.trim(), b));
    });
  }
  renderPay(); rerenders.push(renderPay);
  if (cfg.gatewayUrl) { const g = $("#gatewayBtn"); g.hidden = false; g.href = cfg.gatewayUrl; }

  /* =============== closing: logo blooms from the ground =============== */
  (function bloom() {
    const sec = $("#bloom"), v = $("#bloomVideo");
    if (!sec || !v) return;
    let played = false;
    new IntersectionObserver(entries => {
      const e = entries[0];
      if (e.isIntersecting && !played) {
        played = true;
        sec.classList.add("in");
        v.preload = "auto";
        if (reduced) { v.addEventListener("loadeddata", () => { try { v.currentTime = v.duration - 0.1; } catch (x) {} }, { once: true }); v.load(); return; }
        const p = v.play();
        if (p && p.catch) p.catch(() => {});
      }
    }, { threshold: 0.35 }).observe(sec);
  })();

  /* =============== ledger + progress =============== */
  let ledgerRows = [];
  function parseCSV(text) {
    const rows = []; let row = [], cell = "", q = false;
    for (let k = 0; k < text.length; k++) {
      const ch = text[k];
      if (q) {
        if (ch === '"' && text[k + 1] === '"') { cell += '"'; k++; }
        else if (ch === '"') q = false;
        else cell += ch;
      } else if (ch === '"') q = true;
      else if (ch === ",") { row.push(cell); cell = ""; }
      else if (ch === "\n" || ch === "\r") {
        if (ch === "\r" && text[k + 1] === "\n") k++;
        row.push(cell); rows.push(row); row = []; cell = "";
      } else cell += ch;
    }
    if (cell || row.length) { row.push(cell); rows.push(row); }
    return rows.filter(r => r.some(c => c.trim()));
  }
  const num = s => parseFloat(String(s).replace(/[^\d.]/g, "")) || 0;
  async function loadLedger() {
    if (cfg.ledgerCsvUrl) {
      try {
        const r = await fetch(cfg.ledgerCsvUrl, { cache: "no-store" });
        const rows = parseCSV(await r.text());
        rows.shift();
        ledgerRows = rows.map(r => ({ date: r[0] || "", amount: num(r[1]), method: r[2] || "", ref: (r[3] || "").trim(), note: r[4] || "" }))
          .filter(r => r.amount > 0);
      } catch (e) { ledgerRows = null; }
    } else if (Array.isArray(cfg.ledger)) {
      // simple ledger typed straight into config.js
      ledgerRows = cfg.ledger.map(r => ({ date: r.date || "", amount: num(r.amount), method: r.method || "", ref: String(r.ref || "").trim(), note: r.note || "" }))
        .filter(r => r.amount > 0);
    }
    renderLedger(); renderProgress();
  }
  function renderLedger() {
    const body = $("#ledgerBody"), q = $("#ledgerSearch").value.trim();
    if (ledgerRows === null) {
      body.innerHTML = `<tr class="ledger-empty"><td colspan="5">${L("The ledger could not load. Refresh the page to try again.", "হিসাবখাতা লোড হয়নি। আবার চেষ্টা করতে পেজটি রিফ্রেশ করুন।")}</td></tr>`;
      return;
    }
    if (!ledgerRows.length) {
      body.innerHTML = `<tr class="ledger-empty"><td colspan="5">${L("No gifts recorded yet. Yours could be the first line in this ledger.", "এখনো কোনো দান নথিভুক্ত হয়নি। এই হিসাবখাতার প্রথম লাইনটি হতে পারে আপনার।")}</td></tr>`;
      return;
    }
    const rows = [...ledgerRows].reverse();
    body.innerHTML = rows.map(r => `<tr class="${q && r.ref.endsWith(q) ? "hit" : ""}">
      <td>${r.date}</td><td class="amt">${tk(r.amount)}</td><td>${r.method}</td><td>${r.ref ? "•••" + r.ref : ""}</td><td>${r.note}</td></tr>`).join("");
    if (q.length >= 3) {
      const hit = $("tr.hit", body);
      if (hit) hit.scrollIntoView({ block: "nearest", behavior: "smooth" });
      else toast(L("Not found yet. New gifts are added within 48 hours.", "এখনো পাওয়া যায়নি। নতুন দান ৪৮ ঘণ্টার মধ্যে যোগ করা হয়।"));
    }
  }
  let searchT;
  $("#ledgerSearch").addEventListener("input", () => { clearTimeout(searchT); searchT = setTimeout(renderLedger, 350); });

  function renderProgress() {
    const fromLedger = ledgerRows && ledgerRows.length;
    const raised = fromLedger ? ledgerRows.reduce((s, r) => s + r.amount, 0) : (cfg.raised || 0);
    const donors = fromLedger ? ledgerRows.length : (cfg.donors || 0);
    $("#raisedOut").textContent = tk(raised);
    const goal = cfg.goal || 0;
    $("#goalOut").textContent = goal
      ? L(`of ${tk(goal)} goal`, `লক্ষ্য ${tk(goal)}`)
      : L("Goal set after the needs assessment", "চাহিদা যাচাইয়ের পর লক্ষ্য নির্ধারণ হবে");
    const pct = goal ? Math.min(100, raised / goal * 100) : 0;
    requestAnimationFrame(() => { $("#progressFill").style.width = pct + "%"; });
    $("#progressSub").textContent = donors
      ? L(`${fmt(donors)} ${donors === 1 ? "person has" : "people have"} given so far. Thank you.`, `এ পর্যন্ত ${fmt(donors)} জন দান করেছেন। ধন্যবাদ।`)
      : L("We have just launched. Be one of the first to give warmth this winter.", "আমরা সবে শুরু করেছি। এই শীতে প্রথম উষ্ণতা পাঠানোদের একজন হোন।");
  }
  loadLedger(); rerenders.push(() => { renderLedger(); renderProgress(); });

  /* =============== spending donut =============== */
  function renderDonut() {
    const sp = (cfg.spending || []).filter(s => s.amount > 0);
    const svg = $("#donut"), center = $("#donutCenter"), legend = $("#spendLegend");
    const R = 80, C = 2 * Math.PI * R;
    if (!sp.length) {
      svg.innerHTML = `<circle cx="100" cy="100" r="${R}" fill="none" stroke="#c9d5cf" stroke-width="22" stroke-dasharray="6 6"/>`;
      center.innerHTML = `<span><strong>${tk(0)}</strong>${L("spent so far. The breakdown appears here after the first purchases.", "এ পর্যন্ত খরচ। প্রথম কেনাকাটার পর এখানে হিসাব দেখা যাবে।")}</span>`;
      legend.innerHTML = "";
      return;
    }
    const total = sp.reduce((s, x) => s + x.amount, 0);
    const colors = ["#e3a14a", "#3f6b4a", "#8fb3c2", "#b8701f", "#a7b8a0", "#2b4a5a"];
    let off = 0;
    svg.innerHTML = sp.map((s, k) => {
      const len = s.amount / total * C;
      const c = `<circle cx="100" cy="100" r="${R}" fill="none" stroke="${colors[k % colors.length]}" stroke-width="22"
        stroke-dasharray="0 ${C}" data-len="${len}" stroke-dashoffset="${-off}"/>`;
      off += len;
      return c;
    }).join("");
    requestAnimationFrame(() => $$("circle", svg).forEach(c => c.setAttribute("stroke-dasharray", `${c.dataset.len - 1.5} ${C}`)));
    center.innerHTML = `<span><strong>${tk(total)}</strong>${L("spent", "খরচ")}</span>`;
    legend.innerHTML = sp.map((s, k) => `<li><i style="background:${colors[k % colors.length]}"></i>${L(s.en, s.bn)}<b>${tk(s.amount)}</b></li>`).join("");
  }
  renderDonut(); rerenders.push(renderDonut);

  /* =============== partners =============== */
  function renderPartners() {
    const p = cfg.partners || [];
    $("#partnerWall").innerHTML = p.map(x => `<span>${x}</span>`).join("");
  }
  renderPartners();

  /* =============== dedication card =============== */
  const cv = $("#giftCanvas"), cx = cv.getContext("2d");
  const logoImg = new Image();
  logoImg.src = "assets/logo.png";
  function wrapText(text, maxW) {
    const words = text.split(" "), lines = []; let line = "";
    words.forEach(w => {
      const test = line ? line + " " + w : w;
      if (cx.measureText(test).width > maxW && line) { lines.push(line); line = w; } else line = test;
    });
    if (line) lines.push(line);
    return lines;
  }
  function drawCard() {
    const W = 1080, H = 1080;
    const name = $("#cfName").value.trim() || L("Someone you love", "প্রিয় কেউ");
    const from = $("#cfFrom").value.trim();
    const msg = $("#cfMsg").value.trim();
    const g = cx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#0f1e1a"); g.addColorStop(.7, "#1d3a34"); g.addColorStop(1, "#33524b");
    cx.fillStyle = g; cx.fillRect(0, 0, W, H);
    const glow = cx.createRadialGradient(W * .5, H * .95, 10, W * .5, H * .95, 620);
    glow.addColorStop(0, "rgba(227,161,74,.45)"); glow.addColorStop(1, "rgba(227,161,74,0)");
    cx.fillStyle = glow; cx.fillRect(0, 0, W, H);
    cx.strokeStyle = "rgba(20,40,30,.85)"; cx.lineWidth = 14; cx.lineCap = "round";
    for (let y = 900; y < H + 40; y += 34) {
      cx.beginPath();
      for (let x = -40; x <= W + 40; x += 40) cx.quadraticCurveTo(x + 10, y - 14 - (y - 900) * .05, x + 20, y);
      cx.stroke();
    }
    cx.strokeStyle = "rgba(223,232,228,.18)"; cx.lineWidth = 2;
    cx.strokeRect(40, 40, W - 80, H - 80);
    if (logoImg.complete && logoImg.naturalWidth) {
      cx.save(); cx.beginPath(); cx.arc(W / 2, 190, 100, 0, 6.283); cx.fillStyle = "#fff"; cx.fill(); cx.clip();
      cx.drawImage(logoImg, W / 2 - 100, 90, 200, 200); cx.restore();
    }
    cx.textAlign = "center";
    cx.fillStyle = "#c9d8d1";
    cx.font = '40px "Hind Siliguri"';
    cx.fillText(L("This winter, warmth was shared", "এই শীতে উষ্ণতা পৌঁছে গেল"), W / 2, 380);
    cx.font = '34px "Hind Siliguri"';
    cx.fillStyle = "#8fb3c2";
    cx.fillText(L("in honour of", "যাঁর নামে"), W / 2, 440);
    cx.fillStyle = "#ffffff";
    let size = 108;
    cx.font = `${size}px "Tiro Bangla"`;
    while (cx.measureText(name).width > W - 200 && size > 56) { size -= 6; cx.font = `${size}px "Tiro Bangla"`; }
    cx.fillText(name, W / 2, 560);
    let y = 640;
    if (msg) {
      cx.fillStyle = "#e3c79a";
      cx.font = 'italic 42px "Tiro Bangla"';
      wrapText(msg, W - 260).slice(0, 2).forEach(l => { cx.fillText(l, W / 2, y); y += 56; });
    }
    if (from) {
      cx.fillStyle = "#c9d8d1";
      cx.font = '36px "Hind Siliguri"';
      cx.fillText(L(`with love, ${from}`, `শুভেচ্ছায়, ${from}`), W / 2, Math.max(y + 20, 720));
    }
    cx.fillStyle = "#e3a14a";
    cx.font = '44px "Tiro Bangla"';
    cx.fillText("পেয়ালার ওপারে", W / 2, 950);
    cx.fillStyle = "#c9d8d1";
    cx.font = '28px "Tiro Bangla"';
    cx.fillText("উষ্ণতার গল্পে, যাঁদের নামটুকু নেই", W / 2, 995);
  }
  const fontsReady = (document.fonts && document.fonts.load)
    ? Promise.all([document.fonts.load('60px "Tiro Bangla"', "পেয়ালার"), document.fonts.load('40px "Hind Siliguri"', "এই শীতে Aa")]).catch(() => {})
    : Promise.resolve();
  fontsReady.then(drawCard);
  logoImg.onload = drawCard;
  ["#cfName", "#cfFrom", "#cfMsg"].forEach(s => $(s).addEventListener("input", drawCard));
  rerenders.push(drawCard);
  function cardBlob() {
    return new Promise((res, rej) => {
      try { cv.toBlob(b => (b ? res(b) : rej()), "image/png"); } catch (e) { rej(e); }
    });
  }
  $("#cfDownload").addEventListener("click", async () => {
    try {
      const b = await cardBlob();
      const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(b), download: "peyalar-opare-card.png" });
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      $("#rfHonour").value = $("#cfName").value.trim();
      toast(L("Card saved. Now send your gift.", "কার্ড সেভ হয়েছে। এবার উপহার পাঠান।"));
    } catch (e) { toast(L("Download works once the site is online.", "সাইট অনলাইনে গেলে ডাউনলোড কাজ করবে।")); }
  });
  $("#cfShare").addEventListener("click", async () => {
    try {
      const b = await cardBlob();
      const file = new File([b], "peyalar-opare-card.png", { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], text: L("A gift of warmth, given in your name.", "আপনার নামে উষ্ণতার একটি উপহার।") + " " + shareUrl() });
      } else $("#cfDownload").click();
    } catch (e) { if (e && e.name !== "AbortError") $("#cfDownload").click(); }
  });

  /* =============== forms =============== */
  const subjects = { volunteer: "Volunteer sign-up", donation: "Donation confirmation", partner: "Partnership request" };
  function handleForm(form, onDone) {
    form.addEventListener("submit", async e => {
      e.preventDefault();
      const msg = $(".form-msg", form);
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const fd = new FormData(form);
      const data = {};
      for (const [k, v] of fd.entries()) data[k] = data[k] ? data[k] + ", " + v : v;
      data.language = lang();
      data.submitted = new Date().toISOString();
      const btn = $("button[type=submit]", form);
      btn.disabled = true;
      if (cfg.formEndpoint) {
        try {
          await fetch(cfg.formEndpoint, { method: "POST", mode: "no-cors", body: new URLSearchParams(data) });
          msg.className = "form-msg ok";
          msg.textContent = L("Thank you. We received it and will be in touch.", "ধন্যবাদ। আমরা পেয়েছি, শীঘ্রই যোগাযোগ করব।");
          form.reset(); onDone && onDone();
        } catch (err) {
          msg.className = "form-msg err";
          msg.textContent = L("It didn't send. Check your connection and try again, or email us.", "পাঠানো যায়নি। ইন্টারনেট সংযোগ দেখে আবার চেষ্টা করুন, অথবা ইমেইল করুন।");
        }
      } else {
        const body = Object.entries(data).map(([k, v]) => `${k}: ${v}`).join("\n");
        location.href = `mailto:${cfg.email}?subject=${encodeURIComponent(subjects[data.form] || "Peyalar Opare")}&body=${encodeURIComponent(body)}`;
        msg.className = "form-msg ok";
        msg.textContent = L("Your email app opened with the details. Press send to finish.", "আপনার ইমেইল অ্যাপে তথ্যগুলো খুলেছে। শেষ করতে সেন্ড চাপুন।");
      }
      btn.disabled = false;
    });
  }
  handleForm($("#volForm"));
  handleForm($("#reportForm"));
  handleForm($("#partnerForm"));

  /* =============== share =============== */
  const shareUrl = () => location.href.split("#")[0];
  const shareText = () => L("Peyalar Opare: winter support for tea garden workers in Bangladesh. Join in:",
    "পেয়ালার ওপারে: চা বাগানের শ্রমিকদের জন্য শীতের উষ্ণতা। পাশে থাকুন:");
  function renderShare() {
    const u = encodeURIComponent(shareUrl()), t = encodeURIComponent(shareText());
    const links = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
      whatsapp: `https://wa.me/?text=${t}%20${u}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
      x: `https://twitter.com/intent/tweet?text=${t}&url=${u}`
    };
    Object.entries(links).forEach(([k, v]) => { const a = $(`[data-share="${k}"]`); if (a) a.href = v; });
  }
  renderShare(); rerenders.push(renderShare);
  $('[data-share="copy"]').addEventListener("click", e => copyText(shareUrl(), e.currentTarget));
  const nativeBtn = $('[data-share="native"]');
  if (navigator.share) {
    nativeBtn.hidden = false;
    nativeBtn.addEventListener("click", () => navigator.share({ title: "Peyalar Opare", text: shareText(), url: shareUrl() }).catch(() => {}));
  }

  /* =============== pause looping animations in sections that are off screen =============== */
  if ("IntersectionObserver" in window) {
    const idleIO = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle("idle", !e.isIntersecting)), { rootMargin: "100px 0px" });
    $$("main > section, .hero .ticker").forEach(s => idleIO.observe(s));
  }

  /* =============== contact =============== */
  const ml = $("#mailLink"); ml.textContent = cfg.email || ""; ml.href = "mailto:" + (cfg.email || "");
  const pl = $("#phoneLink"); pl.textContent = cfg.phone || ""; pl.href = "tel:" + (cfg.phone || "").replace(/\s/g, "");
  $("#socials").innerHTML = Object.entries(cfg.socials || {}).filter(([, v]) => v)
    .map(([k, v]) => `<a href="${v}" target="_blank" rel="noopener">${k}</a>`).join("");
  $("#year").textContent = new Date().getFullYear();
})();
