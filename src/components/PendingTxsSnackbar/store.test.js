import { TransactionType, TransactionStatus } from 'constants';
import { observable } from 'mobx';
import PendingTxsSnackbarStore, { INIT_VALUES } from './store';
import { mockResetTransactionList, mockAddTransaction } from '../../network/graphql/queries/';

jest.mock('../../network/graphql/queries'); // block and manually mock our backend

describe('PendingTxsSnackbarStore', () => {
  let store;
  const addr = {
    address: 'qSu4uU8MGp2Ya6j9kQZAtizUfC82aCvGT1',
    qtum: 2000,
    bot: 100,
  };
  const app = {
    global: observable({ syncBlockNum: 0, syncPercent: 10 }),
    wallet: { addresses: [addr] },
  }; // mock the appstore
  const sleep = ms => new Promise(res => setTimeout(res, ms));

  beforeEach(async () => {
    store = new PendingTxsSnackbarStore(app); // create a new instance before each test case
    mockResetTransactionList();
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
      expect.assertions(10);
    });
  });

  describe('queryPendingTransactions()', () => {
    it('Fetches all the pending txs and increments the counts', async () => {
      await store.queryPendingTransactions();
      expect(store.count).toBe(0);
      expect(store.isVisible).toBe(false);

      const allTxs = [];

      allTxs.push(mockAddTransaction(1, { type: TransactionType.APPROVE_CREATE_EVENT, senderAddress: addr.address }));
      await store.queryPendingTransactions();
      expect(store.count).toBe(1);
      expect(store.pendingApproves.length).toBe(1);
      expect(store.isVisible).toBe(true);

      allTxs.push(mockAddTransaction(2, { type: TransactionType.CREATE_EVENT, senderAddress: addr.address }));
      await store.queryPendingTransactions();
      expect(store.count).toBe(2);
      expect(store.pendingCreateEvents.length).toBe(1);
      expect(store.isVisible).toBe(true);

      allTxs.push(mockAddTransaction(3, { type: TransactionType.BET, senderAddress: addr.address }));
      await store.queryPendingTransactions();
      expect(store.count).toBe(3);
      expect(store.pendingBets.length).toBe(1);
      expect(store.isVisible).toBe(true);

      allTxs.push(mockAddTransaction(4, { type: TransactionType.APPROVE_SET_RESULT, senderAddress: addr.address }));
      await store.queryPendingTransactions();
      expect(store.count).toBe(4);
      expect(store.pendingApproves.length).toBe(2);
      expect(store.isVisible).toBe(true);

      allTxs.push(mockAddTransaction(5, { type: TransactionType.SET_RESULT, senderAddress: addr.address }));
      await store.queryPendingTransactions();
      expect(store.count).toBe(5);
      expect(store.pendingSetResults.length).toBe(1);
      expect(store.isVisible).toBe(true);

      allTxs.push(mockAddTransaction(6, { type: TransactionType.APPROVE_VOTE, senderAddress: addr.address }));
      await store.queryPendingTransactions();
      expect(store.count).toBe(6);
      expect(store.pendingApproves.length).toBe(3);
      expect(store.isVisible).toBe(true);

      allTxs.push(mockAddTransaction(7, { type: TransactionType.VOTE, senderAddress: addr.address }));
      await store.queryPendingTransactions();
      expect(store.count).toBe(7);
      expect(store.pendingVotes.length).toBe(1);
      expect(store.isVisible).toBe(true);

      allTxs.push(mockAddTransaction(8, { type: TransactionType.FINALIZE_RESULT, senderAddress: addr.address }));
      await store.queryPendingTransactions();
      expect(store.count).toBe(8);
      expect(store.pendingFinalizeResults.length).toBe(1);
      expect(store.isVisible).toBe(true);

      allTxs.push(mockAddTransaction(9, { type: TransactionType.WITHDRAW, senderAddress: addr.address }));
      await store.queryPendingTransactions();
      expect(store.count).toBe(9);
      expect(store.pendingWithdraws.length).toBe(1);
      expect(store.isVisible).toBe(true);

      allTxs.push(mockAddTransaction(10, { type: TransactionType.WITHDRAW_ESCROW, senderAddress: addr.address }));
      await store.queryPendingTransactions();
      expect(store.count).toBe(10);
      expect(store.pendingWithdraws.length).toBe(2);
      expect(store.isVisible).toBe(true);

      allTxs.push(mockAddTransaction(11, { type: TransactionType.TRANSFER, senderAddress: addr.address }));
      await store.queryPendingTransactions();
      expect(store.count).toBe(11);
      expect(store.pendingTransfers.length).toBe(1);
      expect(store.isVisible).toBe(true);

      allTxs.push(mockAddTransaction(12, { type: TransactionType.RESET_APPROVE, senderAddress: addr.address }));
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

      allTxs.map((tx) => tx.status = TransactionStatus.SUCCESS);
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

      allTxs.push(mockAddTransaction(14, { type: TransactionType.SET_RESULT, senderAddress: addr.address }));
      await store.queryPendingTransactions();
      expect(store.count).toBe(1);
      expect(store.pendingSetResults.length).toBe(1);
      expect(store.isVisible).toBe(true);
    });
  });


  describe('Reset', () => {
    it('Reset the values when called', async () => {
      await store.init();
      mockAddTransaction(1, { type: TransactionType.APPROVE_CREATE_EVENT, senderAddress: addr.address });
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
      expect.assertions(10);
    });
  });


  describe('Reactions', () => {
    it('Visible', async () => {
      expect(store.count).toBe(0);

      mockAddTransaction(1, { type: TransactionType.APPROVE_CREATE_EVENT, senderAddress: addr.address });
      await store.queryPendingTransactions();
      expect(store.count).toBe(1);

      await sleep(100);
      expect(store.isVisible).toBe(true);

      mockResetTransactionList();
      await store.queryPendingTransactions();
      await sleep(100);
      expect(store.isVisible).toBe(false);
      expect.assertions(4);
    });

    it('syncBlockNum', async () => {
      expect(store.isVisible).toBe(false);

      mockAddTransaction(1, { type: TransactionType.APPROVE_CREATE_EVENT, senderAddress: addr.address });
      app.global.syncBlockNum = 1;
      await sleep(100);
      expect(store.isVisible).toBe(false);

      app.global.syncPercent = 120;
      await sleep(100);
      expect(store.isVisible).toBe(false);

      app.global.syncBlockNum = 2;
      await sleep(100);
      expect(app.global.syncPercent).toBe(120);
      expect(store.isVisible).toBe(true);

      mockResetTransactionList();
      app.global.syncPercent = 150;
      await sleep(100);
      expect(store.isVisible).toBe(true);

      app.global.syncBlockNum = 3;
      await sleep(100);
      expect(store.isVisible).toBe(false);
      expect.assertions(7);
    });
  });
});
