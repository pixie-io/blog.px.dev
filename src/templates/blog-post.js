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

import React from 'react';
import { MDXRenderer } from 'gatsby-plugin-mdx';
import { MDXProvider } from '@mdx-js/react';

import { graphql, Link } from 'gatsby';
import Img from 'gatsby-image';
import PropTypes from 'prop-types';
import { LinkedinShareButton, RedditShareButton, TwitterShareButton } from 'react-share';
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import { Disqus } from 'gatsby-plugin-disqus';
import * as styles from './blog-post.module.scss';
import Layout from '../components/layout';
import SEO from '../components/seo';
import mdxComponents from '../components/mdxComponents/index.tsx';
import PostPlaceholder from '../components/post-placeholder';
import reddit from '../images/icons/reddit-icon.svg';
import twitter from '../images/icons/twitter-icon.svg';
import linkedin from '../images/icons/linkedin-icon.svg';
import BlogPostCard from '../components/shared/blog-post-card';
import GravatarIcon from '../components/gravatar';
import HLink from '../components/mdxComponents/h-link.tsx';

const categoryLink = require('../components/category-link');

const MetaBarHeader = ({
  post,
  shareUrl,
}) => (
  <div className={styles.metaBar}>
    <div className='row'>
      <div className='col-9'>
        <div className={styles.postHeader}>
          {(post.frontmatter.emails || []).map((e) => (
            <div className={styles.authorAvatar}>
              <GravatarIcon email={e} />
            </div>
          ))}
          <div>
            <Typography variant='body1' className={styles.author}>
              {post.frontmatter.authors.map((a) => (a.id)).join(', ')}
            </Typography>
            <span className={styles.date}>{post.frontmatter.date}</span>
          </div>
        </div>
      </div>
      <div className='col-3'>

        <div className={styles.socialIcons}>
          <RedditShareButton url={shareUrl}>
            <img src={reddit} alt='reddit' />
          </RedditShareButton>
          <TwitterShareButton url={shareUrl}>
            <img src={twitter} alt='twitter' />
          </TwitterShareButton>
          <LinkedinShareButton
            title={post.frontmatter.title}
            summary={post.frontmatter.excerpt}
            url={shareUrl}
          >
            <img src={linkedin} alt='linkedin' />
          </LinkedinShareButton>
        </div>

      </div>
    </div>
  </div>
);
const MetaBarFooter = ({
  authors,
}) => (
  authors.map((a) => (
    <div className={styles.metaBar}>
      <div className='row'>
        <div className='col-9'>
          <div className={styles.postHeader}>
            <div className={styles.authorAvatar}>
              <GravatarIcon email={a.email} />
            </div>
            <div>
              <Typography variant='body1' className={styles.author}>
                {a.id}
                {a.twitter && (
                <a
                  href={`https://twitter.com/${a.twitter}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className={styles.authorTwitter}
                >
                  {' '}
                  <img src={twitter} alt='twitter' />
                </a>
                )}
              </Typography>
              <span className={styles.date}>{a.bio}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  ))
);
const useStyles = makeStyles((theme) => ({
  body: {
    backgroundColor: theme.palette.mode === 'light' ? 'white' : '#161616',
    '& figcaption': {
      color: theme.palette.primary.main,
      fontSize: '16px',
    },
  },
}));

// eslint-disable-next-line react/prop-types
const BlogPostTemplate = ({
  data,
  location = { href: '' },
}) => {
  const post = data.mdx;
  const related = data.related.nodes;
  const muiClasses = useStyles();
  const { categories } = post.frontmatter;
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
          creators={post.frontmatter.authors.map(
            ({ twitter: twitterHandle }) => (twitterHandle),
          ).filter((n) => n)}
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
                {categories.length
                  ? (
                    <Link to={categoryLink.categoryLink(categories[0])}>
                      {categories[0]}
                    </Link>
                  ) : <></>}
              </div>
              <HLink id='title' variant='h1'>{post.frontmatter.title}</HLink>
            </div>
          </div>
          <MetaBarHeader post={post} shareUrl={location.href} />
          <div className={styles.postBody}>
            <div className='row'>
              <div className='col-12'>
                <MDXProvider components={mdxComponents}>
                  <MDXRenderer>{post.body}</MDXRenderer>
                </MDXProvider>
              </div>
            </div>
          </div>
          <MetaBarFooter authors={post.frontmatter.authors} />
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
                <p>Related Stories</p>
              </div>
              {related.map((p) => (
                <BlogPostCard post={p} key={p.fields.slug} />
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
      frontmatter: PropTypes.shape,
      body: PropTypes.string,
      excerpt: PropTypes.string,
    }),
    related: PropTypes.shape,
  }).isRequired,
  location: PropTypes.shape({ href: PropTypes.string }).isRequired,

};
export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    mdx(fields: { slug: { eq: $slug } }) {
      excerpt(pruneLength: 160)
      body
      frontmatter {
        title
        authors {
          id
          bio
          email
          twitter
        }
        emails
        categories
        date(formatString: "MMMM DD, YYYY")
        featured_image {
          childImageSharp {
            fluid(maxHeight: 500, quality: 92) {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
        }
      }
    }
    related: allMdx(
      filter: {
        fields: { slug: { ne: $slug } }
      }
      limit: 3
      sort: { fields: [frontmatter___date], order: DESC }
    ) {
      nodes {
        fields {
          slug
        }
        frontmatter {
          title
          authors {
            id
          }
          date(formatString: "MMM DD, YYYY")
          featured_image {
            childImageSharp {
              fluid(maxWidth: 320, quality: 92) {
                ...GatsbyImageSharpFluid_withWebp
              }
            }
          }
        }
      }
    }
  }
`;
