import "./style/index.scss";
import "./connection";
import Vuex from 'vuex';
import { store } from "./store";
import DOMPurify from "dompurify";

if (process.isClient) {
  require("codemirror/addon/display/placeholder");

  DOMPurify.addHook("afterSanitizeAttributes", function (currentNode) {
    if (currentNode.tagName === "A") {
      currentNode.textContent = currentNode.getAttribute("href");
      currentNode.setAttribute("target", "_blank");
    }
    return currentNode;
  });
}

export default (Vue, { head, isClient, appOptions }): void => {
  Vue.use(Vuex);

  appOptions.store = store;

  if (isClient && process.env.NODE_ENV === 'production') {
    require('./registerServiceWorker')
  }

  head.script.push({
    src: "https://kit.fontawesome.com/19e31512ed.js",
    crossorigin: "anonymous"
  });

  head.link.push({
    rel: "stylesheet",
    href: "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.5.0/styles/rainbow.min.css"
  });

  head.link.push({
    rel: "apple-touch-icon",
    sizes: "180x180",
    href: "/apple-touch-icon.png",
  });
};
