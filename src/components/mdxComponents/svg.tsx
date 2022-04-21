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

import * as React from 'react';
import { useContext } from 'react';
import { graphql, StaticQuery } from 'gatsby';
import { ColorThemeContext } from '../color-theme.provider';
// eslint-disable-next-line import/no-cycle
import parseMd from './parseMd';

function SvgRenderer({ src, title }) {
  return (
    <StaticQuery
      query={graphql`
      query {
        images: allFile {
          edges {
            node {
              relativePath
              name
             publicURL
            }
          }
        }
      }
    `}
      render={(data) => {
        const lastDot = src.lastIndexOf('.');
        const colorContext = useContext(ColorThemeContext);
        const theme = colorContext.colorMode;

        const fileName = src.substring(0, lastDot);
        const ext = src.substring(lastDot + 1);

        const image = data.images.edges.find((n) => n.node.relativePath.endsWith(`/${src}`));
        const lightImage = data.images.edges.find((n) => n.node.relativePath.endsWith(`/${fileName}-light.${ext}`));
        const darkImage = data.images.edges.find((n) => n.node.relativePath.endsWith(`/${fileName}-dark.${ext}`));

        const getImageSrc = (th: string) => {
          if (th === 'light' && lightImage) {
            return lightImage.node.publicURL;
          }
          if (th === 'dark' && darkImage) {
            return darkImage.node.publicURL;
          }
          return image.node.publicURL;
        };
        if (!image) {
          return null;
        }
        return (

          <figure className='gatsby-resp-image-figure'>
            <img src={getImageSrc(theme)} className='blog-image' />
            <figcaption className='gatsby-resp-image-figcaption MuiTypography-body1'>{parseMd(title)}</figcaption>
          </figure>

        );
      }}
    />
  );
}

export default SvgRenderer;
