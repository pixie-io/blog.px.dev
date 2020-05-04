import React from 'react';
import { Link } from 'gatsby';

import BodyClassName from 'react-body-classname';
import Layout from '../components/layout';
import SEO from '../components/seo';
import styles from '../scss/pages/not-found.module.scss';
import img404 from '../images/404.svg';

const NotFoundPage = () => (
  <Layout>
    <SEO title='404: Not found' />
    <BodyClassName className='black' />
    <section className={styles.notFound}>
      <img src={img404} alt='' />
      <p>
        Oops! Looks like you are lost in space.
        <br />
        Lets head back&nbsp;
        <Link to='/'>home.</Link>
      </p>
    </section>
  </Layout>
);

export default NotFoundPage;
