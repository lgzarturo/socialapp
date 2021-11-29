const passportJWT = require("passport-jwt");
const log = require("../config/logger");
const config = require("../config");
const userController = require("../app/users/users.controller");

let jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
};

module.exports = new passportJWT.Strategy(jwtOptions, function (
  jwtPayload,
  next
) {
  userController.getUser(jwtPayload.id).then(function (user) {
    if (user) {
      next(null, user);
    }
    next(null, false);
  });
});
