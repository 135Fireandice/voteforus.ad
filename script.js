
/* ---------- Custom cursor ---------- */
const cursor = document.getElementById("cursor");
let cx = -100, cy = -100, tx = -100, ty = -100;
window.addEventListener("mousemove", (e) => {
  tx = e.clientX; ty = e.clientY;
});
function cursorLoop() {
  cx += (tx - cx) * 0.18;
  cy += (ty - cy) * 0.18;
  if (cursor) cursor.style.transform = `translate(${cx - 14}px, ${cy - 14}px)`;
  requestAnimationFrame(cursorLoop);
}
cursorLoop();

/* ---------- Scroll-reveal ---------- */
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal-up").forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 0.1}s`;
  io.observe(el);
});

///* ---------- DECONSTRUCTION effect ----------///
   
const decoWord = document.getElementById("decoWord");
const decoLetters = decoWord ? Array.from(decoWord.children) : [];
const palette = ["#470cb8", "#e32d29", "#e64f18", "#fbd608", "#89d354"];

function updateDeconstruct() {
  if (!decoWord) return;
  const rect = decoWord.getBoundingClientRect();
  const vh = window.innerHeight;
  // progress: 0 when word enters from bottom, 1 when it leaves at top
  const progress = Math.max(0, Math.min(1,
    1 - (rect.top + rect.height / 2) / vh
  ));
  const total = decoLetters.length;

  decoLetters.forEach((el, i) => {
    const eased = progress;
    const offsetX = (i - total / 2) * 30 * eased;
    const offsetY = Math.sin(i * 1.2) * 80 * eased;
    const rotate = (i % 2 === 0 ? -1 : 1) * (15 + i * 2) * eased;
    el.style.transform =
      `translate(${offsetX}px, ${offsetY}px) rotate(${rotate}deg)`;

    // Colour shift through palette as progress advances
    const colorIdx = Math.min(palette.length - 1,
      Math.floor(progress * palette.length * (i / total + 0.5)));
    el.style.color = progress > 0.05 ? palette[colorIdx] : "#f5f1ff";
  });
}

/* ---------- Hero parallax orbs ---------- */
const orbs = document.querySelectorAll(".orb");
function updateParallax() {
  const y = window.scrollY;
  orbs.forEach((o, i) => {
    o.style.transform = `translateY(${y * (0.2 + i * 0.1)}px)`;
  });
}

/* Throttled scroll handler */
let ticking = false;
window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateDeconstruct();
      updateParallax();
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

updateDeconstruct();

/* ---------- Smooth-scroll anchor links ---------- */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (id && id.length > 1) {
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  });
});
