exports.codeErrors = {
  MONGO: {
    ID_NOT_VALID: 'DatabaseIdentifierNotValid',
    ID_PARSE_ERROR: 'DatabaseParseIdentifiedError'
  },
  FILE: {
    INVALID_MIME_TYPE: 'FileInvalidMimeType'
  },
  GENERAL: {
    ERROR: 'GeneralErrorStatus',
    PRODUCTION_ERROR: 'SomethingWentWrong'
  },
  USER: {
    DATA_VALIDATION_ERROR: 'UserDataValidationError',
    EXIST_ERROR: 'UserExistError',
    INCORRECT_CREDENTIALS_ERROR: 'UserIncorrectCredentialsError'
  },
  AUTH: {
    UNAUTHORIZED: 'Unauthorized'
  }
}
