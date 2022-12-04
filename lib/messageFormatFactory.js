'use-strict';
const formatDate = require('./formatDate');
const colorizerFactory = require('pino-pretty').colorizerFactory

const LEVEL_TO_STRING = {
  60: 'fatal',
  50: 'error',
  40: 'warn',
  30: 'info',
  20: 'debug',
  10: 'trace'
}

const messageFormatFactory = (colorize) => {
  const colorizer = colorizerFactory(colorize === true);

  const messageFormat = (log, messageKey) => {
    const time = formatDate(log.time);
    const level = colorizer(LEVEL_TO_STRING[log.level]).toLowerCase();

    const logMessages = [time, level];

    if (log.req) {
      const { method, url } = log.req;

      logMessages.push(`${method} ${url}`);
    }

    logMessages.push(colorizer.message(log[messageKey]));

    return logMessages.join(' - ');
  };

  return messageFormat;
};

module.exports = messageFormatFactory
module.exports.messageFormatFactory = messageFormatFactory
module.exports.LEVEL_TO_STRING = LEVEL_TO_STRING
