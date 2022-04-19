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
import { graphql, StaticQuery } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';

function PostPlaceholder() {
  return (
    <StaticQuery
      query={graphql`
      query {
        images: allFile(
          filter: {
            name: { eq: "pixie" }
            sourceInstanceName: { eq: "images" }
          }
        ) {
          edges {
            node {
              relativePath
              name
               childImageSharp {
                  gatsbyImageData(layout: CONSTRAINED)
                }
            }
          }
        }
      }
    `}
      render={(data) => (
        <GatsbyImage
          alt='Blog post'
          loading='lazy'
          image={data.images.edges[0].node.childImageSharp.gatsbyImageData}
        />
      )}
    />
  );
}

export default PostPlaceholder;
