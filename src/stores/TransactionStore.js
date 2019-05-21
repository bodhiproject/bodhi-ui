import { action, runInAction, toJS } from 'mobx';
import { AbiCoder } from 'web3-eth-abi';
import promisify from 'js-promisify';
import { fromAscii } from 'web3-utils';
import {
  addPendingEvent,
  addPendingBet,
  addPendingResultSet,
  createTransaction,
} from '../network/graphql/mutations';
import getContracts from '../config/contracts';
import Tracking from '../helpers/mixpanelUtil';

const CREATE_EVENT_FUNC_SIG = '2b2601bf';
const BET_EVENT_FUNC_SIG = '885ab66d';
const SET_EVENT_FUNC_SIG = 'a6b4218b';
const VOTE_EVENT_FUNC_SIG = '1e00eb7f';
const CREATE_EVENT_FUNC_TYPES = [
  'string',
  'bytes32[10]',
  'uint256',
  'uint256',
  'uint256',
  'uint256',
  'address',
];
const PLAY_EVENT_FUNC_TYPES = [
  'uint8',
];
const web3EthAbi = new AbiCoder();

export default class TransactionStore {
  app = undefined;

  constructor(app) {
    this.app = app;
  }

  handleReqError = (err, reqName) => {
    const { components: { globalDialog } } = this.app;
    if (err.networkError
      && err.networkError.result.errors
      && err.networkError.result.errors.length > 0) {
      // Handles GraphQL error
      globalDialog.setError(
        `${err.message} : ${err.networkError.result.errors[0].message}`,
        `GraphQL error: ${reqName}`,
      );
    } else {
      // Handle other error
      globalDialog.setError(err.message, `Other error: ${reqName}`);
    }
  }

  createEvent = async ({
    nbotMethods,
    eventParams,
    eventFactoryAddr,
    escrowAmt,
    gas,
  }) => {
    try {
      // Construct params
      const { nbotOwner, exchangeRate } = this.app.wallet;
      if (!nbotOwner) {
        throw new Error('exchanger not existed');
      }
      if (!exchangeRate) {
        throw new Error('excahngeRate not existed');
      }
      const paramsHex = web3EthAbi.encodeParameters(
        CREATE_EVENT_FUNC_TYPES,
        eventParams,
      ).substr(2);

      const data = `0x${CREATE_EVENT_FUNC_SIG}${paramsHex}`;
      // Send tx
      const txid = await promisify(
        nbotMethods.transfer['address,uint256,bytes'].sendTransaction,
        [eventFactoryAddr, escrowAmt, data, {
          token: getContracts().NakaBodhiToken.address,
          exchanger: nbotOwner,
          exchangeRate,
          gas,
        }]
      );
      return txid;
    } catch (err) {
      runInAction(() => {
        this.app.components.globalDialog.setError(`${err.message}`);
      });
    }
  };

  playEvent = async ({
    nbotMethods,
    params,
    eventAddr,
    eventFuncSig,
    amount,
    gas,
  }) => {
    try {
      // Construct params
      const { nbotOwner, exchangeRate } = this.app.wallet;
      if (!nbotOwner) {
        throw new Error('exchanger not existed');
      }
      if (!exchangeRate) {
        throw new Error('excahngeRate not existed');
      }
      const paramsHex = web3EthAbi.encodeParameters(
        PLAY_EVENT_FUNC_TYPES,
        params,
      ).substr(2);
      const data = `0x${eventFuncSig}${paramsHex}`;
      // Send tx
      const txid = await promisify(
        nbotMethods.transfer['address,uint256,bytes'].sendTransaction,
        [eventAddr, amount, data, {
          token: getContracts().NakaBodhiToken.address,
          exchanger: nbotOwner,
          exchangeRate,
          gas,
        }]
      );
      return txid;
    } catch (err) {
      runInAction(() => {
        this.app.components.globalDialog.setError(`${err.message}`);
      });
    }
  };

  /**
   * Logic to execute after a tx has been executed.
   * @param {Transaction} tx Transaction obj that was executed.
   */
  onTxExecuted = async (tx, pendingTx) => {
    // TODO: refresh Event Detail if the address is showing
    // Refresh detail page if one the same page
    if (tx.topicAddress && tx.topicAddress === this.app.eventPage.topicAddress) {
      await this.app.eventPage.addPendingTx(pendingTx);
    }

    this.app.txSentDialog.open(tx.txid);
  }

  /**
   * Executes a create event.
   * @param {number} index Index of the Transaction object.
   * @param {Transaction} tx Transaction object.
   */
  @action
  executeCreateEvent = async (tx) => {
    try {
      const {
        senderAddress,
        centralizedOracle,
        name,
        results,
        betStartTime,
        betEndTime,
        resultSetStartTime,
        resultSetEndTime,
        amountSatoshi,
        language,
      } = tx;

      const createEventParams = [
        name,
        toJS(results),
        betStartTime,
        betEndTime,
        resultSetStartTime,
        resultSetEndTime,
        centralizedOracle,
      ];
      for (let i = 0; i < 10; i++) {
        if (createEventParams[1][i]) {
          createEventParams[1][i] = fromAscii(createEventParams[1][i]);
        } else {
          createEventParams[1][i] = fromAscii('');
        }
      }

      const nbotMethods = window.naka.eth.contract(getContracts().NakaBodhiToken.abi)
        .at(getContracts().NakaBodhiToken.address);
      const txid = await this.createEvent({
        nbotMethods,
        eventParams: createEventParams,
        eventFactoryAddr: getContracts().EventFactory.address,
        escrowAmt: amountSatoshi,
        gas: 3000000,
      });

      Object.assign(tx, { txid });
      // Create pending tx on server
      if (txid) {
        const { graphqlClient } = this.app;
        const res = await addPendingEvent(graphqlClient, {
          txid,
          ownerAddress: senderAddress,
          name,
          results: createEventParams[1],
          numOfResults: results.length,
          centralizedOracle,
          betStartTime,
          betEndTime,
          resultSetStartTime,
          resultSetEndTime,
          language,
        });

        await this.onTxExecuted(res);
        this.app.prediction.loadFirst();
        Tracking.track('event-createEvent');
      }
    } catch (err) {
      this.handleReqError(err, 'addPendingEvent');
    }
  }


