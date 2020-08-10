import "./style/index.scss";

if (process.isClient) {
  require("codemirror/addon/display/placeholder");
}

export default (Vue, { head, isClient }): void => {
  if (isClient && process.env.NODE_ENV === 'production') {
    require('./registerServiceWorker')
  }

  head.script.push({
    src: "https://kit.fontawesome.com/19e31512ed.js",
    crossorigin: "anonymous"
  })
};

/*
<meta name="theme-color" content="#ffffff">
*/