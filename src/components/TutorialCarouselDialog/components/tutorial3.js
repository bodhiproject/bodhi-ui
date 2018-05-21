import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Typography, withStyles } from 'material-ui';
import cx from 'classnames';
import { FormattedMessage, injectIntl } from 'react-intl';

import styles from '../styles';

@injectIntl
@withStyles(styles, { withTheme: true })
export default class Tutorial3 extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <div className={classes.titleTopLine}></div>
        <Typography variant="display1">
          <FormattedMessage id="tutorial3.title" defaultMessage="Why Should I Read All This" />
        </Typography>
        <ul className={classes.contentList}>
          <li>
            <Typography variant="body2">
              <FormattedMessage id="tutorial3.content0" defaultMessage="Because we need you to understand that we cannot..." />
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <FormattedMessage id="tutorial3.content1" defaultMessage="Access your account or send your funds for you." />
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <FormattedMessage id="tutorial3.content2" defaultMessage="Recover your wallet data file." />
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <FormattedMessage id="tutorial3.content3" defaultMessage="Recover or change your private key." />
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <FormattedMessage id="tutorial3.content4" defaultMessage="Recover or reset your passphrase." />
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <FormattedMessage id="tutorial3.content5" defaultMessage="Reverse, cancel, or refund transactions." />
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <FormattedMessage id="tutorial3.content6" defaultMessage="Freeze accounts." />
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <FormattedMessage id="tutorial3.content7" defaultMessage="You and only you are responsible for your security." />
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <FormattedMessage id="tutorial3.content8" defaultMessage="Be diligent to keep your wallet data file and passphrase safe and don’t share it with anyone you don’t trust!" />
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <FormattedMessage id="tutorial3.content9" defaultMessage="If you lose your wallet data file, passphrase, and private key no one can recover it for you." />
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <FormattedMessage id="tutorial3.content10" defaultMessage="If you enter your passphrase, wallet data file, or private key on a phishing website, you will have all your funds taken from you." />
            </Typography>
          </li>
        </ul>
      </div>
    );
  }
}
