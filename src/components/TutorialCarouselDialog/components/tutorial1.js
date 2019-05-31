import React from 'react';
import PropTypes from 'prop-types';
import { Typography, withStyles } from '@material-ui/core';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';

import styles from '../styles';
import { ContentItem } from './contentItem';

const messages = defineMessages({
  tutorial1Content0Msg: {
    id: 'tutorial1.content0',
    defaultMessage: 'Assuming you have not used the Naka Wallet client before, when you first open the Bodhi Dapp, you need to download a Naka wallet extension. ',
  },
  tutorial1Content1Msg: {
    id: 'tutorial1.content1',
    defaultMessage: 'Naka uses the Ethereum wallet infrastructure.',
  },
  tutorial1Content2Msg: {
    id: 'tutorial1.content2',
    defaultMessage: 'The Naka Wallet is responsible for holding your passphrase and private keys. Bodhi Dapp does not store or handle this for you.',
  },
  tutorial1Content3Msg: {
    id: 'tutorial1.content3',
    defaultMessage: 'We never transmit, receive, or store your private key, passphrase, or other account information.',
  },
  tutorial1Content4Msg: {
    id: 'tutorial1.content4',
    defaultMessage: 'You are simply using our interface to interact directly with the Naka blockchain.',
  },
  tutorial1Content5Msg: {
    id: 'tutorial1.content5',
    defaultMessage: 'If you send your public key (Naka address) to someone, they can send you NAKA or NBOT.',
  },
  tutorial1Content6Msg: {
    id: 'tutorial1.content6',
    defaultMessage: 'If you send your passphrase, wallet data file, and/or private key to someone, they now have full control of your account.',
  },
});

const Tutorial1 = ({ classes }) => (
  <div>
    <Typography variant="h4" classes={{ subtitle1: classes.tutorialDialogContentTitle }}>
      <FormattedMessage id="tutorial1.title" defaultMessage="Bodhi Dapp Uses The Naka Wallet" />
    </Typography>
    <ul className={classes.contentList}>
      <ContentItem id={messages.tutorial1Content0Msg.id} defaultMessage={messages.tutorial1Content0Msg.defaultMessage} />
      <ContentItem id={messages.tutorial1Content1Msg.id} defaultMessage={messages.tutorial1Content1Msg.defaultMessage} />
      <ContentItem id={messages.tutorial1Content2Msg.id} defaultMessage={messages.tutorial1Content2Msg.defaultMessage} />
      <ContentItem id={messages.tutorial1Content3Msg.id} defaultMessage={messages.tutorial1Content3Msg.defaultMessage} />
      <ContentItem id={messages.tutorial1Content4Msg.id} defaultMessage={messages.tutorial1Content4Msg.defaultMessage} />
      <ContentItem id={messages.tutorial1Content5Msg.id} defaultMessage={messages.tutorial1Content5Msg.defaultMessage} />
      <ContentItem id={messages.tutorial1Content6Msg.id} defaultMessage={messages.tutorial1Content6Msg.defaultMessage} />
    </ul>
  </div>
);

Tutorial1.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default injectIntl(withStyles(styles, { withTheme: true })(Tutorial1));
