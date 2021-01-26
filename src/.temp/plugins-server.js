import plugin_allanchain_gridsome_plugin_pwa_6 from "D:\\Projects\\node-chat-server\\node_modules\\@allanchain\\gridsome-plugin-pwa\\gridsome.client.js"

export default [
  {
    run: plugin_allanchain_gridsome_plugin_pwa_6,
    options: {"name":"chat","manifestOptions":{"short_name":"chat.veld","description":"zero-data chat application","display":"standalone","start_url":"/","categories":["education"],"lang":"en-GB","dir":"auto","background_color":"#000000"},"appleMobileWebAppStatusBarStyle":"default","manifestPath":"manifest.json","icon":"./static/favicon.png","msTileColor":"#1d1c21","workboxOptions":{"cacheId":"chat-veld","skipWaiting":true},"appleMobileWebAppCapable":"no","themeColor":"#00a672","maskableIcon":false,"workboxPluginMode":"generateSW","workboxCompileSrc":true,"msTileImage":"/assets/icons/msapplication-icon-144x144.png","appleMaskIcon":null,"publicPath":"/"}
  }
]
