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

import React, { useEffect, useState } from 'react';
import { graphql, Link } from 'gatsby';
import PropTypes from 'prop-types';
import slugify from 'slugify';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Layout from '../components/layout';
import SEO from '../components/seo';
import BlogPostItem from '../components/shared/blog-post-item';
import * as styles from '../scss/pages/blog.module.scss';
import spaceGuys from '../images/homepage/space-illustration.svg';
import Button from '../components/shared/button';

const useStyles = makeStyles((theme) => ({
  body: {
    backgroundColor: theme.palette.type === 'light' ? 'white' : '#161616',
  },
}));
const Blog = (props) => {
  const PIXIE_TEAM_BLOGS = 'Pixie Team Blogs';
  const {
    data,
    pageContext: { category: urlCategory },
    location = { href: '' },
  } = props;
  const pageSize = 9;
  const paginate = (posts, pageNumber) => posts.slice(0, (pageNumber + 1) * pageSize);
  const muiClasses = useStyles();

  const {
    posts: { nodes: allPosts },
  } = data;
  const {
    categories: { distinct: allCategories },
  } = data;

  let categories = allCategories
    .map((c) => ({
      label: c,
      count: allPosts.filter((pos) => pos.frontmatter.categories.includes(c.toString())).length,
      order: c === PIXIE_TEAM_BLOGS ? 99 : c.length,
    }));
  categories = categories.sort((a, b) => (a.order >= b.order ? -1 : 1));

  const [category] = useState(urlCategory);
  const [page, setPage] = useState(0);
  const [posts, setPosts] = useState(paginate(allPosts, 0));
  const [hasMore, setHasMore] = useState(allPosts.length > pageSize);

  const filterPosts = (p, c) => {
    const filteredPosts = c
      ? allPosts.filter((pos) => pos.frontmatter.categories.some((pc) => pc === c))
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
    <Layout>
      <SEO
        title='Blog'
        url={location.href}
      />
      <section className={`${styles.latestStories}  ${muiClasses.body}`}>
        <div className='container'>
          <div className={styles.blogCategory}>
            <div className='row'>
              <div className='col-1' />
              <div className='col-10'>
                <div className={styles.topDecorator} />
                <Typography variant='h1'>
                  Updates and ideas from Pixie and the Pixienaut developer community
                </Typography>
              </div>
              <div className='col-1' />
            </div>
            <div className='row'>
              <div className='col-1' />
              <div className='col-10'>
                <ul>
                  <li>
                    <Link to='/'>
                      <button
                        type='button'
                        className={!category ? styles.active : ''}
                      >
                        All (
                        {allPosts.length}
                        )
                      </button>
                    </Link>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat.label}>
                      <Link
                        to={`/${slugify(cat.label)
                          .toLowerCase()}`}
                      >
                        <button
                          type='button'
                          className={category === cat.label ? styles.active : ''}
                        >
                          {cat.label}
                          {' '}
                          (
                          {cat.count}
                          )
                        </button>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className='col-1' />
            </div>
          </div>
          {posts.map((post) => (
            <BlogPostItem post={post} key={post.id} />
          ))}
          <div className='clearfix' />
          <div className='row'>
            <div className={`col-12 ${styles.blogViewAll}`}>
              {hasMore ? (
                <button type='button' onClick={() => loadMore()}>
                  View all Blog posts
                  {' '}
                </button>
              ) : (
                ''
              )}
            </div>
          </div>
          <div className='clearfix' />
        </div>
      </section>
      <div className={styles.bottomStars}>
        <section className={styles.communitySection}>
          <img className={styles.spaceGuys} loading='lazy' src={spaceGuys} alt='' />
          <div className='container'>
            <div className='col-12'>
              <div className={styles.communitySectionTitle}>
                <div className={styles.topDecorator} />
                <Typography variant='h2'>
                  Interested in helping shape
                  {' '}
                  <br className='hide-mobile hide-tablet' />
                  {' '}
                  Pixie?
                </Typography>
                <div>
                  <Button className={styles.button} link='https://px.dev/community/'>
                    BE A PIXIENAUT
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

Blog.propTypes = {
  pageContext: PropTypes.shape({
    category: PropTypes.string,
  }),
  location: PropTypes.shape({
    href: PropTypes.string,
  }).isRequired,
  data: PropTypes.shape({
    posts: PropTypes.shape({
      nodes: PropTypes.arrayOf.isRequired,
    }),
    categories: PropTypes.shape({
      distinct: PropTypes.arrayOf.isRequired,
    }),
  }).isRequired,
};
Blog.defaultProps = {
  pageContext: {
    category: null,
  },
};
export default Blog;

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
