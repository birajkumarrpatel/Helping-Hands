'use strict'
const router = require('express').Router()
const healthCheckCtrl = require('../controller/healthCheck')

router.get('/health', healthCheckCtrl.healthCheck)

module.exports = router