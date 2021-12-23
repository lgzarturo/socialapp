const Like = require('./likes.model')
const Post = require('../posts/posts.model')
const code = require('http-status-codes').StatusCodes

exports.getLikes = async () => {
  return Like.find({})
}

exports.getLikesByPost = async (postId) => {
  return Like.find({ post: postId })
}

exports.getLikesByPostAndUser = async (postId, userId) => {
  return Like.findOne({
    post: postId,
    user: userId
  })
}

exports.addLike = async (postId, userId) => {
  const hasLiked = await Like.findOne({
    post: postId,
    user: userId
  })
  if (hasLiked) {
    let error = new Error(`You have already liked this post`)
    error.status = code.BAD_REQUEST
    throw error
  }
  const post = await Post.findOneAndUpdate(
    {
      _id: postId
    },
    {
      $inc: { likes: 1 }
    }
  )
  if (!post) {
    let error = new Error(`Post not found`)
    error.status = code.NOT_FOUND
    throw error
  }
  return new Like({
    post: postId,
    user: userId
  }).save()
}

exports.removeLike = async (postId, userId) => {
  const like = await Like.findOneAndRemove({
    post: postId,
    user: userId
  })
  if (!like) {
    let error = new Error(`Like not found`)
    error.status = code.NOT_FOUND
    throw error
  }
  const post = await Post.findOneAndUpdate(
    {
      _id: postId
    },
    {
      $inc: { likes: -1 }
    }
  )
  if (!post) {
    let error = new Error(`Post not found`)
    error.status = code.NOT_FOUND
    throw error
  }
  return like
}
