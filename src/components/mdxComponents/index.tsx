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

import baseComponents from './baseComponents';
import SvgRenderer from './svg';
import Command from './command';
import Quote from './quote';
import BlockQuote from './block-quote';
import CustomTableCell from './custom-table-cell';

export default {
  ...baseComponents,
  svg: (props: any) => <SvgRenderer {...props} />,
  quote: (props: any) => <Quote {...props} />,
  blockquote: (props: any) => <BlockQuote {...props} />,
  command: (props: any) => <Command {...props} />,
  td: ({ align, ...props }) => <CustomTableCell {...props} align={align || undefined} />,

};
