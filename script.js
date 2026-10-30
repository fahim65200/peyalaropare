(function () {
  const cfg = window.SITE_CONFIG || {};
  const root = document.documentElement;

  /* ---------- Language ---------- */
  function setLang(lang) {
    root.setAttribute("data-lang", lang);
    root.setAttribute("lang", lang);
    try { localStorage.setItem("lang", lang); } catch (e) {}
  }
  let saved = null;
  try { saved = localStorage.getItem("lang"); } catch (e) {}
  const browserBn = (navigator.language || "").toLowerCase().startsWith("bn");
  setLang(saved || (browserBn ? "bn" : "en"));

  document.getElementById("langToggle").addEventListener("click", () => {
    setLang(root.getAttribute("data-lang") === "en" ? "bn" : "en");
  });

  /* ---------- Mobile menu ---------- */
  const nav = document.getElementById("nav");
  const menuBtn = document.getElementById("menuBtn");
  menuBtn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open);
  });
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));

  /* ---------- Donation amount ---------- */
  let amount = 1000;
  const label = document.getElementById("amountLabel");
  const gatewayBtn = document.getElementById("gatewayBtn");
  const custom = document.getElementById("customAmount");
  const buttons = document.querySelectorAll("#amounts button");

  function updateGateway() {
    label.textContent = "৳" + Number(amount).toLocaleString("en-IN");
    if (cfg.gatewayUrl) {
      gatewayBtn.href = cfg.gatewayUrl.replace("{amount}", encodeURIComponent(amount));
    } else {
      gatewayBtn.href = "#donate";
      gatewayBtn.removeAttribute("target");
      gatewayBtn.onclick = (e) => {
        e.preventDefault();
        alert(root.getAttribute("data-lang") === "bn"
          ? "অনলাইন পেমেন্ট শীঘ্রই চালু হবে। এখন বিকাশ/নগদ বা ব্যাংক ব্যবহার করুন।"
          : "Online payment is coming soon. Please use bKash/Nagad or bank transfer for now.");
      };
    }
  }
  buttons.forEach(b => b.addEventListener("click", () => {
    buttons.forEach(x => x.classList.remove("active"));
    b.classList.add("active");
    custom.value = "";
    amount = Number(b.dataset.amount);
    updateGateway();
  }));
  custom.addEventListener("input", () => {
    const v = Number(custom.value);
    if (v >= 10) {
      buttons.forEach(x => x.classList.remove("active"));
      amount = v;
      updateGateway();
    }
  });
  updateGateway();

  // Until a gateway link is added in config.js, hide the card box and amount chooser
  if (!cfg.gatewayUrl) {
    const box = gatewayBtn.closest(".pay-card");
    if (box) box.remove();
    document.getElementById("amounts").remove();
    document.querySelector(".pay-grid").classList.add("two");
  }

  /* ---------- Fill details from config ---------- */
  function fillList(id, obj) {
    const el = document.getElementById(id);
    if (!el) return;
    Object.entries(obj || {}).forEach(([k, v]) => {
      if (!v) return;
      const dt = document.createElement("dt"); dt.textContent = k;
      const dd = document.createElement("dd"); dd.textContent = v;
      el.append(dt, dd);
    });
    if (!el.children.length) {
      el.outerHTML = '<p class="small">Details coming soon / শীঘ্রই যোগ করা হবে</p>';
    }
  }
  fillList("walletList", cfg.wallets);
  fillList("bankList", cfg.bank);

  const reportBtn = document.getElementById("reportBtn");
  if (cfg.reportFormUrl) reportBtn.href = cfg.reportFormUrl;
  else if (cfg.email) reportBtn.href = "mailto:" + cfg.email + "?subject=Donation%20Transaction%20ID";

  const emailLink = document.getElementById("emailLink");
  emailLink.textContent = cfg.email || "";
  emailLink.href = cfg.email ? "mailto:" + cfg.email : "#";
  document.getElementById("phoneText").textContent = cfg.phone || "";

  const socials = document.getElementById("socials");
  Object.entries(cfg.socials || {}).forEach(([name, url]) => {
    if (!url) return;
    const a = document.createElement("a");
    a.href = url; a.textContent = name; a.target = "_blank"; a.rel = "noopener";
    socials.appendChild(a);
  });

  document.getElementById("year").textContent = new Date().getFullYear();
})();
