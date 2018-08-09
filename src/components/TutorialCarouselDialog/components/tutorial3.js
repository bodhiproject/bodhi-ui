import React from 'react';
import PropTypes from 'prop-types';
import { Typography, withStyles } from '@material-ui/core';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';

import styles from '../styles';
import { ContentItem } from './contentItem';

const messages = defineMessages({
  tutorial3Content0Msg: {
    id: 'tutorial3.content0',
    defaultMessage: 'Because we need you to understand that we cannot...',
  },
  tutorial3Content1Msg: {
    id: 'tutorial3.content1',
    defaultMessage: 'Access your account or send your funds for you.',
  },
  tutorial3Content2Msg: {
    id: 'tutorial3.content2',
    defaultMessage: 'Recover your wallet data file.',
  },
  tutorial3Content3Msg: {
    id: 'tutorial3.content3',
    defaultMessage: 'Recover or change your private key.',
  },
  tutorial3Content4Msg: {
    id: 'tutorial3.content4',
    defaultMessage: 'Recover or reset your passphrase.',
  },
  tutorial3Content5Msg: {
    id: 'tutorial3.content5',
    defaultMessage: 'Reverse, cancel, or refund transactions.',
  },
  tutorial3Content6Msg: {
    id: 'tutorial3.content6',
    defaultMessage: 'Freeze accounts.',
  },
  tutorial3Content7Msg: {
    id: 'tutorial3.content7',
    defaultMessage: 'You and only you are responsible for your security.',
  },
  tutorial3Content8Msg: {
    id: 'tutorial3.content8',
    defaultMessage: 'Be diligent to keep your wallet data file and passphrase safe and don’t share it with anyone you don’t trust!',
  },
  tutorial3Content9Msg: {
    id: 'tutorial3.content9',
    defaultMessage: 'If you lose your wallet data file, passphrase, and private key no one can recover it for you.',
  },
  tutorial3Content10Msg: {
    id: 'tutorial3.content10',
    defaultMessage: 'If you enter your passphrase, wallet data file, or private key on a phishing website, you will have all your funds taken from you.',
  },
});

const Tutorial3 = ({ classes }) => (
  <div>
    <Typography variant="display1">
      <FormattedMessage id="tutorial3.title" defaultMessage="Why Should I Read All This" />
    </Typography>
    <ul className={classes.contentList}>
      <ContentItem id={messages.tutorial3Content0Msg.id} defaultMessage={messages.tutorial3Content0Msg.defaultMessage} />
      <ContentItem id={messages.tutorial3Content1Msg.id} defaultMessage={messages.tutorial3Content1Msg.defaultMessage} />
      <ContentItem id={messages.tutorial3Content2Msg.id} defaultMessage={messages.tutorial3Content2Msg.defaultMessage} />
      <ContentItem id={messages.tutorial3Content3Msg.id} defaultMessage={messages.tutorial3Content3Msg.defaultMessage} />
      <ContentItem id={messages.tutorial3Content4Msg.id} defaultMessage={messages.tutorial3Content4Msg.defaultMessage} />
      <ContentItem id={messages.tutorial3Content5Msg.id} defaultMessage={messages.tutorial3Content5Msg.defaultMessage} />
      <ContentItem id={messages.tutorial3Content6Msg.id} defaultMessage={messages.tutorial3Content6Msg.defaultMessage} />
      <ContentItem id={messages.tutorial3Content7Msg.id} defaultMessage={messages.tutorial3Content7Msg.defaultMessage} />
      <ContentItem id={messages.tutorial3Content8Msg.id} defaultMessage={messages.tutorial3Content8Msg.defaultMessage} />
      <ContentItem id={messages.tutorial3Content9Msg.id} defaultMessage={messages.tutorial3Content9Msg.defaultMessage} />
      <ContentItem id={messages.tutorial3Content10Msg.id} defaultMessage={messages.tutorial3Content10Msg.defaultMessage} />
    </ul>
  </div>
);

Tutorial3.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default injectIntl(withStyles(styles, { withTheme: true })(Tutorial3));
