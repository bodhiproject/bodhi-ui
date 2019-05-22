import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Typography } from '@material-ui/core';
import Icon from '../Icon';
import Container from '../Container';
import Label from '../Label';
import { i18nToUpperCase } from '../../../helpers/i18nUtil';

const WinningIcon = () => <Icon type='reward' />;

const WinningOutcomeTitle = () => (
  <Label variant="body2">
    <FormattedMessage id="str.winningOutcome" defaultMessage="Winning Outcome">
      {(txt) => i18nToUpperCase(txt)}
    </FormattedMessage>
  </Label>
);

const WinningResult = ({ intl, eventPage }) => (
  <Typography color="primary" variant="h6">
    {eventPage.selectedOption.name === 'Invalid'
      ? eventPage.event.localizedInvalid.parse(intl.locale)
      : eventPage.selectedOption.name}
  </Typography>
);

const WinningOutcome = ({ intl, eventPage }) => (
  <Container>
    <WinningIcon />
    <WinningOutcomeTitle />
    <WinningResult intl={intl} eventPage={eventPage} />
    {(eventPage.resultBetAmount || eventPage.resultVoteAmount) ? (
      <Typography variant="caption">
        <FormattedMessage
          id="withdrawDetail.youBetYouVote"
          defaultMessage="You bet {naka} NAKA. You voted {nbot} NBOT."
          values={{
            naka: eventPage.resultBetAmount,
            nbot: eventPage.resultVoteAmount,
          }}
        />
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
);

export default injectIntl(WinningOutcome);
