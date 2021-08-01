import marked from "marked";
import hljs from "highlight.js";

const renderer = new marked.Renderer();
renderer.link = function (href, title, text) {
  return `<a target="_blank" href="${href}" title="${title}">${text}</a>`;
};

if (typeof window !== "undefined") {
  hljs.initHighlightingOnLoad();
}

marked.setOptions({
  gfm: true,
  headerIds: false,
  breaks: true,
  highlight: (code, lang) => {
    if (!lang) {
      return code;
    }
    const value = hljs.highlight(lang, code).value;
    return value;
  },
  renderer: renderer,
});

export default marked;
