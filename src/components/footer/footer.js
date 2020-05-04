import React from 'react';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import styles from './footer.module.scss';
import { docsRedirect, loginRedirect } from '../shared/tracking-utils';

const Footer = ({ whiteFooter }) => (
  <footer className={whiteFooter ? styles.whitefooter : ''}>
    <div className='container'>
      <div className={`row ${styles.footerMobile}`}>
        <div className={`col-3 ${styles.copyright}`}>
          <a href=''>
            <i className='icon-logo2' />
          </a>
          <span>&copy; 2020, Pixie Labs Inc.</span>
          <a href='https://pixielabs.ai/policies'>Terms & Privacy</a>
        </div>
        <div className='col-9 hide-tablet'>
          <div className='row'>
            <div className='col-3'>
              <em>Product</em>
              <ul className={styles.footerCategory}>
                <li><a href='https://work.withpixie.ai/login' onClick={(e) => loginRedirect(e)}>Log In</a></li>
                <li><a href='https://work.withpixie.ai/docs' onClick={(e) => docsRedirect(e)}>Docs</a></li>
              </ul>
            </div>
            <div className='col-3'>
              <em>Company</em>
              <ul className={styles.footerCategory}>
                <li><a href='https://pixielabs.ai/community'>Community</a></li>
                <li><a href='https://pixielabs.ai/careers'>Careers</a></li>
              </ul>
            </div>
            <div className='col-6'>
              <em>Help</em>
              <ul className={styles.footerCategory}>
                <li><a href='https://slackin.withpixie.ai'>Join Slack Community</a></li>
                <li><a href='https://pixielabs.ai/contact/#sales'>Contact Sales</a></li>
                <li><a href='https://pixielabs.ai/contact/#support'>Email us</a></li>
              </ul>
            </div>
          </div>
          <div className={styles.footerSocial}>
            <ul>
              <li><a href='https://slackin.withpixie.ai'><i className='icon-slack' /></a></li>
              <li><a href='https://twitter.com/pixielabs_ai'><i className='icon-twitter' /></a></li>
              <li><a href='https://github.com/pixie-labs/pixie'><i className='icon-github-1' /></a></li>
              <li><a href='https://www.youtube.com/channel/UCOMCDRvBVNIS0lCyOmst7eg/featured'><i className='icon-youtube' /></a></li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  </footer>
);
Footer.propTypes = {
  whiteFooter: PropTypes.bool,
};
Footer.defaultProps = {
  whiteFooter: false,
};
export default Footer;
