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
import { MDXRenderer } from 'gatsby-plugin-mdx';
import { MDXProvider } from '@mdx-js/react';
import {
  Box, Container, Divider, Grid, Stack, Typography,
} from '@mui/material';
import { graphql } from 'gatsby';
import mdxComponents from '../components/mdxComponents';
import Header from '../components/header';
import HLink from '../components/mdxComponents/h-link';
import ShareAside from '../components/share-aside';
import GravatarIcon from '../components/gravatar';
import BlogPostCard from '../components/shared/blog-post-card';

// eslint-disable-next-line react/prop-types,@typescript-eslint/ban-ts-comment
// @ts-ignore
function BlogPostTemplate({
  data,
  location = { href: '' },
}: any) {
  const post = data.mdx;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const related = data.related.nodes;
  const {
    frontmatter: {
      title,
      featured_image: featuredImage,
      authors,
      email,
      emails,
      date,
    },
    excerpt,
    timeToRead,
  } = data.mdx;
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
        <Grid container spacing={2}>
          <Grid item xs={1} />
          <Grid item xs={8}>
            <HLink id='title' variant='h1'>{post.frontmatter.title}</HLink>
            <Box sx={(theme) => ({
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'row',
              my: 2,
              [theme.breakpoints.down('md')]: {
                flexDirection: 'column-reverse',
              },
            })}
            >
              <Box sx={{
                display: 'flex',
                flexDirection: 'row',
              }}
              >
                <Stack direction='row' spacing={0.5} mb={1} mr={1}>
                  {(authors || []).map((a: { email: any }) => (
                    <GravatarIcon email={a.email} size={40} key={a.email} />
                  ))}
                </Stack>
                <Box sx={{
                  fontSize: '12px',
                  lineHeight: '14px',
                }}
                >
                  <Box
                    sx={{
                      color: (t) =>
                            // @ts-ignore
                            // eslint-disable-next-line implicit-arrow-linebreak
                            t?.components?.MuiTypography?.styleOverrides?.h1?.color,
                    }}
                  >
                    {authors.map((a: { name: any }) => (a.name))
                      .join(', ')}
                  </Box>

                  {date}
                  {' • '}
                  {timeToRead}
                  {' '}
                  minutes read
                </Box>
              </Box>
              <Stack direction='column' mb={1} mr={1}>
                {(authors || []).map((a: { bio: any; email: string }) => (
                  <Box
                    sx={{
                      fontSize: '12px',
                      lineHeight: '14px',

                    }}
                    key={a.email}
                  >
                    {a.bio}
                  </Box>
                ))}
              </Stack>
            </Box>
            <hr />
            <MDXProvider components={mdxComponents}>
              <MDXRenderer>{post.body}</MDXRenderer>
            </MDXProvider>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Divider />
                <Typography variant='h5'> Related posts</Typography>
              </Grid>
              {related.map((p: { fields: { slug: React.Key | null | undefined } }) => (
                <Grid item xs={4} key={p.fields.slug}><BlogPostCard post={p} /></Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item xs={3}>
            <ShareAside />
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
      body
      timeToRead
      frontmatter {
        title
        authors {
          id
          bio
          name
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
       excerpt(pruneLength: 80)
       timeToRead
        frontmatter {
          title
          authors {
            id
            name
            email
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
