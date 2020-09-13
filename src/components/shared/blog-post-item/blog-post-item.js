import React from 'react';
import { Link } from 'gatsby';
import Img from 'gatsby-image';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import styles from './blog-post-item.module.scss';
import PostPlaceholder from '../../post-placeholder';
import GravatarIcon from '../../gravatar';

const BlogPostItem = ({ post }) => {
  const {
    frontmatter: {
      title,
      featured_image: featuredImage,
      author,
      email,
      date,
      category,
    },
    excerpt,
    fields: { slug },
  } = post;
  return (
    <article className='row'>
      <Link to={`/blog/${slug}`}>
        <div className='col-2' />
        <div className='col-8'>
          <div className={styles.border}>
            <div className={styles.image}>
              {featuredImage
                ? <Img fluid={featuredImage.childImageSharp.fluid} alt={title} />
                : <PostPlaceholder />}
            </div>
            <div className={styles.body}>
              <div className={styles.heading}>
                <div className={styles.authorAvatar}>
                  <GravatarIcon email={email} />
                </div>
                <div className={styles.authorDetails}>
                  <Typography variant='body1 p-0'>
                    {author}
                  </Typography>
                  <div className={styles.dateRow}>
                    <div>{date}</div>
                    <div>{category}</div>
                  </div>
                </div>
              </div>
              <Typography variant='h3'>{title}</Typography>
              <p>{excerpt}</p>
              <div className='col-2' />
            </div>
          </div>
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
