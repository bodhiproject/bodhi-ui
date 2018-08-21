import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { injectIntl } from 'react-intl';
import { Paper } from '@material-ui/core';
import { Sidebar, Row, Content, Title, ResultHistory, TransactionHistory } from '../components';
import WinningOutcome from './WinningOutcome';
import WithdrawTo from './WithdrawTo';
import Reward from './Reward';
import Options from './Options';

@inject('store')
@observer
class WithdrawingTopic extends Component {
  componentWillUnmount() {
    this.props.store.eventPage.reset();
  }
  render() {
    const { store: { eventPage, eventPage: { topic, escrowClaim, botWinnings, qtumWinnings } } } = this.props;
    return (
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
          <ResultHistory oracles={eventPage.oracles} currentEvent={topic} />
          <TransactionHistory options={topic.options} />
        </Content>
        <Sidebar topic={topic} />
      </Row>);
  }
}

const Container = styled(Paper)`
  padding: ${props => props.theme.padding.md.px};
`;

export default injectIntl(inject('store')(WithdrawingTopic));
