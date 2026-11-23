// The HTML is the publication catalogue. Index its existing entries for search.
(() => {
  const toolbar = document.querySelector(".pub-toolbar");
  if (!toolbar) return;

  const search = toolbar.querySelector("input");
  const topic = toolbar.querySelector("select");
  const count = document.getElementById("result-count");
  const reset = document.getElementById("reset-filters");
  const entries = Array.from(document.querySelectorAll(".publication"), article => {
    const topics = article.dataset.topics.split("|");
    const text = [".pub-aside", "h3", ".byline", ".venue", ".pub-description"]
      .map(selector => article.querySelector(selector).innerText)
      .concat(topics).join(" ").toLowerCase().replace(/\s+/g, " ");
    return { article, topics, text };
  });

  const topics = new Set(entries.flatMap(entry => entry.topics));
  for (const name of [...topics].sort()) topic.add(new Option(name, name));

  function filter() {
    const query = search.value.trim().toLowerCase();
    let matches = 0;
    for (const entry of entries) {
      const matchesTopic = topic.selectedIndex === 0 || entry.topics.includes(topic.value);
      entry.article.hidden = !(matchesTopic && entry.text.includes(query));
      if (!entry.article.hidden) matches++;
    }
    count.textContent = matches
      ? matches + (matches === 1 ? " publication" : " publications")
      : "No publications match these filters.";
    reset.hidden = !query && topic.selectedIndex === 0;
  }

  search.addEventListener("input", filter);
  topic.addEventListener("change", filter);
  reset.addEventListener("click", () => {
    search.value = "";
    topic.selectedIndex = 0;
    filter();
    search.focus();
  });
  toolbar.hidden = false;
  count.hidden = false;
  filter();
})();
