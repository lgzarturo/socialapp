const crypto = require('crypto')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

const config = require('../../config')

const Schema = mongoose.Schema

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      minlength: 4
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    biography: {
      type: String,
      trim: true
    },
    portrait: {
      type: String,
      trim: true,
      default: null
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true
    }
  }
)

UserSchema.pre('save', async function (next) {
  const user = this
  const userId = user._id
  if (user.followers.indexOf(userId) === -1) {
    user.followers.push(userId)
  }
  if (user.following.indexOf(userId) === -1) {
    user.following.push(userId)
  }
  if (!user.isModified('password')) return next()
  const salt = await bcrypt.genSalt(config.saltRounds)
  user.password = await bcrypt.hash(user.password, salt)
  next()
})

UserSchema.methods.isValidPassword = async function (newPassword) {
  const user = this
  return await bcrypt.compare(newPassword, user.password)
}

UserSchema.methods.avatar = function (size = 55) {
  const user = this
  const hash = user.email.split('@')[0]
  const md5 = crypto.createHash('md5').update(hash).digest('hex')
  const avatar = `https://avatars.dicebear.com/api/male/${size}-${md5}.svg`
  return avatar
}

UserSchema.virtual('sizeFollowers', {
  ref: 'friendship',
  localField: '_id',
  foreignField: 'follower',
  count: true
})

UserSchema.virtual('sizeFollowings', {
  ref: 'friendship',
  localField: '_id',
  foreignField: 'user',
  count: true
})

UserSchema.virtual('isFollowing')
  .get(function () {
    if (this._following == null) {
      return false
    }
    return this._following
  })
  .set(function (value) {
    this._following = value
  })

module.exports = mongoose.model('User', UserSchema)
