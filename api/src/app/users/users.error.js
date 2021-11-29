const error = require("../../libs/errors").codeErrors;
const code = require("http-status-codes").StatusCodes;

class UserExistsError extends Error {
  constructor(message) {
    super(message);
    this.error = error.USER.EXIST_ERROR;
    this.message = message || "User already exists";
    this.status = code.CONFLICT;
  }
}

class IncorrectCredentialsError extends Error {
  constructor(message) {
    super(message);
    this.error = error.USER.INCORRECT_CREDENTIALS_ERROR;
    this.message = message || "Incorrect credentials";
    this.status = code.BAD_REQUEST;
  }
}

module.exports = {
  UserExistsError,
  IncorrectCredentialsError,
};
