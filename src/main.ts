import "./style/index.scss";
import "./connection";
import Vuex from 'vuex';
import { store } from "./store";
import DOMPurify from "dompurify";
import { connect, waitForReady } from "@/connection";

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

export default (Vue, { router, head, isClient, appOptions }): void => {
  Vue.use(Vuex);

  connect();

  router.beforeEach((to, from, next) => {
    waitForReady().then(next);
  });

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
    href: "https://use.typekit.net/cep5qnb.css"
  });

  head.link.push({
    rel: "apple-touch-icon",
    sizes: "180x180",
    href: "/apple-touch-icon.png",
  });

  head.link.push({
    rel: "icon",
    type: "image/png",
    sizes: "32x32",
    href: "/favicon-32x32.png"
  });

  head.link.push({
    rel: "icon",
    type: "image/png",
    sizes: "16x16",
    href: "/favicon-16x16.png"
  });

  head.link.push({
    rel: "mask-icon",
    href: "/safari-pinned-tab.svg",
    color: "#eb496a",
  });

  head.meta.push({
    name: "msapplication-TileColor",
    content: "#eb496a",
  });

  head.meta.push({
    name: "theme-color",
    content: "#eb496a"
  })
};
