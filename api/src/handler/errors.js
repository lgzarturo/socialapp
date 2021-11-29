const mongoose = require("mongoose");
const log = require("../config/logger");

exports.process = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

exports.databaseErrorHandler = (err, req, res, next) => {
  if (
    err instanceof mongoose.Error ||
    (err.name === "MongoError" && err.code === 11000) ||
    err instanceof mongoose.Error.ValidationError
  ) {
    err.status = 500;
    err.message = `Error inesperado relacionado con la base de datos.`;
  }
  next(err);
};

exports.bodySizeErrorHandler = (err, req, res, next) => {
  if (req.status === 413) {
    err.message = `El tamaño del contenido en la solicitud [${req.path}] excede el tamaño permitido. El máximo permitido es ${err.limit} bytes`;
    log.error(err);
  }
  next(err);
};

exports.productionErrorHandler = (err, req, res, next) => {
  log.error(err.stack);
  res.status(err.status || 500);
  res.json({ error: "Something went wrong", message: err.message });
};

exports.developmentErrorHandler = (err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    stack: err.stack || "",
  });
};
