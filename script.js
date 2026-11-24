const LINKS = {
  github: "https://github.com/abneesh447",
  linkedin: "https://www.linkedin.com/in/abneeshpatel9",
  leetcode: "https://leetcode.com/u/astri_/",
  codeforces: "https://codeforces.com/profile/astri_",
  agentPy: "https://github.com/abneesh447/agent-py",
  orgmind: "https://github.com/abneesh447/orgmind",
  orgmindLive: "https://orgmind-ruddy.vercel.app/",
  ragrabbit: "https://github.com/abneesh447/RagRabbit",
  ragrabbitLive: "https://ragrabbit-ashen.vercel.app/",
  snaplink: "https://github.com/abneesh447/Snaplink",
  snaplinkLive: "https://snaplink-three-mocha.vercel.app/",
};
document.querySelectorAll("[data-href]").forEach((a) => {
  const url = LINKS[a.dataset.href];
  if (url) { a.href = url; a.target = "_blank"; a.rel = "noopener"; }
});
document.getElementById("year").textContent = new Date().getFullYear();
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

// theme
const root = document.documentElement;
document.getElementById("theme").addEventListener("click", () => {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = next;
  try { localStorage.setItem("theme2", next); } catch (e) {}
});

// clock
const clock = document.getElementById("clock");
const tick = () => (clock.textContent = new Date().toLocaleTimeString("en-US", { timeZone: "Asia/Kolkata", hour: "numeric", minute: "2-digit" }));
tick(); setInterval(tick, 15000);

// sun arc: position by current IST time (6am -> 6pm across the arc)
(() => {
  const sun = document.getElementById("sun"), fg = document.getElementById("arcFg"), word = document.getElementById("dayword");
  const place = () => {
    const [h, m] = new Date().toLocaleTimeString("en-GB", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: false }).split(":").map(Number);
    const hrs = h + m / 60, day = hrs >= 6 && hrs <= 18;
    const p = day ? (hrs - 6) / 12 : ((hrs + 6) % 24) / 12;
    const a = Math.PI * (1 - p), x = 150 + 130 * Math.cos(a), y = 110 - 96 * Math.sin(a);
    sun.setAttribute("cx", x.toFixed(1)); sun.setAttribute("cy", Math.min(110, y).toFixed(1));
    sun.classList.toggle("moon", !day);
    const len = fg.getTotalLength(); fg.style.strokeDasharray = len; fg.style.strokeDashoffset = len * (1 - p);
    document.getElementById("tickL").textContent = day ? "6 AM" : "6 PM";
    document.getElementById("tickM").textContent = day ? "noon" : "midnight";
    document.getElementById("tickR").textContent = day ? "6 PM" : "6 AM";
    word.textContent = day ? (hrs < 12 ? "good morning" : hrs < 17 ? "good afternoon" : "golden hour") : "probably coding";
  };
  place(); setInterval(place, 60000);
})();

// marquee duplicate for seamless loop
document.querySelectorAll(".track").forEach((t) => (t.innerHTML += t.innerHTML));

// spotlight
document.querySelectorAll(".spot").forEach((c) => c.addEventListener("pointermove", (e) => {
  const r = c.getBoundingClientRect();
  c.style.setProperty("--mx", e.clientX - r.left + "px");
  c.style.setProperty("--my", e.clientY - r.top + "px");
}));

// count up
const countUp = (el) => {
  const target = parseFloat(el.dataset.count), dec = +el.dataset.dec || 0;
  if (reduce) { el.textContent = target.toFixed(dec); return; }
  const t0 = performance.now(), dur = 1400;
  const step = (t) => {
    const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
    el.textContent = (target * e).toFixed(dec);
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

// reveal
const io = new IntersectionObserver((entries) => entries.forEach((e) => {
  if (!e.isIntersecting) return;
  e.target.classList.add("in");
  e.target.querySelectorAll("[data-count]").forEach(countUp);
  if (e.target.dataset.count) countUp(e.target);
  io.unobserve(e.target);
}), { threshold: 0.15 });
document.querySelectorAll(".hero .reveal").forEach((el, i) => (el.style.transitionDelay = i * 110 + "ms"));
document.querySelectorAll(".bento .reveal").forEach((el, i) => (el.style.transitionDelay = i * 70 + "ms"));
document.querySelectorAll(".proj-grid .reveal").forEach((el, i) => (el.style.transitionDelay = (i % 2) * 120 + "ms"));
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// active nav
const navLinks = [...document.querySelectorAll(".links a")];
const spy = new IntersectionObserver((entries) => entries.forEach((e) => {
  if (e.isIntersecting) navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
}), { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll("main section[id]").forEach((s) => spy.observe(s));

// resume — force file download instead of in-browser preview
document.getElementById("resume")?.addEventListener("click", async (e) => {
  e.preventDefault();
  const link = e.currentTarget;
  const name = link.getAttribute("download") || "Abneesh_Resume.pdf";
  try {
    const res = await fetch(link.href);
    if (!res.ok) throw new Error("fetch failed");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch {
    link.removeAttribute("download");
    link.click();
  }
});

// copy email
const copyBtn = document.getElementById("copy"), copyText = document.getElementById("copyText");
copyBtn.addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(copyBtn.dataset.email); } catch (e) {}
  copyText.textContent = "Copied to clipboard ✓";
  setTimeout(() => (copyText.textContent = copyBtn.dataset.email), 1800);
});
