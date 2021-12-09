const mongoose = require('mongoose')

const Schema = mongoose.Schema

const FriendSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true
    },
    follower: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true
    }
  },
  {
    timestamps: true
  }
)

FriendSchema.index({
  user: 1,
  follower: 1
})

module.exports = mongoose.model('Friend', FriendSchema)
