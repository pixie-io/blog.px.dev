/** @type {import('gatsby').GatsbyConfig} */

const activeEnv = process.env.GATSBY_ACTIVE_ENV || process.env.NODE_ENV || 'dev';
const containers = require('remark-containers');
// const unwrapImages = require('remark-unwrap-images');

require('dotenv')
    .config({
      path: `.env.${activeEnv}`,
    });



module.exports = {
  siteMetadata: {
    title: 'Pixie Labs Blog',
    description: 'Pixie Blog',
    author: 'Pixie Labs',
    siteUrl: 'https://blog.px.dev',
  },
  plugins: [
    'gatsby-plugin-top-layout',
    "gatsby-plugin-sass",
    "gatsby-plugin-image",
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
        remarkPlugins: [containers],
        extensions: ['.mdx', '.md'],
      },
    },
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        "name": "images",
        "path": "./src/images/"
      },
      __key: "images"
    }, {
      resolve: 'gatsby-source-filesystem',
      options: {
        "name": "pages",
        "path": "./src/pages/"
      },
      __key: "pages"
    },
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
        path: `${__dirname}/content`,
        name: 'data',
      },
    },
    'gatsby-plugin-mui-emotion',
    'gatsby-transformer-yaml',
    'gatsby-plugin-netlify',
    'gatsby-plugin-sitemap',
    {
      resolve: 'gatsby-plugin-google-fonts',
      options: {
        fonts: [
          'manrope:400,700',
          'roboto:400,700',
        ],
        display: 'block',
      },
    },
  ],
  mapping: {
    'Mdx.frontmatter.authors': 'authorYaml',
  },
};
