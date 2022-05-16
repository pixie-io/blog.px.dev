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

/*
 * Copyright The Pixie Authors.
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
 */

import * as React from 'react';
import { styled, Typography, TypographyVariant } from '@mui/material';
import link from '../../images/link.svg';

const LinkContainer = styled('div')(
  () => `
  &:hover {
      a {
        opacity: 1;
      },
    },
`,
);
const HeaderAnchor = styled('div')(
  () => `
        display: block;
        position: relative;
        top: -100px;
`,
);
const HeaderLink = styled('a')(
  () => `
        color: inherit;
        display: inline;
        opacity: 0;
        margin-left: 10px;
        position: absolute;
        img: {
            vertical-align: middle;
        },
`,
);

interface Props {
  id: string;
  variant: TypographyVariant;
}

const HLink: React.FC<Props> = ({ id, children, variant }) => (
  <LinkContainer>
    <HeaderAnchor id={id} />
    <Typography variant={variant}>
      {children}
      {children && <HeaderLink href={`#${id}`}><img src={link} alt='Permalink' /></HeaderLink>}
    </Typography>
  </LinkContainer>
);

export default HLink;
