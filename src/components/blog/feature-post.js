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

          <div className={`col-5 ${styles.featuredImage}`}>
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
            className={`col-7  ${styles.featuredExcerpt}`}
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
