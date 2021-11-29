require("dotenv").config();
const path = require("path");

const morgan = require("morgan");
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");

const passportConfig = require("./config/passport");
const log = require("./config/logger");
const config = require("./config");
const authJWT = require("./libs/auth");
const errorHandler = require("./handler/errors");

const userController = require("./app/users/users.controller");
const messageController = require("./app/messages/messages.controller");
const profileController = require("./app/profiles/profiles.controller");
const exploreController = require("./app/resources/explore.controller");

const userRouter = require("./app/users/users.routes");

const PUBLIC_DIR = path.join(__dirname, "..", "public");
const IMAGES_DIR = path.join(PUBLIC_DIR, "images");

let server;

// Connect to MongoDB
mongoose.Promise = global.Promise;
mongoose.connect(config.database, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.connection.on("error", (err) => {
  log.error("Error en la conexión con la base de datos.");
  throw err;
});

// Create Express server
const app = express();
app.use(express.json());
app.use(express.raw({ type: config.typeImage, limit: config.maxImageSize }));
app.use(express.urlencoded({ extended: true }));

// Logging configuration
app.use(
  morgan(config.logFormat, {
    stream: {
      write: (message) => log.info(message.trim()),
    },
  })
);

// Passport configuration
passport.use(authJWT);
app.use(passport.initialize());

// Headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", config.cors.origin);
  res.setHeader("Access-Control-Allow-Methods", config.cors.methods);
  res.setHeader("Access-Control-Allow-Headers", config.cors.headers);
  next();
});

// Public files
app.use(express.static(PUBLIC_DIR));
app.use("/images", express.static(IMAGES_DIR));

// Application routes
app.use("/api/v1/users", userRouter);

// API routes (deprecated)
app.post("/api/v1/explore", exploreController.postExplore);
app.post(
  "/api/v1/follow/:id",
  passportConfig.isAuthenticated,
  profileController.follow
);
app.post(
  "/api/v1/unfollow/:id",
  passportConfig.isAuthenticated,
  profileController.unfollow
);
app.post("/api/v1/signup", userController.signup);
app.post("/api/v1/login", userController.login);
app.post(
  "/api/v1/message",
  passportConfig.isAuthenticated,
  messageController.sendMessage
);

// Error handlers
app.use(errorHandler.databaseErrorHandler);
app.use(errorHandler.bodySizeErrorHandler);

if (config.environment === "development") {
  app.use(errorHandler.developmentErrorHandler);
  server = app.listen(config.port, () => {
    log.info(`Aplicación escuchando en el puerto: ${config.port}`);
  });
} else {
  app.use(errorHandler.productionErrorHandler);
  app.listen();
}

module.exports = {
  app,
  server,
};
