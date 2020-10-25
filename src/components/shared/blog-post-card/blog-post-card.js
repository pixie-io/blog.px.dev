import React from 'react';
import { Link } from 'gatsby';
import Img from 'gatsby-image';
import PropTypes from 'prop-types';
import styles from './blog-post-card.module.scss';
import PostPlaceholder from '../../post-placeholder';

const BlogPostCard = ({ post }) => {
  const {
    frontmatter: {
      title,
      featured_image: featuredImage,
      author,
      authors,
      date,
      category,
    },
    fields: { slug },
  } = post;
  const mapAuthors = authors ?? [author];
  return (
    <div className='col-4 '>
      <article className={`${styles.card} blog-post-card`}>
        <Link to={`/${slug}`}>
          <div className={styles.cardImage}>
            {featuredImage
              ? <Img fluid={featuredImage.childImageSharp.fluid} alt={title} />
              : <PostPlaceholder />}
          </div>
          <div className={styles.cardBody}>
            <h5>{title}</h5>
            <p className={styles.authorRow}>
              {mapAuthors.join(', ')}
              {' '}
              in
              {' '}
              {category}
            </p>
            <p className={styles.dateRow}>
              {date}
            </p>
          </div>
        </Link>
      </article>
    </div>
  );
};
BlogPostCard.propTypes = {
  post: PropTypes.shape({
    frontmatter: PropTypes.object,
    fields: PropTypes.object,
    excerpt: PropTypes.string,
  }).isRequired,
};

export default BlogPostCard;
