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
import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  Button,
  Chip, Container, Divider, Grid, Typography,
} from '@mui/material';
import slugify from 'slugify';
import { graphql, Link, Link as GatsbyLink } from 'gatsby';
import { Box } from '@mui/system';
import { GatsbyImage } from 'gatsby-plugin-image';
import Header from '../components/header';
import BlogPostCard from '../components/shared/blog-post-card';
import ShareAside from '../components/share-aside';
import { urlFromSlug } from '../components/utils';
import PostPlaceholder from '../components/post-placeholder';
import BlogAuthorsHeader from '../components/shared/blog-authors-header';
import Footer from '../components/footer';
import SEO from '../components/seo';

// markup
// eslint-disable-next-line max-len,react/require-default-props
function IndexPage(props: { data: any; pageContext: { category: any }; location?: { href: string } | undefined }) {
  const PIXIE_TEAM_BLOGS = 'Pixie Team Blogs';
  const {
    data,
    pageContext: { category: urlCategory },
    location = { href: '' },
  } = props;

  const {
    posts: { nodes: allPosts },
    heroPost: { nodes: heroPosts },
  }: { posts: { nodes: any[] }; heroPost: { nodes: any[] } } = data;
  const {
    categories: { distinct: allCategories },
  } = data;
  let categories = allCategories
    .map((c: string | any[]) => ({
      label: c,
      count: allPosts.filter((pos: { frontmatter: { categories: string[] } }) => pos.frontmatter.categories.includes(c.toString())).length,
      order: c === PIXIE_TEAM_BLOGS ? 99 : c.length,
    }));
  categories = categories.sort((a: { order: number }, b: { order: number }) => (a.order >= b.order ? -1 : 1));
  const pageSize = 6;
  const paginate = (posts: any[], pageNumber: number) => (pageNumber === 0 ? posts.slice(0, 8) : posts.slice(0, 8 + (pageNumber) * pageSize));

  const [category] = useState(urlCategory);
  const [posts, setPosts] = useState(paginate(allPosts, 0));
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(allPosts.length > pageSize);

  const [heroPost, setHeroPost] = useState(heroPosts[0]);
  const filterPosts = (p:number, c: any) => {
    const postsWithoutHero = allPosts.filter((po) => po.id !== heroPosts[0].id);
    const filteredPosts = c
      ? postsWithoutHero.filter((pos: { frontmatter: { categories: any[] } }) => pos.frontmatter.categories.some((pc) => pc === c))
      : postsWithoutHero;
    const paginatedPosts = paginate(filteredPosts, p);
    setPosts(paginatedPosts);
    setPage(p);
    setHasMore(filteredPosts.length > paginatedPosts.length);
  };
  const loadMore = () => {
    filterPosts(page + 1, category);
  };
  useEffect(() => {
    filterPosts(0, category);
  }, []);

  return (
    <>
      <SEO
        title='Blog'
        url={location.href}
      />
      <Header />
      <Container>
        <Grid container>
          <Grid item xs={12} sm={9}>
            <Grid container spacing={3} my={4}>
              <Grid item md={6} xs={12}>
                <Link to={urlFromSlug(heroPost.fields.slug)}>
                  <Box
                    borderRadius='10px'
                    overflow='hidden'
                    className='blog-post-card-image'
                  >
                    {heroPost.frontmatter.featured_image
                      ? (
                        <GatsbyImage
                          image={heroPost.frontmatter.featured_image.childImageSharp.gatsbyImageData}
                          alt='hero'
                        />
                      )
                      : <PostPlaceholder />}
                  </Box>
                </Link>
              </Grid>
              <Grid item md={6} xs={12} sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
                <Link to={urlFromSlug(heroPost.fields.slug)}>
                  <Typography
                    variant='h2'
                    sx={{ mt: 0 }}
                  >
                    {heroPost.frontmatter.title}
                  </Typography>
                </Link>
                <Typography
                  variant='body1'
                  sx={{ my: 1 }}
                >
                  {heroPost.excerpt}
                </Typography>
                <BlogAuthorsHeader
                  authors={heroPost.frontmatter.authors}
                  timeToRead={heroPost.timeToRead}
                  date={heroPost.frontmatter.date}
                />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='h5'>
                Latest posts
              </Typography>
              <Divider sx={{ mb: 4 }} />
            </Grid>
            <Grid item xs={12}>
              <GatsbyLink to='/'>
                <Chip
                  sx={(theme) => ({
                    mr: 2,
                    mb: 2,
                    color: theme.palette.primary.main,
                  })}
                  className={category === undefined ? 'chip-background' : ''}
                  label={`All (${allPosts.length})`}
                  variant='outlined'
                  clickable
                />
              </GatsbyLink>

              {categories.map((cat: { label: any; count: any }) => (
                <GatsbyLink to={`/${slugify(cat.label)
                  .toLowerCase()}`}
                >
                  <Chip
                    sx={(theme) => ({
                      mr: 2,
                      mb: 2,
                      color: theme.palette.primary.main,
                    })}
                    className={category === cat.label ? 'chip-background' : ''}
                    label={`${cat.label} (${cat.count})`}
                    variant='outlined'
                    clickable
                  />
                </GatsbyLink>
              ))}

            </Grid>

            {posts.slice(0, 2)
              .map((post: any) => (
                <Grid container spacing={3} mb={4} mt={2} key={post.id}>
                  <Grid item md={6} xs={12}>
                    <Link to={urlFromSlug(post.fields.slug)}>
                      <Box
                        borderRadius='10px'
                        overflow='hidden'
                        className='blog-post-card-image'
                      >
                        {post.frontmatter.featured_image
                          ? (
                            <GatsbyImage
                              image={post.frontmatter.featured_image.childImageSharp.gatsbyImageData}
                              alt='hero'
                            />
                          )
                          : <PostPlaceholder />}
                      </Box>
                    </Link>
                  </Grid>
                  <Grid item md={6} xs={12} sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
                    <Link to={urlFromSlug(post.fields.slug)}>
                      <Typography
                        variant='h3'
                        sx={{ mt: 0 }}
                      >
                        {post.frontmatter.title}
                      </Typography>
                    </Link>
                    <Typography
                      variant='body1'
                      sx={{ my: 1 }}
                    >
                      {post.excerpt}
                    </Typography>
                    <BlogAuthorsHeader
                      authors={post.frontmatter.authors}
                      timeToRead={post.timeToRead}
                      date={post.frontmatter.date}
                    />
                  </Grid>
                </Grid>
              ))}
            {posts.slice(2, posts.length).length ? (
              <Grid container spacing={4} sx={{ mt: 4 }}>
                {posts.slice(2, posts.length)
                  .map((post: any) => (
                    <Grid item xs={12} sm={6} md={4}>
                      <BlogPostCard key={post.id} post={post} />
                    </Grid>
                  ))}
                {hasMore ? (
                  <Grid item xs={12} justifyContent='center' container sx={{ mb: 6 }}>
                    <Button
                      variant='contained'
                      onClick={() => loadMore()}
                    >
                      View more
                      {' '}
                    </Button>
                  </Grid>
                ) : (
                  ''
                )}
              </Grid>
            ) : ''}
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

export default IndexPage;

export const pageQuery = graphql`
  query {
    posts: allMdx(
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      nodes {
        fields {
          slug
        }
        id
        timeToRead
        excerpt(pruneLength: 150)
        frontmatter {
          title
          authors {
            id
            name
            email
          }
          emails
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
 heroPost: allMdx(
      sort: { fields: [frontmatter___date], order: DESC }
      limit: 1
    ) {
      nodes {
        fields {
          slug
        }
        id
        timeToRead
        excerpt(pruneLength: 130)
        frontmatter {
          title
          authors {
            id
            name
            email
          }
          emails
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
   categories: allMdx(sort: {fields: fields___slug, order: ASC}) {
      distinct(field: frontmatter___categories)
    }
  }
`;
