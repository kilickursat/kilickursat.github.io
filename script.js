(() => {
  const hero = document.querySelector(".hero");
  const views = hero.querySelector(".scene-views");
  const plate = hero.querySelector(".hero-plate");
  const mobileSource = plate.querySelector("source");
  const artwork = plate.querySelector("img");
  const cutawayDescription = artwork.alt;
  function showView(choice) {
    const base = "assets/" + choice.dataset.asset;
    hero.dataset.view = choice.value;
    mobileSource.srcset = base + "-mobile.webp";
    artwork.srcset = base + "-1200.webp 1200w, " + base + "-1920.webp 1920w";
    artwork.src = base + "-1200.webp";
    artwork.alt = choice.dataset.alt || cutawayDescription;
  }
  views.addEventListener("change", event => showView(event.target));
  // Browsers may restore a radio selection when returning to the portfolio.
  window.addEventListener("pageshow", () => {
    const selected = views.querySelector(":checked");
    if (hero.dataset.view !== selected.value) showView(selected);
  });
  views.hidden = false;

  const menu = document.querySelector(".mobile-nav");
  menu.addEventListener("click", event => {
    const link = event.target.closest("a");
    if (!link) return;
    menu.open = false;
    const target = document.getElementById(link.hash.slice(1));
    if (target) {
      target.tabIndex = -1;
      target.focus({ preventScroll: true });
    }
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && menu.open) {
      menu.open = false;
      menu.querySelector("summary").focus();
    }
  });
  document.addEventListener("click", event => {
    if (menu.open && !menu.contains(event.target)) menu.open = false;
  });

  // The visible citation doubles as a selectable fallback if copying is blocked.
  function selectCitation(paragraph) {
    const range = document.createRange();
    range.selectNodeContents(paragraph);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }

  const status = document.getElementById("copy-status");
  for (const button of document.querySelectorAll(".copy-citation")) {
    const details = button.parentElement.querySelector(".citation");
    const citation = details.querySelector("p");
    const publication = button.closest("article").querySelector("h3").textContent;
    let timer;
    button.hidden = false;
    button.addEventListener("click", async () => {
      clearTimeout(timer);
      let copied = false;
      try {
        await navigator.clipboard.writeText(citation.textContent.trim());
        copied = true;
      } catch {
        const wasOpen = details.open;
        details.open = true;
        selectCitation(citation);
        try {
          copied = document.execCommand("copy");
        } catch {
          copied = false;
        }
        if (copied) {
          window.getSelection().removeAllRanges();
          details.open = wasOpen;
        }
      }
      button.textContent = copied ? "Copied" : "Citation selected";
      status.textContent = copied
        ? "Citation copied for " + publication
        : "Citation selected. Use your device’s copy command.";
      timer = setTimeout(() => { button.textContent = "Copy citation"; }, 2500);
    });
  }
})();
