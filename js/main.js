const siteRoot = document.getElementById("siteRoot");

async function loadSections() {
  try {
    const response = await fetch("data/sections.json");
    const sections = await response.json();
    renderSite(sections);
  } catch (error) {
    console.error("Failed to load sections.json", error);
    siteRoot.innerHTML = `
      <section class="fallback">
        <h1>ELF: Break the Machine</h1>
        <p>Unable to load site data.</p>
      </section>
    `;
  }
}

function renderSite(sections) {
  siteRoot.innerHTML = "";

  const nav = buildNav();
  siteRoot.appendChild(nav);

  sections.forEach((section, index) => {
    const sectionEl = buildSection(section, index);
    siteRoot.appendChild(sectionEl);
  });

  initScrollReveal();
  initCopyButtons();
}

function buildNav() {
  const nav = document.createElement("header");
  nav.className = "siteNav";

  nav.innerHTML = `
    <a class="navBrand" href="#hero">Exit Liquidity Farmers</a>

    <nav class="navLinks">
      <a href="#machine">Machine</a>
      <a href="#thesis">Thesis</a>
      <a href="#engine">Engine</a>
<a class="navSocialButton" href="https://t.me/Exit_LiquidityFarmersPortal" target="_blank">TG</a>
<a class="navSocialButton" href="https://x.com/elvenfarmer" target="_blank">X</a>
      <a href="https://elfbreak.xyz">Play</a>
    </nav>
  `;

  return nav;
}

function buildSection(section) {
  const el = document.createElement("section");

  el.id = section.id;
  el.className = `pageSection ${section.type}Section ${section.side === "left" ? "characterLeft" : "characterRight"}`;

  el.style.backgroundImage = `url('${section.background}')`;

  const characterClass = section.side === "left" ? "overlayLeft" : "overlayRight";
  const panelClass = section.type === "hero" ? "heroPanel" : "storyPanel";

  el.innerHTML = `
    <div class="sectionShade"></div>

    <img
      class="characterOverlay ${characterClass}"
      src="${section.character}"
      alt=""
      onerror="console.log('Missing character image:', this.src);"
    />

    <div class="contentWrap reveal">
      <div class="${panelClass}">
        <div class="panelContent floatingText">
          <p class="eyebrow">${section.eyebrow}</p>
          <h1>${section.title}</h1>
          <p class="bodyText">${section.body}</p>

          ${buildContractButton(section)}
          ${buildVideo(section)}
          ${buildButtons(section)}
        </div>
      </div>
    </div>
  `;

  return el;
}

function buildButtons(section) {
  const buttons = [];

  if (section.primaryButton) {
    buttons.push(`
      <a class="assetButton primaryAction" href="${section.primaryButton.href}">
        <span>${section.primaryButton.label}</span>
      </a>
    `);
  }

  if (section.secondaryButton) {
    buttons.push(`
      <a class="assetButton secondaryAction" href="${section.secondaryButton.href}">
        <span>${section.secondaryButton.label}</span>
      </a>
    `);
  }

  if (!buttons.length) return "";

  return `<div class="buttonRow">${buttons.join("")}</div>`;
}

function buildContractButton(section) {
  if (section.type !== "hero") return "";

  return `
    <div class="contractBox">
      <button class="copyButton" data-ca="${section.contractAddress || ""}">
        Copy CA
      </button>
      <span class="contractText">${section.contractAddress || "CA coming soon"}</span>
    </div>
  `;
}

function buildVideo(section) {
  if (section.type !== "video") return "";

  return `
    <div class="videoFrame">
      <video controls poster="${section.poster}">
        <source src="${section.video}" type="video/quicktime" />
      </video>
    </div>
  `;
}

function initCopyButtons() {
  const buttons = document.querySelectorAll(".copyButton");

  buttons.forEach(button => {
    button.addEventListener("click", async () => {
      const ca = button.dataset.ca;

      if (!ca || ca === "PASTE_CA_HERE") return;

      await navigator.clipboard.writeText(ca);

      const originalText = button.textContent;
      button.textContent = "Copied";

      setTimeout(() => {
        button.textContent = originalText;
      }, 1200);
    });
  });
}

function initScrollReveal() {
  const revealEls = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("isVisible");
        }
      });
    },
    { threshold: 0.2 }
  );

  revealEls.forEach(el => observer.observe(el));
}

loadSections();
