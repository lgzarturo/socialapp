const mongoose = require('mongoose')

const Schema = mongoose.Schema

const PostSchema = new Schema(
  {
    url: {
      type: String,
      required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
      index: true
    },
    caption: {
      type: String,
      maxlength: 200
    },
    numLikes: {
      type: Number,
      min: 0,
      default: 0
    },
    numComments: {
      type: Number,
      min: 0,
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true
    }
  }
)

PostSchema.virtual('comments', {
  ref: 'Message', // The model to use
  localField: '_id', // Find people where `localField`
  foreignField: 'post', // is equal to `foreignField`
  // If `justOne` is true, 'members' will be a single doc as opposed to
  // an array. `justOne` is false by default.
  justOne: false,
  options: { sort: { createdAt: 1 } } // Query options, see http://bit.ly/mongoose-query-options
})

PostSchema.virtual('isLike')
  .get(function () {
    if (this._isLike == null) {
      return false
    }

    return this._isLike
  })
  .set(function (v) {
    this._isLike = v
  })

module.exports = mongoose.model('Post', PostSchema)
