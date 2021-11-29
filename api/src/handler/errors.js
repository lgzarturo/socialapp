const mongoose = require("mongoose");
const log = require("../config/logger");
const error = require("../libs/errors").codeErrors;
const code = require("http-status-codes").StatusCodes;

const MONGO_CONNECTION_ERROR_CODE = 11000;
const MONGO_ERROR_NAME = "MongoError";

exports.process = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

exports.databaseErrorHandler = (err, req, res, next) => {
  if (
    err instanceof mongoose.Error ||
    (err.name === MONGO_ERROR_NAME &&
      err.code === MONGO_CONNECTION_ERROR_CODE) ||
    err instanceof mongoose.Error.ValidationError
  ) {
    err.status = code.INTERNAL_SERVER_ERROR;
    err.message = `Error inesperado relacionado con la base de datos.`;
  }
  next(err);
};

exports.bodySizeErrorHandler = (err, req, res, next) => {
  if (req.status === code.REQUEST_TOO_LONG) {
    err.message = `El tamaño del contenido en la solicitud [${req.path}] excede el tamaño permitido. El máximo permitido es ${err.limit} bytes`;
    log.error(err);
  }
  next(err);
};

exports.productionErrorHandler = (err, req, res, next) => {
  log.error(err.stack);
  const statusCode = err.status || code.INTERNAL_SERVER_ERROR;
  res.status(statusCode);
  res.json({
    error: error.GENERAL.PRODUCTION_ERROR,
    message: err.message,
  });
};

exports.developmentErrorHandler = (err, req, res, next) => {
  const statusCode = err.status || code.INTERNAL_SERVER_ERROR;
  res.status(statusCode);
  res.json({
    error: `${error.GENERAL.ERROR}${statusCode}`,
    message: err.message,
    stack: err.stack || "",
  });
};
