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
