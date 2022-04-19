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

import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import { GatsbyImage } from 'gatsby-plugin-image';
import { urlFromSlug } from '../../utils';
import PostPlaceholder from '../../post-placeholder';
import GravatarIcon from '../../gravatar';
import BlogAuthorsHeader from '../blog-authors-header';

// @ts-ignore
function BlogPostCard({ post }) {
  const {
    excerpt,
    timeToRead,
    frontmatter: {
      title,
      featured_image: featuredImage,
      authors,
      date,
    },
    fields: { slug },
  } = post;
  return (
    <article className='blog-post-card'>
      <Link to={urlFromSlug(slug)}>
        <Box borderRadius='10px' className='blog-post-card-image'>
          {featuredImage
            ? <GatsbyImage image={featuredImage.childImageSharp.gatsbyImageData} alt={title} />
            : <PostPlaceholder />}
        </Box>
        <Box mb={1}>
          <Typography variant='h5' sx={{ mt: 1 }}>{title}</Typography>
          <Typography variant='body1' sx={{ my: 1 }}>{excerpt}</Typography>
          <BlogAuthorsHeader authors={authors} timeToRead={timeToRead} date={date} />
        </Box>
      </Link>
    </article>
  );
}

export default BlogPostCard;
