import "./style/index.scss";

export default (Vue, { head }) => {
  head.script.push({
    src: "https://kit.fontawesome.com/19e31512ed.js",
    crossorigin: "anonymous"
  })
};