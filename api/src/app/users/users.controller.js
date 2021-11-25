const passport = require("passport");
const User = require("./users.model");

exports.getSignup = (req, res, next) => {
  res.render("users/signup");
};

exports.signup = (req, res, next) => {
  const { email, password, name, biography } = req.body;
  if (!email || !password || !name || !biography) {
    req.flash("errors", { message: "All fields are required" });
    return res.redirect("/signup");
  }

  const user = new User({
    email,
    password,
    name,
    biography,
  });
  User.findOne({ email: req.body.email }, (err, userExists) => {
    if (err) {
      next(err);
    }
    if (userExists) {
      req.flash("errors", { message: "User already exists" });
      return res.redirect("/signup");
    }

    user.save((err, result) => {
      if (err) {
        next(err);
      }
      req.logIn(result, (err) => {
        if (err) {
          next(err);
        }
        res.redirect("/");
      });
    });
  });
};

exports.getLogin = (req, res, next) => {
  res.render("users/login");
};

exports.login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      next(err);
    }
    if (!user) {
      req.flash("errors", { message: "Login failed" });
      return res.redirect("/login");
    }
    req.logIn(user, (err) => {
      if (err) {
        next(err);
      }
      res.redirect("/");
    });
  })(req, res, next);
};

exports.logout = (req, res, next) => {
  req.logout();
  return res.redirect("/");
};
