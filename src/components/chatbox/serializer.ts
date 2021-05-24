import { SlateElement, SlateText } from "./types";

export function serialize(elements: SlateElement[]): string {
  return elements.map(serializeElement).filter(Boolean).join("\n");
}

function serializeElement(element: SlateElement): string {
  switch (element.type) {
    case "paragraph":
      return serializeParagraph(element);

    case "code":
      return serializeCode(element);

    default:
      return null;
  }
}

function serializeParagraph(element: SlateElement): string {
  return element.children.map(serializeLeaf).join("");
}

function serializeCode(element: SlateElement): string {
  return "```\n" + element.children.map((x) => x.text.trim).join("") + "\n```";
}

function serializeLeaf(text: SlateText): string {
  let prefix = [text.bold && "**", text.code && "`", text.italic && "_"].filter(
    Boolean
  );

  let value = text.text;
  let start = "";
  let end = "";

  if (prefix.length != 0 && value.trim().length != value.length) {
    value = value.trim();
    start = text.text.startsWith(" ") ? " " : "";
    end = text.text.endsWith(" ") ? " " : "";
  }

  const result = `${start}${prefix.join("")}${value}${prefix
    .reverse()
    .join("")}${end}`;

  return result;
}
