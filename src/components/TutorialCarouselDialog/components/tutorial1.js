import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Typography, withStyles } from 'material-ui';
import cx from 'classnames';
import { FormattedMessage, injectIntl } from 'react-intl';

import styles from '../styles';

@injectIntl
@withStyles(styles, { withTheme: true })
export default class Tutorial1 extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  render() {
    const { classes } = this.props;

    return (
      <div>
        <div className={classes.titleTopLine}></div>
        <Typography variant="display1">
          <FormattedMessage id="tutorial1.title" defaultMessage="Bodhi Dapp Uses The Qtum Wallet" />
        </Typography>
        <ul className={classes.contentList}>
          <li>
            <Typography variant="body2">
              <FormattedMessage id="tutorial1.content0" defaultMessage="Assuming you have not used the Qtum Wallet client before, when you first open the Bodhi Dapp, you are generating a brand new Qtum wallet. " />
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <FormattedMessage id="tutorial1.content1" defaultMessage="Qtum uses the Bitcoin Core wallet infrastructure." />
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <FormattedMessage id="tutorial1.content2" defaultMessage="Bitcoin wallets already contain roughly 100 different addresses assigned to one wallet. This is why you might see new addresses appearing in your wallet." />
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <FormattedMessage id="tutorial1.content3" defaultMessage="The Qtum Wallet is responsible for holding your passphrase and private keys. Bodhi Dapp does not store or handle this for you." />
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <FormattedMessage id="tutorial1.content4" defaultMessage="We never transmit, receive, or store your private key, passphrase, or other account information." />
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <FormattedMessage id="tutorial1.content5" defaultMessage="You are simply using our interface to interact directly with the Qtum blockchain." />
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <FormattedMessage id="tutorial1.content6" defaultMessage="If you send your public key (Qtum address) to someone, they can send you QTUM or BOT." />
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <FormattedMessage id="tutorial1.content7" defaultMessage="If you send your passphrase, wallet data file, and/or private key to someone, they now have full control of your account." />
            </Typography>
          </li>
        </ul>
      </div>
    );
  }
}
