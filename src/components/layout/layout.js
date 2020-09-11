import React from 'react';
import PropTypes from 'prop-types';

import Header from '../header';
import Footer from '../footer';
import { ThemeModeContext } from '../mainThemeProvider';

const Layout = ({
  children, whiteHeader, whiteFooter, hideMenu, showSwitch,
}) => (
  <>
    <ThemeModeContext.Consumer>
      {({ toggleTheme, theme }) => (
        <>
          <Header
            showSwitch={showSwitch}
            whiteHeader={whiteHeader}
            hideMenu={hideMenu}
            onThemeTypeSwitch={toggleTheme}
            theme={theme}
          />
          <main>{children}</main>
          <Footer whiteFooter={theme === 'light' || whiteFooter} />
        </>
      )}
    </ThemeModeContext.Consumer>
  </>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  whiteHeader: PropTypes.bool,
  whiteFooter: PropTypes.bool,
  hideMenu: PropTypes.bool,
  showSwitch: PropTypes.bool,
};
Layout.defaultProps = {
  whiteHeader: false,
  whiteFooter: false,
  hideMenu: false,
  showSwitch: false,
};
export default Layout;
