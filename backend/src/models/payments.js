'use strict'
const mongoose = require('mongoose')

// @ts-ignore
const userSchema = mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'users'
  },
  status: {
    type: String
  },
  professional_id: {
    type: mongoose.Types.ObjectId,
    ref: 'users'
  },
  amount: {
    type: Number
  },
  currency: {
    type: String
  },
  payment_response: {
    type: Object
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

const model = mongoose.model('payment', userSchema, 'payments')
module.exports = model