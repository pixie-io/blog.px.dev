const activeEnv = process.env.GATSBY_ACTIVE_ENV || process.env.NODE_ENV || 'dev';
const containers = require('remark-containers');
const unwrapImages = require('remark-unwrap-images');

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
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/content/pages`,
        name: 'pages',
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/content`,
        name: 'data',
      },
    },
    {
      resolve: 'gatsby-plugin-mdx',
      options: {
        gatsbyRemarkPlugins: [
          {
            resolve: 'gatsby-remark-relative-images',
          },
          {
            resolve: 'gatsby-remark-images',
            options: {
              maxWidth: 1035,
              showCaptions: true,
              markdownCaptions: false,
            },
          },
          {
            resolve: 'gatsby-remark-copy-linked-files',
          },
        ],
        remarkPlugins: [containers, unwrapImages],
        extensions: ['.mdx', '.md'],
      },
    },
    'gatsby-transformer-yaml',
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    'gatsby-plugin-styled-components',
    'gatsby-plugin-emotion',
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
          'Source Code Pro:400',
          'Source Sans Pro:400',
          'manrope:300,400,400i,700',
          'roboto:300,400,400i,700',
        ],
        display: 'swap',
      },
    },

    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
  mapping: {
    'Mdx.frontmatter.author': 'aaa',
  },
};
