// @ts-nocheck

'use strict'
const usersRepo = require('../repositories/users')
const worksRepo = require('../repositories/works')
const meetingsRepo = require('../repositories/meetings')
const paymentsRepo = require('../repositories/payment')

const stripe = require('../config/stripe-handler')
const joiSchema = require('../utils/joi-schema')
const { joiValidatorHandler, sendEmail } = require('../utils/utils')
const { Types } = require('mongoose')

const createStripeCustomer = async (jsonData) => {
  try {
    const customerResponse = await stripe.customers.create(jsonData)
    return customerResponse
  } catch (error) {
    throw error
  }
}

module.exports.processPayment = async (body) => {

  joiValidatorHandler(joiSchema.processPaymentJoiSchema, body)

  const [userData = null] = await usersRepo.findDataV2({ _id: Types.ObjectId(body.user), is_deleted: false })
  if (!userData) {
    throw { msg: 'No user found with provided request' }
  }

  const [workData = null] = await worksRepo.findData({ _id: Types.ObjectId(body.work_id), is_deleted: false })
  if (!workData) {
    throw { msg: 'Work data not found' }
  }

  const [professionalData = null] = await usersRepo.findDataV2({
    _id: Types.ObjectId(workData.user_id),
    user_type: 'professional'
  })
  if (!professionalData) {
    throw { msg: 'No profession\'s data found' }
  }

  let stripeId
  if (!userData.stripe_id) {
    const stripeResponse = await createStripeCustomer({
      name: userData.name || 'User',
      email: userData.email,
      description: 'Helping Hands ' + userData._id
    })
    stripeId = stripeResponse.id
    await usersRepo.updateData({ _id: Types.ObjectId(body.user) }, { $set: { stripe_id: stripeId } })
  } else {
    stripeId = userData.stripe_id
  }

  const paymentResponse = await stripe.charges.create({
    source: body.source,
    currency: body.currency,
    amount: body.amount
  })

  const paymentId = Types.ObjectId()
  await paymentsRepo.createData({
    _id: paymentId,
    user: Types.ObjectId(body.user),
    status: paymentResponse.status,
    professional_id: Types.ObjectId(workData.user_id),
    amount: paymentResponse.amount / 100,
    currency: paymentResponse.currency,
    payment_response: paymentResponse
  })

  await meetingsRepo.createData({
    user: Types.ObjectId(body.user),
    status: "pending",
    work_id: Types.ObjectId(workData._id),
    professional_id: Types.ObjectId(workData.user_id),
    payment_id: paymentId,
    selected_date: new Date(body.selected_date)
  })

  const mailOptions = {
    to: professionalData['email'],
    from: process.env.SMTP_USER,
    subject: 'Helping Hands - New Meeting Booked',
    html: `Hello ${professionalData['name']},<br>
      ${userData['name']} has booked a meeting with you. Please plan your work according to it.<br><br>
      Thanks and Regards,<br>
      Helping Hands Team`
  }
  await sendEmail(mailOptions)

  return []
}