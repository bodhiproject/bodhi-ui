/* eslint-disable */
// import React, { Component } from 'react';



// class OraclePageStore {

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

// const BetOracle = observer(({ oracle: { name, unconfirmed } }) => (
//   <Fragment>
//     <Content>
//       <Title>{name}</Title>
//       {unconfirmed && <EventWarning />}
//       <Options />
//       <ConsensusThreshold />
//       <BetButton onClick={bet} />
//     </Content>
//     <Sidebar>
//     </Sidebar>
//   </Fragment>
// )
