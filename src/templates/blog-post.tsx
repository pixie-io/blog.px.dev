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

import React from 'react';

import { graphql } from 'gatsby';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import { MDXProvider } from '@mdx-js/react';
import { Container, Grid } from '@mui/material';
import mdxComponents from '../components/mdxComponents';
import Header from '../components/header';
import HLink from '../components/mdxComponents/h-link';

// eslint-disable-next-line react/prop-types,@typescript-eslint/ban-ts-comment
// @ts-ignore
function BlogPostTemplate({ data, location = { href: '' } }) {
  const post = data.mdx;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const related = data.related.nodes;

  const { categories } = post.frontmatter;
  const disqusConfig = {
    url: location.href,
    identifier: post.frontmatter.title,
    title: post.frontmatter.title,
  };

  return (
    <>
      <Header />

      <Container>
        <Grid container>
          <Grid item xs={1} />
          <Grid item xs={8}>
            <HLink id='title' variant='h1'>{post.frontmatter.title}</HLink>
            <MDXProvider components={mdxComponents}>
              <MDXRenderer>{post.body}</MDXRenderer>
            </MDXProvider>
            <Grid item xs={3} />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default BlogPostTemplate;

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    mdx(fields: { slug: { eq: $slug } }) {
      excerpt(pruneLength: 160)
      body
      frontmatter {
        title
        authors {
          id
          bio
          email
          twitter
        }
        emails
        categories
        date(formatString: "MMMM DD, YYYY")
        featured_image {
          childImageSharp {
            fluid(maxHeight: 500, quality: 92) {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
        }
      }
    }
    related: allMdx(
      filter: {
        fields: { slug: { ne: $slug } }
      }
      limit: 3
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      nodes {
        fields {
          slug
        }
        frontmatter {
          title
          authors {
            id
          }
          date(formatString: "MMM DD, YYYY")
          featured_image {
            childImageSharp {
              fluid(maxWidth: 320, quality: 92) {
                ...GatsbyImageSharpFluid_withWebp
              }
            }
          }
        }
      }
    }
  }
`;
