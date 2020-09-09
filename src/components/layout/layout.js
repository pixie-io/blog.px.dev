import React from 'react';
import PropTypes from 'prop-types';

import Header from '../header';
import Footer from '../footer';

const Layout = ({
  children, whiteHeader, whiteFooter, hideMenu,
}) => (
  <>
    <Header whiteHeader={whiteHeader} hideMenu={hideMenu} />
    <main>{children}</main>
    <Footer whiteFooter={whiteFooter} />
  </>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  whiteHeader: PropTypes.bool,
  whiteFooter: PropTypes.bool,
  hideMenu: PropTypes.bool,
};
Layout.defaultProps = {
  whiteHeader: false,
  whiteFooter: false,
  hideMenu: false,
};
export default Layout;
