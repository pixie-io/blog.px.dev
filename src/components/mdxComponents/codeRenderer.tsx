import withStyles from '@material-ui/core/styles/withStyles';
import { Box, Tooltip } from '@material-ui/core';
import Highlight, { defaultProps } from 'prism-react-renderer';
import React from 'react';
import copyBtn from '../../images/copy-btn.svg';

const CodeRenderer = withStyles((theme) => ({
  code: {
    backgroundColor: theme.palette.type === 'light' ? '#212324' : '#292929',
    borderRadius: '5px',
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.15)',
    marginBottom: '16px',
    marginTop: '12px',
    position: 'relative',
    padding: '4px 55px 4px 12px',
    maxWidth: '100%',
    '&:hover': {
      '& img': {
        display: 'inline-flex!important' as any,
      },
    },

  },

  pre: {
    maxWidth: '100px',
  },
  codeHighlight: {
    display: 'block',
    width: '100%',
    overflowX: 'auto',
    fontFamily: '"Roboto Mono", Monospace,',
  },

  copyBtn: {
    display: 'none',
    position: 'absolute',
    top: '18px',
    transform: 'translateY(-50%)',
    right: '14px',
    cursor: 'pointer',
    height: '16px',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },

}))(({ classes, code, language = 'javascript' }: any) => (
  <div className={classes.code}>
    <Box className={`${classes.codeHighlight} small-scroll`}>
      <Highlight
        {...defaultProps}
        code={code.trim()}
        language={language}
      >
        {({
          className, style, tokens, getLineProps, getTokenProps,
        }: any) => (
          <pre
            className={`${className} ${classes.pre}`}
            style={{ ...style, backgroundColor: 'transparent' }}
          >
            {tokens.map((line, i) => (
              <div {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </Box>
    <Tooltip title='Copy to clipboard' aria-label='copy' placement='top'>
      <img src={copyBtn} alt='' className={classes.copyBtn} onClick={() => { navigator.clipboard.writeText(code); }} />
    </Tooltip>
  </div>
));
export default CodeRenderer;
