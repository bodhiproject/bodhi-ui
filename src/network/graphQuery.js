import GraphRequest from './graphRequest';

export function queryAllTopics() {
  const request = new GraphRequest('allTopics');
  return request.execute();
}

export function queryAllOracles() {
  const request = new GraphRequest('allOracles');
  return request.execute();
}

export function querySyncInfo() {
  const request = new GraphRequest('syncInfo');
  return request.execute();
}
