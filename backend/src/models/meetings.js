'use strict'
const mongoose = require('mongoose')

// @ts-ignore
const userSchema = mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'users'
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "completed", "professional_completed", "client_cancelled"],
    default: "pending"
  },
  work_id: {
    type: mongoose.Types.ObjectId,
    ref: 'works'
  },
  professional_id: {
    type: mongoose.Types.ObjectId,
    ref: 'users'
  },
  payment_id: {
    type: mongoose.Types.ObjectId,
    ref: 'payments'
  },
  completed_on: {
    type: Date
  },
  selected_date: {
    type: Date
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

const model = mongoose.model('meeting', userSchema, 'meetings')
module.exports = model