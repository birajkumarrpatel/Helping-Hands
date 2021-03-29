'use strict'
const healthCheck = require('./healthCheck')
const users = require('./users')
const professional = require('./professional')
const payments = require('./payment')

module.exports = (app) => {
    app.use('/api', healthCheck)
    app.use('/api/user', users)
    app.use('/api/professional', professional)
    app.use('/api/payment', payments)
}

