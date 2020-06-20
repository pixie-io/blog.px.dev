import React from 'react';
import Img from 'gatsby-image';
import { Link } from 'gatsby';

import PropTypes from 'prop-types';
import styles from './feature-blog.module.scss';
import PostPlaceholder from '../post-placeholder';

const FeatureBlogPostItem = ({ post }) => {
  const {
    frontmatter: {
      title, featured_image: featuredImage, date, subtitle,
    },
    fields: { slug },
    excerpt,
  } = post;
  return (
    <div className={`container ${styles.featured}`}>
      <Link to={`/blog/${slug}`}>
        <div className='row'>

          <div className={`col-7 ${styles.featuredImage}`}>
            <div className={styles.featuredLeftBottom} />
            <div className={styles.featuredLeftTop} />
            <div className={styles.featuredRightTop} />
            {featuredImage ? (
              <Img
                className={styles.featureImage}
                fluid={featuredImage.childImageSharp.fluid}
                alt={title}
              />
            )
              : <PostPlaceholder />}
          </div>
          <div
            className={`col-5  ${styles.featuredExcerpt}`}
          >
            <h3>Pixie Engineering</h3>
            <h1>{title}</h1>
            <p>{subtitle || excerpt}</p>
            <span>{date}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

FeatureBlogPostItem.propTypes = {
  post: PropTypes.shape({
    frontmatter: PropTypes.object,
    fields: PropTypes.object,
    excerpt: PropTypes.string,
  }).isRequired,
};
export default FeatureBlogPostItem;
