import React, { useState } from 'react';
import Cookies from 'js-cookie';
import styles from './cookies-banner.module.scss';

const CookiesBanner = () => {
  const isBrowser = typeof window !== 'undefined';
  const [consent, setConsent] = useState(isBrowser ? Cookies.get('consent') : null);
  const close = () => {
    Cookies.set('consent', true);
    setConsent(true);
  };
  return !consent ? (
    <div className={styles.banner}>
      <div className={styles.innerText}>
        This site uses cookies to provide you with a better user experience.
        By using Pixie, you consent to our
        <a href='https://pixielabs.ai/privacy/#Cookies' target='_blank' rel='noopener noreferrer'> use of cookies</a>
      </div>
      <button type='button' className={styles.closeButton} onClick={() => close()}>
        Close
      </button>
    </div>
  ) : '';
};
export default CookiesBanner;
