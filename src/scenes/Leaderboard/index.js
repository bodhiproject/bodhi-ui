import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { injectIntl, defineMessages } from 'react-intl';
import { Grid, withStyles, Card as _Card, CardContent, Typography } from '@material-ui/core';

import styles from './styles';
import _Leaderboard from '../Event/components/Leaderboard';
import { Row, Content } from '../Event/components';

const messages = defineMessages({
  totalEvents: {
    id: 'leaderboard.totalEvents',
    defaultMessage: 'Total Events',
  },
  totalParticipants: {
    id: 'leaderboard.totalParticipants',
    defaultMessage: 'Total Participants',
  },
  totalQTUM: {
    id: 'leaderboard.totalQTUM',
    defaultMessage: 'Total bet in QTUM',
  },
  totalBOT: {
    id: 'leaderboard.totalBOT',
    defaultMessage: 'Total bet in BOT',
  },
});

@withStyles(styles, { withTheme: true })
@injectIntl
@inject('store')
@observer
export default class Leaderboard extends Component {
  componentDidMount() {
    this.props.store.leaderboard.init();
  }
  render() {
    const { eventCount, participantsCount, totalBOT, totalQTUM } = this.props.store.leaderboard;
    const { intl } = this.props;
    return (
      <Row>
        <SidebarContainer>
          <Card title={intl.formatMessage(messages.totalEvents)} value={eventCount} />
          <Card title={intl.formatMessage(messages.totalParticipants)} value={participantsCount} />
          <Card title={intl.formatMessage(messages.totalQTUM)} value={totalQTUM} />
          <Card title={intl.formatMessage(messages.totalBOT)} value={totalBOT} />
        </SidebarContainer>
        <Content>
          <_Leaderboard maxSteps={2} xstore={this.props.store.leaderboard} />
        </Content>
      </Row>
    );
  }
}

const Card = withStyles(styles)(({ title, value, classes }) => (
  <_Card className={classes.card}>
    <CardContent>
      <Typography className={classes.cardHeader} align='left'>
        {title}
      </Typography>
      <Typography className={classes.cardContent}>
        {value}
      </Typography>
    </CardContent>
  </_Card>
));

const SidebarContainer = withStyles(styles)(({ children, classes }) => (
  <Grid className={classes.SidebarContainer} item xs={12} md={4}>
    {children}
  </Grid>
));
