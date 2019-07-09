import { action } from 'mobx';
import { AbiCoder } from 'web3-eth-abi';
import promisify from 'js-promisify';
import { utf8ToHex, padRight } from 'web3-utils';
import { cloneDeep } from 'lodash';
import logger from 'loglevel';
import {
  addPendingEvent,
  addPendingBet,
  addPendingResultSet,
  addPendingWithdraw,
} from '../network/graphql/mutations';
import {
  NakaBodhiToken,
  EventFactory,
  MultipleResultsEvent,
} from '../config/contracts';
import Tracking from '../helpers/mixpanelUtil';

const CREATE_EVENT_FUNC_SIG = '662edd20';
const BET_EVENT_FUNC_SIG = '885ab66d';
const SET_EVENT_FUNC_SIG = 'a6b4218b';
const VOTE_EVENT_FUNC_SIG = '1e00eb7f';

const CREATE_EVENT_FUNC_TYPES = [
  'string',
  'bytes32[3]',
  'uint256',
  'uint256',
  'address',
  'uint8',
  'uint256',
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
    const { globalDialog } = this.app;
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

  getPayByTokenParams = () => {
    const { nbotOwner, exchangeRate } = this.app.wallet;
    if (!nbotOwner) throw Error('exchanger not defined');
    if (!exchangeRate) throw Error('exchangeRate not defined');

    return {
      token: NakaBodhiToken()[this.app.naka.network.toLowerCase()],
      exchanger: nbotOwner,
      exchangeRate,
    };
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
      const paramsHex = web3EthAbi.encodeParameters(
        CREATE_EVENT_FUNC_TYPES,
        eventParams,
      ).substr(2);
      const data = `0x${CREATE_EVENT_FUNC_SIG}${paramsHex}`;

      // Send tx
      const pbtParams = this.getPayByTokenParams();
      const txid = await promisify(
        nbotMethods.transfer['address,uint256,bytes'].sendTransaction,
        [eventFactoryAddr, escrowAmt, data, {
          gas,
          ...pbtParams,
        }]
      );
      return txid;
    } catch (err) {
      logger.error('TransactionStore.createEvent', err);
      return undefined;
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
      const paramsHex = web3EthAbi.encodeParameters(
        PLAY_EVENT_FUNC_TYPES,
        params,
      ).substr(2);
      const data = `0x${eventFuncSig}${paramsHex}`;

      // Send tx
      const pbtParams = this.getPayByTokenParams();
      const txid = await promisify(
        nbotMethods.transfer['address,uint256,bytes'].sendTransaction,
        [eventAddr, amount, data, {
          gas,
          ...pbtParams,
        }]
      );
      return txid;
    } catch (err) {
      logger.error('TransactionStore.playEvent', err);
    }
  };

  /**
   * Logic to execute after a tx has been executed.
   * @param {Transaction} tx Transaction obj that was executed.
   */
  onTxExecuted = async (tx) => {
    // Refresh detail page if one the same page
    if (tx.eventAddress && tx.eventAddress === this.app.eventPage.address) {
      this.app.eventPage.addPendingTx(tx);
    }
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
        betEndTime,
        resultSetStartTime,
        amountSatoshi,
        arbitrationOptionIndex,
        arbitrationRewardPercentage,
        language,
      } = tx;

      // Construct params for executing tx
      const createEventParams = [
        name,
        cloneDeep(results),
        betEndTime,
        resultSetStartTime,
        centralizedOracle,
        arbitrationOptionIndex,
        arbitrationRewardPercentage,
      ];
      // Format results to bytes32 types
      for (let i = 0; i < 3; i++) {
        if (createEventParams[1][i]) {
          createEventParams[1][i] = padRight(utf8ToHex(createEventParams[1][i]), 64);
        } else {
          createEventParams[1][i] = padRight(utf8ToHex(''), 64);
        }
      }

      // Execute tx
      const { network } = this.app.naka;
      const nbotMethods = window.naka.eth.contract(NakaBodhiToken().abi)
        .at(NakaBodhiToken()[network.toLowerCase()]);
      const txid = await this.createEvent({
        nbotMethods,
        eventParams: createEventParams,
        eventFactoryAddr: EventFactory()[network.toLowerCase()],
        escrowAmt: amountSatoshi,
        gas: 3000000,
      });
      logger.error('txid1', txid);
      // TODO: remove after mobile apps are done debugging
      logger.error('Returned to dapp after create event');

      console.log('Returned to dapp after create event');

      if (!txid) {
        return undefined;
      }

      // Create pending tx on server
      Object.assign(tx, { txid });
      if (txid) {
        const { graphqlClient } = this.app;
        const res = await addPendingEvent(graphqlClient, {
          txid,
          ownerAddress: senderAddress,
          name,
          results: createEventParams[1],
          numOfResults: results.length,
          centralizedOracle,
          betEndTime,
          resultSetStartTime,
          language,
        });

        logger.error('comess here');

        await this.onTxExecuted(res);
        logger.error('onTx');

        Tracking.track('event-createEvent');
      }
      logger.error('txid22', txid);
      return txid;
    } catch (err) {
      logger.error('TransactionStore.executeCreateEvent', err);
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
      const { network } = this.app.naka;
      const nbotMethods = window.naka.eth.contract(NakaBodhiToken().abi)
        .at(NakaBodhiToken()[network.toLowerCase()]);
      const betParams = [optionIdx];
      const txid = await this.playEvent({
        nbotMethods,
        params: betParams,
        eventAddr,
        eventFuncSig: BET_EVENT_FUNC_SIG,
        amount,
        gas: 300000,
      });
      // TODO: remove after mobile apps are done debugging
      console.log('Returned to dapp after bet');
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
      logger.error('TransactionStore.executeBet', err);
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
      const { network } = this.app.naka;
      const nbotMethods = window.naka.eth.contract(NakaBodhiToken().abi)
        .at(NakaBodhiToken()[network.toLowerCase()]);
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
      logger.error('TransactionStore.executeSetResult', err);
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
      const { network } = this.app.naka;
      const nbotMethods = window.naka.eth.contract(NakaBodhiToken().abi)
        .at(NakaBodhiToken()[network.toLowerCase()]);
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
      logger.error('TransactionStore.executeVote', err);
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
      const { eventAddress, winningAmount, escrowAmount, version } = tx;
      const nbotMethods = window.naka.eth.contract(MultipleResultsEvent(version).abi)
        .at(eventAddress);
      const pbtParams = this.getPayByTokenParams();
      const txid = await promisify(nbotMethods.withdraw, [{
        gas: 200000,
        ...pbtParams,
      }]);

      Object.assign(tx, { txid });

      if (txid) {
        // Create pending tx on server
        const {
          graphqlClient,
          wallet: { currentWalletAddress: { address } },
        } = this.app;
        const res = await addPendingWithdraw(graphqlClient, {
          txid,
          eventAddress,
          winnerAddress: address,
          winningAmount,
          escrowAmount,
        });

        await this.onTxExecuted(res);
        Tracking.track('event-withdraw');
      }
    } catch (err) {
      logger.error('TransactionStore.executeWithdraw', err);
      this.handleReqError(err, 'addPendingWithdraw');
    }
  }
}
