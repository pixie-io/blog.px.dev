import React, { useState } from 'react';
import { graphql, Link } from 'gatsby';


import PropTypes from 'prop-types';
import Img from 'gatsby-image/index';
import Layout from '../components/layout';
import SEO from '../components/seo';
import styles from '../scss/pages/blog.module.scss';
import blogIcon from '../images/blog-icon.svg';
import PostPlaceholder from '../components/post-placeholder';

const Blog = ({ data }) => {
  const {
    posts: { nodes: allPosts },
  } = data;
  let {
    categories: { group: categories },
  } = data;
  const allPostsNumber = allPosts.length;
  categories = (categories || []).map((c) => ({
    name: c.fieldValue,
    count: c.totalCount,
  }));

  const [category, setCategory] = useState(null);
  const [posts, setPosts] = useState(allPosts);

  const filterPosts = (p, c) => {
    const filteredPosts = c
      ? allPosts.filter((pos) => pos.frontmatter.category === c)
      : allPosts;
    setPosts(filteredPosts);
    setCategory(c);
  };

  const filterByCategory = (c) => {
    filterPosts(0, c);
  };

  return (
    <Layout>
      <SEO title='Blog' />
      <section className={styles.blogIndex}>
        <div className='container'>
          <div className='col-12'>
            <div className='row'>
              <h1>
                <img src={blogIcon} />
                Blog
              </h1>
              <h3>The latest news and announcements on Pixie, products, partners, and more.</h3>
              <div className={styles.categoriesFilter}>
                <span
                  className={`${!category ? styles.active : ''} ${styles.categoryItem}`}
                  onClick={() => filterByCategory(null)}
                >
                  All (
                  {allPostsNumber}
                  )
                </span>
                {categories.map((cat) => (
                  <span
                    key={cat.name}
                    className={`${category === cat.name ? styles.active : ''} ${styles.categoryItem}`}
                    onClick={() => filterByCategory(cat.name)}
                  >
                    {cat.name}
                    (
                    {cat.count}
                    )
                  </span>
                ))}
              </div>
            </div>

          </div>
          {posts.map((post) => (
            <Link to={`/blog/${post.fields.slug}`} className={styles.blogPostItem} key={post.id}>
              <div className='row'>
                <div className='col-3'>
                  {post.frontmatter.featured_image
                    ? (
                      <Img
                        fluid={post.frontmatter.featured_image.childImageSharp.fluid}
                        alt={post.frontmatter.title}
                      />
                    )
                    : <PostPlaceholder />}
                </div>
                <div className='col-9'>
                  <div className={styles.overText}>
                    {post.frontmatter.date}
                    {' • '}
                    {post.timeToRead}
                    {' '}
                    minute
                    {post.timeToRead > 1 ? 's' : ''}
                    {' '}
                    read
                  </div>
                  <h3>{post.frontmatter.title}</h3>
                  <div className={styles.author}>
                    {post.frontmatter.author}
                    {' '}
                    in
                    {' '}
                    {post.frontmatter.category}
                  </div>
                  <div className={styles.summary}>
                    {post.excerpt}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className='clearfix' />
      </section>
    </Layout>
  );
};

Blog.propTypes = {
  data: PropTypes.shape({
    featured: PropTypes.shape({
      nodes: PropTypes.array,
    }),
    posts: PropTypes.shape({
      nodes: PropTypes.array.isRequired,
    }),
    categories: PropTypes.shape({
      group: PropTypes.array.isRequired,
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
        timeToRead
        excerpt
        frontmatter {
          title
          author
          category
          date(formatString: "DD MMMM YYYY")
          featured_image {
            childImageSharp {
              id
              fluid(maxWidth: 290) {
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
    featured: allMdx(
      filter: { frontmatter: { featured: { eq: true } } }
      limit: 3
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      nodes {
        fields {
          slug
        }
        excerpt(pruneLength: 160)
        frontmatter {
          title
          subtitle
          author
          date(formatString: "MMMM DD, YYYY")
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
   categories: allMdx(filter: {frontmatter: {category: {ne: null}}}) {
    group(field: frontmatter___category) {
      totalCount
      fieldValue
    }
  }
  }
`;
