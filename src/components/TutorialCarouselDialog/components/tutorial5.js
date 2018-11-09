import React from 'react';
import PropTypes from 'prop-types';
import { Typography, withStyles } from '@material-ui/core';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';

import styles from '../styles';
import { ContentItem } from './contentItem';

const messages = defineMessages({
  tutorial5Content0Msg: {
    id: 'tutorial5.content0',
    defaultMessage: 'The blockchain is like a huge, global, decentralized spreadsheet.',
  },
  tutorial5Content1Msg: {
    id: 'tutorial5.content1',
    defaultMessage: 'It keeps track of who sent how many tokens to whom, and what the balance of every account is.',
  },
  tutorial5Content2Msg: {
    id: 'tutorial5.content2',
    defaultMessage: 'It is stored and maintained by thousands of people (miners) across the globe who have special computers.',
  },
  tutorial5Content3Msg: {
    id: 'tutorial5.content3',
    defaultMessage: 'The blocks in the blockchain are made up of all the individual transactions sent from users who interact with the blockchain.',
  },
  tutorial5Content4Msg: {
    id: 'tutorial5.content4',
    defaultMessage: 'When you see your balance on Bodhi Dapp, the Qtum Wallet, or view your transactions on the Qtum Explorer, you are seeing data on the blockchain, not in our personal systems.',
  },
});

const Tutorial5 = ({ classes }) => (
  <div>
    <Typography variant="h4" classes={{ subtitle1: classes.tutorialDialogContentTitle }}>
      <FormattedMessage id="tutorial5.title" defaultMessage="What Is Blockchain" />
    </Typography>
    <ul className={classes.contentList}>
      <ContentItem id={messages.tutorial5Content0Msg.id} defaultMessage={messages.tutorial5Content0Msg.defaultMessage} />
      <ContentItem id={messages.tutorial5Content1Msg.id} defaultMessage={messages.tutorial5Content1Msg.defaultMessage} />
      <ContentItem id={messages.tutorial5Content2Msg.id} defaultMessage={messages.tutorial5Content2Msg.defaultMessage} />
      <ContentItem id={messages.tutorial5Content3Msg.id} defaultMessage={messages.tutorial5Content3Msg.defaultMessage} />
      <ContentItem id={messages.tutorial5Content4Msg.id} defaultMessage={messages.tutorial5Content4Msg.defaultMessage} />
    </ul>
  </div>
);

Tutorial5.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default injectIntl(withStyles(styles, { withTheme: true })(Tutorial5));
