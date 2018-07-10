/* eslint-disable */
import React from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { injectIntl } from 'react-intl';
import { Typography, Grid } from '@material-ui/core';
import _ from 'lodash';
import { getShortLocalDateTimeString, getEndTimeCountDownString } from '../../../../helpers/utility';
import { SidebarContainer } from './components';
import { StepperVertRight } from 'components';


export const Sidebar = inject('store')(observer(({ store: { oraclePage: { oracle } } }) => (
  <SidebarContainer>
    <EventInfo>
      <EndDate oracle={oracle} />
      <Funding oracle={oracle} />
      <ResultSetter oracle={oracle} />
    </EventInfo>
    <StepperVertRight />
  </SidebarContainer>
)));


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
  <EventInfoBlockContainer>
    <Typography variant="body1">
      {intl.formatMessage({ id })}
    </Typography>
    <EventContent>{content}</EventContent>
    {highlight && (
      <Typography variant="body2" color="secondary">
        {highlight}
      </Typography>
    )}
  </EventInfoBlockContainer>
));

const EventContent = styled(Typography).attrs({ variant: 'title' })`
  margin-top: ${props => props.theme.padding.unit.px};
  word-wrap: break-word;
  padding-left: ${props => props.theme.padding.md.px};
  font-size: ${props => props.theme.typography.fontSize};
`;

const EventInfoBlockContainer = styled(Grid).attrs({ item: true, xs: 6, md: 12 })`
  margin-bottom: 36px;
`;

/* eslint-disable */