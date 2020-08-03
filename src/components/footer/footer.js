import React from 'react';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import styles from './footer.module.scss';
import { docsRedirect, loginRedirect } from '../shared/tracking-utils';
import pixieLogo from '../../images/footer/pixie-logo.svg';
import docs from '../../images/footer/docs-icon.svg';
import github from '../../images/footer/github-icon.svg';
import slack from '../../images/footer/slack-icon.svg';
import youtube from '../../images/footer/youtube-icon.svg';
import twitter from '../../images/footer/twitter-icon.svg';
import linkedIn from '../../images/footer/linkedin-icon.svg';

const Footer = ({ whiteFooter }) => (
  <footer className={`${whiteFooter ? styles.whitefooter : ''} ${styles.footer}`} style={{ position: 'relative' }}>
    <Link to='/'><img src={pixieLogo} alt='Pixie logo' className={styles.logo} /></Link>
    <div className='container hide-not-desktop'>
      <div className={styles.divider} />
      <div className={styles.socialIcons}>
        <a
          href='https://work.withpixie.ai/docs'
          onClick={(e) => docsRedirect(e)}
        >
          <img src={docs} className={styles.socialIcon} />
        </a>
        <a href='https://github.com/pixie-labs/pixie'>
          <img src={github} className={styles.socialIcon} />
        </a>
        <a href='https://slackin.withpixie.ai'>
          <img src={slack} className={styles.socialIcon} />
        </a>
        <a href='https://www.youtube.com/channel/UCOMCDRvBVNIS0lCyOmst7eg/featured'>
          <img src={youtube} className={styles.socialIcon} />
        </a>
        <a href='https://twitter.com/pixie_run'>
          <img src={twitter} className={styles.socialIcon} />
        </a>
        <a href='https://www.linkedin.com/company/pixieai/'>
          <img src={linkedIn} className={styles.socialIcon} />
        </a>
      </div>
      <div className={styles.divider} />
      <ul className={styles.linksRow}>
        <li>
          <a
            href='https://work.withpixie.ai/login'
            onClick={(e) => loginRedirect(e)}
          >
            SIGN IN
          </a>
        </li>
        <li>
          <a href='https://pixielabs.ai/terms'>TERMS & PRIVACY</a>
        </li>
        <li>
          <a href='https://pixielabs.ai/community'>COMMUNITY</a>
        </li>
        <li>
          <a href='https://pixielabs.ai/careers'>CAREERS</a>
        </li>
        <li>
          <Link to='/'>BLOG</Link>
        </li>
        <li>
          <a href='https://pixielabs.ai/contact'>CONTACT</a>
        </li>
      </ul>
    </div>
    <div className={styles.copyrightLink}>© 2020, Pixie Labs Inc.</div>
  </footer>
);
Footer.propTypes = {
  whiteFooter: PropTypes.bool,
};
Footer.defaultProps = {
  whiteFooter: false,
};
export default Footer;
