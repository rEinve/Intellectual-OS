import { initSearch } from "./search";

document.querySelectorAll<HTMLElement>("[data-search]").forEach((root) => {
  initSearch(root);
});
