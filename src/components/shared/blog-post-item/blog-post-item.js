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
import { Link } from 'gatsby';
import Img from 'gatsby-image';
import PropTypes from 'prop-types';
import { withStyles } from '@mui/styles';
import { Typography } from '@mui/material';
import * as styles from './blog-post-item.module.scss';
import PostPlaceholder from '../../post-placeholder';
import GravatarIcon from '../../gravatar';
import { urlFromSlug } from '../../utils';

const BlogPostItem = withStyles(() => ({
  image: {
    marginTop: '40px',
  },
}))(({
  post,
  classes,
}) => {
  const {
    frontmatter: {
      title,
      featured_image: featuredImage,
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
        <Link to={urlFromSlug(slug)}>

          <div className={classes.image}>
            {featuredImage
              ? <Img fluid={featuredImage.childImageSharp.fluid} alt={title} />
              : <PostPlaceholder />}
          </div>
          <div className={styles.body}>
            <Typography variant='h3'>{title}</Typography>
            <Typography variant='subtitle1'>{excerpt}</Typography>
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
                    {authors.map((a) => (a.id))
                      .join(', ')}
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
    frontmatter: PropTypes.shape,
    fields: PropTypes.shape,
    timeToRead: PropTypes.number,
    excerpt: PropTypes.string,
  }).isRequired,
};

export default BlogPostItem;
