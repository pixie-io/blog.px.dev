import React from 'react';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import { MDXProvider } from '@mdx-js/react';

import { graphql, Link } from 'gatsby';
import Img from 'gatsby-image';
import PropTypes from 'prop-types';
import { LinkedinShareButton, RedditShareButton, TwitterShareButton } from 'react-share';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Disqus, CommentCount } from 'gatsby-plugin-disqus';
import styles from './blog-post.module.scss';
import Layout from '../components/layout';
import SEO from '../components/seo';
import mdxComponents from '../components/mdxComponents/index.tsx';
import PostPlaceholder from '../components/post-placeholder';
import reddit from '../images/icons/reddit-icon.svg';
import twitter from '../images/icons/twitter-icon.svg';
import linkedin from '../images/icons/linkedin-icon.svg';
import BlogPostCard from '../components/shared/blog-post-card';
import GravatarIcon from '../components/gravatar';

const categoryLink = require('../components/category-link');

const MetaBar = ({ post, shareUrl, author }) => (
  <div className={styles.metaBar}>
    <div className='row'>
      <div className='col-9'>
        <div className={styles.postHeader}>
          <div className={styles.authorAvatar}>
            <GravatarIcon email={post.frontmatter.email} />
          </div>
          <div>
            <Typography variant='body1' className={styles.author}>
              {post.frontmatter.author}
              {author && (
                <a
                  href={author.twitter}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={styles.authorTwitter}
                >
                  {' '}
                  <img src={twitter} />
                </a>
              )}
            </Typography>
            <span className={styles.date}>{author ? author.bio : post.frontmatter.date}</span>
          </div>
        </div>
      </div>
      <div className='col-3'>
        {!author
        && (
          <div className={styles.socialIcons}>
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
          </div>
        )}
      </div>
    </div>
  </div>
);

const useStyles = makeStyles((theme) => ({
  body: {
    backgroundColor: theme.palette.type === 'light' ? 'white' : '#161616',
    '& figcaption': {
      color: theme.palette.primary.main,
    },
  },
}));

// eslint-disable-next-line react/prop-types
const BlogPostTemplate = ({ data, location = { href: '' } }) => {
  const post = data.mdx;
  const related = data.featured.nodes;
  const muiClasses = useStyles();
  const author = data.authors.edges.map((a) => a.node)
    .find((a) => a.id === post.frontmatter.author);

  const disqusConfig = {
    url: location.href,
    identifier: post.frontmatter.title,
    title: post.frontmatter.title,
  };

  return (
    <Layout showSwitch>
      <div className={`${styles.blogPost} ${muiClasses.body}`}>
        <SEO
          title={post.frontmatter.title}
          description={post.excerpt}
          url={location.href}
          image={post.frontmatter.featured_image
            ? post.frontmatter.featured_image.childImageSharp.fluid.src
            : null}
        />

        <div className='container'>
          <div className='row'>
            <div className='col-12'>
              <div className={styles.postImage}>
                {post.frontmatter.featured_image ? (
                  <Img
                    style={{ maxHeight: '500px' }}
                    imgStyle={{ objectFit: 'cover' }}
                    fluid={
                      post.frontmatter.featured_image.childImageSharp.fluid
                    }
                  />
                ) : (
                  <PostPlaceholder
                    imgStyle={{ objectFit: 'cover' }}
                    style={{ maxHeight: '300px' }}
                  />
                )}
              </div>
              <div className={styles.breadcrumb}>
                <Link to='/'>Blog</Link>
                {' '}
                /
                {' '}
                <Link to={categoryLink.categoryLink(post.frontmatter.category)}>
                  {post.frontmatter.category}
                </Link>
              </div>
              <Typography variant='h1'>{post.frontmatter.title}</Typography>
            </div>
          </div>
          <MetaBar post={post} shareUrl={location.href} />
          <div className={styles.postBody}>
            <div className='row'>
              <div className='col-12'>
                <MDXProvider components={mdxComponents}>
                  <MDXRenderer>{post.body}</MDXRenderer>
                </MDXProvider>
              </div>
            </div>
          </div>
          <MetaBar post={post} author={author} shareUrl={location.href} />
          <div className='row'>
            <div className='col-12'>
              <Disqus config={disqusConfig} />
            </div>
          </div>
        </div>
        <section className={styles.relatedStories}>
          <div className='container'>
            <div className='row'>
              <div className='col-12'>
                <hr />
                <Typography variant='h4'>Related Stories</Typography>
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
    }),
    featured: PropTypes.object,
    authors: PropTypes.object,
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
        author
        email
        category
        date(formatString: "MMMM DD, YYYY")
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
      filter: {
        fields: { slug: { ne: $slug } }
        frontmatter: { featured: { eq: true } }
      }
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
          email
          date(formatString: "MMMM DD, YYYY")
          category
          featured_image {
            childImageSharp {
              fluid(maxWidth: 1920, quality: 92) {
                ...GatsbyImageSharpFluid_withWebp
              }
            }
          }
        }
      }
    }
    authors:allAuthorYaml {
    edges {
      node {
        id
        bio
        email
        twitter
      }
    }
  }
  }
`;
