import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import cx from 'classnames';
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';
import { Typography, Grid, Paper, withStyles } from '@material-ui/core';
import {
  Loading,
  BackButton,
  PageContainer,
  ContentContainer,
  Card,
} from 'components';
import { EVENT_STATUS, Routes } from 'constants';
import styles from './styles';
import Option from '../Event/Option';
import HistoryTable from '../Event/HistoryTable';
import WinningOutcome from '../Event/WinningOutcome';

const messages = defineMessages({
  loadHistoryMsg: {
    id: 'load.history',
    defaultMessage: 'Loading Event History...',
  },
});

@injectIntl
@withStyles(styles, { withTheme: true })
@withRouter
@inject('store')
@observer
export default class EventHistory extends Component {
  async componentDidMount() {
    const { params } = this.props.match;
    this.props.store.ui.location = Routes.EVENT_HISTORY;
    await this.props.store.eventPage.init({ ...params });
    this.props.store.history.init();
  }

  renderTitle = () => {
    const {
      classes,
      store: { eventPage },
    } = this.props;
    return (
      <Typography variant="h4" className={cx(classes.title, classes.padLeft)}>
        {eventPage.eventName}
      </Typography>
    );
  }

  renderOptions = (actionText, betSpecific) => {
    const { classes, store: { eventPage: { isResultSetting, event: { results, status, betResults } } } } = this.props;
    let asOptions = results;
    asOptions = asOptions.slice(1).concat(asOptions[0]);
    if (betSpecific) {
      asOptions = betResults;
      asOptions = asOptions.slice(1);
    }
    return (
      <Grid className={classes.optionGrid}>
        {asOptions.map((option, i) => (
          (status !== EVENT_STATUS.BETTING || ([EVENT_STATUS.PRE_BETTING, EVENT_STATUS.BETTING].includes(status) && i !== asOptions.length - 1)) &&
          <Option
            key={i}
            option={option}
            disabled
            amountInputDisabled={isResultSetting}
            actionText={actionText}
            betSpecific={betSpecific}
          />
        ))}
      </Grid>
    );
  }

  renderBetContent = () => {
    const {
      classes,
      store: {
        eventPage: { event },
      },
    } = this.props;

    return (
      event.currentRound > 0 && <Fragment>
        <div className={cx(classes.stateText, classes.padLeft)}><FormattedMessage id='string.betEnded' defaultMessage='Event bet Ended' /></div>
        {this.renderOptions('bet', true)}
      </Fragment>
    );
  }

  // Renders sections for bet, set, vote statuses
  renderActiveEventContent = () => {
    const {
      store: {
        eventPage: { event },
      },
    } = this.props;
    return (
      <Card>
        {this.renderTitle()}
        {this.renderBetContent()}
        {this.renderOptions(event.currentRound > 0 ? 'vote' : 'bet')}
      </Card>
    );
  }

  // Renders sections for withdraw status
  renderWithdrawContent = () => {
    const {
      classes,
      store: {
        eventPage,
      },
    } = this.props;

    return (
      <Card>
        {this.renderTitle()}
        {this.renderBetContent()}
        <Paper className={classes.withdrawingPaper}>
          <WinningOutcome eventPage={eventPage} />
        </Paper>
      </Card>
    );
  }

  render() {
    const {
      store: {
        eventPage,
        eventPage: { event, loading },
      },
      classes,
    } = this.props;

    if (loading || !event) {
      return <Loading text={messages.loadHistoryMsg} event='true' />;
    }
    return (
      <Fragment>
        <BackButton />
        <PageContainer classes={{ root: classes.pageRoot }}>
          <ContentContainer noSideBar>
            {!eventPage.isWithdrawing
              ? this.renderActiveEventContent()
              : this.renderWithdrawContent()}
            <HistoryTable />
          </ContentContainer>
        </PageContainer>
      </Fragment>
    );
  }
}
