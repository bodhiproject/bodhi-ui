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
