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
  Chip, Container, Grid, Typography,
} from '@mui/material';
import slugify from 'slugify';
import { graphql, Link, Link as GatsbyLink } from 'gatsby';
import { Box } from '@mui/system';
import Img from 'gatsby-image';
import Header from '../components/header';
import BlogPostCard from '../components/shared/blog-post-card';
import ShareAside from '../components/share-aside';
import { urlFromSlug } from '../components/utils';
import PostPlaceholder from '../components/post-placeholder';
import BlogAuthorsHeader from '../components/shared/blog-authors-header';

// markup
// eslint-disable-next-line max-len,react/require-default-props
const IndexPage = (props: { data: any; pageContext: { category: any }; location?: { href: string } | undefined }) => {
  const PIXIE_TEAM_BLOGS = 'Pixie Team Blogs';
  const {
    data,
    pageContext: { category: urlCategory },
    location = { href: '' },
  } = props;
  const pageSize = 9;
  const paginate = (posts: any[], pageNumber: number) => posts.slice(0, (pageNumber + 1) * pageSize);

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

  const [category] = useState(urlCategory);
  const [posts, setPosts] = useState(allPosts);
  const [heroPost, setHeroPost] = useState(heroPosts[0]);
  const [featuredPosts, setFeaturedPosts] = useState(allPosts.slice(1, 3));

  const filterPosts = (c: any) => {
    const filteredPosts = c
      ? allPosts.filter((pos: { frontmatter: { categories: any[] } }) => pos.frontmatter.categories.some((pc) => pc === c))
      : allPosts;
    setPosts(filteredPosts);
  };

  useEffect(() => {
    filterPosts(category);
  }, []);

  return (
    <>
      <Header />
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={9}>
            <Grid container spacing={3} my={4}>
              <Grid item md={6} xs={12}>
                <Link to={urlFromSlug(heroPost.fields.slug)}>
                  <Box borderRadius='10px' overflow='hidden' className='blog-post-card-image'>
                    {heroPost.frontmatter.featured_image
                      ? (
                        <Img
                          fluid={heroPost.frontmatter.featured_image.childImageSharp.fluid}
                          alt='hero'
                        />
                      )
                      : <PostPlaceholder />}
                  </Box>
                </Link>
              </Grid>
              <Grid item md={6} xs={12}>
                <Typography variant='h2' sx={{ mt: 1 }}>{heroPost.frontmatter.title}</Typography>
                <Typography variant='body1' sx={{ my: 1 }}>{heroPost.excerpt}</Typography>
                <BlogAuthorsHeader authors={heroPost.frontmatter.authors} timeToRead={heroPost.timeToRead} date={heroPost.frontmatter.date} />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              {categories.map((cat: { label: any; count: any }) => (
                <Chip
                  sx={{
                    mr: 2,
                    mb: 2,
                  }}
                  variant='outlined'
                  className={category === cat.label ? 'active' : ''}
                  label={(
                    <GatsbyLink to={`/${slugify(cat.label).toLowerCase()}`}>
                      {cat.label}
                      {' '}
                      (
                      {cat.count}
                      )
                    </GatsbyLink>
                      )}
                  clickable
                />
              ))}

            </Grid>

            <Grid item xs={12}>
              <Typography variant='h5'>Latest posts</Typography>
              <hr />
            </Grid>
            {featuredPosts.map((post) => (
              <Grid container spacing={3} mb={4} mt={2} key={post.id}>

                <Grid item md={6} xs={12}>
                  <Link to={urlFromSlug(heroPost.fields.slug)}>
                    <Box borderRadius='10px' overflow='hidden' className='blog-post-card-image'>
                      {heroPost.frontmatter.featured_image
                        ? (
                          <Img
                            fluid={heroPost.frontmatter.featured_image.childImageSharp.fluid}
                            alt='hero'
                          />
                        )
                        : <PostPlaceholder />}
                    </Box>
                  </Link>
                </Grid>
                <Grid item md={6} xs={12}>
                  <Typography variant='h2' sx={{ mt: 1 }}>{heroPost.frontmatter.title}</Typography>
                  <Typography variant='body1' sx={{ my: 1 }}>{heroPost.excerpt}</Typography>
                  <BlogAuthorsHeader authors={heroPost.frontmatter.authors} timeToRead={heroPost.timeToRead} date={heroPost.frontmatter.date} />
                </Grid>
              </Grid>
            ))}
            <Grid item xs={12} mb={2}>
              <Typography variant='h5'>Latest posts</Typography>
              <hr />
            </Grid>
            <Grid container spacing={3}>
              {posts.map((post: any) => (
                <Grid item xs={12} sm={6} md={4}>
                  <BlogPostCard key={post.id} post={post} />
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item xs={12} sm={3}>
            <ShareAside />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

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
        excerpt(pruneLength: 100)
        frontmatter {
          title
          authors {
            id
            email
          }
          emails
          categories
          date(formatString: "MMM DD, YYYY")
          featured_image {
            childImageSharp {
              fluid(maxHeight: 320 quality: 92) {
                ...GatsbyImageSharpFluid_withWebp
              }
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
        excerpt(pruneLength: 100)
        frontmatter {
          title
          authors {
            id
            email
          }
          emails
          categories
          date(formatString: "MMM DD, YYYY")
          featured_image {
            childImageSharp {
              fluid(maxHeight: 226 quality: 92) {
                ...GatsbyImageSharpFluid_withWebp
              }
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
