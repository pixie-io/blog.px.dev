import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { Box } from '@material-ui/core';
import Highlight, { defaultProps } from 'prism-react-renderer';
import IconButton from '@material-ui/core/IconButton';
import copyBtn from '../../images/copy-btn.svg';

const CodeRenderer = withStyles(() => ({
  code: {
    backgroundColor: '#212324',
    borderRadius: '5px',
    boxShadow: '0px 6px 18px rgba(0, 0, 0, 0.0864292)',
    marginBottom: '12px',
    marginTop: '12px',
    position: 'relative',
    padding: '4px 55px 4px 12px',

  },

  pre: {
    maxWidth: '100px',
  },
  codeHighlight: {
    display: 'block',
    width: '100%',
    overflowX: 'auto',
    fontFamily: 'source code pro',
  },

  copyBtn: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    right: '0',
    cursor: 'pointer',
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
    <IconButton
      edge='start'
      color='inherit'
      className={classes.copyBtn}
      onClick={() => { navigator.clipboard.writeText(code); }}
    >
      <img src={copyBtn} alt='' />
    </IconButton>
  </div>
));
export default CodeRenderer;
