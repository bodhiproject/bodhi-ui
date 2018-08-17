import axios from 'axios';
import http from 'http';
import https from 'https';

export default axios.create({
  httpAgent: new http.Agent(),
  httpsAgent: new https.Agent({ ciphers: 'DES-CBC3-SHA' }),
});
