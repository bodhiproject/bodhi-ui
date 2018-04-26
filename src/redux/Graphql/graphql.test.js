import moment from 'moment';
import casual from 'casual';
import { createStore } from '../store';
import graphqlActions from './actions';
// const { Descending, Ascending } = SortBy;
import { gql } from '../../network/mockServer';


describe('GraphQL tests', () => {
  // const server = mockServer();
  const store = createStore();

  it('should create an event', async () => {
    const timeGap = 30; // minutes
    const nowPlus = (numOf) => `${moment().add(numOf, 'minutes').utc().unix()}`;
    const topic = Object.values({
      name: '',
      outcomes: [],
      resultSetter: '',
      bettingStartTime: nowPlus(0),
      bettingEndTime: nowPlus(timeGap),
      resultSettingStartTime: nowPlus(timeGap),
      resultSettingEndTime: nowPlus(2 * timeGap),
      escrowAmount: 100,
      creatorAddress: '',
    });
    store.dispatch(graphqlActions.createTopicTx(...topic));
  });

  it('should get all Oracles', async () => {
    const { data } = await gql`
      query {
        allOracles(filter: {OR: [{token: BOT, status: WAITRESULT}]}) {
          txid
          version
          address
          topicAddress
          status
          token
          name
          options
          optionIdxs
          amounts
          resultIdx
          blockNum
          startTime
          endTime
          resultSetStartTime
          resultSetEndTime
          resultSetterAddress
          resultSetterQAddress
          consensusThreshold
        }
      }
    `;
    console.log('DATA: ', data);
  });
  // it('should have the sortBy start out as ASC', () => {
  //   expect(store.getState().dashboard.sortBy).toBe(Ascending);
  // });

  // it('should change the sortBy to DESC when switching direction', () => {
  //   store.dispatch(dashboardActions.sortOrderChanged(Descending));
  //   expect(store.getState().dashboard.sortBy).toBe(Descending);
  // });
});
