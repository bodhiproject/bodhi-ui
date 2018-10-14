import { TransactionType } from 'constants';

import PendingTxsSnackbarStore, { INIT_VALUES } from './store';
import { sleep, getMockAppStore } from '../../helpers/testUtil';
import mockDB from '../../../test/mockDB';

jest.mock('../../network/graphql/queries'); // block and manually mock our backend

describe('PendingTxsSnackbarStore', () => {
  let app;
  let store;
  let addr;

  beforeEach(async () => {
    app = getMockAppStore();
    app.syncPercent = 10;
    [addr] = app.wallet.addresses;

    store = new PendingTxsSnackbarStore(app); // create a new instance before each test case
    mockDB.init();
    await store.init();
  });

  describe('Init', () => {
    it('Init with null tx list', async () => {
      expect(store.count).toBe(INIT_VALUES.count);
      expect(store.isVisible).toBe(INIT_VALUES.isVisible);
      expect(store.pendingCreateEvents).toEqual(INIT_VALUES.pendingCreateEvents);
      expect(store.pendingBets).toEqual(INIT_VALUES.pendingBets);
      expect(store.pendingSetResults).toEqual(INIT_VALUES.pendingSetResults);
      expect(store.pendingVotes).toEqual(INIT_VALUES.pendingVotes);
      expect(store.pendingFinalizeResults).toEqual(INIT_VALUES.pendingFinalizeResults);
      expect(store.pendingWithdraws).toEqual(INIT_VALUES.pendingWithdraws);
      expect(store.pendingTransfers).toEqual(INIT_VALUES.pendingTransfers);
      expect(store.pendingResetApproves).toEqual(INIT_VALUES.pendingResetApproves);
    });
  });

  describe('Reset', () => {
    it('Reset the values when called', async () => {
      mockDB.addTransactions(mockDB.generateTransaction({
        type: TransactionType.APPROVE_CREATE_EVENT,
        senderAddress: addr.address,
      }));

      await store.queryPendingTransactions();
      store.reset();
      expect(store.count).toBe(INIT_VALUES.count);
      expect(store.isVisible).toBe(INIT_VALUES.isVisible);
      expect(store.pendingCreateEvents).toEqual(INIT_VALUES.pendingCreateEvents);
      expect(store.pendingBets).toEqual(INIT_VALUES.pendingBets);
      expect(store.pendingSetResults).toEqual(INIT_VALUES.pendingSetResults);
      expect(store.pendingVotes).toEqual(INIT_VALUES.pendingVotes);
      expect(store.pendingFinalizeResults).toEqual(INIT_VALUES.pendingFinalizeResults);
      expect(store.pendingWithdraws).toEqual(INIT_VALUES.pendingWithdraws);
      expect(store.pendingTransfers).toEqual(INIT_VALUES.pendingTransfers);
      expect(store.pendingResetApproves).toEqual(INIT_VALUES.pendingResetApproves);
    });
  });

  describe('queryPendingTransactions()', () => {
    it('Fetches all the pending txs and increments the counts', async () => {
      await store.queryPendingTransactions();
      expect(store.count).toBe(0);
      expect(store.isVisible).toBe(false);

      mockDB.addTransactions(mockDB.generateTransaction({
        type: TransactionType.APPROVE_CREATE_EVENT,
        senderAddress: addr.address,
      }));
      await store.queryPendingTransactions();
      expect(store.count).toBe(1);
      expect(store.pendingApproves.length).toBe(1);
      expect(store.isVisible).toBe(true);

      mockDB.addTransactions(mockDB.generateTransaction({
        type: TransactionType.CREATE_EVENT,
        senderAddress: addr.address,
      }));
      await store.queryPendingTransactions();
      expect(store.count).toBe(2);
      expect(store.pendingCreateEvents.length).toBe(1);
      expect(store.isVisible).toBe(true);

      mockDB.addTransactions(mockDB.generateTransaction({
        type: TransactionType.BET,
        senderAddress: addr.address,
      }));
      await store.queryPendingTransactions();
      expect(store.count).toBe(3);
      expect(store.pendingBets.length).toBe(1);
      expect(store.isVisible).toBe(true);

      mockDB.addTransactions(mockDB.generateTransaction({
        type: TransactionType.APPROVE_SET_RESULT,
        senderAddress: addr.address,
      }));
      await store.queryPendingTransactions();
      expect(store.count).toBe(4);
      expect(store.pendingApproves.length).toBe(2);
      expect(store.isVisible).toBe(true);

      mockDB.addTransactions(mockDB.generateTransaction({
        type: TransactionType.SET_RESULT,
        senderAddress: addr.address,
      }));
      await store.queryPendingTransactions();
      expect(store.count).toBe(5);
      expect(store.pendingSetResults.length).toBe(1);
      expect(store.isVisible).toBe(true);

      mockDB.addTransactions(mockDB.generateTransaction({
        type: TransactionType.APPROVE_VOTE,
        senderAddress: addr.address,
      }));
      await store.queryPendingTransactions();
      expect(store.count).toBe(6);
      expect(store.pendingApproves.length).toBe(3);
      expect(store.isVisible).toBe(true);

      mockDB.addTransactions(mockDB.generateTransaction({
        type: TransactionType.VOTE,
        senderAddress: addr.address,
      }));
      await store.queryPendingTransactions();
      expect(store.count).toBe(7);
      expect(store.pendingVotes.length).toBe(1);
      expect(store.isVisible).toBe(true);

      mockDB.addTransactions(mockDB.generateTransaction({
        type: TransactionType.FINALIZE_RESULT,
        senderAddress: addr.address,
      }));
      await store.queryPendingTransactions();
      expect(store.count).toBe(8);
      expect(store.pendingFinalizeResults.length).toBe(1);
      expect(store.isVisible).toBe(true);

      mockDB.addTransactions(mockDB.generateTransaction({
        type: TransactionType.WITHDRAW,
        senderAddress: addr.address,
      }));
      await store.queryPendingTransactions();
      expect(store.count).toBe(9);
      expect(store.pendingWithdraws.length).toBe(1);
      expect(store.isVisible).toBe(true);

      mockDB.addTransactions(mockDB.generateTransaction({
        type: TransactionType.WITHDRAW_ESCROW,
        senderAddress: addr.address,
      }));
      await store.queryPendingTransactions();
      expect(store.count).toBe(10);
      expect(store.pendingWithdraws.length).toBe(2);
      expect(store.isVisible).toBe(true);

      mockDB.addTransactions(mockDB.generateTransaction({
        type: TransactionType.TRANSFER,
        senderAddress: addr.address,
      }));
      await store.queryPendingTransactions();
      expect(store.count).toBe(11);
      expect(store.pendingTransfers.length).toBe(1);
      expect(store.isVisible).toBe(true);

      mockDB.addTransactions(mockDB.generateTransaction({
        type: TransactionType.RESET_APPROVE,
        senderAddress: addr.address,
      }));
      await store.queryPendingTransactions();
      expect(store.count).toBe(12);
      expect(store.pendingApproves.length).toBe(3);
      expect(store.pendingCreateEvents.length).toBe(1);
      expect(store.pendingBets.length).toBe(1);
      expect(store.pendingSetResults.length).toBe(1);
      expect(store.pendingVotes.length).toBe(1);
      expect(store.pendingFinalizeResults.length).toBe(1);
      expect(store.pendingWithdraws.length).toBe(2);
      expect(store.pendingTransfers.length).toBe(1);
      expect(store.pendingResetApproves.length).toBe(1);
      expect(store.isVisible).toBe(true);

      mockDB.setAllTxsSuccess();
      await store.queryPendingTransactions();
      expect(store.count).toBe(0);
      expect(store.pendingCreateEvents.length).toBe(0);
      expect(store.pendingBets.length).toBe(0);
      expect(store.pendingSetResults.length).toBe(0);
      expect(store.pendingVotes.length).toBe(0);
      expect(store.pendingFinalizeResults.length).toBe(0);
      expect(store.pendingWithdraws.length).toBe(0);
      expect(store.pendingTransfers.length).toBe(0);
      expect(store.pendingResetApproves.length).toBe(0);
      expect(store.isVisible).toBe(false);

      mockDB.addTransactions(mockDB.generateTransaction({
        type: TransactionType.SET_RESULT,
        senderAddress: addr.address,
      }));
      await store.queryPendingTransactions();
      expect(store.count).toBe(1);
      expect(store.pendingSetResults.length).toBe(1);
      expect(store.isVisible).toBe(true);
    });
  });

  describe('Reactions', () => {
    it('Visible', async () => {
      expect(store.count).toBe(0);

      mockDB.addTransactions(mockDB.generateTransaction({
        type: TransactionType.APPROVE_CREATE_EVENT,
        senderAddress: addr.address,
      }));
      await store.queryPendingTransactions();
      expect(store.count).toBe(1);

      await sleep();
      expect(store.isVisible).toBe(true);

      mockDB.setAllTxsSuccess();
      await store.queryPendingTransactions();
      await sleep();
      expect(store.isVisible).toBe(false);
    });

    it('syncBlockNum', async () => {
      expect(store.isVisible).toBe(false);

      mockDB.addTransactions(mockDB.generateTransaction({
        type: TransactionType.APPROVE_CREATE_EVENT,
        senderAddress: addr.address,
      }));
      app.global.syncBlockNum = 1;
      await sleep();
      expect(store.isVisible).toBe(false);

      app.global.syncPercent = 120;
      await sleep();
      expect(store.isVisible).toBe(false);

      app.global.syncBlockNum = 2;
      await sleep();
      expect(app.global.syncPercent).toBe(120);
      expect(store.isVisible).toBe(true);

      mockDB.setAllTxsSuccess();
      app.global.syncPercent = 150;
      await sleep();
      expect(store.isVisible).toBe(true);

      app.global.syncBlockNum = 3;
      await sleep();
      expect(store.isVisible).toBe(false);
    });
  });
});
