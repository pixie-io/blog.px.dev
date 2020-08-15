import React from 'react';

import styles from './newsletter.module.scss';

const Newsletter = () => (
  <section className={`${styles.newsletter} container`}>
    <div className='col-1' />
    <div className='col-10'>
      <div className='row'>
        <h2>Subscribe to our newsletter</h2>
        <p>Tortor blandit fames eleifend adipiscing dictumst id lectus. Sagittis nam nulla feugiat tristique dictum duis nisl, ullamcorper molestie. </p>
      </div>
    </div>
    <div className='col-1' />

    <div className='clearfix' />

  </section>
);


export default Newsletter;
