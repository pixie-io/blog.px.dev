const pageQuery = `{
  pages: allMdx(
    filter: {
      fileAbsolutePath: { regex: "/blog/" },
    }
  ) {
    edges {
      node {
        id
        frontmatter {
          title
          categories
          date
        }
        fields {
          slug
        }
        excerpt(pruneLength: 5000)
      }
    }
  }
}`;

function pageToAlgoliaRecord({
  node: {
    id,
    frontmatter,
    fields,
    ...rest
  },
}) {
  return {
    objectID: id,
    ...frontmatter,
    ...fields,
    ...rest,
  };
}

const queries = [
  {
    query: pageQuery,
    transformer: ({ data }) => data.pages.edges.map(pageToAlgoliaRecord),
    indexName: 'blog',
    settings: { attributesToSnippet: ['excerpt:20'] },
  },
];
module.exports = queries;
