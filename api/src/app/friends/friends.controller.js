const Friend = require('./friends.model')

exports.getFriends = async () => {
  return Friend.find({})
}

exports.getFriend = async (userId, followerId) => {
  return Friend.findOne({ user: userId, follower: followerId })
}

exports.getFollowers = async (userId) => {
  return Friend.find({ user: userId })
}

exports.getFollowings = async (userId) => {
  return Friend.find({ follower: userId })
}

exports.createFriend = async (userId, followerId) => {
  const friend = new Friend({ user: userId, follower: followerId })
  return friend.save()
}

exports.deleteFriend = async (userId, followerId) => {
  return Friend.findOneAndRemove({ user: userId, follower: followerId })
}
