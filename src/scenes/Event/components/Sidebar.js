import React from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { injectIntl } from 'react-intl';
import { Typography, Grid } from '@material-ui/core';
import _ from 'lodash';
import { StepperVertRight } from 'components';
import { getShortLocalDateTimeString, getEndTimeCountDownString } from '../../../helpers';


export const Sidebar = inject('store')(observer(({ store: { eventPage: { oracle } } }) => (
  <SidebarContainer>
    <EventInfo>
      <EndDate oracle={oracle} />
      <Funding oracle={oracle} />
      <ResultSetter oracle={oracle} />
    </EventInfo>
    <StepperVertRight />
  </SidebarContainer>
)));

const SidebarContainer = styled(Grid).attrs({ item: true, xs: 12, md: 4 })`
  padding: ${props => props.theme.padding.lg.px};
  overflow-x: hidden;
  border-left: ${props => props.theme.border};
  text-align: right;
`;

const EndDate = injectIntl(({ oracle: { endTime }, intl: { locale, messages } }) => (
  <EventInfoBlock id='eventInfo.endDate' content={getShortLocalDateTimeString(endTime)} highlight={getEndTimeCountDownString(endTime, locale, messages)} />
));

const Funding = ({ oracle: { amounts, token } }) => (
  <EventInfoBlock id='eventInfo.fund' content={`${parseFloat(_.sum(amounts).toFixed(5)).toString()} ${token}`} />
);

const ResultSetter = ({ oracle }) => (
  <EventInfoBlock id='str.resultSetter' content={oracle.resultSetterQAddress} />
);

const EventInfo = styled.div`
  padding-bottom: ${props => props.theme.padding.md.px};
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

const Heading = styled(Typography).attrs({ variant: 'body1' })`
  font-size: 18px;
  text-transform: uppercase;
`;

const Content = styled(Typography).attrs({ variant: 'title' })`
  margin-top: ${props => props.theme.padding.unit.px} !important;
  word-wrap: break-word !important;
  padding-left: ${props => props.theme.padding.md.px} !important;
  font-size: ${props => props.theme.typography.fontSize} !important;
`;

const Container = styled(Grid).attrs({ item: true, xs: 6, md: 12 })`
  margin-bottom: 36px !important;
`;

export { SidebarContainer };
