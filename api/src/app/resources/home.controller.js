const messageController = require('../messages/messages.controller')

exports.getHome = (req, res) => {
  if (req.user) {
    messageController.getMessageByUser(req.user.following).then((messages) => {
      res.status(200).json({ messages })
    })
  }
}
