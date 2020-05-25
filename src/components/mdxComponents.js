import React from 'react';

export default {
  p: (props) => <p {...props}>{props.children}</p>,
  img: (props) => <img {...props} className='blog-image' />,

};
