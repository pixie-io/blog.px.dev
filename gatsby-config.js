const activeEnv = process.env.GATSBY_ACTIVE_ENV || process.env.NODE_ENV || 'dev';

require('dotenv').config({
  path: `.env.${activeEnv}`,
});

module.exports = {
  siteMetadata: {
    title: 'Pixie Labs Blog',
    description: 'Pixie Blog',
    author: 'Pixie Labs Inc.',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-scroll-reveal',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/content/blog`,
        name: 'posts',
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 645,
            },
          },
        ],
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/content/pages`,
        name: 'pages',
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'gatsby-starter-default',
        short_name: 'starter',
        start_url: '/',
        background_color: '#132E38',
        theme_color: '#132E38',
        display: 'minimal-ui',
        icon: 'src/images/p_circle_big.png', // This path is relative to the root of the site.
        include_favicon: false,
      },
    },
    {
      resolve: 'gatsby-plugin-segment-js',
      options: {
        prodKey: '3CJpc8eFGKdlIRqUFqRta0lVYFzXyJeo',
        devKey: 'vGjQ5dHvJnp0akb0wxnPMjd2YQWqNLwt',
        trackPage: true,
      },
    },
    {
      resolve: 'gatsby-plugin-sass',
      options: {
        includePaths: ['node_modules', './src/scss'],
      },
    },
    {
      resolve: 'gatsby-plugin-google-fonts',
      options: {
        fonts: [
          'Montserrat:300,400,700',
        ],
        display: 'block',
      },
    },
    {
      resolve: 'gatsby-plugin-sass',
      options: {
        includePaths: ['node_modules', './src/scss'],
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
};
