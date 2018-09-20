import { TransactionType, TransactionStatus } from 'constants';
import { observable } from 'mobx';
import PendingTxsSnackbarStore from './store';
import { mockResetTransactionList, mockAddTransaction } from '../../network/graphql/queries/';

jest.mock('../../network/graphql/queries'); // block and manually mock our backend

describe('PendingTxsSnackbarStore', () => {
  let store;
  const app = {
    global: observable({ syncBlockNum: 0, syncPercent: 10 }),
  }; // mock the appstore
  const sleep = ms => new Promise(res => setTimeout(res, ms));

  describe('Init', () => {
    beforeEach(() => {
      store = new PendingTxsSnackbarStore(app); // create a new instance before each test case
      mockResetTransactionList();
    });
    it('Init with null tx list', async () => {
      await store.init();
      expect(store.count).toBe(0);
      expect(store.isVisible).toBe(false);
      expect.assertions(2);
    });
    it('Init with tx list', async () => {
      await store.queryPendingTransactions();
      expect(store.count).toBe(0);
      expect(store.isVisible).toBe(false);
      mockAddTransaction({ txid: 1, status: TransactionStatus.PENDING, type: TransactionType.APPROVE_CREATE_EVENT });
      await store.queryPendingTransactions();
      expect(store.count).toBe(1);
      expect(store.pendingCreateEvents.length).toBe(1);
      expect(store.isVisible).toBe(true);
      mockAddTransaction({ txid: 2, status: TransactionStatus.PENDING, type: TransactionType.CREATE_EVENT });
      await store.queryPendingTransactions();
      expect(store.count).toBe(2);
      expect(store.pendingCreateEvents.length).toBe(2);
      expect(store.isVisible).toBe(true);
      mockAddTransaction({ txid: 3, status: TransactionStatus.PENDING, type: TransactionType.BET });
      await store.queryPendingTransactions();
      expect(store.count).toBe(3);
      expect(store.pendingCreateEvents.length).toBe(2);
      expect(store.pendingBets.length).toBe(1);
      expect(store.isVisible).toBe(true);
      mockResetTransactionList();
      await store.queryPendingTransactions();
      expect(store.count).toBe(0);
      expect(store.pendingCreateEvents.length).toBe(0);
      expect(store.pendingBets.length).toBe(0);
      expect(store.isVisible).toBe(false);
      mockAddTransaction({ txid: 4, status: TransactionStatus.PENDING, type: TransactionType.SET_RESULT });
      await store.queryPendingTransactions();
      expect(store.count).toBe(1);
      expect(store.pendingCreateEvents.length).toBe(0);
      expect(store.pendingSetResults.length).toBe(1);
      expect(store.isVisible).toBe(true);
      expect.assertions(20);
    });
  });

  describe('Reactions', () => {
    beforeEach(async () => {
      store = new PendingTxsSnackbarStore(app); // create a new instance before each test case
      mockResetTransactionList();
      await store.init();
    });
    it('Visible', async () => {
      expect(store.count).toBe(0);
      store.count = 1;
      await sleep(100);
      expect(store.isVisible).toBe(true);
      store.count = 0;
      await sleep(100);
      expect(store.isVisible).toBe(false);
      store.count = 1;
      await sleep(100);
      expect(store.isVisible).toBe(true);
      store.count = 0;
      await sleep(100);
      expect(store.isVisible).toBe(false);
      mockAddTransaction({ txid: 1, status: TransactionStatus.PENDING, type: TransactionType.APPROVE_CREATE_EVENT });
      await store.queryPendingTransactions();
      expect(store.count).toBe(1);
      await sleep(100);
      expect(store.isVisible).toBe(true);
      mockResetTransactionList();
      await store.queryPendingTransactions();
      await sleep(100);
      expect(store.isVisible).toBe(false);
      expect.assertions(8);
    });
    it('Sync', async () => {
      expect(store.isVisible).toBe(false);
      mockAddTransaction({ txid: 1, status: TransactionStatus.PENDING, type: TransactionType.APPROVE_CREATE_EVENT });
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
