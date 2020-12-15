import React from 'react';
import PropTypes from 'prop-types';

import Header from '../header';
import Footer from '../footer';
import { ThemeModeContext } from '../mainThemeProvider.tsx';
import CookiesBanner from '../cookies-banner/cookies-banner';

const Layout = ({
  children, whiteHeader, hideMenu,
}) => (
  <>
    <ThemeModeContext.Consumer>
      {({ toggleTheme, theme }) => (
        <>
          <Header
            whiteHeader={whiteHeader}
            hideMenu={hideMenu}
            onThemeTypeSwitch={toggleTheme}
            theme={theme}
          />
          <main>{children}</main>
          <Footer />
          <CookiesBanner />
        </>
      )}
    </ThemeModeContext.Consumer>
  </>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  whiteHeader: PropTypes.bool,
  hideMenu: PropTypes.bool,
};
Layout.defaultProps = {
  whiteHeader: false,
  hideMenu: false,
};
export default Layout;
