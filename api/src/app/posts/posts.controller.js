const AWS = require('aws-sdk')
const fs = require('fs').promises
const config = require('../../config')
const path = require('path')
const Friend = require('../friends/friends.model')

const Post = require('./posts.model')

var s3Client = new AWS.S3({ ...config.s3 })

exports.createPost = async (post, userId) => {
  return new Post({
    ...post,
    user: userId
  }).save()
}

exports.getPosts = async () => {
  return Post.find({})
    .populate('user', '_id email')
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
        select: '_id email portrait'
      }
    })
    .sort({ createdAt: -1 })
}

exports.getFeedPost = async (userId, queryDateBefore) => {
  const friendship = await Friend.find({ user: userId }, 'follower')
  const userFollowersId = friendship.map((friend) => friend.follower)
  const posts = await Post.find({
    user: userFollowersId,
    createdAt: { $lt: queryDateBefore }
  })
    .sort({ createdAt: -1 })
    .limit(3)
    .populate('user', '_id email portrait')
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
        select: '_id email portrait'
      }
    })
  return posts
}

exports.addLike = async (userId, posts) => {
  const postIds = posts.map((post) => post._id)
  const likes = await Like.find({
    user: userId,
    post: { $in: postIds }
  })
  const likesIds = likes.map((like) => like.post)
  posts.forEach((post) => {
    if (likesIds.some((id) => id.equals(post._id))) {
      post.hasLiked = true
    }
  })
  return posts
}

exports.getPostsByUser = async (userId) => {
  const posts = await Post.find({ user: userId })
  return posts
}

exports.getPostByUser = async (postId, userId) => {
  const post = await Post.findById(postId)
    .populate('user', '_id email portrait')
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
        select: '_id email'
      }
    })

  if (!post) {
    let error = new Error(`Post not found`)
    error.status = code.NOT_FOUND
    throw error
  }
  const posts = await this.addLike(userId, [post])
  return posts[0]
}

exports.createPost = async (post, userId) => {
  return await new Post({
    ...post,
    user: userId
  }).save()
}

exports.saveImage = async (image, filename) => {
  if (!config.saveImagesInS3) {
    const pathServer = path.join(
      __dirname,
      '..',
      '..',
      '..',
      'public',
      'images',
      filename
    )
    await fs.writeFile(pathServer, image)
    return `/images/${filename}`
  }

  const pathS3 = `${config.s3.bucket}/${filename}`
  await s3Client
    .putObject({
      Bucket: config.s3BucketName,
      Key: pathS3,
      Body: image,
      ACL: 'public-read'
    })
    .promise()
  return `${config.s3BucketPath}${pathS3}`
}
