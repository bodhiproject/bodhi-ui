import logger from 'loglevel';
import remote from 'loglevel-plugin-remote';
import { API } from '../network/routes';

const format = log => `${log.message}${log.stacktrace ? `\n${log.stacktrace}` : ''}`;

remote.apply(logger, {
  url: API.LOG_CLIENT_ERROR,
  method: 'POST',
  format,
});

export default logger;
