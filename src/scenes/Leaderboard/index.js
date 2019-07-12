import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { injectIntl, defineMessages } from 'react-intl';
import { Grid, withStyles, Card as _Card, CardContent, Typography } from '@material-ui/core';
import { PageContainer, ContentContainer } from 'components';
import { Routes } from 'constants';
import styles from './styles';
import _Leaderboard from '../Event/Leaderboard';
import { toFixed } from '../../helpers/utility';

const messages = defineMessages({
  totalEvents: {
    id: 'leaderboard.totalEvents',
    defaultMessage: 'Total Events',
  },
  totalParticipants: {
    id: 'leaderboard.totalParticipants',
    defaultMessage: 'Total Participants',
  },
  totalBets: {
    id: 'leaderboard.totalBets',
    defaultMessage: 'Total bets in NBOT',
  },
});

@withStyles(styles, { withTheme: true })
@injectIntl
@inject('store')
@observer
export default class Leaderboard extends Component {
  componentDidMount() {
    this.props.store.ui.location = Routes.LEADERBOARD;
    this.props.store.leaderboard.init();
  }

  render() {
    const { eventCount, participantCount, totalBets } = this.props.store.leaderboard;
    return (
      <PageContainer>
        <SidebarContainer>
          <Card title={messages.totalEvents} value={eventCount} />
          <Card title={messages.totalParticipants} value={participantCount} />
          <Card title={messages.totalBets} value={totalBets} />
        </SidebarContainer>
        <ContentContainer>
          <_Leaderboard maxSteps={2} />
        </ContentContainer>
      </PageContainer>
    );
  }
}

const Card = injectIntl(withStyles(styles)(({ title, value, classes, intl }) => (
  <_Card className={classes.card}>
    <CardContent>
      <Typography className={classes.cardHeader} align='left'>
        {intl.formatMessage(title)}
      </Typography>
      <Typography className={classes.cardContent}>
        {toFixed(value, true)}
      </Typography>
    </CardContent>
  </_Card>
)));

const SidebarContainer = withStyles(styles)(({ children, classes }) => (
  <Grid className={classes.SidebarContainer} item xs={12} md={4}>
    {children}
  </Grid>
));
