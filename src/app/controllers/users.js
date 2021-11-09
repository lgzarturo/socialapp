const passport = require("passport");
const User = require("../../model/user/User");

exports.signup = (req, res, next) => {
  const user = new User({
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
  });
  User.findOne({ email: req.body.email }, (err, userExists) => {
    if (err) {
      next(err);
    }
    if (userExists) {
      return res.status(400).json({
        title: "User already exists",
        error: err,
      });
    }

    user.save((err, result) => {
      if (err) {
        next(err);
      }
      req.logIn(result, (err) => {
        if (err) {
          next(err);
        }
        res.status(201).json({
          message: "User created",
          obj: result,
        });
      });
    });
  });
};

exports.login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      next(err);
    }
    if (!user) {
      return res.status(401).json({
        title: "Login failed",
        error: info,
      });
    }
    req.logIn(user, (err) => {
      if (err) {
        next(err);
      }
      res.status(200).json({
        message: "Login successful",
        obj: user,
      });
    });
  })(req, res, next);
};

exports.logout = (req, res, next) => {
  req.logout();
  res.status(200).json({
    message: "Logout successful",
  });
};
