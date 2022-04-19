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
import { Tab, Tabs } from '@mui/material';

import { withStyles } from '@mui/styles';
// eslint-disable-next-line import/no-cycle
import parseMd from './parseMd';

// This is a circular dependency, but only at declaration time - the usages fire after definition.
// eslint-disable-next-line import/no-cycle

// Doesn't get used directly; only its props are
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function CustomTab({ label, children }) {
  return null;
}

function TabPanel({ show, contents }) {
  const children = React.useMemo(() => (
    typeof contents === 'string' ? parseMd(contents) : contents
  ), [contents]);

  if (!show) return null;
  return <div>{children}</div>;
}

export const CustomTabs = withStyles(({ palette }) => ({
  tabHeader: {
    color: palette.primary.main,
    letterSpacing: 'initial',
  },
}))((props) => {
  const { classes, children } = props;
  const [tabIndex, setTabIndex] = React.useState(0);

  const tabs = React.useMemo(() => (
    React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) return null;
      const label = child.props?.label;
      const contents = child.props?.children;
      return label && contents ? { label, contents } : null;
    }).filter((v) => v)
  ), [children]);

  return (
    <>
      <Tabs value={tabIndex} onChange={(_, v) => setTabIndex(v)}>
        {tabs.map(({ label }) => <Tab label={label} className={classes.tabHeader} />)}
      </Tabs>
      {tabs.map(({ label, contents }, i) => (
        <TabPanel show={tabIndex === i} key={label} contents={contents} />
      ))}
    </>
  );
});

export default CustomTabs;
