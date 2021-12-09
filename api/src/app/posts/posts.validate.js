const Joi = require('joi')
const log = require('../../config/logger')
const fileType = require('file-type')
const error = require('../../libs/errors').codeErrors
const code = require('http-status-codes').StatusCodes

const MIME_TYPE_VALID = ['image/jpeg', 'image/png', 'image/jpg']

const postBlueprint = Joi.object().keys({
  url: Joi.string().required(),
  caption: Joi.string().max(200)
})

exports.postCreateValidation = (req, res, next) => {
  const result = postBlueprint.validate(req.body, {
    abortEarly: false,
    convert: false
  })
  if (result.error == null) {
    next()
  } else {
    console.log(result)
    const validationErrors = result.error.details.reduce((data, error) => {
      return data + `[${error.message}]`
    }, '')

    log.warn(
      'El siguiente post no pasó la validación: ',
      req.body,
      validationErrors
    )
    res
      .status(code.BAD_REQUEST)
      .send(
        `El post en el body debe especificar url. Errores en tu request: ${validationErrors}`
      )
  }
}

exports.imageValidate = (req, res, next) => {
  const contentType = req.get('content-type')
  if (!MIME_TYPE_VALID.includes(contentType)) {
    log.error(`Invalid MIME type: ${contentType}`)
    res.status(code.BAD_REQUEST).json({
      error: error.FILE.INVALID_MIME_TYPE,
      message: `Invalid MIME type: ${contentType}`
    })
    return
  }

  const fileInfo = fileType(req.body)
  if (!MIME_TYPE_VALID.includes(fileInfo.mime)) {
    const message = `Invalid file type: ${fileInfo.mime}`
    log.error(message)
    res.status(code.BAD_REQUEST).json({
      error: error.FILE.INVALID_FILE_TYPE,
      message
    })
  }

  req.extension = fileInfo.ext
  next()
}
