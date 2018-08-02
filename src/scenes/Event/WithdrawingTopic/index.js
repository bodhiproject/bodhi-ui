import React, { Fragment } from 'react';
import styled, { css } from 'styled-components';
import _ from 'lodash';
import { inject, observer } from 'mobx-react';
import { injectIntl } from 'react-intl';
import { Paper } from '@material-ui/core';
// import { EventWarning, ImportantNote } from 'components';
import Transactions from '../components/EventTxHistory';
import ResultHistory from '../components/EventTxHistory/resultHistory';
import { Row, Content, Title } from '../components';
import { Sidebar } from '../Sidebar';
import WinningOutcome from './WinningOutcome';
import WithdrawTo from './WithdrawTo';
import Reward from './Reward';
import Options from './Options';
// import ResultHistory from './ResultHistory';


const WithdrawingTopic = observer(({ store: { eventPage, eventPage: { topic, escrowAmount, botWinnings, qtumWinnings } } }) => (
  <Row>
    <Content>
      <Title>{topic.name}</Title>
      <Container>
        <WinningOutcome eventPage={eventPage} />
        {Boolean(escrowAmount || botWinnings || qtumWinnings) && (
          <Fragment>
            <Reward topic={topic} eventPage={eventPage} />
            <WithdrawTo />
          </Fragment>
        )}
      </Container>
      <Options eventPage={eventPage} />
      <ResultHistory oracles={eventPage.oracles} />
      <Transactions type='oracle' options={topic.options} />
    </Content>
    <Sidebar />
  </Row>
));

const Container = styled(Paper)`
  padding: ${props => props.theme.padding.md.px};
`;

export default injectIntl(inject('store')(WithdrawingTopic));
