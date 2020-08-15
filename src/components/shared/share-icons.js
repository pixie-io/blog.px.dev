import React from 'react';
import { docsRedirect } from './tracking-utils';
import docs from '../../images/footer/docs-icon.svg';
import styles from '../../templates/blog-post.module.scss';
import github from '../../images/footer/github-icon.svg';
import slack from '../../images/footer/slack-icon.svg';
import youtube from '../../images/footer/youtube-icon.svg';
import twitter from '../../images/footer/twitter-icon.svg';
import linkedIn from '../../images/footer/linkedin-icon.svg';


const ShareIcons = () => (
  <div>
    <a
      href='https://work.withpixie.ai/docs'
      onClick={(e) => docsRedirect(e)}
    >
      <img src={docs} className={styles.socialIcon} />
    </a>
    <a href='https://github.com/pixie-labs/pixie'>
      <img src={github} className={styles.socialIcon} />
    </a>
    <a href='https://slackin.withpixie.ai'>
      <img src={slack} className={styles.socialIcon} />
    </a>
    <a href='https://www.youtube.com/channel/UCOMCDRvBVNIS0lCyOmst7eg/featured'>
      <img src={youtube} className={styles.socialIcon} />
    </a>
    <a href='https://twitter.com/pixie_run'>
      <img src={twitter} className={styles.socialIcon} />
    </a>
    <a href='https://www.linkedin.com/company/pixieai/'>
      <img src={linkedIn} className={styles.socialIcon} />
    </a>
  </div>
);


export default ShareIcons;
