/** This is a storage class work for mocking graphql
 * so the test files link to this instead of connecting to backend
 * This file simply skip the backend retrival and fake query results and return
 * Current logic is straightforward but good enough to make tests
 * */
export default {
  paginatedOracles: { totalCount: 0, oracles: [], pageInfo: { hasNextPage: true, count: 0, pageNumber: 1 } },
  paginatedTopics: { totalCount: 0, topics: [], pageInfo: { hasNextPage: true, count: 0, pageNumber: 1 } },
  transactions: [],
  resetAll() {
    this.paginatedOracles = { totalCount: 0, oracles: [], pageInfo: { hasNextPage: true, count: 0, pageNumber: 1 } };
    this.paginatedTopics = { totalCount: 0, topics: [], pageInfo: { hasNextPage: true, count: 0, pageNumber: 1 } };
    this.transactions = [];
  },
  resetOracles() {
    this.paginatedOracles = { totalCount: 0, oracles: [], pageInfo: { hasNextPage: true, count: 0, pageNumber: 1 } };
  },
  resetTopics() {
    this.paginatedTopics = { totalCount: 0, topics: [], pageInfo: { hasNextPage: true, count: 0, pageNumber: 1 } };
  },
  resetTransactions() {
    this.transactions = [];
  },
  addOracles(newOracles) {
    this.paginatedOracles.oracles.push(newOracles);
    this.paginatedOracles.totalCount = this.paginatedOracles.totalCount + 1;
  },
  addTopics(newTopics) {
    this.paginatedTopics.topics.push(newTopics);
    this.paginatedTopics.totalCount = this.paginatedTopics.totalCount + 1;
  },
  addTransactions(newTransactions) {
    this.transactions.push(newTransactions);
  },
};
