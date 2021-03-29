'use strict'
const professionalService = require('../service/professional')
const logger = require('../middlewares/logger')
const utils = require('../utils/utils')

module.exports.addNewWork = async (req, res) => {
    try {
        const body = req.body
        const result = await professionalService.addNewWork(body)
        return res.send(utils.responseGenerators(result, utils.httpStatusCodes.OK, 'New work added successfully', null));
    } catch (error) {
        logger.error('Error while user registration: %j %s', error, error)
        const errMsg = typeof error === 'string' ? error : error.msg ? error.msg : 'Error while adding new work.'
        return res.status(utils.httpStatusCodes.INTERNAL_SERVER_ERROR).send(utils.responseGenerators([], utils.httpStatusCodes.INTERNAL_SERVER_ERROR, errMsg, error))
    }
}

module.exports.listWorks = async (req, res) => {
    try {
        const body = req.body
        const result = await professionalService.listWorks(body)
        return res.send(utils.responseGenerators(result, utils.httpStatusCodes.OK, 'Work list fetched successfully', null));
    } catch (error) {
        logger.error('Error while user registration: %j %s', error, error)
        const errMsg = typeof error === 'string' ? error : error.msg ? error.msg : 'Error while fetching work list.'
        return res.status(utils.httpStatusCodes.INTERNAL_SERVER_ERROR).send(utils.responseGenerators([], utils.httpStatusCodes.INTERNAL_SERVER_ERROR, errMsg, error))
    }
}

module.exports.updateWorkStatus = async (req, res) => {
    try {
        const body = req.body
        const result = await professionalService.updateWorkStatus(body)
        return res.send(utils.responseGenerators(result, utils.httpStatusCodes.OK, `Job ${body.is_deleted ? 'deactivated' : 'activated'} successfully`, null));
    } catch (error) {
        logger.error('Error while user registration: %j %s', error, error)
        const errMsg = typeof error === 'string' ? error : error.msg ? error.msg : 'Error while fetching work list.'
        return res.status(utils.httpStatusCodes.INTERNAL_SERVER_ERROR).send(utils.responseGenerators([], utils.httpStatusCodes.INTERNAL_SERVER_ERROR, errMsg, error))
    }
}

module.exports.fetchUpcomingList = async (req, res) => {
    try {
        const body = req.body
        const result = await professionalService.fetchUpcomingList(body)
        return res.send(utils.responseGenerators(result, utils.httpStatusCodes.OK, `Upcoming jobs list successfully`, null));
    } catch (error) {
        logger.error('Error while user registration: %j %s', error, error)
        const errMsg = typeof error === 'string' ? error : error.msg ? error.msg : 'Error while fetching upcoming jobs.'
        return res.status(utils.httpStatusCodes.INTERNAL_SERVER_ERROR).send(utils.responseGenerators([], utils.httpStatusCodes.INTERNAL_SERVER_ERROR, errMsg, error))
    }
}

module.exports.fetchMeetingRequestList = async (req, res) => {
    try {
        const body = req.body
        const result = await professionalService.fetchMeetingRequestList(body)
        return res.send(utils.responseGenerators(result, utils.httpStatusCodes.OK, `Meeting for approval request fetched successfully`, null));
    } catch (error) {
        logger.error('Error while user registration: %j %s', error, error)
        const errMsg = typeof error === 'string' ? error : error.msg ? error.msg : 'Error while fetching meeting list for approval.'
        return res.status(utils.httpStatusCodes.INTERNAL_SERVER_ERROR).send(utils.responseGenerators([], utils.httpStatusCodes.INTERNAL_SERVER_ERROR, errMsg, error))
    }
}

module.exports.fetchCompletedList = async (req, res) => {
    try {
        const body = req.body
        const result = await professionalService.fetchCompletedList(body)
        return res.send(utils.responseGenerators(result, utils.httpStatusCodes.OK, `Completed jobs list successfully`, null));
    } catch (error) {
        logger.error('Error while user registration: %j %s', error, error)
        const errMsg = typeof error === 'string' ? error : error.msg ? error.msg : 'Error while fetching completed jobs.'
        return res.status(utils.httpStatusCodes.INTERNAL_SERVER_ERROR).send(utils.responseGenerators([], utils.httpStatusCodes.INTERNAL_SERVER_ERROR, errMsg, error))
    }
}

module.exports.completeMeeting = async (req, res) => {
    try {
        const body = req.body
        const result = await professionalService.completeMeeting(body)
        return res.send(utils.responseGenerators(result, utils.httpStatusCodes.OK, `Meeting marked as completed`, null));
    } catch (error) {
        logger.error('Error while user registration: %j %s', error, error)
        const errMsg = typeof error === 'string' ? error : error.msg ? error.msg : 'Error while completing meeting.'
        return res.status(utils.httpStatusCodes.INTERNAL_SERVER_ERROR).send(utils.responseGenerators([], utils.httpStatusCodes.INTERNAL_SERVER_ERROR, errMsg, error))
    }
}

module.exports.approveMeeting = async (req, res) => {
    try {
        const body = req.body
        const result = await professionalService.approveMeeting(body)
        return res.send(utils.responseGenerators(result, utils.httpStatusCodes.OK, `Meeting approved successfully`, null));
    } catch (error) {
        logger.error('Error while user registration: %j %s', error, error)
        const errMsg = typeof error === 'string' ? error : error.msg ? error.msg : 'Error while approving meeting.'
        return res.status(utils.httpStatusCodes.INTERNAL_SERVER_ERROR).send(utils.responseGenerators([], utils.httpStatusCodes.INTERNAL_SERVER_ERROR, errMsg, error))
    }
}

module.exports.remindForReview = async (req, res) => {
    try {
        const body = req.body
        const result = await professionalService.remindForReview(body)
        return res.send(utils.responseGenerators(result, utils.httpStatusCodes.OK, `Reminder send successfully`, null));
    } catch (error) {
        logger.error('Error while user registration: %j %s', error, error)
        const errMsg = typeof error === 'string' ? error : error.msg ? error.msg : 'Error while completing meeting.'
        return res.status(utils.httpStatusCodes.INTERNAL_SERVER_ERROR).send(utils.responseGenerators([], utils.httpStatusCodes.INTERNAL_SERVER_ERROR, errMsg, error))
    }
}