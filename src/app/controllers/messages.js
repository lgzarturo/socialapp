const Message = require("../../model/message/Message");

exports.sendMessage = (req, res, next) => {
  console.log(req.body);
  const { text } = req.body;
  if (!text) {
    req.flash("errors", { message: "Message can't be empty" });
    return res.redirect("/");
  }
  const message = new Message({
    text,
    user: req.user._id,
  });
  message
    .save()
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      next(err);
    });
};

exports.getMessageByUser = (userIds) => {
  return Message.find({ user: { $in: userIds } })
    .sort({ createdAt: -1 })
    .populate("user");
};
