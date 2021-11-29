const code = require("http-status-codes").StatusCodes;

class UserExistsError extends Error {
  constructor(message) {
    super(message);
    this.message = message || "User already exists";
    this.status = code.CONFLICT;
    this.name = "UserExistsError";
  }
}

class IncorrectCredentialsError extends Error {
  constructor(message) {
    super(message);
    this.message = message || "Incorrect credentials";
    this.status = code.BAD_REQUEST;
    this.name = "IncorrectCredentialsError";
  }
}

module.exports = {
  UserExistsError,
  IncorrectCredentialsError,
};
