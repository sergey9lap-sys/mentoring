gsap.registerPlugin(ScrollTrigger);

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const desktop = window.matchMedia("(min-width: 901px)");
const russianShortWords = new Set([
  "а", "без", "в", "во", "для", "до", "за", "и", "из", "к", "ко",
  "на", "не", "ни", "но", "о", "об", "от", "по", "под", "при",
  "про", "с", "со", "у"
]);

function bindRussianShortWords(root) {
  const pattern = /(^|[\s([«„"—–-])(а|без|в|во|для|до|за|и|из|к|ко|на|не|ни|но|о|об|от|по|под|при|про|с|со|у)\s+(?=[А-Яа-яЁё0-9«„"])/giu;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const textNodes = [];

  while (walker.nextNode()) {
    const node = walker.currentNode;
    const parent = node.parentElement;
    if (!parent || parent.closest("script, style, noscript, textarea, [data-no-typeset]")) continue;
    if (node.nodeValue.trim()) textNodes.push(node);
  }

  textNodes.forEach((node) => {
    node.nodeValue = node.nodeValue.replace(pattern, "$1$2\u00a0");
  });
}

bindRussianShortWords(document.body);

const contourLabels = document.querySelectorAll(".contour .eyebrow");
if (contourLabels[0]) contourLabels[0].textContent = "КОНТУР 1 · НЕДЕЛИ 1–3";
if (contourLabels[1]) contourLabels[1].textContent = "КОНТУР 2 · НЕДЕЛИ 4–6";

function closeSiblingAccordions(active) {
  document.querySelectorAll("details[open]").forEach((item) => {
    if (item !== active) item.removeAttribute("open");
  });
}

document.querySelectorAll("details").forEach((detail) => {
  detail.addEventListener("toggle", () => {
    if (detail.open) closeSiblingAccordions(detail);
  });
});

const problemStage = document.querySelector(".problem-track");
const problemCards = Array.from(document.querySelectorAll(".problem"));
const problemCounter = document.querySelector("[data-problem-current]");
let activeProblem = 0;
let problemTimer;

function showProblem(nextIndex, direction = 1) {
  if (!problemCards.length) return;
  const normalized = (nextIndex + problemCards.length) % problemCards.length;
  const current = problemCards[activeProblem];
  const next = problemCards[normalized];
  if (current === next && next.classList.contains("is-active")) return;

  current?.classList.remove("is-active");
  next.classList.add("is-active");

  activeProblem = normalized;
  problemCards.forEach((card, index) => card.setAttribute("aria-hidden", index === activeProblem ? "false" : "true"));
  if (problemCounter) problemCounter.textContent = String(activeProblem + 1).padStart(2, "0");
}

function startProblemRotation() {
  if (reducedMotion || problemCards.length < 2) return;
  window.clearInterval(problemTimer);
  problemTimer = window.setInterval(() => showProblem(activeProblem + 1, 1), 5600);
}

if (problemCards.length) {
  problemCards[0].classList.add("is-active");
  problemCards.forEach((card, index) => card.setAttribute("aria-hidden", index === 0 ? "false" : "true"));
  document.querySelector("[data-problem-prev]")?.addEventListener("click", () => { showProblem(activeProblem - 1, -1); startProblemRotation(); });
  document.querySelector("[data-problem-next]")?.addEventListener("click", () => { showProblem(activeProblem + 1, 1); startProblemRotation(); });
  problemStage?.addEventListener("mouseenter", () => window.clearInterval(problemTimer));
  problemStage?.addEventListener("mouseleave", startProblemRotation);
  startProblemRotation();
}

document.querySelectorAll("[data-widget-open]").forEach((button) => {
  button.addEventListener("click", () => {
    const modal = document.getElementById(button.dataset.widgetOpen);
    if (!(modal instanceof HTMLDialogElement)) return;
    modal.showModal();
    document.body.classList.add("modal-open");
  });
});

document.querySelectorAll(".widget-modal").forEach((modal) => {
  const closeModal = () => {
    modal.close();
    document.body.classList.remove("modal-open");
  };
  modal.querySelector("[data-widget-close]")?.addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });
  modal.addEventListener("close", () => document.body.classList.remove("modal-open"));
});

