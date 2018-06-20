import React from 'react';
import PropTypes from 'prop-types';
import { Typography, withStyles } from '@material-ui/core';
import { FormattedMessage, injectIntl } from 'react-intl';

import styles from '../styles';
import { ContentItem } from './contentItem';


const Tutorial4 = ({ classes }) => (
  <div>
    <Typography variant="display1">
      <FormattedMessage id="tutorial4.title" defaultMessage="How To Protect Yourself From Loss" />
    </Typography>
    <ul className={classes.contentList}>
      <ContentItem id="tutorial4.content0" defaultMessage="If you lose your passphrase, wallet data file, or private key, it is gone forever. Don’t lose it." />
      <ContentItem id="tutorial4.content1" defaultMessage="Make a backup of your wallet data file and passphrase. Do NOT just store it on your computer. Print it out on a piece of paper or save it to a USB drive." />
      <ContentItem id="tutorial4.content2" defaultMessage="Store this paper or USB drive in a different physical location. A backup is not useful if it is destroyed by a fire or flood along with your laptop." />
      <ContentItem id="tutorial4.content3" defaultMessage="Do not store your private key in Dropbox, Google Drive, or other cloud storage. If that account is compromised, your funds will be stolen." />
    </ul>
  </div>
);

Tutorial4.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default injectIntl(withStyles(styles, { withTheme: true })(Tutorial4));
