/*
 * Copyright 2018- The Pixie Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

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
    indexName: process.env.GATSBY_ALGOLIA_DEV_INDEX_NAME,
    settings: { attributesToSnippet: ['excerpt:20'] },
  },
];
module.exports = queries;
