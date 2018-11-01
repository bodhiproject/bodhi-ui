import React from 'react';
import PropTypes from 'prop-types';
import { Typography, withStyles } from '@material-ui/core';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';

import styles from '../styles';
import { ContentItem } from './contentItem';

const messages = defineMessages({
  tutorial0Content0Msg: {
    id: 'tutorial0.content0',
    defaultMessage: 'Bodhi Dapp is a free, open-source, client-side interface.',
  },
  tutorial0Content1Msg: {
    id: 'tutorial0.content1',
    defaultMessage: 'It allows you to interact directly with the blockchain while remaining in full control of your keys & your funds.',
  },
  tutorial0Content2Msg: {
    id: 'tutorial0.content2',
    defaultMessage: 'Bodhi Dapp is NOT a standalone wallet. We use the Qtum Core Wallet to handle all transactions and interactions with the Qtum blockchain.',
  },
  tutorial0Content3Msg: {
    id: 'tutorial0.content3',
    defaultMessage: 'YOU and ONLY YOU are responsible for your security. This saying is applicable for all things related to blockchain and cryptocurrency.',
  },
});

const Tutorial0 = ({ classes }) => (
  <div>
    <Typography variant="subtitle2" classes={{ subtitle2: classes.tutorialDialogContentTitle }}>
      <FormattedMessage id="tutorial0.title" defaultMessage="What Is The Bodhi App" />
    </Typography>
    <ul className={classes.contentList}>
      <ContentItem id={messages.tutorial0Content0Msg.id} defaultMessage={messages.tutorial0Content0Msg.defaultMessage} />
      <ContentItem id={messages.tutorial0Content1Msg.id} defaultMessage={messages.tutorial0Content1Msg.defaultMessage} />
      <ContentItem id={messages.tutorial0Content2Msg.id} defaultMessage={messages.tutorial0Content2Msg.defaultMessage} />
      <ContentItem id={messages.tutorial0Content3Msg.id} defaultMessage={messages.tutorial0Content3Msg.defaultMessage} />
    </ul>
  </div>
);

Tutorial0.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default injectIntl(withStyles(styles, { withTheme: true })(Tutorial0));
