import _ from 'lodash';
import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
import fetch from 'node-fetch';

import actions from './actions';
import { request } from '../../network/httpRequest';
import { querySyncInfo } from '../../network/graphQuery';
import { satoshiToDecimal } from '../../helpers/utility';
import Routes from '../../network/routes';

export function* listUnspentRequestHandler() {
  yield takeEvery(actions.LIST_UNSPENT, function* listUnspentRequest() {
    try {
      const result = yield call(request, Routes.listUnspent);

      if (_.isEmpty(result)) {
        // listunspent returned empty. Use the default qtum address.
        const options = {
          method: 'POST',
          body: JSON.stringify({
            accountName: '',
          }),
          headers: { 'Content-Type': 'application/json' },
        };

        const defaultAddress = yield call(request, Routes.getAccountAddress, options);

        yield put({
          type: actions.LIST_UNSPENT_RETURN,
          value: {
            utxos: [],
            addresses: [
              { address: defaultAddress, qtum: 0 },
            ],
          },
        });
      } else {
        // listunspent returned with a non-empty array
        const addresses = processListUnspent(result);

        yield put({
          type: actions.LIST_UNSPENT_RETURN,
          value: addresses,
        });
      }
    } catch (error) {
      yield put({
        type: actions.LIST_UNSPENT_RETURN,
        error: error.message,
      });
    }
  });
}

function processListUnspent(utxos) {
  const trimmedUtxos = _.map(utxos, (output) =>
    _.pick(output, ['address', 'amount', 'txid', 'vout', 'confirmations', 'spendable']));

  const addresses = [];

  // Combine utxos with same address
  _.each(trimmedUtxos, (output) => {
    const currentAddr = output.address;
    const index = _.findIndex(addresses, { address: currentAddr });

    if (index !== -1) {
      // Found existing entry with same address
      const newQtum = addresses[index].qtum + output.amount;
      addresses.splice(index, 1, { address: currentAddr, qtum: newQtum });
    } else {
      // Not found, insert new entry
      addresses.push({
        address: currentAddr,
        qtum: output.amount,
      });
    }
  });

  return {
    utxos: trimmedUtxos,
    addresses,
  };
}

export function* getBotBalanceRequestHandler() {
  yield takeEvery(actions.GET_BOT_BALANCE, function* getBotBalanceRequest(action) {
    try {
      const {
        owner,
        senderAddress,
      } = action.payload;

      const options = {
        method: 'POST',
        body: JSON.stringify({
          owner,
          senderAddress,
        }),
        headers: { 'Content-Type': 'application/json' },
      };

      const result = yield call(request, Routes.botBalance, options);
      const botValue = result && result.balance ? satoshiToDecimal(result.balance) : 0;

      yield put({
        type: actions.GET_BOT_BALANCE_RETURN,
        value: {
          address: owner,
          value: botValue,
        },
      });
    } catch (error) {
      yield put({
        type: actions.GET_BOT_BALANCE_RETURN,
        error: error.message,
      });
    }
  });
}

export function* syncInfoRequestHandler() {
  yield takeEvery(actions.GET_SYNC_INFO, function* syncInfoRequest(action) {
    try {
      const result = yield call(querySyncInfo);

      yield put({
        type: actions.SYNC_INFO_RETURN,
        syncInfo: result,
      });
    } catch (error) {
      yield put({
        type: actions.SYNC_INFO_RETURN,
        error: error.message,
      });
    }
  });
}

export function* onSyncInfoHandler() {
  yield takeEvery(actions.ON_SYNC_INFO, function* onSyncInfo(action) {
    if (action.syncInfo.error) {
      yield put({
        type: actions.SYNC_INFO_RETURN,
        error: action.syncInfo.error,
      });
    } else {
      yield put({
        type: actions.SYNC_INFO_RETURN,
        syncInfo: action.syncInfo,
      });
    }
  });
}

// Get the total statistics from the Qtum Insight API
export function* getInsightTotalsRequestHandler() {
  yield takeEvery(actions.GET_INSIGHT_TOTALS, function* getInsightTotalsRequest() {
    try {
      const result = yield call(request, Routes.insightTotals);

      yield put({
        type: actions.GET_INSIGHT_TOTALS_RETURN,
        value: { result },
      });
    } catch (error) {
      yield put({
        type: actions.GET_INSIGHT_TOTALS_RETURN,
        value: { error: error.message ? error.message : '' },
      });
    }
  });
}

export default function* topicSaga() {
  yield all([
    fork(listUnspentRequestHandler),
    fork(getBotBalanceRequestHandler),
    fork(syncInfoRequestHandler),
    fork(onSyncInfoHandler),
    fork(getInsightTotalsRequestHandler),
  ]);
}
