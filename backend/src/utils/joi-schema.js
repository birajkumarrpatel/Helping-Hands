'use strict'
const joi = require('joi')

module.exports.userRegistration = joi.object().keys({
  user_type: joi.string().valid('professional', 'client').required(),
  name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().pattern(/[a-zA-Z0-9@!£$%&*]*/).min(8).required().error(new Error('Password must be 8 character long and it should contain a-z, A-Z, 0-9 or @!£$%&*'))
})

module.exports.loginJoiSchema = joi.object().keys({
  user_type: joi.string().valid('professional', 'client').required(),
  email: joi.string().email().required(),
  password: joi.string().pattern(/[a-zA-Z0-9@!£$%&*]*/).min(8).required().error(new Error('Password must be 8 character long and it should contain a-z, A-Z, 0-9 or @!£$%&*'))
})

module.exports.forgotPasswordJoiSchema = joi.object().keys({
  email: joi.string().email().required(),
  user_type: joi.string().valid('professional', 'client').required()
})

module.exports.changePasswordJoiSchema = joi.object().keys({
  _id: joi.string().required(),
  currentPassword: joi.string().pattern(/[a-zA-Z0-9@!£$%&*]*/).min(8).required().error(new Error('Password must be 8 character long and it should contain a-z, A-Z, 0-9 or @!£$%&*')),
  newPassword: joi.string().pattern(/[a-zA-Z0-9@!£$%&*]*/).min(8).required().error(new Error('Password must be 8 character long and it should contain a-z, A-Z, 0-9 or @!£$%&*'))
})

module.exports.updateUserProfile = joi.object().keys({
  user_type: joi.string().valid('professional', 'client').required(),
  _id: joi.string().required(),
  name: joi.string(),
  mobile_number: joi.string(),
  is_mobile_verified: joi.boolean().strict(),
  address: joi.string(),
  experience: joi.number()
}).or('name', 'mobile_number', 'is_profile_verified', 'address', 'experience')

module.exports.addNewWorkJoiSchema = joi.object().keys({
  user_id: joi.string().required(),
  title: joi.string().required(),
  description: joi.string().required(),
  location: joi.object().keys({
    city: joi.string().required(),
    state: joi.string().required(),
    country: joi.string().required()
  }),
  work_image: joi.array().min(1).required(),
  price: joi.number().strict().max(999999).required()
})

module.exports.listWorksJoiSchema = joi.object().keys({
  _id: joi.string().required(),
  search_string: joi.string().allow('', null).default(null)
})

module.exports.updateWorkStatusJoiSchema = joi.object().keys({
  _id: joi.string().required(),
  is_deleted: joi.boolean().strict().required()
})

module.exports.fetchUpcomingListJoiSchema = joi.object().keys({
  _id: joi.string().required()
})

module.exports.addJobToFavJoiSchema = joi.object().keys({
  _id: joi.string().required(),
  work_id: joi.string().required()
})

module.exports.getWorkDetailsJoiSchema = joi.object().keys({
  _id: joi.string().default(null),
  work_id: joi.string().required()
})

module.exports.processPaymentJoiSchema = joi.object().keys({
  user: joi.string().required(),
  work_id: joi.string().required(),
  amount: joi.number().required(),
  currency: joi.string().default('usd'),
  source: joi.string().required(),
  selected_date: joi.string()
})

module.exports.completeMeetingJoiSchema = joi.object().keys({
  meeting_id: joi.string().required(),
  _id: joi.string().required()
})

module.exports.approveMeetingJoiSchema = joi.object().keys({
  meeting_id: joi.string().required(),
  _id: joi.string().required(),
  action: joi.string().valid('accept', 'reject').default('accept')
})

module.exports.meetingsListForUserJoiSchema = joi.object().keys({
  _id: joi.string().required(),
  type: joi.string().valid('scheduled', 'review_required', 'completed').default('scheduled')
})

module.exports.cancelMeetingJoiSchema = joi.object().keys({
  _id: joi.string().required(),
  meeting_id: joi.string().required()
})

module.exports.remindForReviewJoiSchema = joi.object().keys({
  user: joi.string().required(),
  meeting_id: joi.string().required()
})

module.exports.submitReviewJoiSchema = joi.object().keys({
  _id: joi.string().required(),
  meeting_id: joi.string().required(),
  professional_id: joi.string().required(),
  work_id: joi.string().required(),
  work_rate: joi.number().strict().required(),
})

