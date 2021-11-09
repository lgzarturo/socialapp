const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const passport = require("passport");
const passportConfig = require("./app/config/passport");
const userController = require("./app/controllers/users");

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

app.get("/", (req, res) => {
  req.session.count = req.session.count ? req.session.count + 1 : 1;
  res.status(200).json({ message: `Hola has visto esta página ${req.session.count}` });
});
app.post("/signup", userController.signup);
app.post("/login", userController.login);
app.get("/logout", passportConfig.isAuthenticated, userController.logout);
app.get("/profile", passportConfig.isAuthenticated, (req, res) => {
  res.status(200).json(req.user);
});
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
