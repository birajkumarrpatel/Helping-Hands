'use strict'
const mongoose = require('mongoose')

// @ts-ignore
const userSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Types.ObjectId,
    ref: 'users',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    }
  },
  work_image: {
    type: Array
  },
  price: {
    type: Number
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

const model = mongoose.model('work', userSchema, 'works')
module.exports = model