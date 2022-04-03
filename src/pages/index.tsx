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
  Chip,
  Container,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import slugify from 'slugify';
import { graphql, Link as GatsbyLink } from 'gatsby';
import Img from 'gatsby-image';
import Link from '../components/link';
import { urlFromSlug } from '../components/utils';
import Header from '../components/header';
import slack from '../images/header/slack-icon.svg';
import github from '../images/header/github-icon.svg';
import twitter from '../images/header/twitter-icon.svg';
import youtube from '../images/header/youtube-icon.svg';

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
  } = data;
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
  const [page, setPage] = useState(0);
  const [posts, setPosts] = useState(paginate(allPosts, 0));
  const [hasMore, setHasMore] = useState(allPosts.length > pageSize);

  const filterPosts = (p: number, c: any) => {
    const filteredPosts = c
      ? allPosts.filter((pos: { frontmatter: { categories: any[] } }) => pos.frontmatter.categories.some((pc) => pc === c))
      : allPosts;
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
      <Header />
      <Container>
        <Stack direction='row' spacing={1}>
          {categories.map((cat: { label: any; count: any }) => (
            <Chip
              variant='outlined'
              className={category === cat.label ? 'active' : ''}
              label={(
                <GatsbyLink to={`/${slugify(cat.label)
                  .toLowerCase()}`}
                >
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
        </Stack>

        <Grid container>
          <Grid item xs={9}>

            {posts.map((post) => (
              <>
                <Link to={urlFromSlug(post.fields.slug)}>
                  {post.frontmatter.title}
                </Link>
                {post.frontmatter.featured_image
                  ? (
                    <Img
                      fluid={post.frontmatter.featured_image.childImageSharp.fluid}
                      alt={post.frontmatter.title}
                    />
                  )
                  : ''}
                <p>{post.excerpt}</p>

              </>
            ))}

            {hasMore ? (
              <button type='button' onClick={() => loadMore()}>
                View all Blog posts
                {' '}
              </button>
            ) : (
              ''
            )}
          </Grid>
          <Grid item xs={3}>
            <Typography variant='h5'>Connect with us</Typography>
            <List>
              <ListItem disablePadding>
                <ListItemButton component='a' href='https://slackin.px.dev' target='_blank'>
                  <ListItemIcon sx={{
                    minWidth: 0,
                    pr: 1,
                  }}
                  >
                    {' '}
                    <img width={18} src={slack} alt='slack' />
                    {' '}
                  </ListItemIcon>
                  <ListItemText primary='Slack' />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  component='a'
                  href='https://github.com/pixie-io/pixie'
                  target='_blank'
                >
                  <ListItemIcon sx={{
                    minWidth: 0,
                    pr: 1,
                  }}
                  >
                    {' '}
                    <img width={20} src={github} alt='github' />
                    {' '}
                  </ListItemIcon>
                  <ListItemText primary='Github' />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  component='a'
                  href='https://twitter.com/pixie_run'
                  target='_blank'
                >
                  <ListItemIcon sx={{
                    minWidth: 0,
                    pr: 1,
                  }}
                  >
                    {' '}
                    <img width={20} src={twitter} alt='twitter' />
                  </ListItemIcon>
                  <ListItemText primary='Twitter' />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  component='a'
                  href='https://www.youtube.com/channel/UCOMCDRvBVNIS0lCyOmst7eg/featured'
                  target='_blank'
                >
                  <ListItemIcon sx={{
                    minWidth: 0,
                    pr: 1,
                  }}
                  >
                    {' '}
                    <img width={22} src={youtube} alt='youtube' />
                  </ListItemIcon>
                  <ListItemText primary='Youtube' />
                </ListItemButton>
              </ListItem>
            </List>
            <Button variant='contained'>FOLLOW US</Button>

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
        excerpt(pruneLength: 200)
        frontmatter {
          title
          authors {
            id
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

   categories: allMdx(sort: {fields: fields___slug, order: ASC}) {
      distinct(field: frontmatter___categories)
    }
  }
`;
