'use strict'
const paymentService = require('../service/payment')
const logger = require('../middlewares/logger')
const utils = require('../utils/utils')

const processPayment = async (req, res) => {
    try {
        const body = req.body
        const result = await paymentService.processPayment(body)
        return res.send(utils.responseGenerators(result, utils.httpStatusCodes.OK, 'Payment captured successfully', null));
    } catch (error) {
        logger.error('Error while getting all products: %j %s', error, error)
        const errMsg = typeof error === 'string' ? error : error.msg ? error.msg : 'Error while fetching profile'
        return res.status(500).send(utils.responseGenerators([], 'Error while processing for payment', errMsg, error))
    }
}

module.exports = {
    processPayment
}