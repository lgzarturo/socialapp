const Joi = require("joi");
const log = require("../../config/logger");
const error = require("../../libs/errors").codeErrors;
const code = require("http-status-codes").StatusCodes;

const userBlueprint = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().min(4).required(),
  name: Joi.string().required(),
  biography: Joi.string().allow("").max(200),
});

exports.userValidate = (req, res, next) => {
  const result = userBlueprint.validate(req.body, {
    abortEarly: false,
    convert: false,
  });

  if (result.error == null) {
    next();
  } else {
    log.info("Falló la validación del usuario");
    log.error(result.error.details.map((d) => d.message));
    res.status(code.BAD_REQUEST).json({
      error: error.USER.DATA_VALIDATION_ERROR,
      message:
        "Información del usuario no cumple con los requisitos del sistema.",
    });
  }
};

const userLoginBlueprint = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().min(4).required(),
});

exports.loginValidate = (req, res, next) => {
  const result = userLoginBlueprint.validate(req.body, {
    abortEarly: false,
    convert: false,
  });

  if (result.error == null) {
    next();
  } else {
    res.status(code.BAD_REQUEST).json({
      error: error.USER.DATA_VALIDATION_ERROR,
      message: "Información de login no cumple con los requisitos del sistema.",
    });
  }
};
