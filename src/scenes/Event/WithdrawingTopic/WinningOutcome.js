import React from 'react';
import styled from 'styled-components';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import { Typography } from '@material-ui/core';
import { Icon } from '../components';
import { Container, Label } from './components';
import { i18nToUpperCase } from '../../../helpers/i18nUtil';

const messages = defineMessages({
  withdrawDetailYouBetYouVoteMsg: {
    id: 'withdrawDetail.youBetYouVote',
    defaultMessage: 'You bet {naka} NAKA. You voted {nbot} NBOT.',
  },
});

const WinningOutcome = injectIntl(({ eventPage, intl }) => (
  <Container>
    <WinningIcon />
    <WinningOutcomeTitle />
    <OutcomeOption>{eventPage.selectedOption === 'Invalid' ? eventPage.topic.localizedInvalid.parse(intl.locale) : eventPage.selectedOption}</OutcomeOption>
    {(eventPage.resultBetAmount || eventPage.resultVoteAmount) ? (
      <Typography variant="caption">
        {intl.formatMessage(messages.withdrawDetailYouBetYouVoteMsg, { naka: eventPage.resultBetAmount, nbot: eventPage.resultVoteAmount })}
      </Typography>
    ) : (
      <Typography variant="caption">
        <FormattedMessage
          id="topic.didNotBetOrVote"
          defaultMessage="You did not bet or vote on the winning outcome."
        />
      </Typography>
    )}
  </Container>
));

const WinningIcon = () => <Icon type='reward' />;

const WinningOutcomeTitle = () => (
  <Label variant="body2">
    <FormattedMessage id="str.winningOutcome" defaultMessage="Wining Outcome">
      {(txt) => i18nToUpperCase(txt)}
    </FormattedMessage>
  </Label>
);

const OutcomeOption = styled(Typography)`
  color: ${props => props.theme.palette.primary.main} !important;
  font-size: ${props => props.theme.sizes.font.large.px} !important;
  font-weight: ${props => props.theme.typography.fontWeightBold} !important;
  margin-bottom: ${props => props.theme.padding.spaceX.px} !important;
`;

export default WinningOutcome;
