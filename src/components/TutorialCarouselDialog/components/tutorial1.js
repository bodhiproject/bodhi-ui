import React from 'react';
import PropTypes from 'prop-types';
import { Typography, withStyles } from '@material-ui/core';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';

import styles from '../styles';
import { ContentItem } from './contentItem';

const messages = defineMessages({
  tutorial1Content0Msg: {
    id: 'tutorial1.content0',
    defaultMessage: 'Assuming you have not used the Qtum Wallet client before, when you first open the Bodhi Dapp, you are generating a brand new Qtum wallet. ',
  },
  tutorial1Content1Msg: {
    id: 'tutorial1.content1',
    defaultMessage: 'Qtum uses the Bitcoin Core wallet infrastructure.',
  },
  tutorial1Content2Msg: {
    id: 'tutorial1.content2',
    defaultMessage: 'Bitcoin wallets already contain roughly 100 different addresses assigned to one wallet. This is why you might see new addresses appearing in your wallet.',
  },
  tutorial1Content3Msg: {
    id: 'tutorial1.content3',
    defaultMessage: 'The Qtum Wallet is responsible for holding your passphrase and private keys. Bodhi Dapp does not store or handle this for you.',
  },
  tutorial1Content4Msg: {
    id: 'tutorial1.content4',
    defaultMessage: 'We never transmit, receive, or store your private key, passphrase, or other account information.',
  },
  tutorial1Content5Msg: {
    id: 'tutorial1.content5',
    defaultMessage: 'You are simply using our interface to interact directly with the Qtum blockchain.',
  },
  tutorial1Content6Msg: {
    id: 'tutorial1.content6',
    defaultMessage: 'If you send your public key (Qtum address) to someone, they can send you QTUM or BOT.',
  },
  tutorial1Content7Msg: {
    id: 'tutorial1.content7',
    defaultMessage: 'If you send your passphrase, wallet data file, and/or private key to someone, they now have full control of your account.',
  },
});

const Tutorial1 = ({ classes }) => (
  <div>
    <Typography variant="display1">
      <FormattedMessage id="tutorial1.title" defaultMessage="Bodhi Dapp Uses The Qtum Wallet" />
    </Typography>
    <ul className={classes.contentList}>
      <ContentItem id={messages.tutorial1Content0Msg.id} defaultMessage={messages.tutorial1Content0Msg.defaultMessage} />
      <ContentItem id={messages.tutorial1Content1Msg.id} defaultMessage={messages.tutorial1Content1Msg.defaultMessage} />
      <ContentItem id={messages.tutorial1Content2Msg.id} defaultMessage={messages.tutorial1Content2Msg.defaultMessage} />
      <ContentItem id={messages.tutorial1Content3Msg.id} defaultMessage={messages.tutorial1Content3Msg.defaultMessage} />
      <ContentItem id={messages.tutorial1Content4Msg.id} defaultMessage={messages.tutorial1Content4Msg.defaultMessage} />
      <ContentItem id={messages.tutorial1Content5Msg.id} defaultMessage={messages.tutorial1Content5Msg.defaultMessage} />
      <ContentItem id={messages.tutorial1Content6Msg.id} defaultMessage={messages.tutorial1Content6Msg.defaultMessage} />
      <ContentItem id={messages.tutorial1Content7Msg.id} defaultMessage={messages.tutorial1Content7Msg.defaultMessage} />
    </ul>
  </div>
);

Tutorial1.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default injectIntl(withStyles(styles, { withTheme: true })(Tutorial1));
