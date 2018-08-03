import React from 'react';
import styled from 'styled-components';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Typography } from '@material-ui/core';
import { Icon } from '../components';
import { Container, Label } from './components';
import { i18nToUpperCase } from '../../../helpers/i18nUtil';


const WinningOutcome = injectIntl(({ eventPage, intl }) => (
  <Container>
    <WinningIcon />
    <WinningReward />
    <OutcomeTitle>{eventPage.selectedOption}</OutcomeTitle>
    {(eventPage.totalBetAmount || eventPage.totalVoteAmount) ? (
      <Typography variant="caption">
        {intl.formatMessage({ id: 'str.winningOutcome' }, { qtum: eventPage.resultBetAmount, bot: eventPage.resultVoteAmount })}
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

const WinningReward = () => (
  <Label variant="body2">
    <FormattedMessage id="withdrawDetail.reward" defaultMessage="REWARD">
      {(txt) => i18nToUpperCase(txt)}
    </FormattedMessage>
  </Label>
);

const OutcomeTitle = styled(Typography)`
  color: ${props => props.theme.palette.primary.main};
  font-size: ${props => props.theme.sizes.font.titleSm};
  font-weight: ${props => props.theme.typography.fontWeightBold};
  margin-bottom: ${props => props.theme.padding.unit.px};
`;

export default WinningOutcome;
