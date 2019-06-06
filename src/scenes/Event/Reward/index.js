import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Typography, Tooltip, withStyles } from '@material-ui/core';
import RewardTooltipContent from '../RewardTooltipContent';
import Icon from '../Icon';
import Container from '../Container';
import Label from '../Label';
import { i18nToUpperCase } from '../../../helpers/i18nUtil';
import { toFixed } from '../../../helpers/utility';
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
        eventPage: { nbotWinnings, returnRate, totalInvestment, profitOrLoss },
      },
    } = this.props;

    return (
      <div className={classes.colDiv}>
        <Typography variant="h4">
          <div className={classes.rowDiv}>
            +{toFixed(nbotWinnings)} <div className={classes.tokenDiv}>NBOT</div>
            <Tooltip
              classes={{ tooltip: classes.rewardTooltip }}
              id="tooltip-reward"
              title={<RewardTooltipContent token="NBOT" totalInvestment={toFixed(totalInvestment)} profitOrLoss={toFixed(profitOrLoss)} />}
            >
              <i className="icon iconfont icon-ic_question" />
            </Tooltip>
          </div>
        </Typography>
        <Typography variant="caption">
          <FormattedMessage
            id="withdrawDetail.returnRateXPercent"
            defaultMessage="Return rate: {rate}%"
            values={{ rate: toFixed(returnRate) }}
          />
        </Typography>
      </div>
    );
  }

  render() {
    const {
      classes,
      store: {
        eventPage: { nbotWinnings },
      },
    } = this.props;
    if (nbotWinnings > 0) {
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
