const messageController = require("./messages");

exports.getHome = (req, res) => {
  if (req.user) {
    messageController.getMessageByUser(req.user.following).then((messages) => {
      res.render("home", {
        messages,
      });
    });
  } else {
    res.render("home");
  }
};
