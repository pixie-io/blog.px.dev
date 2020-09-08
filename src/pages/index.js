import React, { useState } from 'react';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import Layout from '../components/layout';
import SEO from '../components/seo';
import BlogPostItem from '../components/shared/blog-post-item';
import styles from '../scss/pages/blog.module.scss';
import blogIcon from '../images/blog-icon.svg';

const Blog = ({ data }) => {
  const pageSize = 9;
  const paginate = (posts, pageNumber) => posts.slice(0, (pageNumber + 1) * pageSize);

  const {
    posts: { nodes: allPosts },
  } = data;
  const {
    categories: { nodes: allCategories },
  } = data;
  const categories = [
    ...new Set((allCategories || []).map((c) => c.frontmatter.category)),
  ].map((c) => ({
    label: c,
    count: allPosts.filter((pos) => pos.frontmatter.category === c).length,
  }));

  const [category, setCategory] = useState(null);
  const [page, setPage] = useState(0);
  const [posts, setPosts] = useState(paginate(allPosts, 0));
  const [hasMore, setHasMore] = useState(allPosts.length > pageSize);

  const filterPosts = (p, c) => {
    const filteredPosts = c
      ? allPosts.filter((pos) => pos.frontmatter.category === c)
      : allPosts;
    const paginatedPosts = paginate(filteredPosts, p);
    setPosts(paginatedPosts);
    setPage(p);
    setCategory(c);
    setHasMore(filteredPosts.length > paginatedPosts.length);
  };

  const loadMore = () => {
    filterPosts(page + 1, category);
  };
  const filterByCategory = (c) => {
    filterPosts(0, c);
  };

  return (
    <Layout>
      <SEO title='Blog' />
      <section className={styles.latestStories}>
        <div className='container'>
          <div className={`row ${styles.blogCategory}`}>
            <div className='col-12'>
              <h1>
                <img src={blogIcon} alt='blog icon' />
                Blog
              </h1>
              <h3>The latest news and announcements on Pixie, products, partners, and more.</h3>
            </div>
            <div className='col-12'>
              <ul>
                {categories.map((cat) => (
                  <li key={cat.label}>
                    <button
                      type='button'
                      className={category === cat.label ? styles.active : ''}
                      onClick={() => filterByCategory(cat.label)}
                    >
                      {cat.label}
                      {' '}
                      (
                      {cat.count}
                      )
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className='row'>
            {posts.map((post) => (
              <BlogPostItem post={post} key={post.id} />
            ))}
          </div>
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
    </Layout>
  );
};

Blog.propTypes = {
  data: PropTypes.shape({
    posts: PropTypes.shape({
      nodes: PropTypes.array.isRequired,
    }),
    categories: PropTypes.shape({
      nodes: PropTypes.array.isRequired,
    }),
  }).isRequired,
};

export default Blog;

export const pageQuery = graphql`
  query {
    posts: allMdx(
      filter: { frontmatter: { featured: { eq: true } } }
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      nodes {
        fields {
          slug
        }
        id
        frontmatter {
        
          title
          author
          category
          date(formatString: "DD MMMM YYYY")
          featured_image {
            childImageSharp {
              id
              fluid(maxWidth: 380) {
                base64
                aspectRatio
                src
                srcSet
                sizes
              }
            }
          }
        }
      }
    }
  
    categories: allMdx(filter: { frontmatter: { category: { ne: null } } }) {
      nodes {
        frontmatter {
          category
        }
      }
    }
  }
`;
