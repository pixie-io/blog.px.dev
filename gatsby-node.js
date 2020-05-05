const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');
const fetch = require('node-fetch');

exports.onCreateNode = ({
  node, actions, getNode, getNodesByType,
}) => {
  const { createNodeField, createParentChildLink } = actions;

  if (node.internal.type === 'Directory') {
    const parentDirectory = path.normalize(`${node.dir}/`);
    const parent = getNodesByType('Directory')
      .find(
        (n) => path.normalize(`${n.absolutePath}/`) === parentDirectory,
      );
    if (parent) {
      // eslint-disable-next-line no-param-reassign
      node.parent = parent.id;
      createParentChildLink({
        child: node,
        parent,
      });
    }
  }

  if (node.internal.type === 'MarkdownRemark') {
    const fileNode = (node.parent && node.parent !== 'undefined')
      ? getNode(node.parent)
      : node;


    const slug = createFilePath({
      node,
      getNode,
    });
    const fullSlug = fileNode.sourceInstanceName !== 'posts'
      ? path.posix.join(fileNode.sourceInstanceName, slug)
      : slug;
    const parent = getNodesByType('Directory')
      .find(
        (n) => n.name === fileNode.relativeDirectory,
      );
    if (parent) {
      createParentChildLink({
        child: node,
        parent,
      });
    }
    createNodeField({
      name: 'slug',
      node,
      value: fullSlug,
    });
  }
};
exports.createPages = async ({ graphql, actions }) => {
  const result = await graphql(`
    query {
  blog: allMarkdownRemark(
            filter: { fileAbsolutePath: { regex: "/blog/" } }
            sort: { fields: [frontmatter___date], order: DESC }
            limit: 1000
          ) {
            edges {
              node {
                fields {
                  slug
                }
                frontmatter {
                  title
                }
              }
            }
          }
     }
  `);
  if (result.errors) {
    throw result.errors;
  }

  const blogPrefix = 'blog';
  const blogPost = path.resolve('./src/templates/blog-post.js');
  const posts = result.data.blog.edges;

  posts.forEach((post) => {
    const related = [...posts];
    actions.createPage({
      path: blogPrefix + post.node.fields.slug,
      component: blogPost,
      context: {
        slug: post.node.fields.slug,
        related,
      },
    });
  });
  return null;
};
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
    }
    type Frontmatter @infer {
      title: String
      subtitle: String
      date: Date @dateformat(formatString: "DD-MM-YYYY")
      author: String
      category: String
      featured_image:   File @fileByRelativePath,
      featured: Boolean
    }
    type FeaturedImage{
      absolutePath:String
    }
  `;
  createTypes(typeDefs);
};
exports.sourceNodes = async ({
  actions: { createNode },
  createContentDigest,
}) => {
  const slackReq = await fetch('https://slackin.withpixie.ai/data');
  const slack = await slackReq.json();

  const gitReq = await fetch('https://api.github.com/repos/pixie-labs/pixie');
  const github = await gitReq.json();

  createNode({
    slack: slack.total,
    github: github.watchers,
    id: 'header-counters-data',
    parent: null,
    children: [],
    internal: {
      type: 'HeaderCountersData',
      contentDigest: createContentDigest({}),
    },
  });
};
