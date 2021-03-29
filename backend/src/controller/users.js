'use strict'
const usersService = require('../service/users')
const logger = require('../middlewares/logger')
const utils = require('../utils/utils')

module.exports.register = async (req, res) => {
    try {
        const body = req.body
        const result = await usersService.register(body)
        return res.send(utils.responseGenerators(result, utils.httpStatusCodes.OK, 'You are registered successfully', null));
    } catch (error) {
        logger.error('Error while user registration: %j %s', error, error)
        const errMsg = typeof error === 'string' ? error : error.msg ? error.msg : 'Error while registration.'
        return res.status(utils.httpStatusCodes.INTERNAL_SERVER_ERROR).send(utils.responseGenerators([], utils.httpStatusCodes.INTERNAL_SERVER_ERROR, errMsg, error))
    }
}


module.exports.verifyAccount = async (req, res) => {
    try {
        const userCode = req.query.c
        const result = await usersService.verifyAccount(userCode)
        return res.redirect(result)
    } catch (error) {
        logger.error('Error while user registration: %j %s', error, error)
        const errMsg = typeof error === 'string' ? error : error.msg ? error.msg : 'Error while verifying your account.'
        return res.status(utils.httpStatusCodes.INTERNAL_SERVER_ERROR).send(utils.responseGenerators([], utils.httpStatusCodes.INTERNAL_SERVER_ERROR, errMsg, error))
    }
}

module.exports.changeProfilePicture = async (req, res) => {
    try {
        const files = req.files
        const userCode = req.headers['user_code']
        const result = await usersService.changeProfilePicture(files, userCode)
        // return res.send({ files, body })
        return res.send(utils.responseGenerators(result, utils.httpStatusCodes.OK, 'Profile updated successfully', null));
    } catch (error) {
        logger.error('Error while user registration: %j %s', error, error)
        const errMsg = typeof error === 'string' ? error : error.msg ? error.msg : 'Error while uploading profile picture.'
        return res.status(utils.httpStatusCodes.INTERNAL_SERVER_ERROR).send(utils.responseGenerators([], utils.httpStatusCodes.INTERNAL_SERVER_ERROR, errMsg, error))
    }
}

module.exports.uploadImage = async (req, res) => {
    try {
        const files = req.files
        const userCode = req.headers['user_code']
        const result = await usersService.uploadImage(files, userCode)
        // return res.send({ files, body })
        return res.send(utils.responseGenerators(result, utils.httpStatusCodes.OK, 'Image Uploaded Successfully', null));
    } catch (error) {
        logger.error('Error while user registration: %j %s', error, error)
        const errMsg = typeof error === 'string' ? error : error.msg ? error.msg : 'Error while uploading profile picture.'
        return res.status(utils.httpStatusCodes.INTERNAL_SERVER_ERROR).send(utils.responseGenerators([], utils.httpStatusCodes.INTERNAL_SERVER_ERROR, errMsg, error))
    }
}


module.exports.updateMyProfile = async (req, res) => {
    try {
        const body = req.body
        const result = await usersService.updateMyProfile(body)
        return res.send(utils.responseGenerators(result, utils.httpStatusCodes.OK, 'Profile updated successfully', null));
    } catch (error) {
        logger.error('Error while user registration: %j %s', error, error)
        const errMsg = typeof error === 'string' ? error : error.msg ? error.msg : 'Error while update profile.'
        return res.status(utils.httpStatusCodes.INTERNAL_SERVER_ERROR).send(utils.responseGenerators([], utils.httpStatusCodes.INTERNAL_SERVER_ERROR, errMsg, error))
    }
}

module.exports.login = async (req, res) => {
    try {
        const body = req.body
        const result = await usersService.login(body)
        return res.send(utils.responseGenerators(result, utils.httpStatusCodes.OK, 'Login successfully', null));
    } catch (error) {
        logger.error('Error while login: %j %s', error, error)
        const errMsg = typeof error === 'string' ? error : error.msg ? error.msg : 'Error while login. Please try again'
        return res.status(500).send(utils.responseGenerators([], 'Error while user login', errMsg, error))
    }
}

module.exports.forgotPassword = async (req, res) => {
    try {
        const body = req.body
        const result = await usersService.forgotPassword(body)
        return res.send(utils.responseGenerators(result, utils.httpStatusCodes.OK, 'We have sent an email with your password to your registered email address.', null));
    } catch (error) {
        logger.error('Error while forgotPassword: %j %s', error, error)
        const errMsg = typeof error === 'string' ? error : error.msg ? error.msg : 'Error while forgot password. Please try again'
        return res.status(500).send(utils.responseGenerators([], 'Error while forgot password login', errMsg, error))
    }
}

