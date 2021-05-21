module.exports = {
  siteMetadata: {
    title: `Veld.Chat`,
    description: `Pretty epic`,
    author: `@veld`,
  },
  plugins: [
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/static`,
      },
    },
    `gatsby-plugin-sass`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `static/android-chrome-192x192.png`, // This path is relative to the root of the site.
      },
    },
    `gatsby-plugin-offline`,
  ],
}
