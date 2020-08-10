// This is where project configuration and plugin options are located.
// Learn more: https://gridsome.org/docs/config

// Changes here require a server restart.
// To restart press CTRL + C in terminal and run `gridsome develop`

module.exports = {
  siteName: 'chat',
  plugins: [
    {
      use: 'gridsome-plugin-typescript',
    },
    {
      use: '@allanchain/gridsome-plugin-pwa',
      options: {
        manifestOptions: {
          short_name: 'chat.veld',
          description: 'zero-data chat application',
          display: 'standalone',
          gcm_sender_id: undefined,
          start_url: '/',
          categories: ['education'],
          lang: 'en-GB',
          dir: 'auto'
        },
        appleMobileWebAppStatusBarStyle: 'default',
        manifestPath: 'manifest.json',
        icon: "./static/favicon.png",
        msTileColor: '#1d1c21',
        workboxOptions: {
          cacheId: 'chat-veld',
          skipWaiting: true
        }
      }
    }
  ]
}
