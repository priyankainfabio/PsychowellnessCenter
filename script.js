const revealItems = document.querySelectorAll(".section-reveal");

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

revealItems.forEach((item) => revealObserver.observe(item));

const heroVisual = document.querySelector(".hero-visual");
const chips = document.querySelectorAll(".care-chip");

if (heroVisual && window.matchMedia("(pointer: fine)").matches) {
  heroVisual.addEventListener("mousemove", (event) => {
    const rect = heroVisual.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    chips.forEach((chip, index) => {
      const strength = 8 + index * 1.4;
      chip.style.marginLeft = `${x * strength}px`;
      chip.style.marginTop = `${y * strength}px`;
    });
  });

  heroVisual.addEventListener("mouseleave", () => {
    chips.forEach((chip) => {
      chip.style.marginLeft = "0px";
      chip.style.marginTop = "0px";
    });
  });
}

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  document.documentElement.style.setProperty("--scroll-glow", `${Math.min(scrollY / 900, 1)}`);
}, { passive: true });

const statNumbers = document.querySelectorAll(".stat-number");

const animateStat = (item) => {
  const target = Number(item.dataset.target || 0);
  const decimals = Number(item.dataset.decimals || 0);
  const suffix = item.dataset.suffix || "";
  const duration = 1400;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;
    item.textContent = `${value.toFixed(decimals)}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(tick);
      return;
    }

    item.textContent = `${target.toFixed(decimals)}${suffix}`;
  };

  requestAnimationFrame(tick);
};

if (statNumbers.length) {
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      statNumbers.forEach(animateStat);
      statObserver.disconnect();
    });
  }, { threshold: 0.3 });

  statObserver.observe(document.querySelector(".stats"));
}
