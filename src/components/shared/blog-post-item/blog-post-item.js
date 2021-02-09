import React from 'react';
import { Link } from 'gatsby';
import Img from 'gatsby-image';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import styles from './blog-post-item.module.scss';
import PostPlaceholder from '../../post-placeholder';
import GravatarIcon from '../../gravatar';

const BlogPostItem = withStyles(() => ({
  image: {
    marginTop: '80px',
  },
}))(({ post, classes }) => {
  const {
    frontmatter: {
      title,
      featured_image: featuredImage,
      author,
      authors,
      email,
      emails,
      date,
    },
    excerpt,
    timeToRead,
    fields: { slug },
  } = post;
  return (
    <article className='row'>
      <div className='col-1' />
      <div className='col-10'>
        <Link to={`/${slug}`}>

          <div className={classes.image}>
            {featuredImage
              ? <Img fluid={featuredImage.childImageSharp.fluid} alt={title} />
              : <PostPlaceholder />}
          </div>
          <div className={styles.body}>
            <Typography variant='h3'>{title}</Typography>
            <Typography variant='body1'>{excerpt}</Typography>
            <div className={styles.heading}>
              {email ? (
                <div className={styles.authorAvatar}>
                  <GravatarIcon email={email} />
                </div>
              ) : (emails || []).map((e) => (
                <div className={styles.authorAvatar}>
                  <GravatarIcon email={e} />
                </div>
              ))}
              <Typography variant='body1' className='m-0'>
                <div className={styles.authorDetails}>
                  <div className={styles.authorName}>
                    {author || (authors || []).join(', ')}
                  </div>
                  <div className={styles.dot}>•</div>
                  <div className={styles.postDetails}>
                    {date}
                  </div>
                  <div className={styles.dot}>•</div>
                  <div className={styles.postDetails}>
                    {timeToRead}
                    {' '}
                    minute read
                  </div>
                </div>
              </Typography>
            </div>
          </div>
        </Link>

      </div>
      <div className='col-1' />
    </article>
  );
});
BlogPostItem.propTypes = {
  post: PropTypes.shape({
    frontmatter: PropTypes.object,
    fields: PropTypes.object,
    timeToRead: PropTypes.number,
    excerpt: PropTypes.string,
  }).isRequired,
};

export default BlogPostItem;
