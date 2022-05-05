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
  Box,
  Container,
  Divider,
  Grid,
  Stack,
  Theme,
  ThemeProvider,
  Tooltip,
  Typography,
} from '@mui/material';
import { graphql } from 'gatsby';
import { LinkedinShareButton, RedditShareButton, TwitterShareButton } from 'react-share';
import createBreakpoints from '@mui/system/createTheme/createBreakpoints';
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
import SEO from '../components/seo';

const breakpoints = createBreakpoints({});

const blogPostThemeOverride = {
  MuiList: {
    styleOverrides: {
      root: {
        margin: 0,
        padding: 0,
        listStyle: 'disc',
        paddingInlineStart: '40px',
        marginTop: '28px',
      },
    },
  },
  MuiListItem: {
    styleOverrides: {
      root: {
        padding: 0,
        paddingBottom: '12px',
        paddingLeft: '12px',
        fontFamily: 'charter, georgia, serif',
        fontSize: '21px',
        lineHeight: '32px',
        display: 'list-item',
        [breakpoints.down('md')]: {
          fontSize: '18px',
          lineHeight: '28px',
        },
      },
    },
  },
  MuiTypography: {
    styleOverrides: {
      h1: {
        color: 'rgba(var(--color-headings))',
        fontFamily: 'Manrope',
        fontWeight: 400,
        fontSize: '48px',
        lineHeight: '64px',

        [breakpoints.down('md')]: {
          fontSize: '38px',
          lineHeight: '46px',
        },
        [breakpoints.down('sm')]: {
          fontSize: '32px',
          lineHeight: '42px',
        },
      },
      h2: {
        color: 'rgba(var(--color-headings))',
        fontFamily: 'Manrope',
        marginBottom: '-8px',
        marginTop: '58px',
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '30px',
        lineHeight: '36px',
        [breakpoints.down('md')]: {
          marginBottom: '-6px',
          marginTop: '26px',
          fontStyle: 'normal',
          fontWeight: 500,
          fontSize: '22px',
          lineHeight: '28px',
        },
      },
      h3: {
        color: 'rgba(var(--color-headings))',
        fontFamily: 'Manrope',
        marginBottom: '-6.8px',
        marginTop: '38px',
        fontStyle: 'normal',
        fontWeight: 500,
        fontSize: '22px',
        lineHeight: '28px',
        [breakpoints.down('md')]: {
          marginBottom: '-6px',
          marginTop: '25px',
          fontStyle: 'normal',
          fontWeight: 500,
          fontSize: '20px',
          lineHeight: '24px',
        },
      },
      h5: {
        color: 'rgba(var(--color-headings))',
        fontFamily: 'Manrope',
        marginBottom: '16px',
        marginTop: '24px',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: '14px',
        lineHeight: '17.5px',
        WebkitFontSmoothing: 'antialiased',
      },
    },
  },
};
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
      <SEO
        title={post.frontmatter.title}
        description={post.excerpt}
        url={location.href}
        creators={post.frontmatter.authors ? (post.frontmatter.authors || []).map(
          (a: { twitterHandle: string }) => (a?.twitterHandle),
        )
          .filter((n: string) => n) : []}
        image={post.frontmatter.featured_image
          ? post.frontmatter.featured_image.childImageSharp.gatsbyImageData.images.fallback.src
          : null}
        lang='EN'
        meta={undefined}
      />
      <Header />
      <Container>
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            sm={1}
            sx={(theme) => ({
              [theme.breakpoints.down('md')]: {
                display: 'none',
              },
            })}
          />
          <Grid item xs={12} sm={8}>
            <HLink id='title' variant='h1'>{post.frontmatter.title}</HLink>
          </Grid>
          <Grid
            item
            xs={12}
            sm={3}
            sx={(theme) => ({
              [theme.breakpoints.down('md')]: {
                display: 'none',
              },
            })}
          />
        </Grid>

      </Container>
      <Container>
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            sm={1}
            sx={(theme) => ({
              [theme.breakpoints.down('md')]: {
                display: 'none',
              },
            })}
          >
            <Box sx={{ mt: 8 }} />
            <Box sx={(theme) => ({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              position: 'sticky',
              top: 100,
              my: 2,
              mr: 4,
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
          <Grid
            item
            xs={12}
            sm={8}
            sx={{
              mt: {
                xs: 0,
                sm: 2,
              },
            }}
          >
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
              <ThemeProvider
                theme={(outerTheme: Theme) => ({
                  ...outerTheme,
                  components: { ...outerTheme.components, ...blogPostThemeOverride },
                })}
              >
                <MDXRenderer>{post.body}</MDXRenderer>
              </ThemeProvider>

            </MDXProvider>
            <Grid container spacing={2} sx={{ mt: 6 }}>
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
          categories
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
