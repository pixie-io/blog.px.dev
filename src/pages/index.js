import React, { useState } from 'react';
import { graphql, Link } from 'gatsby';
import PropTypes from 'prop-types';
import Layout from '../components/layout';
import SEO from '../components/seo';
import BlogPostItem from '../components/shared/blog-post-item';
import FeatureBlogPostItem from '../components/blog/feature-post';
import styles from '../scss/pages/blog.module.scss';
import leftNav from '../images/left-nav.svg';
import rightNav from '../images/right-nav.svg';

const Blog = ({ data }) => {
  const pageSize = 9;
  const paginate = (posts, pageNumber) => posts.slice(0, (pageNumber + 1) * pageSize);
  const { featured: { nodes: featured } } = data;
  const maxFeatured = Math.max(featured.length, 3);
  const { posts: { nodes: allPosts } } = data;
  const { categories: { nodes: allCategories } } = data;
  const categories = [...new Set((allCategories || []).map((c) => c.frontmatter.category))];

  const [category, setCategory] = useState(null);
  const [page, setPage] = useState(0);
  const [posts, setPosts] = useState(paginate(allPosts, 0));
  const [hasMore, setHasMore] = useState(allPosts.length > pageSize);
  const [featureIndex, setFeatureIndex] = useState(0);

  const filterPosts = (p, c) => {
    const filteredPosts = c ? allPosts.filter((pos) => pos.frontmatter.category === c) : allPosts;
    const paginatedPosts = paginate(filteredPosts, p);
    setPosts(paginatedPosts);
    setPage(p);
    setCategory(c);
    setHasMore(filteredPosts.length > paginatedPosts.length);
  };
  const goLeft = () => {
    setFeatureIndex(Math.max(0, featureIndex - 1));
  };
  const goRight = () => {
    setFeatureIndex(Math.min(maxFeatured - 1, featureIndex + 1));
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
      <section className={styles.featuredBlog}>
        <div className={styles.ornamentTopRight} />
        <div className={styles.ornamentTopLeft} />
        <FeatureBlogPostItem post={featured[featureIndex]} />
        <div className='container'>
          <div className='col-7' />
          <div className='col-5'>
            <div className={styles.navigationFeatured}>
              <div className={styles.navigateDots}>
                {[...Array(maxFeatured)
                  .keys()].map((index) => (
                    <button
                      type='button'
                      key={index}
                      onClick={() => setFeatureIndex(index)}
                      className={index === featureIndex ? 'active' : ''}
                    />
                ))}
              </div>
              <div onClick={() => goRight()} className={styles.navigateArrow}>
                <img src={rightNav} alt='' />
              </div>
              <div onClick={() => goLeft()} className={styles.navigateArrow}>
                <img src={leftNav} alt='' />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className={styles.latestStories}>
        <div className='container'>
          <div className={`row ${styles.blogCategory}`}>
            <div className='col-12'>
              <h2>Latest Stories</h2>
            </div>
            <div className='col-12'>
              <span>Categories</span>
              <ul>
                <li>
                  <button className={!category ? styles.active : ''} type='button' onClick={() => filterByCategory(null)}>All</button>
                </li>

                {categories.map((cat) => (
                  <li>
                    <button
                      type='button'
                      className={category === cat ? styles.active : ''}
                      key={cat}
                      onClick={() => filterByCategory(cat)}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className='row'>
            {posts.map((post) => <BlogPostItem post={post} key={post.id} />)}
          </div>
          <div className='clearfix' />
          <div className='row'>
            <div className={`col-12 ${styles.blogViewAll}`}>
              {hasMore
                ? <button type='button' onClick={() => loadMore()}>View all Blog posts </button> : ''}
            </div>
          </div>
          <div className='clearfix' />


        </div>
        <div className={styles.messageBlog}>
          <div
            className={styles.quoteOrnament1}
            data-sal='slide-up'
            data-sal-duration='600'
            data-sal-delay='300'
            data-sal-easing='ease'
          />
          <div
            data-sal='slide-down'
            data-sal-duration='900'
            data-sal-delay='300'
            data-sal-easing='ease'
            className={styles.quoteOrnament2}
          />

          <h4>We&apos;re busy building. Drop us a line to learn more!</h4>
          <h5>
            Got questions or suggestions? Message us here, email us, or visit our&nbsp;
            <a
              href='https://work.withpixie.ai/docs'
              target='_blank'
              rel='noopener noreferrer'
            >
              help center.
            </a>
          </h5>
          <a href='https://pixielabs.ai/contact' className='button'>Contact Us</a>

        </div>
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
      nodes: PropTypes.array.isRequired,
    }),
  }).isRequired,
};

export default Blog;

export const pageQuery = graphql`
    query {
        posts: allMarkdownRemark(filter: {frontmatter: {featured: {eq: true}}}, sort: { fields: [frontmatter___date], order: DESC }) {
            nodes {
                fields {
                    slug
                }
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
        featured: allMarkdownRemark(filter: {frontmatter: {featured: {eq: true}}}, limit: 3, sort: { fields: [frontmatter___date], order: DESC }) {
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
        categories: allMarkdownRemark(filter: {frontmatter: {category: {ne: null}}}) {
            nodes {
                frontmatter {
                    category
                }
            }
        }
    }
`;
