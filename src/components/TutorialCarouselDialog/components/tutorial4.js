import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Typography, withStyles } from 'material-ui';
import cx from 'classnames';
import { FormattedMessage, injectIntl } from 'react-intl';

import styles from '../styles';

@injectIntl
@withStyles(styles, { withTheme: true })
export default class Tutorial4 extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <div className={classes.titleTopLine}></div>
        <Typography variant="display1">
          <FormattedMessage id="tutorial4.title" defaultMessage="How To Protect Yourself From Loss" />
        </Typography>
        <ul className={classes.contentList}>
          <li>
            <Typography variant="body2">
              <FormattedMessage id="tutorial4.content0" defaultMessage="If you lose your passphrase, wallet data file, or private key, it is gone forever. Don’t lose it." />
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <FormattedMessage id="tutorial4.content1" defaultMessage="Make a backup of your wallet data file and passphrase. Do NOT just store it on your computer. Print it out on a piece of paper or save it to a USB drive." />
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <FormattedMessage id="tutorial4.content2" defaultMessage="Store this paper or USB drive in a different physical location. A backup is not useful if it is destroyed by a fire or flood along with your laptop." />
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <FormattedMessage id="tutorial4.content3" defaultMessage="Do not store your private key in Dropbox, Google Drive, or other cloud storage. If that account is compromised, your funds will be stolen." />
            </Typography>
          </li>
        </ul>
      </div>
    );
  }
}
