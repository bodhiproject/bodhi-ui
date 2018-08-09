import React from 'react';
import PropTypes from 'prop-types';
import { Typography, withStyles } from '@material-ui/core';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';

import styles from '../styles';
import { ContentItem } from './contentItem';

const messages = defineMessages({
  tutorial6Content0Msg: {
    id: 'tutorial6.content0',
    defaultMessage: 'Having to be in control of your own security is the trade-off for decentralization.',
  },
  tutorial6Content1Msg: {
    id: 'tutorial6.content1',
    defaultMessage: "You don't have to rely on your bank, government, or anyone else when you want to move your funds.",
  },
  tutorial6Content2Msg: {
    id: 'tutorial6.content2',
    defaultMessage: "You don't have to rely on the security of an exchange or bank to keep your funds safe.",
  },
  tutorial6Content3Msg: {
    id: 'tutorial6.content3',
    defaultMessage: "If you don't find these things valuable, ask yourself why you think the blockchain and cryptocurrencies are valuable.",
  },
});

const Tutorial6 = ({ classes }) => (
  <div>
    <Typography variant="display1">
      <FormattedMessage id="tutorial6.title" defaultMessage="Decentralization" />
    </Typography>
    <ul className={classes.contentList}>
      <ContentItem id={messages.tutorial6Content0Msg.id} defaultMessage={messages.tutorial6Content0Msg.defaultMessage} />
      <ContentItem id={messages.tutorial6Content1Msg.id} defaultMessage={messages.tutorial6Content1Msg.defaultMessage} />
      <ContentItem id={messages.tutorial6Content2Msg.id} defaultMessage={messages.tutorial6Content2Msg.defaultMessage} />
      <ContentItem id={messages.tutorial6Content3Msg.id} defaultMessage={messages.tutorial6Content3Msg.defaultMessage} />
    </ul>
  </div>
);

Tutorial6.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default injectIntl(withStyles(styles, { withTheme: true })(Tutorial6));
