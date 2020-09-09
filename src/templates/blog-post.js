import React from 'react';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import { MDXProvider } from '@mdx-js/react';

import { graphql, Link } from 'gatsby';
import Img from 'gatsby-image';
import PropTypes from 'prop-types';
import {
  FacebookShareButton,
  LinkedinShareButton,
  RedditShareButton,
  TwitterShareButton,
} from 'react-share';
import styles from './blog-post.module.scss';
import Layout from '../components/layout';
import SEO from '../components/seo';
import mdxComponents from '../components/mdxComponents/index.tsx';
import PostPlaceholder from '../components/post-placeholder';
import reddit from '../images/icons/reddit-icon.svg';
import slack from '../images/icons/slack-icon.svg';
import facebook from '../images/icons/facebook-icon.svg';
import twitter from '../images/icons/twitter-icon.svg';
import linkedin from '../images/icons/linkedin-icon.svg';
import BlogPostCard from '../components/shared/blog-post-card';

const MetaBar = ({ post, shareUrl }) => (
  <div className={styles.metaBar}>
    <div className='row'>
      <div className='col-6'>
        <div className={styles.postHeader}>
          <span className={styles.author}>{post.frontmatter.author}</span>
          <span className={styles.date}>
            {post.frontmatter.date}
            {' '}
            •
            {post.timeToRead}
            {' '}
            minutes read
          </span>
        </div>
      </div>
      <div className='col-6'>
        <div className={styles.socialIcons}>
          <a
            href='https://slackin.withpixie.ai'
            target='_blank'
            rel='noopener noreferrer'
          >
            <img src={slack} />
          </a>
          <RedditShareButton url={shareUrl}>
            <img src={reddit} />
          </RedditShareButton>
          <TwitterShareButton url={shareUrl}>
            <img src={twitter} />
          </TwitterShareButton>
          <LinkedinShareButton
            title={post.frontmatter.title}
            summary={post.frontmatter.excerpt}
            url={shareUrl}
          >
            <img src={linkedin} />
          </LinkedinShareButton>
          <FacebookShareButton
            url={shareUrl}
          >
            <img src={facebook} />
          </FacebookShareButton>
        </div>
      </div>
    </div>
  </div>
);
// eslint-disable-next-line react/prop-types
const BlogPostTemplate = ({ data, location = { href: '' } }) => {
  const post = data.mdx;
  const related = data.featured.nodes;

  return (
    <Layout>
      <div className={styles.blogPost}>
        <SEO title='Home' />
        <div className='container'>
          <div className='row'>
            <div className='col-12'>
              <div className={styles.breadcrumb}>
                <Link to='/'>Blog</Link>
                {' '}
                /
                {' '}
                {post.frontmatter.category}
              </div>
              <h1>{post.frontmatter.title}</h1>
            </div>
          </div>
          <MetaBar post={post} shareUrl={location.href} />
          <div className={styles.postImage}>
            <div className='row'>
              <div className='col-12'>
                {post.frontmatter.featured_image ? (
                  <Img
                    fluid={
                      post.frontmatter.featured_image.childImageSharp.fluid
                    }
                  />
                ) : (
                  <PostPlaceholder />
                )}
              </div>
            </div>
          </div>
          <div className={styles.postBody}>
            <div className='row'>
              <div className='col-12'>
                <MDXProvider components={mdxComponents}>
                  <MDXRenderer>{post.body}</MDXRenderer>
                </MDXProvider>
              </div>
            </div>
          </div>
          <MetaBar post={post} shareUrl={location.href} />
        </div>

        <section className={styles.relatedStories}>
          <div className='container'>
            <div className='row'>
              <div className='col-12'>
                <h3>Related Stories</h3>
              </div>
              {related.map((p) => (
                <BlogPostCard post={p} key={p.fields.slug} />
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
      timeToRead: PropTypes.number,
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
        author
        category
        date(formatString: "DD MMMM YYYY")
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
        excerpt(pruneLength: 200)
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
