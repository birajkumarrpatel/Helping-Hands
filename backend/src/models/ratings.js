'use strict'
const mongoose = require('mongoose')

// @ts-ignore
const userSchema = mongoose.Schema({
  meeting_id: {
    type: mongoose.Types.ObjectId,
    ref: 'meetings',
    required: true
  },
  work_id: {
    type: mongoose.Types.ObjectId,
    ref: 'works',
    required: true
  },
  user_id: {
    type: mongoose.Types.ObjectId,
    ref: 'users',
    required: true
  },
  professional_id: {
    type: mongoose.Types.ObjectId,
    ref: 'users',
    required: true
  },
  rate: {
    type: Number,
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

const model = mongoose.model('rating', userSchema, 'ratings')
module.exports = model