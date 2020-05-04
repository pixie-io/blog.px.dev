import { graphql, Link, useStaticQuery } from 'gatsby';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import BodyClassName from 'react-body-classname';
import styles from './header.module.scss';
import { docsRedirect, loginRedirect, signupRedirect } from '../shared/tracking-utils';
import { MenuCountersContext } from '../shared/header-counters.provider';

const Header = ({ whiteHeader, hideMenu }) => {
  const headerCountersData = useStaticQuery(graphql`
      {
          headerCountersData {
              slack
              github
          }
      }
  `);
  const { headerCountersData: { github: ssrGithub, slack: ssrSlack } } = headerCountersData;

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
    <header className={`${whiteHeader ? styles.whiteHeader : ''} ${showShadow ? styles.showShadow : ''} ${hideMenu ? styles.hideMenu : ''}`}>
      <BodyClassName className={`${open ? 'menu-open' : ''}`} />
      <MenuCountersContext.Consumer>
        {(context) => (
          <div>
            <Link to='/'>
              <i className='icon-logo2' />
            </Link>
            <div className={styles.counters}>
              <div className={styles.counter}>
                <a href='https://slackin.withpixie.ai/'>
                  <i className='icon-slack' />
                  <div>
                    {context.totalUsers || ssrSlack}
                  </div>
                </a>
              </div>
              <div className={styles.counter}>
                <a href='https://github.com/pixie-labs/pixie'>
                  <i className='icon-github-1' />
                  <div>
                    {context.totalGit || ssrGithub}
                  </div>
                </a>
              </div>
            </div>
          </div>
        )}
      </MenuCountersContext.Consumer>
      <div className={`hide-mobile hide-tablet ${styles.menu}`}>
        <ul>
          <li>
            <a href='#' onClick={(e) => docsRedirect(e)}>Docs</a>
          </li>
          <li className={styles.outlined}>
            <a href='#' onClick={(e) => loginRedirect(e)}>Log In</a>
          </li>
          <li className={styles.colored}>
            <a href='#' onClick={(e) => signupRedirect(e)}>
              Join Beta
            </a>
          </li>
        </ul>
      </div>
      <div className={`hide-desktop ${styles.menuResponsive} ${open ? styles.menuOpen : ''}`} onClick={() => closeMenu()}>
        <div className={styles.headerResponsive}>
          <Link to='/' className={styles.icon}>
            <i className='icon-logo2' />
          </Link>
          <i className={`icon-menu-on  ${styles.close}`} onClick={() => setOpen(false)} />
        </div>
        <div className={styles.mobileNavMenu}>
          <div>
            <em>Product</em>
            <ul>
              <li>
                <a href='https://withpixie.ai/login' onClick={(e) => loginRedirect(e)}>Log-in</a>
              </li>
              <li>
                <a href='https://withpixie.ai/signup' onClick={(e) => signupRedirect(e)}>Sign-up</a>
              </li>
              <li>
                <a href='https://work.withpixie.ai/docs' onClick={(e) => docsRedirect(e)}>Docs</a>
              </li>
            </ul>
          </div>
          <div>
            <em>Company</em>
            <ul>
              <li><Link to='/community'>Community</Link></li>
              <li><Link to='/careers'>Careers</Link></li>
            </ul>
          </div>
          <div>
            <em>Help & support</em>
            <ul>
              <li><a href='https://pixie-community.slack.com/'>Join Slack Community</a></li>
              <li><Link to='/contact/#sales'>Contact Sales</Link></li>
              <li><Link to='/contact/#support'>Email us</Link></li>
            </ul>
          </div>
        </div>
        <div className={styles.links}>
          <ul className={styles.socialIcons}>
            <li><a href='https://pixie-community.slack.com/'><i className='icon-slack' /></a></li>
            <li><a href='https://twitter.com/pixie_run'><i className='icon-twitter' /></a></li>
            <li><a href='https://github.com/pixie-labs/'><i className='icon-github-1' /></a></li>
            <li>
              <a href='https://www.youtube.com/channel/UCOMCDRvBVNIS0lCyOmst7eg/featured'><i className='icon-youtube' /></a>
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
  hideMenu: PropTypes.bool,
};
Header.defaultProps = {
  whiteHeader: false,
  hideMenu: false,
};
export default Header;
