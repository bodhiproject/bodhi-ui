/** This is a storage class work for mocking graphql
 * so the test files link to this instead of connecting to backend
 * This file simply skip the backend retrival and fake query results and return
 * Current logic is straightforward but good enough to make tests
 * */
export default {
  oracles: [],
  topics: [],
  transactions: [],
  resetAll() {
    this.topics = [];
    this.oracles = [];
    this.transactions = [];
  },
  resetOracles() {
    this.oracles = [];
  },
  resetTopics() {
    this.topics = [];
  },
  resetTransactions() {
    this.transactions = [];
  },
  addOracles(newOracles) {
    this.oracles.push(newOracles);
  },
  addTopics(newTopics) {
    this.topics.push(newTopics);
  },
  addTransactions(newTransactions) {
    this.transactions.push(newTransactions);
  },
};
