import { all, takeEvery, put, fork, call } from 'redux-saga/effects';
// import { push } from 'react-router-redux';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';


import actions from './actions';

import fakeData from './fakedata';

const client = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:5555/graphql' }),
  cache: new InMemoryCache(),
});

const ALL_TOPICS = gql`
query{
  allTopics{
    address,
    creatorAddress,
    name,
    options,
    blockNum
  }
}
`;


const isFake = false;

export function* getTopicsRequestHandler(/* actions */) {
  yield takeEvery(actions.GET_TOPICS_REQUEST, function* onGetTopicsRequest() {
    console.log('saga: onGetTopicsRequest');

    if (isFake) {
      yield put({
        type: actions.GET_TOPICS_SUCCESS,
        value: fakeData,
      });
    } else {
      try {
        const result = yield call(queryAllTopics);

        // const result = undefined;

        yield put({
          type: actions.GET_TOPICS_SUCCESS,
          value: result,
        });
      } catch (error) {
        yield put({
          type: actions.GET_TOPICS_ERROR,
          value: error.message,
        });
      }
    }
  });
}

function queryAllTopics() {
  return client.query({ query: ALL_TOPICS }).then((res) => {
    const queryName = 'allTopics';
    const queryData = res.data[queryName].map((entry) => ({
      address: entry.address,
      name: entry.name,
      options: entry.options,
      bettingEndBlock: entry.blockNum,
      creatorAddress: entry.creatorAddress,
    }));
    console.log(queryData);
    return queryData;
  });
}

// export function* getTopicsSuccess() {
//   yield takeEvery(actions.GET_TOPICS_SUCCESS, function* (payload) {
//     console.log(payload);
//   });
// }

// export function* getTopicsError() {
//   yield takeEvery(actions.GET_TOPICS_ERROR, function* (payload) {
//     console.log(payload);
//   });
// }

export default function* dashboardSaga() {
  yield all([
    fork(getTopicsRequestHandler),
    // fork(getTopicsSuccess),
    // fork(getTopicsError),
  ]);
}
