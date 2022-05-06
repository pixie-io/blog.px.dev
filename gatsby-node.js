const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');
const fetch = require('node-fetch');
const slugify = require('slugify');
const categoryLink = require('./src/components/category-link');

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

  if (node.internal.type === 'Mdx') {
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
  const { createRedirect } = actions;
  const result = await graphql(`
    query {
      blog: allMdx(
        filter: { fileAbsolutePath: { regex: "/blog/" } }
      ) {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
      categories: allMdx {
        distinct(field: frontmatter___categories)
      }
    }
  `);
  if (result.errors) {
    throw result.errors;
  }

  const blogPrefix = 'blog/';
  const blogPost = path.resolve('./src/templates/blog-post.tsx');
  const homePage = path.resolve('./src/pages/index.tsx');

  const posts = result.data.blog.edges;
  posts.forEach((post) => {
    const urlPath = (post.node.fields.slug).replace('//', '/');
    createRedirect({
      fromPath: (blogPrefix + post.node.fields.slug).replace('//', '/'),
      toPath: urlPath,
      redirectInBrowser: true,
      isPermanent: true,
    });
    actions.createPage({
      path: urlPath,
      component: blogPost,
      context: {
        slug: post.node.fields.slug,
      },
    });
  });

  const categories = result.data.categories.distinct;
  categories.forEach((category) => {
    actions.createPage({
      path: categoryLink.categoryLink(category),
      component: homePage,
      context: {
        slug: slugify(category),
        category,
      },
    });
  });

  return null;
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
    type Mdx implements Node {
      frontmatter: MdxFrontmatter
    }
    type MdxFrontmatter @infer {
      title: String
      date: Date @dateformat(formatString: "YYYY-MM-DD")
      categories: [String]
      authors: [AuthorYaml] @link(by: "name")
      featured_image: File @fileByRelativePath,
      redirect_from: [String]
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
  const slackReq = await fetch('https://slackin.px.dev/data');
  const slack = await slackReq.json();

  const gitReq = await fetch('https://api.github.com/repos/pixie-io/pixie');
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

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
      alias: { $components: path.resolve(__dirname, 'src/components') },
    },
    node: {
      fs: 'empty',
    },
  });
};
