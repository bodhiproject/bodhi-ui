import React from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { injectIntl, defineMessages } from 'react-intl';
import { Typography, Grid, withStyles } from '@material-ui/core';
import { StepperVertRight, Card } from 'components';
import { getEndTimeCountDownString, getTimeString } from '../../../helpers';
import styles from './styles';

const message = defineMessages({
  eventInfoEndDateMsg: {
    id: 'eventInfo.endDate',
    defaultMessage: 'Ending Date',
  },
  eventInfoFundMsg: {
    id: 'eventInfo.fund',
    defaultMessage: 'Funding',
  },
  strResultSetterMsg: {
    id: 'str.resultSetter',
    defaultMessage: 'Result Setter',
  },
  eventVersionMsg: {
    id: 'str.eventVersion',
    defaultMessage: 'Event Version',
  },
  eventArbitrationRewardPercentage: {
    id: 'str.arbitrationReward',
    defaultMessage: 'Arbitration Reward',
  },
});

const Sidebar = inject('store')(observer(({ store: { eventPage: { event } }, endTime }) => (
  <SidebarContainer>
    <Card>
      <EventInfo>
        <EndDate endTime={endTime} />
        <ProfitCut event={event} />
      </EventInfo>
    </Card>
    <StepperVertRight />
  </SidebarContainer>
)));

const SidebarContainer = withStyles(styles)(({ children, classes }) => (
  <Grid className={classes.sidebarContainer} item xs={12} md={4}>
    {children}
  </Grid>
));

const EndDate = injectIntl(inject('store')(observer(({ endTime, store: { ui: { currentTimeUnix } }, intl: { locale, messages } }) => (
  <EventInfoBlock id={message.eventInfoEndDateMsg.id} content={getTimeString(endTime)} highlight={getEndTimeCountDownString(endTime - currentTimeUnix, locale, messages)} />
))));

const ProfitCut = ({ event: { arbitrationRewardPercentage } }) => (
  <EventInfoBlock id={message.eventArbitrationRewardPercentage.id} content={`${arbitrationRewardPercentage}%`} />
);

const EventInfo = styled.div`
  padding-bottom: ${props => props.theme.padding.spaceX.px};
`;

const EventInfoBlock = injectIntl(({ id, content, highlight, intl }) => (
  <Container>
    <Heading>{intl.formatMessage({ id })}</Heading>
    <Content>{content}</Content>
    {highlight && (
      <Typography variant="body2" color="secondary" gutterBottom>
        {highlight}
      </Typography>
    )}
  </Container>
));

const Heading = styled(Typography).attrs({ variant: 'body2' })`
  font-size: 18px;
  text-transform: uppercase;
`;

const Content = styled(Typography).attrs({ variant: 'h6' })`
  margin-top: ${props => props.theme.padding.spaceX.px} !important;
  word-wrap: break-word !important;
  font-size: ${props => props.theme.typography.fontSize} !important;
`;

const Container = styled(Grid).attrs({ item: true })`
  @media(min-width: 600px) {
    margin-bottom: 36px !important;
  }
`;

export { SidebarContainer, Sidebar };
