const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../app/users/users.model");
const error = require("../libs/errors").codeErrors;
const code = require("http-status-codes").StatusCodes;

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    (email, password, done) => {
      User.findOne({ email: email }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {
            error: error.USER.DATA_VALIDATION_ERROR,
            message: "Incorrect email",
          });
        }
        if (!user.isValidPassword(password)) {
          return done(null, false, {
            error: error.USER.DATA_VALIDATION_ERROR,
            message: "Incorrect password",
          });
        }
        return done(null, user);
      });
    }
  )
);

exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(code.UNAUTHORIZED).json({
    error: error.AUTH.UNAUTHORIZED,
    message: "Unauthorized",
  });
};
