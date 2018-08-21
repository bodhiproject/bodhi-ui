import React, { Fragment } from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import { Typography, Tooltip } from '@material-ui/core';

import RewardTooltipContent from './RewardTooltipContent';
import { Icon } from '../components';
import { Container, Label } from './components';
import { i18nToUpperCase } from '../../../helpers/i18nUtil';

const messages = defineMessages({
  withdrawDetailReturnRateMsg: {
    id: 'withdrawDetail.returnRate',
    defaultMessage: 'Return rate:',
  },
});

// TODO: fix the tooltip next to QtumReturn and BotUsed
const Reward = ({ eventPage, topic }) => {
  const { qtumWinnings, botWinnings, betBalances, voteBalances } = eventPage;
  const totalBetAmount = _.sum(betBalances);
  const totalVoteAmount = _.sum(voteBalances);
  const qtumReturnRate = totalBetAmount ? ((qtumWinnings - totalBetAmount) / totalBetAmount) * 100 : 0;
  const botReturnRate = totalVoteAmount ? ((botWinnings - totalVoteAmount) / totalVoteAmount) * 100 : 0;
  const resultBetAmount = betBalances[topic.resultIdx];
  const resultVoteAmount = voteBalances[topic.resultIdx];
  const totalQtumWinningBets = eventPage.topic.qtumAmount[topic.resultIdx];
  const totalQtumBets = _.sum(topic.qtumAmount);
  const totalLosingQtumBets = totalQtumBets - totalQtumWinningBets;
  const losersQtumReward = totalLosingQtumBets / 100;
  const losersAdjustedQtum = totalLosingQtumBets - losersQtumReward;
  const qtumWon = ((resultBetAmount / totalQtumWinningBets) * losersAdjustedQtum) || 0;
  const totalBotWinningBets = topic.botAmount[topic.resultIdx];
  const botQtumWon = ((resultVoteAmount / totalBotWinningBets) * losersQtumReward) || 0;
  if (botQtumWon > 0 || qtumWon > 0) {
    return (
      <Container>
        <RewardIcon />
        <RewardTitle />
        <Row>
          <QtumReturn
            qtumWinnings={eventPage.qtumWinnings}
            qtumWon={qtumWon}
            botQtumWon={botQtumWon}
            resultTokenAmount={resultBetAmount}
            totalTokenAmount={totalBetAmount}
            tokenWinnings={qtumWinnings}
            qtumReturnRate={qtumReturnRate}
          />
          <Separator />
          <BotUsed
            botWinnings={eventPage.botWinnings}
            resultTokenAmount={resultVoteAmount}
            totalTokenAmount={totalVoteAmount}
            tokenWinnings={botWinnings}
            botReturnRate={botReturnRate}
          />
        </Row>
      </Container>
    );
  }
  return <Fragment />;
};

const RewardIcon = () => <Icon type='token' />;

const RewardTitle = () => (
  <Label>
    <FormattedMessage id="withdrawDetail.reward" defaultMessage="REWARD">
      {(txt) => i18nToUpperCase(txt)}
    </FormattedMessage>
  </Label>
);

const Separator = styled.div`
  display: inline-block;
  width: 1px;
  height: 75px;
  background: ${props => props.theme.palette.divider};
  margin-left: ${props => props.theme.padding.md.px};
  margin-right: ${props => props.theme.padding.md.px};
`;

const QtumReturn = injectIntl(({ qtumWinnings, qtumReturnRate, intl, ...props }) => (
  <Wrapper>
    <Typography variant="display1">
      <Row>
        +{qtumWinnings} <Token>QTUM</Token>
        <Tooltip id="tooltip-reward" title={<RewardTooltipContent token="QTUM" {...props} />}>
          <i className="icon iconfont icon-ic_question" />
        </Tooltip>
      </Row>
    </Typography>
    <Typography variant="caption">
      {`${intl.formatMessage(messages.withdrawDetailReturnRateMsg)} ${qtumReturnRate.toFixed(2)}%`}
    </Typography>
  </Wrapper>
));

const BotUsed = injectIntl(({ botWinnings, botReturnRate, intl, ...props }) => (
  <Wrapper>
    <Typography variant="display1">
      <Row>
        +{botWinnings} <Token>BOT</Token>
        <Tooltip id="tooltip-reward" title={<RewardTooltipContent token="BOT" {...props} />}>
          <i className="icon iconfont icon-ic_question" />
        </Tooltip>
      </Row>
    </Typography>
    <Typography variant="caption">
      {`${intl.formatMessage(messages.withdrawDetailReturnRateMsg)} ${botReturnRate.toFixed(2)}%`}
    </Typography>
  </Wrapper>
));

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;
const Col = styled.div`
  display: flex;
  flex-direction: column;
`;

const Token = styled.div`
  font-size: ${props => props.theme.sizes.font.textSm};
  font-weight: ${props => props.theme.typography.fontWeightBold};
`;

const Wrapper = Col.extend`
  position: relative;
  /* display: inline-block; */
  margin-bottom: ${props => props.theme.padding.unit.px};
`;

export default Reward;
