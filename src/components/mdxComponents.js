import React from 'react';
import Code from './mdxComponents/code';
import CodeRenderer from './mdxComponents/codeRenderer.tsx';
import Pre from './mdxComponents/pre';

const getChildren = (props) => props.children;
const getLanguage = (props) => (props.className ? props.className.replace('language-', '') : 'bash');
export default {
  p: ({ children }) => <p>{children}</p>,
  img: (props) => <img {...props} className='blog-image' />,
  pre: Pre,
  code: (props) => (
    <CodeRenderer
      {...props}
      code={getChildren(props)}
      language={getLanguage(props)}
    />
  ),
  inlineCode: (props) => <Code {...props} />,
};
