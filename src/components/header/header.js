/* eslint-disable react/jsx-indent */
import { Link } from 'gatsby';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import BodyClassName from 'react-body-classname';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import styles from './header.module.scss';

import docs from '../../images/footer/docs-icon.svg';
import github from '../../images/footer/github-icon.svg';
import slack from '../../images/footer/slack-icon.svg';
import youtube from '../../images/footer/youtube-icon.svg';
import twitter from '../../images/footer/twitter-icon.svg';
import pixieLogo from '../../images/pixie-logo-header.svg';
import betanaut from '../../images/betanaut.png';
import { docsRedirect, loginRedirect, signupRedirect } from '../shared/tracking-utils';


const Header = ({
  transparentMenu, onThemeTypeSwitch,
  theme,
}) => {
  const [open, setOpen] = useState(false);
  const [showShadow, setShowShadow] = useState(false);
  const [showNewsBar, setShowNewsBar] = useState(true);

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
  const closeTopBanner = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setShowNewsBar(false);
  };
  return (
    <>
      {showNewsBar && (

        <div className={styles.newsBar}>

          <span className='hide-not-desktop'>
             Join us for our next Pixienaut Monthly call on March 25th.
            {' '}
            <a href='/community/'>
                   Learn more
            </a>
            {' '}
             🚀
          </span>
          <span className='hide-desktop'>
                <a href='/community/'>Join us for our Pixienaut Monthly on March 25th.</a>
          </span>

          <div
            className={`${styles.newsBarClose} hide-desktop`}
            onClick={(e) => closeTopBanner(e)}
          >
            {' '}
            &#10005;
          </div>
        </div>

      )}
      <header
        className={`
      ${transparentMenu ? styles.transparentMenu : ''}  
      ${showNewsBar ? styles.showNewsBar : ''}  
        ${theme === 'light' ? styles.whiteHeader : ''}
      ${showShadow ? styles.showShadow : ''} 
      `}
      >
        <BodyClassName className={`${open ? 'menu-open' : ''} theme-${theme}`} />
        <div className={styles.logos}>
          <Link to='/' className={styles.logo}>
            <img src={pixieLogo} alt='pixie logo' />
          </Link>
          <div className={styles.socialIcons}>
            <a href='https://slackin.withpixie.ai'>
              <img src={slack} alt='slack' />
            </a>
            <a href='https://github.com/pixie-labs/pixie'>
              <img src={github} alt='github' />
            </a>
            <a href='https://twitter.com/pixie_run'>
              <img src={twitter} alt='twitter' />
            </a>
          </div>
        </div>
        <div className={`${styles.menu}`}>
          <ul className='hide-mobile hide-tablet'>
            <li>
              <IconButton
                className={styles.menuItem}
                size='small'
                onClick={(e) => {
                  e.preventDefault();
                  onThemeTypeSwitch();
                }}
              >
                {theme === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
              </IconButton>
            </li>
            <li className='hide-mobile hide-tablet'>
              <a href='https://work.withpixie.ai/docs' onClick={(e) => docsRedirect(e)}>
                Docs
              </a>
            </li>
            <li className={styles.colored}>
              <a href='https://pixielabs.ai/'>
                LEARN MORE
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

            <IconButton onClick={() => setOpen(false)} className={styles.close}>
              <CloseIcon style={{ color: 'white' }} />
            </IconButton>

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
                  <a href='https://pixielabs.ai/community'>Community</a>
                </li>
                <li>
                  <a href='https://pixielabs.ai/careers'>Careers</a>
                </li>
              </ul>
            </div>
            <div>
              <em>Help & support</em>
              <ul>
                <li>
                  <a href='https://slackin.withpixie.ai'>
                    Join Slack Community
                  </a>
                </li>
                <li>
                  <a href='https://pixielabs.ai//contact/#sales'>Contact Sales</a>
                </li>
                <li>
                  <a href='https://pixielabs.ai//contact/#support'>Email us</a>
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
            </ul>

            <a href='https://pixielabs.ai/terms'>Terms & Privacy</a>
          </div>
        </div>
        <div className='hide-desktop'>
          <IconButton
            className={styles.menuItem}
            size='small'
            onClick={(e) => {
              e.preventDefault();
              onThemeTypeSwitch();
            }}
          >
            {theme === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
          </IconButton>
          <IconButton onClick={() => setOpen(true)}>
            <MenuIcon />
          </IconButton>
        </div>

      </header>
    </>
  );
};

Header.propTypes = {
  transparentMenu: PropTypes.bool,
  onThemeTypeSwitch: PropTypes.func.isRequired,
  theme: PropTypes.string.isRequired,
};
Header.defaultProps = {
  transparentMenu: false,
};
export default Header;
