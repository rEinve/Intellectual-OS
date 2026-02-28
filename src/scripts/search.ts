import Fuse from "fuse.js";

export function initSearch(root: HTMLElement) {
  const input = root.querySelector<HTMLInputElement>(".search__input");
  const resultsEl = root.querySelector<HTMLDivElement>(".search__results");

  if (!input || !resultsEl) return;

  let fuse: Fuse<any> | null = null;
  let loading: Promise<void> | null = null;

  const BASE = import.meta.env.BASE_URL || "/";

  async function loadIndex() {
    if (fuse) return;
    if (loading) return loading;

    loading = (async () => {
      const url = new URL("api/search.json", window.location.origin + BASE);
      const res = await fetch(url.toString());

      if (!res.ok) {
        console.error("Search index fetch failed:", res.status);
        return;
      }

      const index = await res.json();

      fuse = new Fuse(index, {
        keys: [
          { name: "title", weight: 0.7 },
          { name: "content", weight: 0.3 },
        ],
        threshold: 0.35,
        ignoreLocation: true,
      });
    })();

    return loading;
  }

  function render(results: any[]) {
    if (!results?.length) {
      resultsEl.innerHTML = "";
      return;
    }

    resultsEl.innerHTML = results
      .slice(0, 10)
      .map(
        (r) => `
          <a class="search__item" href="/${r.item.slug}/">
            <div class="search__title">${r.item.title}</div>
          </a>
        `
      )
      .join("");
  }

  let timer: number | undefined;

  input.addEventListener("input", () => {
    clearTimeout(timer);
    timer = window.setTimeout(async () => {
      const query = input.value.trim();

      if (!query) {
        resultsEl.innerHTML = "";
        return;
      }

      await loadIndex();
      if (!fuse) return;

      const results = fuse.search(query);
      render(results);
    }, 120);
  });
}
