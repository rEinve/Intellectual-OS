import { visit } from "unist-util-visit";
import { toString } from "hast-util-to-string";

type HastElement = {
  type: "element";
  tagName: string;
  properties?: Record<string, any>;
  children?: any[];
};

function isElement(node: any): node is HastElement {
  return node && node.type === "element" && typeof node.tagName === "string";
}

function parseCalloutMarker(text: string) {
  // Matches:
  // [!NOTE]
  // [!NOTE]+
  // [!NOTE]-
  const m = text.match(/^\s*\[!([A-Za-z0-9_-]+)\]\s*([+-])?\s*(.*)\s*$/);
  if (!m) return null;

  const type = m[1].toLowerCase();
  const fold = m[2] === "+" ? "open" : m[2] === "-" ? "closed" : "none";
  const title = (m[3] || "").trim();

  return { type, fold, title };
}

export function rehypeObsidianCallouts() {
  return (tree: any) => {
    visit(tree, "element", (node: any, index: number | null, parent: any) => {
      if (!parent || index == null) return;
      if (!isElement(node) || node.tagName !== "blockquote") return;

      const first = node.children?.[0];
      if (!isElement(first) || first.tagName !== "p") return;

      const firstText = toString(first);
      const parsed = parseCalloutMarker(firstText);
      if (!parsed) return;

      // Remove the marker line from the first paragraph content.
      // We rebuild the first paragraph to contain only the title (if provided) and keep the rest.
      const titleText = parsed.title || parsed.type;

      // Build callout header
      const header: HastElement = {
        type: "element",
        tagName: "div",
        properties: { className: ["callout__head"] },
        children: [
          {
            type: "element",
            tagName: "span",
            properties: { className: ["callout__icon"], "aria-hidden": "true" },
            children: [],
          },
          {
            type: "element",
            tagName: "span",
            properties: { className: ["callout__label"] },
            children: [{ type: "text", value: titleText }],
          },
        ],
      };

      // Drop the marker paragraph entirely, *unless* it has more than just the marker.
      // In Obsidian, anything after the marker on the same line is considered a title.
      // We've already extracted it into the header, so remove that first <p>.
      const remainingChildren = (node.children ?? []).slice(1);

      // Callout body wrapper
      const body: HastElement = {
        type: "element",
        tagName: "div",
        properties: { className: ["callout__body"] },
        children: remainingChildren.length ? remainingChildren : [],
      };

      // Optional folding using <details>
      const baseProps = {
        className: ["callout"],
        "data-callout": parsed.type,
      };

      if (parsed.fold !== "none") {
        const details: HastElement = {
          type: "element",
          tagName: "details",
          properties: {
            ...baseProps,
            open: parsed.fold === "open" ? true : undefined,
          },
          children: [
            {
              type: "element",
              tagName: "summary",
              properties: { className: ["callout__summary"] },
              children: header.children ?? [],
            },
            body,
          ],
        };

        parent.children[index] = details;
        return;
      }

      // Non-folding callout
      const callout: HastElement = {
        type: "element",
        tagName: "aside",
        properties: baseProps,
        children: [header, body],
      };

      parent.children[index] = callout;
    });
  };
}
