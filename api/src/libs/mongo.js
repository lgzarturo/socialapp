const error = require("./errors").codeErrors;
const code = require("http-status-codes").StatusCodes;

exports.idValidator = (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return res.status(code.BAD_REQUEST).json({
      error: error.MONGO.ID_NOT_VALID,
      message:
        "El parámetro id es un valor requerido. Favor de revisar la documentación",
    });
  }
  if (id.match(/^[0-9a-fA-F]{24}$/) === null) {
    return res.status(code.BAD_REQUEST).json({
      error: error.MONGO.ID_PARSE_ERROR,
      message:
        "El formato del parámetro es invalido. Favor de revisar la documentación",
    });
  }
  next();
};
