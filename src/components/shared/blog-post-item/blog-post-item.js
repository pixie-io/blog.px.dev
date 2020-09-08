import React from 'react';
import { Link } from 'gatsby';
import Img from 'gatsby-image';
import PropTypes from 'prop-types';
import styles from './blog-post-item.module.scss';
import PostPlaceholder from '../../post-placeholder';

const BlogPostItem = ({ post }) => {
  const {
    frontmatter: {
      title,
      featured_image: featuredImage,
      author,
      date,
      category,
    },
    timeToRead,
    excerpt,
    fields: { slug },
  } = post;
  return (
    <article className='row'>
      <Link to={`/blog/${slug}`}>
        <div className='col-3'>
          {featuredImage
            ? <Img fluid={featuredImage.childImageSharp.fluid} alt={title} />
            : <PostPlaceholder />}
        </div>
        <div className='col-9'>
          <p className={styles.dateRow}>
            {date}
            {' '}
            •
            {' '}
            {timeToRead}
            {' '}
            minutes read
          </p>
          <h3>{title}</h3>

          <p className={styles.authorRow}>
            {author}
            {' '}
            in
            {' '}
            {category}
          </p>
          <p>{excerpt}</p>
        </div>
      </Link>
    </article>
  );
};
BlogPostItem.propTypes = {
  post: PropTypes.shape({
    frontmatter: PropTypes.object,
    fields: PropTypes.object,
    timeToRead: PropTypes.number,
    excerpt: PropTypes.string,
  }).isRequired,
};

export default BlogPostItem;
