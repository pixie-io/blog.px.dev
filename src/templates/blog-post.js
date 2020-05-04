import React from 'react';
import { graphql, Link } from 'gatsby';
import Img from 'gatsby-image';
import PropTypes from 'prop-types';
import styles from './blog-post.module.scss';
import Layout from '../components/layout';
import SEO from '../components/seo';
import BlogPostItem from '../components/shared/blog-post-item';

const BlogPostTemplate = ({ data }) => {
  const post = data.markdownRemark;
  const related = data.featured.nodes;

  return (
    <Layout whiteFooter whiteHeader>
      <SEO title='Home' />
      <div className={styles.ornamentTopRight} />
      <div className={styles.ornamentCenterRight} />
      <div className={styles.ornamentTopLeft} />
      <div className={styles.ornamentCenterLeft} />
      <div className='container'>
        <section className={styles.header}>
          <div className={`row ${styles.singlePost}`}>
            <div className={`col-7 ${styles.featuredImage}`}>
              <div className={styles.singlePostLeftBottom} />
              <div className={styles.singlePostLeftTop} />
              <div className={styles.singlePostRightTop} />
              <Img fluid={post.frontmatter.featured_image.childImageSharp.fluid} />
            </div>
            <div className={`col-5 ${styles.detailsPost}`}>
              <h3>DIGITAL MARKETING</h3>
              <h1>{post.frontmatter.title}</h1>
              <p>{post.frontmatter.subtitle || post.excerpt}</p>
              <span>{post.frontmatter.date}</span>
            </div>
          </div>
        </section>
        <div className='row'>
          <div
            className={`col-12 ${styles.blogPostContent}`}
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </div>
      </div>

      <section className={styles.latestStories}>
        <div className='container'>
          <div className='row'>

            {related.map((p) => (
              <BlogPostItem post={p} key={p.id} />
            ))}
          </div>
        </div>
        <div className='row'>
          <div className='col-12'>
            <Link to='/blog' className={styles.viewAll}>View all Blog posts</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};
export default BlogPostTemplate;
BlogPostTemplate.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.object,
      html: PropTypes.string,
      excerpt: PropTypes.object,
    }),
    featured: PropTypes.object,
  }).isRequired,
};
export const pageQuery = graphql`
    query BlogPostBySlug($slug: String!) {
        markdownRemark(fields: { slug: { eq: $slug } }) {
            id
            excerpt(pruneLength: 160)
            html
            frontmatter {
                title
                subtitle
                date
                featured_image {
                    childImageSharp {
                        fluid(maxWidth: 1200, quality: 92) {
                            ...GatsbyImageSharpFluid_withWebp
                        }
                    }
                }
            }
        }
        featured: allMarkdownRemark(
            filter: { frontmatter: { featured: { eq: true } } }
            limit: 3
            sort: { fields: [frontmatter___date], order: DESC }
        ) {
            nodes {
                fields {
                    slug
                }
                frontmatter {
                    title
                    subtitle
                    author
                    date
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
    }
`;
