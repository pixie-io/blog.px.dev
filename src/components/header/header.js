import { Link } from 'gatsby';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import BodyClassName from 'react-body-classname';
import styles from './header.module.scss';

import docs from '../../images/footer/docs-icon.svg';
import github from '../../images/footer/github-icon.svg';
import slack from '../../images/footer/slack-icon.svg';
import youtube from '../../images/footer/youtube-icon.svg';
import twitter from '../../images/footer/twitter-icon.svg';
import linkedin from '../../images/footer/linkedin-icon.svg';
import pixieLogo from '../../images/pixie-logo-header.svg';
import betanaut from '../../images/betanaut.png';

import { docsRedirect, loginRedirect, signupRedirect } from '../shared/tracking-utils';

const Header = ({ whiteHeader, transparentMenu }) => {
  const [open, setOpen] = useState(false);
  const [showShadow, setShowShadow] = useState(false);

  const closeMenu = () => {
    setOpen(false);
  };
  const processShadowVisibility = () => {
    const top = window.pageYOffset || document.documentElement.scrollTop;
    if (top > 1) {
      setShowShadow(true);
    } else {
      setShowShadow(false);
    }
  };

  useEffect(() => {
    processShadowVisibility();
    window.addEventListener('scroll', processShadowVisibility, false);
    return () => {
      window.removeEventListener('scroll', processShadowVisibility, false);
    };
  }, []);

  return (
    <header
      className={`
      ${transparentMenu ? styles.transparentMenu : ''}  
      ${whiteHeader ? styles.whiteHeader : ''}  
      ${showShadow ? styles.showShadow : ''} 
      `}
    >
      <BodyClassName className={`${open ? 'menu-open' : ''}`} />
      <div className={styles.logos}>
        <Link to='/' className={styles.logo}>
          <img src={pixieLogo} alt='pixie logo' />
          <img src={betanaut} alt='pixienaut beta' className={styles.betanaut} />
        </Link>
        <div className={styles.socialIcons}>
          <a href='https://slackin.withpixie.ai'>
            <img src={slack} />
          </a>
          <a href='https://github.com/pixie-labs/pixie'>
            <img src={github} />
          </a>
          <a href='https://twitter.com/pixie_run'>
            <img src={twitter} />
          </a>
        </div>
      </div>
      <div className={`hide-mobile hide-tablet ${styles.menu}`}>
        <ul>
          <li>
            <a href='#' onClick={(e) => docsRedirect(e)}>
              Docs
            </a>
          </li>
          <li>
            <a href='#' onClick={(e) => loginRedirect(e)}>
              Sign In
            </a>
          </li>
          <li className={styles.colored}>
            <a href='https://docs.pixielabs.ai/installing-pixie/quick-start/' target='_blank' rel='noreferrer noopener'>
              Get started
            </a>
          </li>
        </ul>
      </div>
      <div
        className={`hide-desktop ${styles.menuResponsive} ${
          open ? styles.menuOpen : ''
        }`}
        onClick={() => closeMenu()}
      >
        <div className={styles.headerResponsive}>
          <Link to='/' className={styles.icon}>
            <img src={pixieLogo} alt='pixie logo' />
            <img src={betanaut} alt='pixienaut beta' className={styles.betanaut} />
          </Link>
          <i
            className={`icon-menu-on  ${styles.close}`}
            onClick={() => setOpen(false)}
          />
        </div>
        <div className={styles.mobileNavMenu}>
          <div>
            <em>Product</em>
            <ul>
              <li>
                <a
                  href='https://withpixie.ai/login'
                  onClick={(e) => loginRedirect(e)}
                >
                  Log-in
                </a>
              </li>
              <li>
                <a
                  href='https://withpixie.ai/signup'
                  onClick={(e) => signupRedirect(e)}
                >
                  Sign-up
                </a>
              </li>
              <li>
                <a
                  href='https://work.withpixie.ai/docs'
                  onClick={(e) => docsRedirect(e)}
                >
                  Docs
                </a>
              </li>
            </ul>
          </div>
          <div>
            <em>Company</em>
            <ul>
              <li>
                <Link to='/community'>Community</Link>
              </li>
              <li>
                <Link to='/careers'>Careers</Link>
              </li>
            </ul>
          </div>
          <div>
            <em>Help & support</em>
            <ul>
              <li>
                <a href='https://pixie-community.slack.com/'>
                  Join Slack Community
                </a>
              </li>
              <li>
                <Link to='/contact/#sales'>Contact Sales</Link>
              </li>
              <li>
                <Link to='/contact/#support'>Email us</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.links}>

          <ul className={styles.socialIcons}>

            <li>
              <a
                href='https://work.withpixie.ai/docs'
                onClick={(e) => docsRedirect(e)}
              >
                <img src={docs} className={styles.socialIcon} />
              </a>
            </li>
            <li>
              <a href='https://github.com/pixie-labs/pixie'>
                <img src={github} className={styles.socialIcon} />
              </a>
            </li>
            <li>
              <a href='https://slackin.withpixie.ai'>
                <img src={slack} className={styles.socialIcon} />
              </a>
            </li>
            <li>
              <a href='https://www.youtube.com/channel/UCOMCDRvBVNIS0lCyOmst7eg/featured'>
                <img src={youtube} className={styles.socialIcon} />
              </a>
            </li>
            <li>
              <a href='https://twitter.com/pixie_run'>
                <img src={twitter} className={styles.socialIcon} />
              </a>
            </li>
            <li>
              <a href='https://www.linkedin.com/company/pixieai/'>
                <img src={linkedin} className={styles.socialIcon} />
              </a>
            </li>
          </ul>

          <Link to='/terms'>Terms & Privacy</Link>
        </div>
      </div>
      <i onClick={() => setOpen(true)} className='icon-menu-off hide-desktop' />
    </header>
  );
};

Header.propTypes = {
  whiteHeader: PropTypes.bool,
  transparentMenu: PropTypes.bool,
};
Header.defaultProps = {
  whiteHeader: false,
  transparentMenu: false,
};
export default Header;
