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

/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import * as React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { graphql, useStaticQuery } from 'gatsby';
import favDark from '../images/favicon-dark.png';
import favGreen from '../images/favicon-green.png';

function SEO({
  description, lang, meta, title, url, creators, image,
}) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
          }
        }
      }
    `,
  );

  const favicon = {
    rel: 'icon',
    type: 'image/png',
    href:
      typeof window !== 'undefined'
      && window.matchMedia
      && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? favGreen
        : favDark,
  };

  const metaDescription = description || site.siteMetadata.description;

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={`%s | ${site.siteMetadata.title}`}
      link={[favicon]}
      meta={[
        {
          name: 'description',
          content: metaDescription,
        },
        {
          property: 'og:title',
          content: title,
        },
        {
          name: 'twitter:title',
          content: title,
        },
        {
          property: 'og:description',
          content: metaDescription,
        },
        {
          name: 'twitter:description',
          content: metaDescription,
        },
        {
          property: 'og:type',
          content: 'website',
        },
        {
          name: 'twitter:card',
          content: 'summary_large_image',
        },
        {
          property: 'og:image',
          content: image,
        },
        {
          name: 'twitter:image',
          content: `https://blog.px.dev${image}`,
        },
        {
          name: 'twitter:site',
          content: '@pixie_run',
        },
        {
          property: 'og:locale',
          content: 'en_US',
        },
        {
          property: 'og:url',
          content: url,
        },
        {
          property: 'og:site_name',
          content: site.siteMetadata.title,
        },
        {
          property: 'og:image:width',
          content: image ? 1200 : null,
        },
        {
          property: 'og:image:height',
          content: image ? 500 : null,
        },
      ].concat(meta)
        .concat(creators.map((creator) => ({ name: 'twitter:creator', content: creator })))}
    />
  );
}

SEO.defaultProps = {
  lang: 'en',
  meta: [],
  description: '',
  image: null,
  url: '',
  creators: [],
};

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  image: PropTypes.string,
  url: PropTypes.string,
  creators: PropTypes.arrayOf(PropTypes.string),
  meta: PropTypes.arrayOf(PropTypes.shape),
  title: PropTypes.string.isRequired,
};

export default SEO;
