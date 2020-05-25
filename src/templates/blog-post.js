import React from 'react';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import { MDXProvider } from '@mdx-js/react';

import { graphql, Link } from 'gatsby';
import Img from 'gatsby-image';
import PropTypes from 'prop-types';
import styles from './blog-post.module.scss';
import Layout from '../components/layout';
import SEO from '../components/seo';
import BlogPostItem from '../components/shared/blog-post-item';
import mdxComponents from '../components/mdxComponents';

const BlogPostTemplate = ({ data }) => {
  const post = data.mdx;
  const related = data.featured.nodes;

  return (
    <Layout whiteFooter whiteHeader>

      <SEO title='Home' />
      <div className='container'>
        <section className={styles.header}>
          <div className={`row ${styles.singlePost}`}>
            <div className={`col-7 ${styles.featuredImage}`}>

              <div className={styles.singlePostLeftTop} />

              <Img
                fluid={post.frontmatter.featured_image.childImageSharp.fluid}
              />
            </div>
            <div className={`col-5 ${styles.detailsPost}`}>
              <h3>Pixie Engineering</h3>
              <h1>{post.frontmatter.title}</h1>
              <p>{post.frontmatter.subtitle || post.excerpt}</p>
              <span>{post.frontmatter.date}</span>
            </div>
          </div>
        </section>
        <div className='row'>
          <div className={`col-12 ${styles.blogPostContent}`}>
            <MDXProvider components={mdxComponents}>
              <MDXRenderer>{post.body}</MDXRenderer>
            </MDXProvider>
          </div>
        </div>
      </div>

      <section className={styles.latestStories}>
        <div className='container'>
          <div className='row'>
            {related.map((p) => (
              <BlogPostItem post={p} key={p.fields.slug} />
            ))}
          </div>
        </div>
        <div className='row'>
          <div className='col-12'>
            <Link to='/' className={styles.viewAll}>
              View all Blog posts
            </Link>
          </div>
        </div>
      </section>

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
