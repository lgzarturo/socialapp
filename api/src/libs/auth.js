const passportJWT = require('passport-jwt')
const log = require('../config/logger')
const config = require('../config')
const userController = require('../app/users/users.controller')

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()
}

module.exports = new passportJWT.Strategy(jwtOptions, function (
  jwtPayload,
  next
) {
  userController
    .getUser({ id: jwtPayload.id })
    .then(function (user) {
      if (user) {
        next(null, user)
        return
      }
      next(null, false)
    })
    .catch(function (err) {
      log.error('Ocurrió un error al intentar validar el token', err)
      next(err)
    })
})
