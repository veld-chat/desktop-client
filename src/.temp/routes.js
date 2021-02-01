const c1 = () => import(/* webpackChunkName: "page--src-pages-settings-vue" */ "C:\\Sources\\veld\\src\\pages\\settings.vue")
const c2 = () => import(/* webpackChunkName: "page--node-modules-gridsome-app-pages-404-vue" */ "C:\\Sources\\veld\\node_modules\\gridsome\\app\\pages\\404.vue")
const c3 = () => import(/* webpackChunkName: "page--src-pages-index-vue" */ "C:\\Sources\\veld\\src\\pages\\index.vue")

export default [
  {
    path: "/settings/",
    component: c1
  },
  {
    name: "404",
    path: "/404/",
    component: c2
  },
  {
    name: "home",
    path: "/",
    component: c3
  },
  {
    name: "*",
    path: "*",
    component: c2
  }
]
