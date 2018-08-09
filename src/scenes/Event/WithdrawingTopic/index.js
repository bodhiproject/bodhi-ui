import React, { Fragment } from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { injectIntl } from 'react-intl';
import { Paper } from '@material-ui/core';
import TransactionHistory from '../components/TransactionHistory';
import ResultHistory from '../components/ResultHistory';
import { Sidebar, Row, Content, Title } from '../components';
import WinningOutcome from './WinningOutcome';
import WithdrawTo from './WithdrawTo';
import Reward from './Reward';
import Options from './Options';


const WithdrawingTopic = observer(({ store: { eventPage, eventPage: { topic, escrowClaim, botWinnings, qtumWinnings } } }) => (
  <Row>
    <Content>
      <Title>{topic.name}</Title>
      <Container>
        <WinningOutcome eventPage={eventPage} />
        {Boolean(escrowClaim || botWinnings || qtumWinnings) && (
          <Fragment>
            <Reward topic={topic} eventPage={eventPage} />
            <WithdrawTo />
          </Fragment>
        )}
      </Container>
      <Options eventPage={eventPage} />
      <ResultHistory oracles={eventPage.oracles} />
      <TransactionHistory options={topic.options} />
    </Content>
    <Sidebar topic={topic} />
  </Row>
));

const Container = styled(Paper)`
  padding: ${props => props.theme.padding.md.px};
`;

export default injectIntl(inject('store')(WithdrawingTopic));
