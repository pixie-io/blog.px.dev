import React from 'react';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import { MDXProvider } from '@mdx-js/react';

import { graphql } from 'gatsby';
import Img from 'gatsby-image';
import PropTypes from 'prop-types';
import styles from './blog-post.module.scss';
import Layout from '../components/layout';
import BlogPostItem from '../components/shared/blog-post-item';
import mdxComponents from '../components/mdxComponents';
import PostPlaceholder from '../components/post-placeholder';
import ShareIcons from '../components/shared/share-icons';
import Newsletter from '../components/shared/newsletter/newsletter';

const BlogPostTemplate = ({ data }) => {
  const post = data.mdx;
  const related = data.featured.nodes;

  return (
    <Layout>
      <div className={styles.blogPost}>
        {post.frontmatter.featured_image
          ? (
            <Img
              className={styles.topImage}
              fluid={post.frontmatter.featured_image.childImageSharp.fluid}
            />
          ) : <PostPlaceholder />}
        <section>
          <div className={`${styles.blogPostContainer} container`}>
            <div className='row'>
              <div className='col-12'>
                <div className={styles.postCategory}>{post.frontmatter.category}</div>
                <div className={styles.postShare}>
                  <ShareIcons />
                  <div>
                    <div className={styles.postAuthor}>
                      {post.frontmatter.author}
                    </div>
                    <div className={styles.postDate}>
                      {post.frontmatter.date}
                      {' • '}
                      {post.timeToRead}
                      {' '}
                      minute
                      {post.timeToRead > 1 ? 's' : ''}
                      {' '}
                      read
                    </div>

                  </div>
                </div>
                <h1>{post.frontmatter.title}</h1>
                <div className={styles.postBody}>
                  <MDXProvider components={mdxComponents}>
                    <MDXRenderer>{post.body}</MDXRenderer>
                  </MDXProvider>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className='clearfix' style={{ marginBottom: '51px' }} />
          <Newsletter />
          <div className='clearfix' style={{ marginBottom: '51px' }} />
          <div className='container'>
            <div className='row'>
              <div className='col-12'>
                <div className={styles.postCategory}>{post.frontmatter.category}</div>
                <div className={styles.postShare}>
                  <ShareIcons />
                  <div>
                    <div className={styles.postAuthor}>
                      {post.frontmatter.author}
                    </div>
                    <div className={styles.postDate}>
                      {post.frontmatter.date}
                      {' • '}
                      {post.timeToRead}
                      {' '}
                      minute
                      {post.timeToRead > 1 ? 's' : ''}
                      {' '}
                      read
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className='clearfix' />
        <section className={styles.readNext}>
          <div className='container'>
            <div className='row'>
              <div className='col-12'>
                <h3>Read This Next</h3>
              </div>
              <div className='row'>
                {related.map((p) => (
                  <BlogPostItem post={p} key={p.fields.slug} />
                ))}
              </div>
            </div>
          </div>

        </section>
      </div>
    </Layout>
  );
};
export default BlogPostTemplate;
BlogPostTemplate.propTypes = {
  data: PropTypes.shape({
    mdx: PropTypes.shape({
      frontmatter: PropTypes.object,
      body: PropTypes.string,
      timeToRead: PropTypes.number,
      excerpt: PropTypes.string,
    }),
    featured: PropTypes.object,
  }).isRequired,
};
export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    mdx(fields: { slug: { eq: $slug } }) {
      excerpt(pruneLength: 160)
      body
      timeToRead
      frontmatter {
        title
        subtitle
        date
        category
        author
        featured_image {
          childImageSharp {
            fluid(maxWidth: 1200, quality: 92) {
              ...GatsbyImageSharpFluid_withWebp
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
        timeToRead
        frontmatter {
          title
          subtitle
          author
          date
          category
          featured_image {
            childImageSharp {
              fluid(maxWidth: 1200, quality: 92) {
                ...GatsbyImageSharpFluid_withWebp
              }
            }
          }
        }
      }
    }
  }
`;
