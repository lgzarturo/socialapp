const winston = require('winston')
const config = require('../config')

const ERROR_LEVEL = 'error'
const DEBUG_LEVEL = 'debug'

module.exports = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: config.hideLogs ? ERROR_LEVEL : DEBUG_LEVEL,
      handleExceptions: true,
      json: false,
      colorize: true,
      prettyPrint: (object) => JSON.stringify(object, null, 2)
    })
  ]
})
