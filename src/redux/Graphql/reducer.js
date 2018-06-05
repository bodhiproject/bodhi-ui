/* eslint-disable */
import { Map } from 'immutable';
import { defineMessages } from 'react-intl';

import actions from './actions';
import { EventStatus, TransactionStatus, TransactionType, OracleStatus } from '../../constants';

const initState = new Map({
  getPendingTransactionsReturn: { count: 0 },
  actionableItemCount: {
    [EventStatus.Set]: 0,
    [EventStatus.Finalize]: 0,
    [EventStatus.Withdraw]: 0,
    totalCount: 0,
  },
  txReturn: null, // used to display TransactionSentDialog
  getOraclesReturn: [],
  getTopicsReturn: [],
  error: null, // type: object
});

const messages = defineMessages({
  placeBet: { id: 'bottomButtonText.placeBet', defaultMessage: 'Place Bet' },
  setResult: { id: 'str.setResult', defaultMessage: 'Set Result' },
  arbitrate: { id: 'bottomButtonText.arbitrate', defaultMessage: 'Arbitrate' },
  finalizeResult: { id: 'str.finalizeResult', defaultMessage: 'Finalize Result' },
  withdraw: { id: 'str.withdraw', defaultMessage: 'Withdraw' },
});

/**
 * Takes an oracle object and returns which phase it is in.
 * @param {oracle} oracle
 */
const getPhase = ({ token, status, name }) => {
  if (token === 'QTUM' && status === 'VOTING') return 'betting';
  if (token === 'BOT' && status === 'VOTING') return 'voting';
  if (token === 'QTUM' && ['WAITRESULT', 'OPENRESULTSET'].includes(status)) return 'resultSetting';
  if (token === 'BOT' && status === 'WAITRESULT') return 'finalizing';
  if (['QTUM', 'BOT'].includes(token) && status === 'WITHDRAW') return 'withdrawing';
  console.warn('TOKEN: ', token, 'STATUS: ', status, 'NAME: ', name);
  throw Error('invalid phase');
};

export default function graphqlReducer(state = initState, action) {
  const { Pending } = TransactionStatus;

  switch (action.type) {
    case actions.GET_TOPICS_RETURN: {
      console.log('ACTION: ', action);
      const { WithdrawEscrow, Withdraw } = TransactionType;
      const topics = action.value.map((topic) => {
        const pendingTypes = [WithdrawEscrow, Withdraw];
        const isPending = topic.transactions.some(({ type, status }) => pendingTypes.includes(type) && status === Pending);

        const totalQTUM = parseFloat(_.sum(topic.qtumAmount).toFixed(2));
        const totalBOT = parseFloat(_.sum(topic.botAmount).toFixed(2));
        return {
          ...topic,
          amountLabel: `${totalQTUM} QTUM, ${totalBOT} BOT`,
          url: `/topic/${topic.address}`,
          isUpcoming: false,
          buttonText: messages.withdraw,
          unconfirmed: isPending,
        };
      });
      // First page, overwrite all data
      if (!action.skip || action.skip === 0) {
        return state.set('getTopicsReturn', topics);
      }

      // Not first page, add to existing data
      return state.set('getTopicsReturn', [...state.get('getTopicsReturn'), ...topics]);
    }

    case actions.GET_ORACLES_RETURN: {
      const oracles = action.value.map((oracle) => {
        const phase = getPhase(oracle);

        const { ApproveSetResult, SetResult, ApproveVote, Vote, FinalizeResult, Bet } = TransactionType;
        const pendingTypes = {
          betting: [Bet],
          voting: [ApproveVote, Vote],
          resultSetting: [ApproveSetResult, SetResult],
          finalizing: [FinalizeResult],
        }[phase] || [];
        const isPending = oracle.transactions.some(({ type, status }) => pendingTypes.includes(type) && status === Pending);

        const isUpcoming = phase === 'voting' && oracle.status === OracleStatus.WaitResult;

        const buttonText = {
          betting: messages.placeBet,
          resultSetting: messages.setResult,
          voting: messages.arbitrate,
          finalizing: messages.finalizeResult,
          withdrawing: messages.withdraw,
        }[phase];

        if (!buttonText) console.log('NO BUTTON TEXT. phase: ', phase);

        const amount = parseFloat(_.sum(oracle.amounts).toFixed(2));

        return {
          amountLabel: phase === 'finalizing' ? `${amount} ${oracle.token}` : '',
          url: `/oracle/${oracle.topicAddress}/${oracle.address}/${oracle.txid}`,
          endTime: phase === 'resultSetting' ? oracle.resultSetEndTime : oracle.endTime,
          unconfirmed: (!oracle.topicAddress && !oracle.address) || isPending,
          isUpcoming,
          buttonText,
          phase,
          ...oracle,
        };
      // filter out the oracles in the 'withdrawing' phase
      })
      // .filter(({ buttonText, phase }) => buttonText && phase !== 'withdrawing');

      // First page, overwrite all data
      if (!action.skip || action.skip === 0) {
        return state.set('getOraclesReturn', oracles);
      }

      // Not first page, add to existing data
      return state.set('getOraclesReturn', [...state.get('getOraclesReturn'), ...oracles]);
    }

    case actions.GET_TRANSACTIONS_RETURN: {
      // First page, overwrite all data
      if (!action.skip || action.skip === 0) {
        return state.set('getTransactionsReturn', action.value);
      }

      // Not first page, add to existing data
      return state.set('getTransactionsReturn', [...state.get('getTransactionsReturn'), ...action.value]);
    }
    case actions.GET_PENDING_TRANSACTIONS_RETURN: {
      return state.set('getPendingTransactionsReturn', action.value);
    }
    case actions.GET_ACTIONABLE_ITEM_COUNT_RETURN: {
      return state.set('actionableItemCount', action.value);
    }
    case actions.CREATE_TOPIC_TX_RETURN:
    case actions.CREATE_BET_TX_RETURN:
    case actions.CREATE_SET_RESULT_TX_RETURN:
    case actions.CREATE_VOTE_TX_RETURN:
    case actions.CREATE_FINALIZE_RESULT_TX_RETURN:
    case actions.CREATE_WITHDRAW_TX_RETURN:
    case actions.CREATE_TRANSFER_TX_RETURN: {
      if (action.error) {
        return state.set('error', action.error);
      }
      return state.set('txReturn', action.value);
    }
    case actions.CLEAR_GRAPHQL_ERROR: {
      return state.set('error', null);
    }
    case actions.CLEAR_TX_RETURN: {
      return state.set('txReturn', undefined);
    }
    default: {
      return state;
    }
  }
}
