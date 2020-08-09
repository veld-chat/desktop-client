import "./style/index.scss";
import vuex from "vuex";

export default (Vue, { head }): void => {
  Vue.use(vuex);

  head.script.push({
    src: "https://kit.fontawesome.com/19e31512ed.js",
    crossorigin: "anonymous"
  })
};