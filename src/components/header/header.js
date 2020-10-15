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
  whiteHeader, transparentMenu, onThemeTypeSwitch,
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
        <a href='https://blog.pixielabs.ai/blog/public-beta-launch/beta-launch/'>
          <div className={styles.newsBar}>
            <div className='hide-mobile hide-tablet'>
              Check out Pixie Community’s Launch Announcement
              &nbsp;
              🚀
            </div>
            <div className='hide-desktop'>
              Check out Pixie Community’s Launch
              &nbsp;
              🚀
            </div>
            <div
              className={`${styles.newsBarClose} hide-desktop`}
              onClick={(e) => closeTopBanner(e)}
            >
              {' '}
              &#10005;
            </div>
          </div>
        </a>
      )}
      <header
        className={`
      ${transparentMenu ? styles.transparentMenu : ''}  
      ${showNewsBar ? styles.showNewsBar : ''}  
      ${whiteHeader ? styles.whiteHeader : ''}  
      ${showShadow ? styles.showShadow : ''} 
      `}
      >
        <BodyClassName className={`${open ? 'menu-open' : ''} theme-${theme}`} />
        <div className={styles.logos}>
          <Link to='/' className={styles.logo}>
            <img src={pixieLogo} alt='pixie logo' />
            <span>Blog</span>
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
                Try Community Beta
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
                  <a href='https://slackin.withpixie.ai'>
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
            </ul>

            <Link to='/terms'>Terms & Privacy</Link>
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
            <MenuIcon style={{ color: 'white' }} />
          </IconButton>
        </div>

      </header>
    </>
  );
};

Header.propTypes = {
  whiteHeader: PropTypes.bool,
  transparentMenu: PropTypes.bool,
  onThemeTypeSwitch: PropTypes.func.isRequired,
  theme: PropTypes.string.isRequired,
};
Header.defaultProps = {
  whiteHeader: false,
  transparentMenu: false,
};
export default Header;
