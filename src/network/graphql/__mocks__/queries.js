/** This is a mock module of ../queries.js,
 * so the test files link to this instead of connecting to backend
 * This file simply skip the backend retrival and fake query results and return
 * Current logic is straightforward but good enough to make tests
 * */
export function queryAllTopics(filters, orderBy, limit, skip) {
  const topics = [];
  const max = 23;
  let i;
  for (i = 0; i < max; i++) {
    topics.push({ txid: i });
  }
  const end = skip + limit <= max ? skip + limit : max;
  return topics.slice(skip, end);
}

export function queryAllOracles(filters, orderBy, limit, skip) {
  const oracles = [];
  const max = 23;
  let i;
  for (i = 0; i < max; i++) {
    const oracle = {
      txid: i,
      amounts: [],
      consensusThreshold: 100,
      address: '02e91962156da21fae38e65038279c020347e4ff',
      topicAddress: '4044f951857f2885d66d29a475235dacdaddea84',
      resultSetEndTime: 10,
      endTime: 20,
      options: [],
    };
    oracles.push(oracle);
  }
  const end = skip + limit <= max ? skip + limit : max;
  return oracles.slice(skip, end);
}