module.exports.changePassword = async (req, res) => {
    try {
        const body = req.body
        const result = await usersService.changePassword(body)
        return res.send(utils.responseGenerators(result, utils.httpStatusCodes.OK, 'Password changes successfully', null));
    } catch (error) {
        logger.error('Error while changePassword: %j %s', error, error)
        const errMsg = typeof error === 'string' ? error : error.msg ? error.msg : 'Error while changing password'
        return res.status(500).send(utils.responseGenerators([], 'Error while changing password', errMsg, error))
    }
}

module.exports.myProfile = async (req, res) => {
    try {
        const userCode = req.headers['user_code'] || undefined
        const result = await usersService.myProfile(userCode)
        return res.send(utils.responseGenerators(result, utils.httpStatusCodes.OK, 'Profile fetched successfully', null));
    } catch (error) {
        logger.error('Error while getting all products: %j %s', error, error)
        const errMsg = typeof error === 'string' ? error : error.msg ? error.msg : 'Error while fetching profile'
        return res.status(500).send(utils.responseGenerators([], 'Error while fetching profile', errMsg, error))
    }
}

module.exports.loadWorkList = async (req, res) => {
    try {
        const body = req.body
        const result = await usersService.loadWorkList(body)
        return res.send(utils.responseGenerators(result, utils.httpStatusCodes.OK, 'Work list fetched successfully', null));
    } catch (error) {
        logger.error('Error while getting all products: %j %s', error, error)
        const errMsg = typeof error === 'string' ? error : error.msg ? error.msg : 'Error while fetching profile'
        return res.status(500).send(utils.responseGenerators([], 'Error while fetching profile', errMsg, error))
    }
}

module.exports.addJobToFav = async (req, res) => {
    try {
        const body = req.body
        const result = await usersService.addJobToFav(body)
        return res.send(utils.responseGenerators(result, utils.httpStatusCodes.OK, 'Data updated successfully', null));
    } catch (error) {
        logger.error('Error while getting all products: %j %s', error, error)
        const errMsg = typeof error === 'string' ? error : error.msg ? error.msg : 'Error while fetching profile'
        return res.status(500).send(utils.responseGenerators([], 'Error while fetching profile', errMsg, error))
    }
}

module.exports.getWorkDetails = async (req, res) => {
    try {
        const body = req.body
        const result = await usersService.getWorkDetails(body)
        return res.send(utils.responseGenerators(result, utils.httpStatusCodes.OK, 'Work details fetched successfully', null));
    } catch (error) {
        logger.error('Error while getting all products: %j %s', error, error)
        const errMsg = typeof error === 'string' ? error : error.msg ? error.msg : 'Error while fetching profile'
        return res.status(500).send(utils.responseGenerators([], 'Error while fetching profile', errMsg, error))
    }
}

module.exports.meetingsListForUser = async (req, res) => {
    try {
        const body = req.body
        const result = await usersService.meetingsListForUser(body)
        return res.send(utils.responseGenerators(result, utils.httpStatusCodes.OK, 'Work details fetched successfully', null));
    } catch (error) {
        logger.error('Error while getting all products: %j %s', error, error)
        const errMsg = typeof error === 'string' ? error : error.msg ? error.msg : 'Error while fetching profile'
        return res.status(500).send(utils.responseGenerators([], 'Error while fetching profile', errMsg, error))
    }
}

module.exports.cancelMeeting = async (req, res) => {
    try {
        const body = req.body
        const result = await usersService.cancelMeeting(body)
        return res.send(utils.responseGenerators(result, utils.httpStatusCodes.OK, 'Meeting cancelled successfully', null));
    } catch (error) {
        logger.error('Error while getting all products: %j %s', error, error)
        const errMsg = typeof error === 'string' ? error : error.msg ? error.msg : 'Error while cancelling meeting'
        return res.status(500).send(utils.responseGenerators([], 'Error while fetching profile', errMsg, error))
    }
}

module.exports.submitReview = async (req, res) => {
    try {
        const body = req.body
        const result = await usersService.submitReview(body)
        return res.send(utils.responseGenerators(result, utils.httpStatusCodes.OK, 'Review submitted successfully', null));
    } catch (error) {
        logger.error('Error while getting all products: %j %s', error, error)
        const errMsg = typeof error === 'string' ? error : error.msg ? error.msg : 'Error while submitting review'
        return res.status(500).send(utils.responseGenerators([], 'Error while fetching profile', errMsg, error))
    }
}