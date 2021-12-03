const Message = require("./messages.model");

exports.sendMessage = (req, res, next) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ message: "Message can't be empty" });
  }
  const message = new Message({
    text,
    user: req.user._id,
  });
  message
    .save()
    .then(() => {
      res.status(200).json({ message: "Message sent" });
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
