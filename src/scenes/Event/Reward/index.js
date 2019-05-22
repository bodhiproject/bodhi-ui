import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Typography, Tooltip, withStyles } from '@material-ui/core';
import RewardTooltipContent from '../RewardTooltipContent';
import Icon from '../Icon';
import Container from '../Container';
import Label from '../Label';
import { i18nToUpperCase } from '../../../helpers/i18nUtil';
import styles from './styles';

@withStyles(styles)
@injectIntl
@inject('store')
@observer
export default class Reward extends Component {
  renderTitle = () => (
    <Label>
      <FormattedMessage id="withdrawDetail.reward" defaultMessage="REWARD">
        {(txt) => i18nToUpperCase(txt)}
      </FormattedMessage>
    </Label>
  )

  renderReturnAmount = () => {
    const {
      classes,
      store: {
        eventPage: { nbotWinnings },
      },
    } = this.props;
    // TODO: implement when Event store pulls TotalResultBets
    // const betterBets = event && event.betterBets;
    // const returnRate = ((nbotWinnings - betterBets) / betterBets) * 100;
    const returnRate = 0;

    return (
      <div className={classes.colDiv}>
        <Typography variant="h4">
          <div className={classes.rowDiv}>
            +{nbotWinnings} <div className={classes.tokenDiv}>NBOT</div>
            <Tooltip
              classes={{ tooltip: classes.rewardTooltip }}
              id="tooltip-reward"
              title={<RewardTooltipContent token="NBOT" />}
            >
              <i className="icon iconfont icon-ic_question" />
            </Tooltip>
          </div>
        </Typography>
        <Typography variant="caption">
          <FormattedMessage
            id="withdrawDetail.returnRateXPercent"
            defaultMessage="Return rate: {rate}%"
            values={{ rate: returnRate.toFixed(2) }}
          />
        </Typography>
      </div>
    );
  }

  render() {
    const { eventPage, event, classes } = this.props;
    const { nbotWinnings, betBalances, voteBalances } = eventPage;
    // const totalBetAmount = _.sum(betBalances);
    // const totalVoteAmount = _.sum(voteBalances);
    // const nakaReturnRate = totalBetAmount ? ((nakaWinnings - totalBetAmount) / totalBetAmount) * 100 : 0;
    // const nbotReturnRate = totalVoteAmount ? ((nbotWinnings - totalVoteAmount) / totalVoteAmount) * 100 : 0;
    // const resultBetAmount = betBalances[event.resultIdx];
    // const resultVoteAmount = voteBalances[event.resultIdx];
    // const totalNakaWinningBets = eventPage.event.nakaAmount[event.resultIdx];
    // const totalNakaBets = _.sum(event.nakaAmount);
    // const totalLosingNakaBets = totalNakaBets - totalNakaWinningBets;
    // const losersNakaReward = totalLosingNakaBets / 100;
    // const losersAdjustedNaka = totalLosingNakaBets - losersNakaReward;
    // const nakaWon = ((resultBetAmount / totalNakaWinningBets) * losersAdjustedNaka) || 0;
    // const totalNbotWinningBets = event.nbotAmount[event.resultIdx];
    // const nbotNakaWon = ((resultVoteAmount / totalNbotWinningBets) * losersNakaReward) || 0;
    const nbotNakaWon = 1;
    if (nbotNakaWon > 0) {
      return (
        <Container>
          <Icon type='token' />
          {this.renderTitle()}
          <div className={classes.rowDiv}>
            {this.renderReturnAmount()}
          </div>
        </Container>
      );
    }
    return null;
  }
}
