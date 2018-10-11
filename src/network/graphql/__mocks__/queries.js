/** This is a mock module of ../queries.js,
 * so the test files link to this instead of connecting to backend
 * this mock module is a interface between stores and mockData module.
 * */
import { orderBy as lodashOrderBy, flatten, forEach, filter as lodashFilter, isUndefined, toInteger } from 'lodash';

import mockData from '../../../../test/mockDB';

export function queryAllTopics(app, filters, orderBy, limit, skip) {
  let { topics } = mockData;
  topics = filterList(filters, mockData.topics);
  topics = orderList(orderBy, topics);
  topics = paginateList(limit, skip, topics);
  return {
    totalCount: mockData.paginatedTopics.totalCount,
    topics,
    pageInfo: {
      hasNextPage: end < mockData.paginatedTopics.totalCount,
      pageNumber: toInteger(end / limit),
      count: topics.length,
    },
  };
}

export function queryAllOracles(app, filters, orderBy, limit, skip) {
  const { totalCount } = mockData.paginatedOracles;
  let { oracles } = mockData.paginatedOracles;
  oracles = filterList(filters, oracles);
  oracles = orderList(orderBy, oracles);
  oracles = paginateList(limit, skip, oracles);

  const end = getEndIndex(limit, skip, oracles);
  return {
    totalCount,
    oracles,
    pageInfo: {
      hasNextPage: end < totalCount,
      pageNumber: toInteger(end / limit),
      count: oracles.length,
    },
  };
}

export function queryAllTransactions(filters, orderBy, limit = 0, skip = 0) {
  let { transactions } = mockData;
  transactions = filterList(filters, mockData.transactions);
  transactions = orderList(orderBy, transactions);
  transactions = paginateList(limit, skip, transactions);
  return transactions;
}

const getPageInfo = (totalCount, limit, skip) => {
  const end = skip + (limit > 0 && limit <= list.length) ? skip + limit : oracles.length;
  return !isUndefined(limit)
    && !isUndefined(skip)
    && skip + (limit > 0 && limit <= list.length) ? skip + limit : list.length;
};

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
