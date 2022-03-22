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

import CodeRenderer from './codeRenderer';

const cache = new Map<string, any>();

interface GhEmbedProps {
  language: string;
  /** Example: pixie-io/pixie-blog */
  repo: string;
  /** Example: src/components/mdxComponents/github-embed.tsx (this file!) */
  srcPath: string;
}
const GhEmbed = React.memo<GhEmbedProps>(({ language, repo, srcPath }) => {
  const [res, setRes] = React.useState(null);
  const [content, setContent] = React.useState('');

  React.useEffect(() => {
    let active = true;
    const url = `https://api.github.com/repos/${repo}/contents/${srcPath}`;
    if (cache.has(url)) {
      setRes(cache.get(url));
    } else {
      fetch(`https://api.github.com/repos/${repo}/contents/${srcPath}`).then((val) => {
        val.json().then((json) => {
          cache.set(url, json);
          if (active) {
            setRes(json);
          }
        });
      });
    }
    return () => { active = false; };
  }, [repo, srcPath]);

  React.useEffect(() => {
    if (!res) setContent('');
    else {
      try {
        setContent(global.atob(res.content));
      } catch (e) {
        setContent('Could not fetch content from GitHub');
      }
    }
  }, [res]);

  return <CodeRenderer className={`language-${language}`} code={content} />;
});
GhEmbed.displayName = 'GhEmbed';

export default GhEmbed;
