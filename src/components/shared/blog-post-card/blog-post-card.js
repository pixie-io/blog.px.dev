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
import styles from './blog-post-card.module.scss';
import { urlFromSlug } from '../../utils';
import PostPlaceholder from '../../post-placeholder';

const BlogPostCard = ({ post }) => {
  const {
    frontmatter: {
      title,
      featured_image: featuredImage,
      authors,
      date,
    },
    fields: { slug },
  } = post;
  return (
    <div className='col-4 '>
      <article className={`${styles.card} blog-post-card`}>
        <Link to={urlFromSlug(slug)}>
          <div className={styles.cardImage}>
            {featuredImage
              ? <Img fluid={featuredImage.childImageSharp.fluid} alt={title} />
              : <PostPlaceholder />}
          </div>
          <div className={styles.cardBody}>
            <h4>{title}</h4>
            <p className={styles.authorRow}>
              {authors.map((a) => (a.id)).join(', ')}
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
    frontmatter: PropTypes.shape,
    fields: PropTypes.shape,
    excerpt: PropTypes.string,
  }).isRequired,
};

export default BlogPostCard;
