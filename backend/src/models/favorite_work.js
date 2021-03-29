'use strict'
const mongoose = require('mongoose')

// @ts-ignore
const userSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Types.ObjectId,
    ref: 'users',
    required: true
  },
  is_fav: {
    type: Boolean,
    required: true
  },
  work_id: {
    type: mongoose.Types.ObjectId,
    ref: 'works',
    required: true
  },
  is_deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date,
    default: null,
  },
},
  {
    timestamps: true,
  }
)

const model = mongoose.model('favorite_work', userSchema, 'favorite_works')
module.exports = model