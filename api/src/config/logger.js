const path = require("path");
const winston = require("winston");
const config = require("../config");

module.exports = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: config.hideLogs ? "error" : "debug",
      handleExceptions: true,
      json: false,
      colorize: true,
      prettyPrint: (object) => JSON.stringify(object, null, 2),
    }),
  ],
});
