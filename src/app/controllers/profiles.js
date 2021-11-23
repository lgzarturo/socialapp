const User = require("../../model/user/User");
const messageController = require("../controllers/messages");

exports.getMeProfile = (req, res) => {
  getProfile(req.user._id)
    .then(([user, messages]) => {
      res.render("users/profile", {
        user,
        messages,
        itsFollowing: false,
        hideFollowButton: true,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProfile = (req, res) => {
  const userId = req.params.id;
  const itsFollowing = req.user
    ? req.user.following.indexOf(userId) !== -1
    : false;
  const hideFollowButton = req.user ? req.user._id.toString() === userId : true;

  if (req.user && req.user._id.equals(userId)) {
    return res.redirect("/me/profile");
  }

  getProfile(userId)
    .then(([user, messages]) => {
      res.render("users/profile", {
        user,
        messages,
        itsFollowing,
        hideFollowButton,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.follow = (req, res) => {
  const followUserId = req.params.id;
  const userId = req.user._id;

  Promise.all([
    addFollowing(userId, followUserId),
    addFollower(userId, followUserId),
  ]).then(() => {
    res.redirect(`/profile/${followUserId}`);
  });
};

exports.unfollow = (req, res) => {
  const followUserId = req.params.id;
  const userId = req.user._id;

  Promise.all([
    removeFollowing(userId, followUserId),
    removeFollower(userId, followUserId),
  ]).then(() => {
    res.redirect(`/profile/${followUserId}`);
  });
};

const getProfile = (userId) => {
  return Promise.all([
    User.findOne({ _id: userId }),
    messageController.getMessageByUser([userId]),
  ]);
};

const addFollowing = (userId, followUserId) => {
  return User.findOneAndUpdate(
    { _id: userId },
    { $push: { following: followUserId } }
  );
};

const addFollower = (userId, followUserId) => {
  return User.findOneAndUpdate(
    { _id: followUserId },
    { $push: { followers: userId } }
  );
};

const removeFollowing = (userId, followUserId) => {
  return User.findOneAndUpdate(
    { _id: userId },
    { $pull: { following: followUserId } }
  );
};

const removeFollower = (userId, followUserId) => {
  return User.findOneAndUpdate(
    { _id: followUserId },
    { $pull: { followers: userId } }
  );
};
