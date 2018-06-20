import React from 'react';
import PropTypes from 'prop-types';
import { Typography, withStyles } from '@material-ui/core';
import { FormattedMessage, injectIntl } from 'react-intl';

import styles from '../styles';
import { ContentItem } from './contentItem';


const Tutorial3 = ({ classes }) => (
  <div>
    <Typography variant="display1">
      <FormattedMessage id="tutorial3.title" defaultMessage="Why Should I Read All This" />
    </Typography>
    <ul className={classes.contentList}>
      <ContentItem id="tutorial3.content0" defaultMessage="Because we need you to understand that we cannot..." />
      <ContentItem id="tutorial3.content1" defaultMessage="Access your account or send your funds for you." />
      <ContentItem id="tutorial3.content2" defaultMessage="Recover your wallet data file." />
      <ContentItem id="tutorial3.content3" defaultMessage="Recover or change your private key." />
      <ContentItem id="tutorial3.content4" defaultMessage="Recover or reset your passphrase." />
      <ContentItem id="tutorial3.content5" defaultMessage="Reverse, cancel, or refund transactions." />
      <ContentItem id="tutorial3.content6" defaultMessage="Freeze accounts." />
      <ContentItem id="tutorial3.content7" defaultMessage="You and only you are responsible for your security." />
      <ContentItem id="tutorial3.content8" defaultMessage="Be diligent to keep your wallet data file and passphrase safe and don’t share it with anyone you don’t trust!" />
      <ContentItem id="tutorial3.content9" defaultMessage="If you lose your wallet data file, passphrase, and private key no one can recover it for you." />
      <ContentItem id="tutorial3.content10" defaultMessage="If you enter your passphrase, wallet data file, or private key on a phishing website, you will have all your funds taken from you." />
    </ul>
  </div>
);

Tutorial3.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default injectIntl(withStyles(styles, { withTheme: true })(Tutorial3));
