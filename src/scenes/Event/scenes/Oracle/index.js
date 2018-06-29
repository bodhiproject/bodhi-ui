/* eslint-disable */
// import React, { Component } from 'react';



// class OraclePageStore {
//   @observable optionSelected =

// }

// class OraclePage extends Component {

//   render() {
//     const { oracle } = this.props.store.oraclePage
//     const Oracle = {
//       BETTING: BetOracle,
//       VOTING: VoteOracle,
//       RESULT_SETTING: ResultSettingOracle,
//       FINALIZING: FinalizingOracle,
//     }[oracle.phase];

//     return (
//       <Fragment>
//         <BackButton />
//         <Oracle oracle={oracle} />
//       </Fragment>
//     )
//   }
// }

// const Row = styled.div`
//   display: flex;
//   flex-direction: row;
// `
// const BetOracle = observer(({ oracle }) => (
//   <Row>
//     <Content>
//       <Title>{oracle.name}</Title>
//       {oracle.unconfirmed && <EventWarning />}
//       <BetOptions oracle={oracle} />
//       <ConsensusThreshold />
//       <BetButton onClick={oracle.bet} />
//       <Transactions />
//     </Content>
//     <Sidebar>
//       <EndingDate />
//       <Funding />
//       <ResultSetter />
//       <PhaseMap />
//     </Sidebar>
//   </Row>
// ))

// const Col = styled.div`
//   display: flex;
//   flex-direction: column;
// `
// const Content = Col;
// const Sidebar = Row;

// const BetOptions = injectIntl(observer(({ oracle, intl }) => (
//   <Fragment>
//     {oracle.options.map((option, index) => {
//       const invalidOption = localizeInvalidOption(item.name, intl);
//       return (
//         <EventOption
//           key={index}
//           isLast={index === oracle.options.length - 1}
//           // currentOptionIdx={this.state.currentOptionIdx}
//           optionIdx={index}
//           // name={option.name === 'Invalid' ? invalidOption : option.name}
//           amount={`${item.value}`}
//           option={option}
//           oracle={oracle}
//           // maxAmount={option.maxAmount}
//           // percent={option.percent}
//           voteAmount={config.eventStatus === EventStatus.Set ? oracle.consensusThreshold : this.state.voteAmount}
//           token={config.eventStatus === EventStatus.Set ? Token.Bot : oracle.token}
//           // isPrevResult={option.isPrevResult}
//           // isFinalizing={option.isFinalizing}
//           // consensusThreshold={oracle.consensusThreshold}
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

