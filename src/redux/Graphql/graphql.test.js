import moment from 'moment';
import faker from 'faker';
import { createStore } from '../store';
import graphqlActions from './actions';
// const { Descending, Ascending } = SortBy;
import { gql } from '../../network/mockServer';


describe('GraphQL tests', () => {
  // const server = mockServer();
  const store = createStore();
  const { dispatch, getState } = store;

  it('should create an event', async () => {
    const timeGap = 30; // minutes
    const nowPlus = (numOf) => `${moment().add(numOf, 'minutes').utc().unix()}`;
    const topic = Object.values({
      name: faker.lorem.word(),
      outcomes: [...faker.lorem.words().split(' ')],
      resultSetter: faker.finance.bitcoinAddress(),
      bettingStartTime: nowPlus(0),
      bettingEndTime: nowPlus(timeGap),
      resultSettingStartTime: nowPlus(timeGap),
      resultSettingEndTime: nowPlus(2 * timeGap),
      escrowAmount: 10, // TODO: is this always the case???
      creatorAddress: faker.finance.bitcoinAddress(),
    });
    // expect(graphqlStore().getOraclesReturn.length).toBe(0);
    console.log('BEFORE: ', getState().graphql);
    // expect(getState().graphql.txReturn)
    await dispatch(graphqlActions.createTopicTx(...topic));

    console.log('AFTER: ', getState().graphql);

    // console.log('STORE: ', getState().graphql);
    // const { data } = await gql`
    //   mutation {
    //     createTopic(name: "a", options: ["a", "b"], resultSetterAddress: "qUttsnD9TW3aknHM9217tkab8sdhzFv6Wd", bettingStartTime: "1524727080", bettingEndTime: "1524727200", resultSettingStartTime: "1524727200", resultSettingEndTime: "1524727320", amount: "1000000000", senderAddress: "qUttsnD9TW3aknHM9217tkab8sdhzFv6Wd") {
    //       txid
    //       createdTime
    //       version
    //       type
    //       status
    //       senderAddress
    //     }
    //   }
    // `;
    // console.log('DATA: ', data);
    // expect(graphqlStore().getOraclesReturn.length).toBe(1);
  });

  it('should get all Oracles', async () => {
    // const { data } = await gql`
    //   query {
    //     allOracles(filter: {OR: [{token: BOT, status: WAITRESULT}]}) {
    //       txid
    //       version
    //       address
    //       topicAddress
    //       status
    //       token
    //       name
    //       options
    //       optionIdxs
    //       amounts
    //       resultIdx
    //       blockNum
    //       startTime
    //       endTime
    //       resultSetStartTime
    //       resultSetEndTime
    //       resultSetterAddress
    //       resultSetterQAddress
    //       consensusThreshold
    //     }
    //   }
    // `;
    // console.log('DATA: ', data);
  });
  // it('should have the sortBy start out as ASC', () => {
  //   expect(store.getState().dashboard.sortBy).toBe(Ascending);
  // });

  // it('should change the sortBy to DESC when switching direction', () => {
  //   store.dispatch(dashboardActions.sortOrderChanged(Descending));
  //   expect(store.getState().dashboard.sortBy).toBe(Descending);
  // });
});
