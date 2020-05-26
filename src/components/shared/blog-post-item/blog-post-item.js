import React from 'react';
import { Link } from 'gatsby';
import Img from 'gatsby-image';

import PropTypes from 'prop-types';
import styles from './blog-post-item.module.scss';

const BlogPostItem = ({ post }) => {
  const {
    frontmatter: {
      title,
      featured_image: featuredImage,
      author,
      date,
      //  category,
    },
    fields: { slug },
  } = post;

  return (
    <article className='col-4'>
      <div className={styles.articleContent}>
        <Link to={`/blog/${slug}`}>
          <div className={styles.featuredImage}>
            <Img fluid={featuredImage.childImageSharp.fluid} alt={title} />
          </div>
          <div className={styles.content}>
            <h4>{title}</h4>
            <p className='subtitle1'>{author}</p>
            <span>{date}</span>
          </div>
        </Link>
      </div>
    </article>
  );
};
BlogPostItem.propTypes = {
  post: PropTypes.shape({
    frontmatter: PropTypes.object,
    fields: PropTypes.object,
  }).isRequired,
};

export default BlogPostItem;