if (!reducedMotion) {
  const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });
  heroTimeline
    .from(".hero__visual", { opacity: 0, scale: 0.92, filter: "blur(12px)", duration: 1.15 })
    .from(".hero__kicker", { opacity: 0, y: 12, duration: 0.45 }, 0.25)
    .from(".hero h1", { opacity: 0, y: 28, filter: "blur(7px)", duration: 0.9 }, 0.34)
    .from(".hero__action-row", { opacity: 0, y: 18, duration: 0.65 }, 0.62)
    .from(".hero__facts", { opacity: 0, y: 12, duration: 0.55 }, 0.78);

  gsap.utils.toArray(".section-head").forEach((heading) => {
    gsap.from(heading, {
      opacity: 0,
      y: 26,
      filter: "blur(6px)",
      duration: 0.75,
      ease: "power3.out",
      scrollTrigger: { trigger: heading, start: "top 84%", once: true }
    });
  });

  gsap.from(".audience__item", {
    xPercent: -4,
    opacity: 0,
    duration: 0.7,
    stagger: 0.11,
    ease: "power3.out",
    scrollTrigger: { trigger: ".audience__list", start: "top 78%", once: true }
  });

  gsap.from(".experience-fit__grid article", {
    y: 38,
    opacity: 0,
    filter: "blur(6px)",
    duration: 0.72,
    stagger: 0.09,
    ease: "power3.out",
    scrollTrigger: { trigger: ".experience-fit__grid", start: "top 80%", once: true }
  });

  gsap.fromTo(".audience",
    { y: 120, clipPath: "inset(0 3% 0 3% round 44px 44px 0 0)" },
    {
      y: 0,
      clipPath: "inset(0 0 0 0 round 34px 34px 0 0)",
      ease: "none",
      scrollTrigger: {
        trigger: ".audience",
        start: "top 96%",
        end: "top 72%",
        scrub: 0.45
      }
    }
  );

  gsap.fromTo(".problems",
    { clipPath: "inset(0 0 100% 0)" },
    {
      clipPath: "inset(0 0 0% 0)",
      ease: "none",
      scrollTrigger: {
        trigger: ".problems",
        start: "top 95%",
        end: "top 48%",
        scrub: 0.55
      }
    }
  );

  const whyTitle = document.querySelector(".why__statement h2");
  if (whyTitle && desktop.matches) {
    const whyWords = whyTitle.textContent
      .trim()
      .split(/\s+/);

    whyTitle.innerHTML = whyWords
      .map((word, index) => {
        const normalized = word.toLocaleLowerCase("ru-RU").replace(/[.,:;!?«»"()]/g, "");
        const separator = index === whyWords.length - 1
          ? ""
          : russianShortWords.has(normalized) ? "&nbsp;" : " ";
        return `<span class="word">${word}</span>${separator}`;
      })
      .join("");

    gsap.to(".why__statement .word", {
      opacity: 1,
      stagger: 0.08,
      ease: "none",
      scrollTrigger: {
        trigger: ".why",
        start: "top 45%",
        end: "bottom 70%",
        scrub: 0.45
      }
    });
  }

  gsap.from(".path article", {
    y: 70,
    opacity: 0,
    duration: 0.85,
    stagger: 0.13,
    ease: "power3.out",
    scrollTrigger: { trigger: ".path", start: "top 75%", once: true }
  });

  gsap.fromTo(".result-path",
    { y: 82, scale: 0.985, clipPath: "inset(0 2% 0 2% round 30px 30px 0 0)" },
    {
      y: 0,
      scale: 1,
      clipPath: "inset(0 0 0 0 round 30px 30px 0 0)",
      ease: "none",
      scrollTrigger: {
        trigger: ".result-path",
        start: "top 96%",
        end: "top 54%",
        scrub: 0.55
      }
    }
  );

  gsap.utils.toArray(".contour").forEach((contour, index) => {
    gsap.from(contour, {
      yPercent: index === 0 ? 8 : 13,
      clipPath: "inset(12% 0 0 0 round 24px 24px 0 0)",
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: contour,
        start: "top 82%",
        once: true
      }
    });

    const intro = contour.querySelector(".contour__intro");
    const topics = contour.querySelector(".contour__topics");
    const items = Array.from(contour.querySelectorAll("li"));
    const focusLine = contour.querySelector(".contour__focus-line");
    const pairs = [[items[0], items[5]], [items[1], items[6]], [items[2], items[7]], [items[3], items[8]], [items[4]]]
      .map((pair) => pair.filter(Boolean));

    const topicsTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: contour,
        start: "top 66%",
        once: true
      }
    });

    topicsTimeline
      .from(intro.children, {
        y: 18,
        opacity: 0.25,
        filter: "blur(5px)",
        duration: 0.55,
        stagger: 0.06,
        ease: "power3.out"
      })
      .fromTo(focusLine, {
        y: -80,
        opacity: 0
      }, {
        y: () => topics.offsetHeight + 80,
        opacity: 0.85,
        duration: 1.25,
        ease: "power2.inOut"
      }, 0.12);

    pairs.forEach((pair, rowIndex) => {
      topicsTimeline.from(pair, {
        x: (item) => items.indexOf(item) < 5 ? -34 : 34,
        opacity: 0.18,
        filter: "blur(7px)",
        clipPath: (item) => items.indexOf(item) < 5
          ? "inset(0 35% 0 0 round 12px)"
          : "inset(0 0 0 35% round 12px)",
        duration: 0.58,
        ease: "power3.out"
      }, 0.18 + rowIndex * 0.16);
    });

    topicsTimeline.to(focusLine, { opacity: 0, duration: 0.25 }, 1.18);
  });

  gsap.from(".tariff", {
    y: 58,
    opacity: 0,
    filter: "blur(7px)",
    duration: 0.85,
    stagger: 0.12,
    ease: "power3.out",
    scrollTrigger: { trigger: ".tariffs__grid", start: "top 75%", once: true }
  });

  gsap.from(".corporate-tariff > div", {
    y: 34,
    opacity: 0,
    filter: "blur(5px)",
    duration: 0.72,
    stagger: 0.1,
    ease: "power3.out",
    scrollTrigger: { trigger: ".corporate-tariff", start: "top 78%", once: true }
  });

  gsap.from(".author__photo img", {
    scale: 0.88,
    opacity: 0.45,
    ease: "none",
    scrollTrigger: {
      trigger: ".author",
      start: "top 82%",
      end: "center center",
      scrub: 0.55
    }
  });

  if (desktop.matches) {
    gsap.fromTo(".outcomes",
      { y: 92, clipPath: "inset(0 2% 0 2% round 30px 30px 0 0)" },
      {
        y: 0,
        clipPath: "inset(0 0 0 0 round 30px 30px 0 0)",
        ease: "none",
        scrollTrigger: {
          trigger: ".outcomes",
          start: "top 98%",
          end: "top 56%",
          scrub: 0.5
        }
      }
    );
  }

  if (desktop.matches) {
    ScrollTrigger.create({
      trigger: ".why",
      start: "top top+=84",
      end: "bottom bottom",
      pin: ".why__statement",
      pinSpacing: false
    });

    gsap.utils.toArray(".why__points article").forEach((item, index) => {
      gsap.from(item, {
        x: 70,
        opacity: 0.25,
        filter: "blur(5px)",
        ease: "none",
        scrollTrigger: {
          trigger: item,
          start: "top 88%",
          end: "top 53%",
          scrub: 0.4
        }
      });
    });

    ScrollTrigger.create({
      trigger: ".practice",
      start: "top top+=84",
      end: "bottom bottom",
      pin: ".practice__aside",
      pinSpacing: false,
      anticipatePin: 1
    });

    gsap.utils.toArray(".practice__grid article").forEach((card, index) => {
      gsap.from(card, {
        y: 50 + index * 12,
        opacity: 0.35,
        scale: 0.96,
        ease: "none",
        scrollTrigger: {
          trigger: card,
          start: "top 88%",
          end: "top 52%",
          scrub: 0.45
        }
      });
    });
  }
}

window.addEventListener("load", () => ScrollTrigger.refresh());
