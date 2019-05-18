import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { injectIntl, defineMessages } from 'react-intl';
import { Typography, Grid, withStyles } from '@material-ui/core';
import _ from 'lodash';
import { StepperVertRight } from 'components';
import { getEndTimeCountDownString } from '../../../helpers';
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
});

const Sidebar = inject('store')(observer(({ store: { eventPage: { event } }, endTime }) => (
  <SidebarContainer>
    <EventInfo>
      <EndDate endTime={endTime} />
      <Funding event={event} />
      <ResultSetter event={event} />
    </EventInfo>
    {/* <StepperVertRight /> */}
  </SidebarContainer>
)));

const SidebarContainer = withStyles(styles)(({ children, classes }) => (
  <Grid className={classes.oracleSidebarContainer} item xs={12} md={4}>
    {children}
  </Grid>
));

const EndDate = inject('store')(observer(injectIntl(({ endTime, store: { ui: { currentTimeUnix } }, intl: { locale, messages } }) => (
  <EventInfoBlock id={message.eventInfoEndDateMsg.id} content={moment.unix(endTime).format('LLL')} highlight={getEndTimeCountDownString(endTime - currentTimeUnix, locale, messages)} />
))));

const Funding = ({ event: { totalBets } }) => (
  <EventInfoBlock id={message.eventInfoFundMsg.id} content={`${totalBets} NBOT`} />
);

const ResultSetter = ({ event }) => (
  <EventInfoBlock id={message.strResultSetterMsg.id} content={event.centralizedOracle} />
);

const EventInfo = styled.div`
  padding-bottom: ${props => props.theme.padding.space5X.px};
`;

const EventInfoBlock = injectIntl(({ id, content, highlight, intl }) => (
  <Container>
    <Heading>{intl.formatMessage({ id })}</Heading>
    <Content>{content}</Content>
    {highlight && (
      <Typography variant="body2" color="secondary">
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
  margin-bottom: 36px !important;
`;

export { SidebarContainer, Sidebar };
