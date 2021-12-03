const passport = require("passport");
const User = require("./users.model");
const code = require("http-status-codes").StatusCodes;

exports.getAll = () => {
  return User.find({});
};

exports.getById = (id) => {
  return User.findById(id);
};

exports.create = (user) => {
  return new User({
    ...user,
  }).save();
};

exports.exists = (email) => {
  return new Promise((resolve, reject) => {
    User.find({ email })
      .then((users) => {
        resolve(users.length > 0);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.getUserQuery = (query, authUserId) => {
  const user = User.findOne(query).populate("followers").populate("following");
  if (authUserId && user) {
    user.followers = user.followers.filter((follower) => {
      return follower.id !== authUserId;
    });
    user.followings = user.followings.filter((following) => {
      return following.id !== authUserId;
    });
  }
  return user;
};

exports.getUser = (
  { username: username, id: id, email: email },
  authUserId
) => {
  if (username) {
    return this.getUserQuery({ username }, authUserId);
  } else if (id) {
    return this.getUserQuery({ _id: id }, authUserId);
  } else if (email) {
    return this.getUserQuery({ email }, authUserId);
  } else {
    throw new Error("No user id or username or email provided");
  }
};

exports.signup = (req, res, next) => {
  const { email, password, name, biography } = req.body;
  if (!email || !password || !name || !biography) {
    req.flash("errors", { message: "All fields are required" });
    return res
      .status(code.BAD_REQUEST)
      .json({ message: "All fields are required" });
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
      return res
        .status(code.BAD_REQUEST)
        .json({ message: "User already exists" });
    }

    user.save((err, result) => {
      if (err) {
        next(err);
      }
      req.logIn(result, (err) => {
        if (err) {
          next(err);
        }
        res.status(code.OK).json({ message: "User created" });
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
      req.flash("errors", { message: "Login failed" });
      return res.status(code.BAD_REQUEST).json({ message: "Login failed" });
    }
    req.logIn(user, (err) => {
      if (err) {
        next(err);
      }
      return res.status(code.OK).json({ message: "Login successful" });
    });
  })(req, res, next);
};

exports.logout = (req, res, next) => {
  req.logout();
  res.status(code.OK).json({ message: "Logout successful" });
};
