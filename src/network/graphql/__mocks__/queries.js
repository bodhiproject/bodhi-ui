/** This is a mock module of ../queries.js,
 * so the test files link to this instead of connecting to backend
 * this mock module is a interface between stores and mockData module.
 * */
import { orderBy as lodashOrderBy, flatten, forEach, filter as lodashFilter, isUndefined, toInteger } from 'lodash';

import mockData from '../../../../test/mockDB';

export function queryAllTopics(app, filters, orderBy, limit, skip) {
  const { totalCount } = mockData.paginatedTopics;
  let { topics } = mockData.paginatedTopics;
  topics = filterList(filters, topics);
  topics = orderList(orderBy, topics);
  topics = paginateList(limit, skip, topics);

  return {
    totalCount,
    topics,
    pageInfo: getPageInfo(limit, skip, totalCount, topics),
  };
}

export function queryAllOracles(app, filters, orderBy, limit, skip) {
  const { totalCount } = mockData.paginatedOracles;
  let { oracles } = mockData.paginatedOracles;
  oracles = filterList(filters, oracles);
  oracles = orderList(orderBy, oracles);
  oracles = paginateList(limit, skip, oracles);

  return {
    totalCount,
    oracles,
    pageInfo: getPageInfo(limit, skip, totalCount, oracles),
  };
}

export async function queryMostVotes(app, filters, orderBy, limit, skip) {
  const { totalCount } = mockData.paginatedAccumulatedVotes;
  let { votes } = mockData.paginatedAccumulatedVotes;
  votes = filterList(filters, votes);
  votes = orderList(orderBy, votes);
  votes = paginateList(limit, skip, votes);

  return {
    totalCount,
    votes,
    pageInfo: getPageInfo(limit, skip, totalCount, votes),
  };
}

export function queryAllTransactions(filters, orderBy, limit, skip) {
  let { transactions } = mockData;
  transactions = filterList(filters, mockData.transactions);
  transactions = orderList(orderBy, transactions);
  transactions = paginateList(limit, skip, transactions);
  return transactions;
}

export function queryWithdraws(filters, orderBy, limit, skip) {
  let { withdraws } = mockData;
  withdraws = filterList(filters, mockData.withdraws);
  withdraws = orderList(orderBy, withdraws);
  withdraws = paginateList(limit, skip, withdraws);
  return withdraws;
}

export function queryResultSets(filters, orderBy, limit, skip) {
  let { resultSets } = mockData;
  resultSets = filterList(filters, mockData.resultSets);
  resultSets = orderList(orderBy, resultSets);
  resultSets = paginateList(limit, skip, resultSets);
  return resultSets;
}

export function queryAllVotes(filters, orderBy, limit, skip) {
  let { votes } = mockData;
  votes = filterList(filters, mockData.votes);
  votes = orderList(orderBy, votes);
  votes = paginateList(limit, skip, votes);
  return votes;
}

const filterList = (filters, list) => {
  if (filters) {
    return flatten(filters.map((filter) => lodashFilter(list, filter)));
  }
  return list;
};

const orderList = (orderBy, list) => {
  if (orderBy) {
    const orderFields = [];
    const orderDirections = [];

    if (orderBy instanceof Array) {
      forEach(orderBy, (order) => {
        orderFields.push(order.field);
        orderDirections.push(order.direction);
      });
    } else {
      orderFields.push(orderBy.field);
      orderDirections.push(orderBy.direction);
    }

    return lodashOrderBy(list, orderFields, orderDirections);
  }
  return list;
};

const paginateList = (limit, skip, list) => {
  if (!isUndefined(limit) && !isUndefined(skip)) {
    const end = skip + limit <= list.length ? skip + limit : list.length;
    return list.slice(skip, end);
  }
  return list;
};

const getPageInfo = (limit, skip, totalCount, list) => {
  const endIndex = skip + limit;
  return !isUndefined(limit)
    && !isUndefined(skip)
    && {
      hasNextPage: endIndex < totalCount,
      pageNumber: toInteger(endIndex / limit),
      count: list.length,
    };
};
