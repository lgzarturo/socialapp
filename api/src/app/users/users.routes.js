const express = require("express");
const _ = require("underscore");
const uuidv4 = require("uuid/v4");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const config = require("../../config");
const log = require("../../config/logger");
const userValidation = require("./users.validate").userValidate;
const loginValidation = require("./users.validate").loginValidate;
const userController = require("./users.controller");
const handleErrors = require("../../handler/errors").process;
const { UserExistsError, IncorrectCredentialsError } = require("./users.error");
const jwtAuthenticate = passport.authenticate("jwt", { session: false });

const userRouter = express.Router();

function transformEmailToLowercase(req, res, next) {
  req.body.email && (req.body.email = req.body.email.toLowerCase());
  next();
}

function createToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    config.jwt.secret,
    {
      expiresIn: config.jwt.expiresIn,
    }
  );
}

function hideFields(user) {
  const data = {
    _id: user._id || user.id,
    email: user.email,
    name: user.name,
    biography: user.biography,
    portrait: user.portrait,
    followers: user.followers,
    numFollowers: user.followers.length - 1,
    following: user.following,
    numFollowing: user.following.length - 1,
  };
  console.info(data);
  return data;
}

userRouter.get(
  "/",
  handleErrors((req, res) => {
    return userController.getUsers().then((users) => {
      res.json(users.map(hideFields));
    });
  })
);

userRouter.get(
  "/explore",
  [jwtAuthenticate],
  handleErrors(async (req, res) => {
    //userController.
  })
);

userRouter.get(
  "/whoami",
  [jwtAuthenticate],
  handleErrors(async (req, res) => {
    res.json(hideFields(req.user));
  })
);

userRouter.get(
  "/:username",
  [jwtAuthenticate],
  handleErrors(async (req, res) => {
    const { username } = req.params;
    const user = await userController.getUser({ username }, req.user.id);

    if (!user) {
      let err = new Error("User not found");
      err.status = 404;
      throw err;
    }
    res.json(hideFields(user));
  })
);

userRouter.post(
  "/signup",
  [userValidation, transformEmailToLowercase],
  handleErrors(async (req, res) => {
    let user = req.body;
    const userExists = await userController.exists(user.email);
    if (userExists) {
      log.warn(`User with email ${user.email} already exists`);
      throw new UserExistsError();
    }
    const passwordHashed = await bcrypt.hash(user.password, 10);
    const userCreated = await userController.create(user, passwordHashed);
    if (!userCreated) {
      log.error(`Error creating user ${user.email}`);
      throw new Error("User not created");
    }
    res.status(201).json({
      token: createToken(userCreated._id),
      user: hideFields(userCreated),
    });
    return;
  })
);

userRouter.post(
  "/login",
  [loginValidation, transformEmailToLowercase],
  handleErrors(async (req, res) => {
    let user = req.body;
    let userFound = await userController.getUser({ email: user.email });
    if (!userFound) {
      log.warn(`User with email ${user.email} not found`);
      throw new IncorrectCredentialsError();
    }
    let passwordMatch = await bcrypt.compare(user.password, userFound.password);
    if (!passwordMatch) {
      log.warn(`User with email ${user.email} not found`);
      throw new IncorrectCredentialsError();
    }
    let token = createToken(userFound.id);
    log.info(`User with email ${user.email} logged in`);
    res.status(200).json({ token, user: hideFields(userFound) });
  })
);

userRouter.post(
  "/upload",
  [jwtAuthenticate],
  handleErrors(async (req, res) => {
    res.status(200).json({
      message: "Uploaded",
    });
  })
);

module.exports = userRouter;
