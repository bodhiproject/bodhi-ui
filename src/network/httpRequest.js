import axios from 'axios';
import http from 'http';
import https from 'https';

let instance;

export default function getAxios() {
  if (!instance) {
    instance = axios.create({
      httpAgent: new http.Agent(),
      httpsAgent: new https.Agent({ ciphers: 'DES-CBC3-SHA' }),
    });
  }
  return instance;
}

/**
 * Executes an HTTP request.
 * @param url {String} The URL we want to request.
 * @param options {Object} The fetch options.
 * @return {Object} The response data as a Promise.
 */
export function request(url, options) {
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
  return response.json()
    .then((res) => res.result || res)
    .catch((err) => {
      throw new Error(err);
    });
}
