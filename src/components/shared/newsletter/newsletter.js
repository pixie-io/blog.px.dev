import React from 'react';

import styles from './newsletter.module.scss';

const Newsletter = () => (
  <section className='container'>
    <div className={`${styles.newsletter} row`}>
      <div className='col-12'>
        <h2>Subscribe to our newsletter</h2>
        <p>
          Tortor blandit fames eleifend adipiscing dictumst id lectus. Sagittis nam nulla feugiat
          tristique dictum duis nisl, ullamcorper molestie.
          {' '}
        </p>
      </div>
    </div>
    <div className='clearfix' />
  </section>
);


export default Newsletter;
