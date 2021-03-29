'use strict'
const healthCheckService = require('../service/healthCheck')
const logger = require('../middlewares/logger')
const utils = require('../utils/utils')

const healthCheck = async (req, res) => {
    try {
        const result = await healthCheckService.healthCheck()
        return res.send(utils.responseGenerators(result, utils.httpStatusCodes.OK, 'Health Check Success', null));
    } catch (error) {
        logger.error('Error while adding new patter: %j %s', error, error)
        if (error && error.msg) {
            return res.status(500).send(utils.responseGenerators([], error.msg, true, ''))
        }
        return res.status(500).send(utils.responseGenerators([], 'Fail', true, error))
    }
}

module.exports = {
    healthCheck
}