  /**
   * Executes a bet.
   * @param {number} index Index of the Transaction object.
   * @param {Transaction} tx Transaction object.
   */
  @action
  executeBet = async (tx) => {
    try {
      const { eventAddr, optionIdx, amount, eventRound } = tx;
      const nbotMethods = window.naka.eth.contract(getContracts().NakaBodhiToken.abi)
        .at(getContracts().NakaBodhiToken.address);
      const betParams = [optionIdx];
      const txid = await this.playEvent({
        nbotMethods,
        params: betParams,
        eventAddr,
        eventFuncSig: BET_EVENT_FUNC_SIG,
        amount,
        gas: 300000,
      });
      Object.assign(tx, { txid });
      if (txid) {
        // Create pending tx on server
        const { graphqlClient, wallet: { currentWalletAddress: { address } } } = this.app;
        const res = await addPendingBet(graphqlClient, {
          txid,
          eventAddress: eventAddr,
          betterAddress: address,
          resultIndex: optionIdx,
          amount,
          eventRound,
        });

        await this.onTxExecuted(res);
        Tracking.track('event-bet');
      }
    } catch (err) {
      this.handleReqError(err, 'addPendingBet');
    }
  }

  /**
   * Executes a set result.
   * @param {number} index Index of the Transaction object.
   * @param {Transaction} tx Transaction object.
   */
  @action
  executeSetResult = async (tx) => {
    try {
      const { eventAddr, optionIdx, amount, eventRound } = tx;
      const nbotMethods = window.naka.eth.contract(getContracts().NakaBodhiToken.abi)
        .at(getContracts().NakaBodhiToken.address);
      const setResultParams = [optionIdx];
      const txid = await this.playEvent({
        nbotMethods,
        params: setResultParams,
        eventAddr,
        eventFuncSig: SET_EVENT_FUNC_SIG,
        amount,
        gas: 500000,
      });

      Object.assign(tx, { txid });
      // Create pending tx on server
      if (txid) {
        const {
          graphqlClient,
          wallet: { currentWalletAddress: { address } },
        } = this.app;
        const res = await addPendingResultSet(graphqlClient, {
          txid,
          eventAddress: eventAddr,
          centralizedOracleAddress: address,
          resultIndex: optionIdx,
          amount,
          eventRound,
        });

        await this.onTxExecuted(res);
        Tracking.track('event-setResult');
      }
    } catch (err) {
      this.handleReqError(err, 'addPendingResultSet');
    }
  }

  /**
   * Executes a vote.
   * @param {number} index Index of the Transaction object.
   * @param {Transaction} tx Transaction object.
   */
  @action
  executeVote = async (tx) => {
    try {
      const { eventAddr, optionIdx, amount, eventRound } = tx;
      const nbotMethods = window.naka.eth.contract(getContracts().NakaBodhiToken.abi)
        .at(getContracts().NakaBodhiToken.address);
      const voteParams = [optionIdx];
      const txid = await this.playEvent({
        nbotMethods,
        params: voteParams,
        eventAddr,
        eventFuncSig: VOTE_EVENT_FUNC_SIG,
        amount,
        gas: 300000,
      });
      Object.assign(tx, { txid });

      // Create pending tx on server
      if (txid) {
        const {
          graphqlClient,
          wallet: { currentWalletAddress: { address } },
        } = this.app;
        const res = await addPendingBet(graphqlClient, {
          txid,
          eventAddress: eventAddr,
          betterAddress: address,
          resultIndex: optionIdx,
          amount,
          eventRound,
        });

        await this.onTxExecuted(res);
        Tracking.track('event-vote');
      }
    } catch (err) {
      this.handleReqError(err, 'addPendingBet');
    }
  }

  /**
   * Executes a withdraw or withdraw escrow..
   * @param {Transaction} tx Transaction object.
   */
  @action
  executeWithdraw = async (tx) => {
    try {
      const { type, senderAddress, topicAddress } = tx;
      const nbotMethods = window.naka.eth.contract(getContracts().MultipleResultsEvent.abi)
        .at(topicAddress);
      const txid = await promisify(nbotMethods.withdraw, []);

      Object.assign(tx, { txid });

      if (txid) {
        // Create pending tx on server
        const pendingTx = await createTransaction('withdraw', {
          type,
          txid,
          senderAddress,
          topicAddress,
        });

        await this.onTxExecuted(tx, pendingTx);
        Tracking.track('event-withdraw');
      }
    } catch (err) {
      this.handleReqError(err, 'addPendingWithdraw');
    }
  }
}
