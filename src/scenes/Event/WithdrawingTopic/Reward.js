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
          <div className={classes.rowDiv}>
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
class QtumReturn extends Component {
  render() {
    const { qtumWinnings, qtumReturnRate, intl, classes, ...props } = this.props;
    return (
      <div className={classes.colDiv}>
        <Typography variant="h4">
          <div className={classes.rowDiv}>
            +{qtumWinnings} <div className={classes.tokenDiv}>QTUM</div>
            <Tooltip classes={{ tooltip: classes.rewardTooltip }} id="tooltip-reward" title={<RewardTooltipContent token="QTUM" {...props} />}>
              <i className="icon iconfont icon-ic_question" />
            </Tooltip>
          </div>
        </Typography>
        <Typography variant="caption">
          {`${intl.formatMessage(messages.withdrawDetailReturnRateMsg)} ${qtumReturnRate.toFixed(2)}%`}
        </Typography>
      </div>
    );
  }
}

@withStyles(styles, { withTheme: true })
@injectIntl
class BotUsed extends Component {
  render() {
    const { botWinnings, botReturnRate, intl, classes, ...props } = this.props;
    return (
      <div className={classes.colDiv}>
        <Typography variant="h4">
          <div className={classes.rowDiv}>
            +{botWinnings} <div className={classes.tokenDiv}>BOT</div>
            <Tooltip classes={{ tooltip: classes.rewardTooltip }} id="tooltip-reward" title={<RewardTooltipContent token="BOT" {...props} />}>
              <i className="icon iconfont icon-ic_question" />
            </Tooltip>
          </div>
        </Typography>
        <Typography variant="caption">
          {`${intl.formatMessage(messages.withdrawDetailReturnRateMsg)} ${botReturnRate.toFixed(2)}%`}
        </Typography>
      </div>
    );
  }
}

export default Reward;
