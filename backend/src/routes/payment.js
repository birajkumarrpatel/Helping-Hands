'use strict'
const router = require('express').Router()
const paymentCtrl = require('../controller/payment')

router.post('/process/payment', paymentCtrl.processPayment) 

module.exports = router