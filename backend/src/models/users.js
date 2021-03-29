'use strict'
const mongoose = require('mongoose')

// @ts-ignore
const userSchema = mongoose.Schema({
  user_type: {
    type: String,
    enum: ['professional', 'client'],
    required: true
  },
  name: {
    type: String,
    length: 30,
    required: true
  },
  email: {
    type: String,
    length: 60,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  is_email_verified: {
    type: Boolean,
    default: false
  },
  profile_picture: {
    type: String,
    default: 'https://res.cloudinary.com/djploevtk/image/upload/v1616000040/d655u1nbfb43p4u80so2.png'
  },
  mobile_number: {
    type: String
  },
  is_mobile_verified: {
    type: Boolean,
    default: false
  },
  stripe_id: {
    type: String
  },
  address: {
    type: String
  },
  experience: {
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

const model = mongoose.model('user', userSchema, 'users')
module.exports = model