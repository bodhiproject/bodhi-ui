import { observable, action, reaction, runInAction, toJS } from 'mobx';
import { filter, isEmpty, reduce } from 'lodash';
import { TransactionType, TransactionStatus } from 'constants';

import { queryAllTransactions } from '../../network/graphql/queries';

const {
  APPROVE_CREATE_EVENT,
  CREATE_EVENT,
  BET,
  APPROVE_SET_RESULT,
  SET_RESULT,
  APPROVE_VOTE,
  VOTE,
  FINALIZE_RESULT,
  WITHDRAW,
  WITHDRAW_ESCROW,
  TRANSFER,
  RESET_APPROVE,
} = TransactionType;

export const INIT_VALUES = {
  isVisible: false,
  count: 0,
  pendingApproves: [],
  pendingCreateEvents: [],
  pendingBets: [],
  pendingSetResults: [],
  pendingVotes: [],
  pendingFinalizeResults: [],
  pendingWithdraws: [],
  pendingTransfers: [],
  pendingResetApproves: [],
};

export default class PendingTxsSnackbarStore {
  @observable isVisible = INIT_VALUES.isVisible
  @observable count = INIT_VALUES.count
  pendingApproves = INIT_VALUES.pendingApproves
  pendingCreateEvents = INIT_VALUES.pendingCreateEvents
  pendingBets = INIT_VALUES.pendingBets
  pendingSetResults = INIT_VALUES.pendingSetResults
  pendingVotes = INIT_VALUES.pendingVotes
  pendingFinalizeResults = INIT_VALUES.pendingFinalizeResults
  pendingWithdraws = INIT_VALUES.pendingWithdraws
  pendingTransfers = INIT_VALUES.pendingTransfers
  pendingResetApproves = INIT_VALUES.pendingResetApproves

  constructor(app) {
    this.app = app;

    // Counts changed
    reaction(
      () => this.count,
      () => this.isVisible = this.count > 0
    );
    // New block change
    reaction(
      () => this.app.global.syncBlockNum + this.app.global.online,
      () => {
        if (this.app.global.syncPercent >= 100) {
          this.queryPendingTransactions();
        }
      },
    );
    // Wallet addresses changed
    reaction(
      () => toJS(this.app.wallet.addresses),
      () => this.queryPendingTransactions(),
    );

    this.init();
  }

  @action
  init = async () => {
    Object.assign(this, INIT_VALUES);
    await this.queryPendingTransactions();
  }

  @action
  queryPendingTransactions = async () => {
    // Address is required for the request filters
    if (isEmpty(this.app.wallet.addresses)) {
      this.reset();
      return;
    }

    try {
      const filters = reduce(this.app.wallet.addresses, (result, obj) => {
        result.push({ status: TransactionStatus.PENDING, senderAddress: obj.address });
        return result;
      }, []);

      const txs = await queryAllTransactions(filters);

      runInAction(() => {
        this.count = txs.length;
        this.pendingApproves = filter(
          txs,
          (tx) => tx.type === APPROVE_CREATE_EVENT || tx.type === APPROVE_SET_RESULT || tx.type === APPROVE_VOTE,
        );
        this.pendingCreateEvents = filter(txs, { type: CREATE_EVENT });
        this.pendingBets = filter(txs, { type: BET });
        this.pendingSetResults = filter(txs, { type: SET_RESULT });
        this.pendingVotes = filter(txs, { type: VOTE });
        this.pendingFinalizeResults = filter(txs, { type: FINALIZE_RESULT });
        this.pendingWithdraws = filter(txs, (tx) => tx.type === WITHDRAW || tx.type === WITHDRAW_ESCROW);
        this.pendingTransfers = filter(txs, { type: TRANSFER });
        this.pendingResetApproves = filter(txs, { type: RESET_APPROVE });
      });
    } catch (error) {
      console.error(error); // eslint-disable-line

      runInAction(() => {
        Object.assign(this, INIT_VALUES);
      });
    }
  }

  reset = () => Object.assign(this, INIT_VALUES)
}
