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
                <h1>{post.frontmatter.title}</h1>
                <p>{post.frontmatter.subtitle || post.excerpt}</p>
                <span>{post.frontmatter.date}</span>
                <MDXProvider components={mdxComponents}>
                  <MDXRenderer>{post.body}</MDXRenderer>
                </MDXProvider>
              </div>
            </div>
          </div>
        </section>
        <div className='clearfix' />
        <section className={styles.readNext}>
          <div className='container'>
            <div className='row'>
              {related.map((p) => (
                <BlogPostItem post={p} key={p.fields.slug} />
              ))}
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
    featured: allMdx(
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
