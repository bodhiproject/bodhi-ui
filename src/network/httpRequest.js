import fetch from 'node-fetch';

/**
 * Executes an HTTP request.
 * @param url {String} The URL we want to request.
 * @param options {Object} The fetch options.
 * @return {Object} The response data as a Promise.
 */
export function request(url, options) {
  console.log('url:', url, 'options:', options);

  return fetch(url, options)
    .then(checkStatusCode)
    .then(parseResponse);
}

function checkStatusCode(response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response);
  }
  return Promise.reject(new Error(response.statusText));
}

/**
 * Parses the HTTP response returned by a network request.
 * @param response {Object} A response from a network request.
 * @return {Object} The parsed JSON from the request.
 */
function parseResponse(response) {
  if (response.url === 'https://testnet.qtum.org/insight-api/statistics/total') {
    return response.text()
      .then((res) => JSON.parse(res))
      .catch((err) => {
        throw new Error(err);
      });
  }
  return response.json()
    .then((res) => res.result)
    .catch((err) => {
      throw new Error(err);
    });
}
