const Joi = require("joi");
const log = require("../../config/logger");

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

  console.log(result);
  if (result.error == null) {
    next();
  } else {
    log.info("Falló la validación del usuario");
    log.error(result.error.details.map((d) => d.message));
    res.status(400).json({
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

  if (result.error == null) next();

  res.status(400).json({
    message: "Información de login no cumple con los requisitos del sistema.",
  });
};
