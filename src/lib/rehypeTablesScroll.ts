import wrapAll from "rehype-wrap-all";

/**
 * Wraps every <table> with:
 * <div class="table-wrap"><table>...</table></div>
 * so wide tables scroll horizontally without breaking layout.
 */
export function rehypeTablesScroll() {
  return wrapAll("table", "div", { className: "table-wrap" });
}
