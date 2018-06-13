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
