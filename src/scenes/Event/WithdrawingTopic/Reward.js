import React, { Fragment, Component } from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import { Typography, Tooltip, withStyles } from '@material-ui/core';

import RewardTooltipContent from './RewardTooltipContent';
import { Icon } from '../components';
import { Container, Label } from './components';
import { i18nToUpperCase } from '../../../helpers/i18nUtil';
import styles from './styles';

const messages = defineMessages({
  withdrawDetailReturnRateMsg: {
    id: 'withdrawDetail.returnRate',
    defaultMessage: 'Return rate:',
  },
});

@withStyles(styles)
@injectIntl
class Reward extends Component {
  render() {
    const { eventPage, topic, classes } = this.props;
    const { nakaWinnings, nbotWinnings, betBalances, voteBalances } = eventPage;
    const totalBetAmount = _.sum(betBalances);
    const totalVoteAmount = _.sum(voteBalances);
    const nakaReturnRate = totalBetAmount ? ((nakaWinnings - totalBetAmount) / totalBetAmount) * 100 : 0;
    const nbotReturnRate = totalVoteAmount ? ((nbotWinnings - totalVoteAmount) / totalVoteAmount) * 100 : 0;
    const resultBetAmount = betBalances[topic.resultIdx];
    const resultVoteAmount = voteBalances[topic.resultIdx];
    const totalNakaWinningBets = eventPage.topic.nakaAmount[topic.resultIdx];
    const totalNakaBets = _.sum(topic.nakaAmount);
    const totalLosingNakaBets = totalNakaBets - totalNakaWinningBets;
    const losersNakaReward = totalLosingNakaBets / 100;
    const losersAdjustedNaka = totalLosingNakaBets - losersNakaReward;
    const nakaWon = ((resultBetAmount / totalNakaWinningBets) * losersAdjustedNaka) || 0;
    const totalNbotWinningBets = topic.nbotAmount[topic.resultIdx];
    const nbotNakaWon = ((resultVoteAmount / totalNbotWinningBets) * losersNakaReward) || 0;
    if (nbotNakaWon > 0 || nakaWon > 0) {
      return (
        <Container>
          <RewardIcon />
          <RewardTitle />
          <div className={classes.rowDiv}>
            <NakaReturn
              nakaWinnings={eventPage.nakaWinnings}
              nakaWon={nakaWon}
              nbotNakaWon={nbotNakaWon}
              resultTokenAmount={resultBetAmount}
              totalTokenAmount={totalBetAmount}
              tokenWinnings={nakaWinnings}
              nakaReturnRate={nakaReturnRate}
            />
            <Separator />
            <BotUsed
              nbotWinnings={eventPage.nbotWinnings}
              resultTokenAmount={resultVoteAmount}
              totalTokenAmount={totalVoteAmount}
              tokenWinnings={nbotWinnings}
              nbotReturnRate={nbotReturnRate}
            />
          </div>
        </Container>
      );
    }
    return <Fragment />;
  }
}

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
`;

@withStyles(styles, { withTheme: true })
@injectIntl
class NakaReturn extends Component {
  render() {
    const { nakaWinnings, nakaReturnRate, intl, classes, ...props } = this.props;
    return (
      <div className={classes.colDiv}>
        <Typography variant="h4">
          <div className={classes.rowDiv}>
            +{nakaWinnings} <div className={classes.tokenDiv}>NAKA</div>
            <Tooltip classes={{ tooltip: classes.rewardTooltip }} id="tooltip-reward" title={<RewardTooltipContent token="NAKA" {...props} />}>
              <i className="icon iconfont icon-ic_question" />
            </Tooltip>
          </div>
        </Typography>
        <Typography variant="caption">
          {`${intl.formatMessage(messages.withdrawDetailReturnRateMsg)} ${nakaReturnRate.toFixed(2)}%`}
        </Typography>
      </div>
    );
  }
}

@withStyles(styles, { withTheme: true })
@injectIntl
class BotUsed extends Component {
  render() {
    const { nbotWinnings, nbotReturnRate, intl, classes, ...props } = this.props;
    return (
      <div className={classes.colDiv}>
        <Typography variant="h4">
          <div className={classes.rowDiv}>
            +{nbotWinnings} <div className={classes.tokenDiv}>NBOT</div>
            <Tooltip classes={{ tooltip: classes.rewardTooltip }} id="tooltip-reward" title={<RewardTooltipContent token="NBOT" {...props} />}>
              <i className="icon iconfont icon-ic_question" />
            </Tooltip>
          </div>
        </Typography>
        <Typography variant="caption">
          {`${intl.formatMessage(messages.withdrawDetailReturnRateMsg)} ${nbotReturnRate.toFixed(2)}%`}
        </Typography>
      </div>
    );
  }
}

export default Reward;
