import React from 'react';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';

import styles from './button.module.scss';

const Button = ({
  to, className, children, onClick, outline, link,
}) => {
  if (to) {
    return (
      <Link
        to={to}
        className={`${styles.linkButton} ${className} ${outline ? styles.outline : ''}`}
      >
        {children}
      </Link>
    );
  }
  if (link) {
    return (
      <a
        type='button'
        className={`${styles.linkButton} ${className} ${outline ? styles.outline : ''}`}
        href={link}
        target='_blank'
        rel='noreferrer'
      >
        {children}
      </a>
    );
  }
  return (
    <button
      type='button'
      className={`${styles.linkButton} ${className} ${outline ? styles.outline : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  to: PropTypes.string,
  link: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
  outline: PropTypes.bool,
};

Button.defaultProps = {
  className: '',
  to: '',
  link: '',
  outline: false,
  onClick: () => {
  },
};
export default Button;
