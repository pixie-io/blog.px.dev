const activeEnv = process.env.GATSBY_ACTIVE_ENV || process.env.NODE_ENV || 'dev';
const containers = require('remark-containers');
const unwrapImages = require('remark-unwrap-images');

require('dotenv')
  .config({
    path: `.env.${activeEnv}`,
  });

module.exports = {
  siteMetadata: {
    title: 'Pixie Labs Blog',
    description: 'Pixie Blog',
    author: 'Pixie Labs',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-react-helmet-canonical-urls',
      options: {
        siteUrl: 'https://blog.pixielabs.ai',
      },
    },
    {
      resolve: 'gatsby-plugin-material-ui',
    },
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
              linkImagesToOriginal: false,
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
        prodKey: 'VULqApc857abNmNJNaYj8e289YbGT5xu',
        devKey: '5GNWfA2PU9v2FDdHx2R6hI0j7vs9heqW',
        trackPage: true,
        host: 'https://segment.withpixie.ai/',
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
          'manrope:300,400,400i,700',
          'roboto:300,400,400i,500,700',
          'roboto+mono:300,400,400i,700',
        ],
        display: 'block',
      },
    },
    {
      resolve: 'gatsby-plugin-disqus',
      options: {
        shortname: 'https-blog-pixielabs-ai',
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
    'gatsby-plugin-netlify',
  ],
  mapping: {
    'Mdx.frontmatter.author': 'authorYaml',
  },

};
