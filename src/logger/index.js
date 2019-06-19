import logger from 'loglevel';
import remote from 'loglevel-plugin-remote';
import { API } from '../network/routes';

const format = (log) => { // eslint-disable-line
  return {
    level: log.level.label,
    message: `${log.message}${log.stacktrace ? `\n${log.stacktrace}` : ''}`,
  };
};

remote.apply(logger, {
  url: API.LOG_CLIENT_ERROR,
  method: 'POST',
  level: 'error',
  format,
});
