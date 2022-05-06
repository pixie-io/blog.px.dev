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
/* eslint-disable import/prefer-default-export */
import * as React from 'react';
import TopLayout from './TopLayout';
import '../../src/scss/style.scss';

const MagicScriptTag = () => {

    let iif = `
        (function() {
            if(window.localStorage.getItem('theme') === 'dark'){
                document.body.classList.add('dark');
            } else if(window.localStorage.getItem('theme') !== 'light'){
                if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.body.classList.add('dark');
                }
            }
                
                   
         })()
        `;
    // eslint-disable-next-line react/no-danger
    return <script dangerouslySetInnerHTML={{__html: iif}}/>;
};
export const onRenderBody = ({setPreBodyComponents}) => {
    setPreBodyComponents(<MagicScriptTag key={'_'}/>);
};

export const wrapRootElement = ({element}) => {
    return <TopLayout>{element}</TopLayout>;
};
