import React from 'react';

export default {
  p: ({ children }) => <p>{children}</p>,
  img: (props) => <img {...props} className='blog-image' />,
};
