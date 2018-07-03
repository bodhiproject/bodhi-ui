/* eslint-disable */
import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Button, Typography, Grid, Paper } from '@material-ui/core';
import Option from '../../components/Option';
import BackButton from '../../../../components/BackButton';

@withRouter
@inject('store')
@observer
export default class OraclePage extends Component {

  componentDidMount() {
    this.props.store.oraclePage.init(this.props.match.params);
  }

  render() {
    const { oraclePage } = this.props.store;
    if (oraclePage.loading) return 'LOADING';
    const { oracle } = oraclePage;
    const Oracle = {
      BETTING: BetOracle,
      // VOTING: VoteOracle,
      // PENDING: VoteOracle,
      // RESULT_SETTING: ResultSettingOracle,
      // FINALIZING: FinalizingOracle,
    }[oracle.phase];
    /**
     * QTUM + PENDING -  ResultSettingOracle
     * BOT + PENDING - VoteOracle
     */

    return (
      <Fragment>
        <BackButton />
        <Oracle oracle={oracle} />
      </Fragment>
    )
  }
}

const Row = styled(({ children, ...props }) => (
  <Paper {...props}>
    <Grid container spacing={0}>{children}</Grid>
  </Paper>
))`
  box-shadow: none;
  border-radius: ${props => props.theme.borderRadius};
`;

const Content = styled(Grid).attrs({ item: true, xs: 12, md: 8 })`
  padding: ${props => props.theme.padding.lg.px};
  overflow-x: hidden;
`;

const Sidebar = styled(Grid).attrs({ item: true, xs: 12, md: 4 })`
  padding: ${props => props.theme.padding.lg.px};
  overflow-x: hidden;
  border-left: ${props => props.theme.border};
  text-align: right;
`;

const Title = styled(Typography).attrs({ variant: 'display1' })`
  margin-bottom: ${props => props.theme.padding.md.px};
`;


const BetOracle = observer(({ oracle }) => (
  <Row>
    <Content>
      <Title>{oracle.name}</Title>
      {/* {oracle.unconfirmed && <EventWarning />} */}
      <BetOptions oracle={oracle} />
      {/* <ConsensusThreshold /> */}
      <BetButton onClick={oracle.bet} />
      {/* <Transactions /> */}
    </Content>
    <Sidebar>
      SIDEBAR
      {/* <EndingDate />
      <Funding />
      <ResultSetter />
      <PhaseMap /> */}
    </Sidebar>
  </Row>
))


const BetOptions = injectIntl(observer(({ oracle, intl }) => (
  <Fragment>
    {oracle.options.map((option, i) => (
      <Option
        key={i}
        i={i}
        option={option}
        oracle={oracle}
        skipExpansion={false}
        showAmountInput={true}
        amountInputDisabled={false}
      />
    ))}
  </Fragment>
)))

const BetButton = props => (
  <Button {...props}><FormattedMessage id="str.bet" defaultMessage="Bet" /></Button>
)


// const ResultSettingOptions = injectIntl(observer(({ oracle, intl }) => (
//   <Fragment>
//     {oracle.options.map((option, i) => {
//       const invalidOption = localizeInvalidOption(item.name, intl);
//       return (
//         <EventOption
//           key={i}
//           i={i}
//           // currentOptionIdx={this.state.currentOptionIdx}
//           optionIdx={index}
//           // name={option.name === 'Invalid' ? invalidOption : option.name}
//           amount={`${item.value}`}
//           option={option}
//           oracle={oracle}
//           // maxAmount={option.maxAmount}
//           // percent={option.percent}
//           voteAmount={oracle.consensusThreshold}
//           token={Token.Bot}
//           lastUsedAddress={lastUsedAddress}
//           skipExpansion={config.predictionAction.skipExpansion}
//           unconfirmedEvent={unconfirmed}
//           showAmountInput={config.predictionAction.showAmountInput}
//           amountInputDisabled={config.predictionAction.amountInputDisabled}
//           onOptionChange={this.handleOptionChange}
//           onAmountChange={this.handleAmountChange}
//           onWalletChange={this.handleWalletChange}
//         />
//       );
//     })}
//   </Fragment>
// )))
