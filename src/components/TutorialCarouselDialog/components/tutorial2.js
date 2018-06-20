import React from 'react';
import PropTypes from 'prop-types';
import { Typography, withStyles } from '@material-ui/core';
import { FormattedMessage, injectIntl } from 'react-intl';

import styles from '../styles';
import { ContentItem } from './contentItem';


const Tutorial2 = ({ classes }) => (
  <div>
    <Typography variant="display1">
      <FormattedMessage id="tutorial2.title" defaultMessage="Securing Your New Wallet" />
    </Typography>
    <ul className={classes.contentList}>
      <ContentItem id="tutorial2.content0" defaultMessage="Assuming you have not used the Qtum Wallet client before, now that you have a brand new Qtum wallet, it is advised to take the proper steps to encrypt and back it up first." />
      <li>
        <Typography variant="body2">
          <a className={classes.link} href="https://github.com/qtumproject/qtum/wiki/Qtum-Wallet-Tutorial#wallet-encryption" target="_blank">
            https://github.com/qtumproject/qtum/wiki/Qtum-Wallet-Tutorial#wallet-encryption
          </a>
        </Typography>
      </li>
      <li>
        <Typography variant="body2">
          <a className={classes.link} href="https://github.com/qtumproject/qtum/wiki/Qtum-Wallet-Tutorial#wallet-backup" target="_blank">
            https://github.com/qtumproject/qtum/wiki/Qtum-Wallet-Tutorial#wallet-backup
          </a>
        </Typography>
      </li>
      <li>
        <Typography variant="body2">
          <a className={classes.link} href="https://github.com/qtumproject/qtum/wiki/Qtum-Wallet-Tutorial#restore-wallet-backup" target="_blank">
            https://github.com/qtumproject/qtum/wiki/Qtum-Wallet-Tutorial#restore-wallet-backup
          </a>
        </Typography>
      </li>
      <ContentItem id="tutorial2.content1" defaultMessage="To encrypt your wallet, select “Launch Qtum Wallet” in the application menu and follow the instructions here." />
      <ContentItem id="tutorial2.content2" defaultMessage="Bitcoin wallets already contain roughly 100 different addresses assigned to one wallet. This is why you might see new addresses appearing in your wallet." />
      <ContentItem id="tutorial2.content3" defaultMessage="The Qtum Wallet is responsible for holding your passphrase and private keys. Bodhi Dapp does not store or handle this for you." />
    </ul>
  </div>
);

Tutorial2.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default injectIntl(withStyles(styles, { withTheme: true })(Tutorial2));
