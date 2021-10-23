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

import React, { useMemo } from 'react';
import { toUrl } from 'gatsby-source-gravatar';
import GatsbyImage from 'gatsby-image';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
  icon: {
    width: '45px',
    height: '45px',
    overflow: 'hidden',
    borderRadius: '50%',
  },
}));

const GravatarIcon = (({ email }) => {
  const url = useMemo(() => toUrl(email || ''), []);
  const classes = useStyles();
  return (
    <GatsbyImage
      className={classes.icon}
      fluid={{
        aspectRatio: 1 / 1,
        src: `${url}?size=45`,
        srcSet: `${url}?size=90 90w, ${url}?size=180 180w`,
        sizes: '(max-width: 45px) 90px, 180px',
      }}
    />
  );
});

export default GravatarIcon;
