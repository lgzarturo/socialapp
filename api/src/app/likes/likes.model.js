const mongoose = require('mongoose')

const Schema = mongoose.Schema

const LikeSchema = new mongoose.Schema(
  {
    post: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Post',
      index: true
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }
  },
  { timestamps: true }
)

LikeSchema.index({ post: 1, user: 1 })

module.exports = mongoose.model('Like', LikeSchema)
