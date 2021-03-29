'use strict'


const configureStripe = require('stripe')
const key = process.env.STRIPE_SECRET_KEY
const stripe = configureStripe(key)

module.exports = stripe
