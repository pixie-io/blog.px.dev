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
  Box, Container, Divider, Grid, Stack, Tooltip, Typography,
} from '@mui/material';
import { graphql } from 'gatsby';
import { LinkedinShareButton, RedditShareButton, TwitterShareButton } from 'react-share';
import mdxComponents from '../components/mdxComponents';
import Header from '../components/header';
import HLink from '../components/mdxComponents/h-link';
import ShareAside from '../components/share-aside';
import GravatarIcon from '../components/gravatar';
import BlogPostCard from '../components/shared/blog-post-card';
import Footer from '../components/footer';
import reddit from '../images/icons/reddit-icon.svg';
import twitter from '../images/icons/twitter-icon.svg';
import linkedin from '../images/icons/linkedin-icon.svg';
// eslint-disable-next-line react/prop-types,@typescript-eslint/ban-ts-comment
// @ts-ignore
function BlogPostTemplate({
  data,
  location = { href: '' },
}: any) {
  const post = data.mdx;
  const shareUrl = location.href;
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
  const allAuthors = authors.filter((a: any) => a);

  return (
    <>
      <Header />
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={1}>
            <Box sx={{ mt: 20 }} />
            <Box sx={(theme) => ({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              position: 'sticky',
              top: 100,
              my: 2,
              [theme.breakpoints.down('md')]: {
                display: 'none',
              },
            })}
            >
              <Tooltip title='Share on reddit' placement='left'>
                <RedditShareButton url={shareUrl}>
                  <img src={reddit} alt='reddit' />
                </RedditShareButton>
              </Tooltip>
              <Tooltip title='Share on Twitter' placement='left'>
                <TwitterShareButton url={shareUrl}>
                  <img src={twitter} alt='twitter' />
                </TwitterShareButton>
              </Tooltip>
              <Tooltip title='Share on linkedIn' placement='left'>
                <LinkedinShareButton
                  title={post.frontmatter.title}
                  summary={post.frontmatter.excerpt}
                  url={shareUrl}
                >
                  <img src={linkedin} alt='linkedin' />
                </LinkedinShareButton>
              </Tooltip>
            </Box>
          </Grid>
          <Grid item xs={12} sm={8}>
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
                alignItems: 'center',
              }}
              >
                <Stack direction='row' spacing={0.5} mr={1}>
                  {(allAuthors || []).map((a: { email: any }) => (a
                    ? (
                      <GravatarIcon
                        email={a.email}
                        size={40}
                        key={a.email}
                      />
                    ) : ''))}
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
                    {allAuthors.map((a: { name: any }) => (a ? a.name : ''))
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
                {(allAuthors || []).map((a: { bio: any; email: string }) => (
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
            <Divider />
            <MDXProvider components={mdxComponents}>
              <MDXRenderer>{post.body}</MDXRenderer>
            </MDXProvider>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Divider />
                <Typography variant='h5'> Related posts</Typography>
              </Grid>
              {related.map((p: { fields: { slug: React.Key | null | undefined } }) => (
                <Grid item sm={6} md={4} xs={12} key={p.fields.slug}>
                  <BlogPostCard
                    post={p}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item xs={12} sm={3}>
            <ShareAside />
          </Grid>
        </Grid>
      </Container>
      <Footer />
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
           gatsbyImageData(layout: CONSTRAINED)
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
              gatsbyImageData(layout: CONSTRAINED)
            }
          }
        }
      }
    }
  }
`;
