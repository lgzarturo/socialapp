const path = require("path");
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const passport = require("passport");
const passportConfig = require("./app/config/passport");
const userController = require("./app/controllers/users");
const messageController = require("./app/controllers/messages");
const profileController = require("./app/controllers/profiles");
const homeController = require("./app/controllers/home");
const exploreController = require("./app/controllers/explore");

const MONGO_URL = "mongodb://127.0.0.1:27017/socialapp";
const app = express();

mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on("error", (err) => {
  throw err;
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: MONGO_URL,
      ttl: 7 * 24 * 60 * 60, // 1 day
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(
  "/css",
  express.static(
    path.join(__dirname, "..", "node_modules", "bootstrap", "dist", "css")
  )
);
app.use(
  "/js",
  express.static(
    path.join(__dirname, "..", "node_modules", "bootstrap", "dist", "js")
  )
);
app.use(
  "/js",
  express.static(path.join(__dirname, "..", "node_modules", "jquery", "dist"))
);
app.use("/public", express.static(path.join(__dirname, "..", "public")));

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.get("/", homeController.getHome);
app.get("/explore", exploreController.getExplore);
app.post("/explore", exploreController.postExplore);
app.get("/me/profile", profileController.getMeProfile);
app.get("/profile/:id", profileController.getProfile);
app.get(
  "/follow/:id",
  passportConfig.isAuthenticated,
  profileController.follow
);
app.get(
  "/unfollow/:id",
  passportConfig.isAuthenticated,
  profileController.unfollow
);

app.get("/signup", userController.getSignup);
app.post("/signup", userController.signup);
app.get("/login", userController.getLogin);
app.post("/login", userController.login);
app.get("/logout", passportConfig.isAuthenticated, userController.logout);
app.get("/profile", passportConfig.isAuthenticated, (req, res) => {
  res.status(200).json(req.user);
});

app.post(
  "/message",
  passportConfig.isAuthenticated,
  messageController.sendMessage
);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
