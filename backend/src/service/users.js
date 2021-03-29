// @ts-nocheck
'use strict'
const { Types } = require('mongoose')

const { JWTAuth } = require('../utils/jwt-auth')
const jwtAuth = new JWTAuth()
const cloudinary = require('../config/cloudinary')
const joiSchema = require('../utils/joi-schema')
const utils = require('../utils/utils')

const meetingsRepo = require('../models/meetings')
const ratingsRepo = require('../models/ratings')
const usersRepo = require('../repositories/users')
const worksRepo = require('../repositories/works')
const worksRepoV2 = require('../models/works')
const favWorkRepo = require('../repositories/favorite_work')

/**
 * 1. Check user with same email exists or not
 * 2. If not exits then register
 * 3. If exists then throw error
 */
module.exports.register = async (body) => {

    utils.joiValidatorHandler(joiSchema.userRegistration, body)

    let { name, email, password } = body
    const [userExistCheck = null] = await usersRepo.findData({ email }, { _id: 0, email: 1 })
    if (userExistCheck) {
        throw { msg: 'Provided email is already registered. Please login' }
    }
    const dataToSave = Object.assign({}, body)
    // dataToSave.test = true
    dataToSave.password = await utils.generateHashedPassword(password)
    // body.is_email_verified = false
    const registerUser = await usersRepo.createData(dataToSave)
    const link = createMailVerificationLink(registerUser._id)
    const mailOptions = {
        to: email,
        from: process.env.SMTP_USER,
        subject: 'Helping Hands - Account Verification',
        html: `Hello ${name},<br>Welcome to Helping Hands. Please click here to activate your <a href=${link}>account</a>
        <br><br>
        Thanks and Regards,
        Helping Hands Team`
    }
    await utils.sendEmail(mailOptions)
    return dataToSave
}

const createMailVerificationLink = (uCode) => {
    return `${process.env.BACKEND_URL}/api/user/verify-account?c=${uCode}`
}

module.exports.verifyAccount = async (userCode) => {
    if (!userCode) throw { msg: 'Usercode is required to activate acount' }
    const [userData = null] = await usersRepo.findData({ _id: Types.ObjectId(userCode) }, { user_type: 1 })
    if (!userData) {
        return process.env.FRONT_END_URL_CLIENT + 'login'
    }
    await usersRepo.updateData({ _id: Types.ObjectId(userCode) }, { $set: { is_email_verified: true } })
    return userData.user_type === 'client' ? process.env.FRONT_END_URL_CLIENT : process.env.FRONT_END_URL_PROFESSIONAL + 'login'
}


module.exports.changeProfilePicture = async (files, userCode) => {
    if (!userCode) {
        throw { msg: 'Invalid request detected' }
    }
    let url = ''
    if (files && files.file && files.file.tempFilePath) {
        const cloudinaryResult = await cloudinary.uploadFile(files.file.tempFilePath)
        if (!cloudinaryResult || !cloudinaryResult.secure_url) {
            throw { msg: 'We are unable to upload file right now. Please contact admin' }
        }
        url = cloudinaryResult.secure_url
    }
    utils.logger.info('url from cloudinary', url)
    await usersRepo.updateData({
        _id: Types.ObjectId(userCode)
    }, {
        $set: {
            profile_picture: url
        }
    })
    const [user = null] = await usersRepo.findData({ _id: Types.ObjectId(userCode) })
    return user
}

module.exports.uploadImage = async (files, userCode) => {
    let url = ''
    if (files && files.file && files.file.tempFilePath) {
        const cloudinaryResult = await cloudinary.uploadFile(files.file.tempFilePath)
        if (!cloudinaryResult || !cloudinaryResult.secure_url) {
            throw { msg: 'We are unable to upload file right now. Please contact admin' }
        }
        url = cloudinaryResult.secure_url
    }
    return { url }
}


module.exports.updateMyProfile = async (body) => {

    utils.joiValidatorHandler(joiSchema.updateUserProfile, body)

    const updateJson = Object.assign({}, body)
    delete updateJson._id
    delete updateJson.user_type

    updateJson.updatedAt = new Date()

    await usersRepo.updateData({
        _id: Types.ObjectId(body._id),
        user_type: body.user_type
    }, {
        $set: updateJson
    })

    const [user = null] = await usersRepo.findData({ _id: Types.ObjectId(body._id) })
    return user
}

// /**
//  * 1. Check user with provided email is there or not
//  * 2. If not, throw error
//  * 3. If exists, then check email verified status
//  * 4. If 3 failed... then throw error
//  * 5. If 3 passed... then check password is matching or not
//  * 6. If 5 failed... then throw error
//  * 7. If 5 passed... then generate unique token
//  * 8. Send final response
//  */
module.exports.login = async (body) => {

    utils.joiValidatorHandler(joiSchema.loginJoiSchema, body)

    let [userData = null] = await (await usersRepo.findData({ email: body.email, user_type: body.user_type }))
    if (!userData) {
        throw { msg: 'No any profile found with provided email address' }
    }


    if (userData.is_deleted) throw { msg: `This account is temporary disabled. Please contact us` }
    if (!userData.is_email_verified) throw { msg: `You haven't verified your email address yet. Please verify` }
    const passwordMatch = await utils.comparePassword(body.password, userData.password)
    if (!passwordMatch) throw { msg: 'Incorrect password received' }

    const tokenData = {
        email: body.email, user_code: userData._id, email_status: userData.is_email_verified, user_type: userData.user_type
    }
    const token = await jwtAuth.createToken(tokenData)
    delete userData.password
    userData.token = token
    return userData
}

module.exports.changePassword = async (body) => {
    utils.joiValidatorHandler(joiSchema.changePasswordJoiSchema, body)

    let [userData = null] = await usersRepo.findData({ _id: Types.ObjectId(body._id) }, { _id: 1, password: 1, email: 1, is_email_verified: 1, name: 1, is_deleted: 1 })
    if (!userData) throw { msg: 'No any profile found with provided email address' }

    let passwordMatch = await utils.comparePassword(body.currentPassword, userData.password)
    if (!passwordMatch) {
        throw { msg: `Your current password is not matching with our current record` }
    }

    if (userData.is_deleted) throw { msg: `This account is temporary disabled. Please contact us` }
    if (!userData.is_email_verified) throw { msg: `Account associated with this email id is not active. Please resent verification link to activate account` }

    const mailOptions = {
        to: body.email,
        from: process.env.SMTP_USER,
        subject: 'Helping Hands - Change Password',
        html: `Hello ${userData.name}, <br>As per current request received, we have changed your password in the platform.
        If you have not did this activity, then contact us for revert back the action
        <br><br>
        Thanks and Regards,
        Helping Hands Team`
    }

    let hashedPassword = await utils.generateHashedPassword(body.newPassword)
    await usersRepo.updateData({ _id: Types.ObjectId(body._id) }, { password: hashedPassword })
    await utils.sendEmail(mailOptions)
    return true
}

module.exports.forgotPassword = async (body) => {
    utils.joiValidatorHandler(joiSchema.forgotPasswordJoiSchema, body)

    let [userData = null] = await usersRepo.findData(body, { _id: 1, password: 1, email: 1, is_email_verified: 1, name: 1, is_deleted: 1 })
    if (!userData) throw { msg: 'No any profile found with provided email address' }

    let password = utils.generateRandomString(8)
    let hashedPassword = await utils.generateHashedPassword(password)
    await usersRepo.updateData(body, { password: hashedPassword })

    if (userData.is_deleted) throw { msg: `This account is temporary disabled. Please contact us` }
    if (!userData.is_email_verified) throw { msg: `Account associated with this email id is not active. Please resent verification link to activate account` }

    const mailOptions = {
        to: body.email,
        from: process.env.SMTP_USER,
        subject: 'Helping Hands - Your Password',
        html: `Hello ${userData.name},<br>As you forgot your password, we are sending you over mail.
        Please don't share this mail to anyone. <br> Your password is: <b>${password}</b>
        <br><br>
        Thanks and Regards,
        Helping Hands Team`
    }
    await utils.sendEmail(mailOptions)
    return true
}

module.exports.myProfile = async (userCode) => {
    if (!userCode) { throw { msg: 'Invalid request detected' } }
    const [result = null] = await usersRepo.findData({ _id: Types.ObjectId(userCode), is_deleted: false })
    return result
}

module.exports.loadWorkList = async (body) => {
    const query = {}
    query.is_deleted = false
    if (body.search_string && body.search_string !== '') {
        const subQuery = [
            { title: new RegExp(body.search_string, 'gmi') },
            { description: new RegExp(body.search_string, 'gmi') },
            { 'location.city': new RegExp(body.search_string, 'gmi') },
            { 'location.state': new RegExp(body.search_string, 'gmi') },
            { 'location.country': new RegExp(body.search_string, 'gmi') },
        ]
        query['$or'] = subQuery
    }
    let result = await worksRepo.findData(query)
    if (body._id && result.length > 0) {
        const favMarked = await favWorkRepo.findData({ user_id: Types.ObjectId(body._id), is_fav: true }, { work_id: 1 })
        const workIds = favMarked.map((elem) => { return (elem.work_id).toString() })
        for (let elem of result) {
            if (workIds.includes((elem._id).toString())) {
                elem.is_fav = 1
            } else elem.is_fav = 0
        }
    }

    const workIds = []
    for (let elem of result) {
        workIds.push(Types.ObjectId(elem._id))
    }
    if (workIds.length > 0) {
        const ratingData = await ratingsRepo.find({
            work_id: { $in: workIds }
        })
        if (ratingData && ratingData.length > 0) {
            const filteredData = filterRatingData(ratingData, 'work_id')
            result = JSON.parse(JSON.stringify(result))
            for (let eachResult of result) {
                eachResult['average_rate'] = filteredData.ratingJson[eachResult._id] / filteredData.countJson[eachResult._id] || 0
                eachResult['total_rating_received'] = filteredData.countJson[eachResult._id] || 0
            }
        }
    }

    return result
}

const filterRatingData = (data, key) => {
    const countJson = {}
    const ratingJson = {}
    for (let elem of data) {
        if (elem && key in elem) {
            countJson[elem[key]] = elem[key] in countJson ? countJson[elem[key]] + 1 : 1
            ratingJson[elem[key]] = elem[key] in ratingJson ? ratingJson[elem[key]] + elem.rate : elem.rate
        }
    }
    return {
        countJson, ratingJson
    }
}

module.exports.addJobToFav = async (body) => {
    utils.joiValidatorHandler(joiSchema.addJobToFavJoiSchema, body)
    const [existingData = null] = await favWorkRepo.findData({
        user_id: Types.ObjectId(body._id),
        work_id: Types.ObjectId(body.work_id)
    })
    if (existingData) {
        await favWorkRepo.updateData({
            user_id: Types.ObjectId(body._id),
            work_id: Types.ObjectId(body.work_id)
        }, {
            is_fav: !existingData.is_fav
        })
    } else {
        await favWorkRepo.createData({
            user_id: Types.ObjectId(body._id),
            work_id: Types.ObjectId(body.work_id),
            is_fav: true
        })
    }
    return true
}


module.exports.getWorkDetails = async (body) => {
    utils.joiValidatorHandler(joiSchema.getWorkDetailsJoiSchema, body)

    const query = {}
    query._id = Types.ObjectId(body.work_id)

    let [result = null] = await worksRepoV2.find(query).populate({
        path: 'user_id',
        model: 'user',
        select: {
            password: 0
        }
    })
    result = JSON.parse(JSON.stringify(result))
    if (body._id && result) {
        const [favMarked = null] = await favWorkRepo.findData({ user_id: Types.ObjectId(body._id), work_id: Types.ObjectId(body.work_id), is_fav: true }, { work_id: 1 })
        if (favMarked) result.is_fav = 1
        else result.is_fav = 0
    }

    const ratingsCount = await ratingsRepo.find({
        work_id: Types.ObjectId(body.work_id)
    })


    
    result.total_rating_received = 0
    result.average_rate = 0

    if (ratingsCount && ratingsCount.length > 0) {
        let ratingReceived = 0
        let ratingTotal = 0
        for (let elem of ratingsCount) {
            ratingReceived++
            ratingTotal += elem['rate']
        }
        result.total_rating_received = ratingReceived
        result.average_rate = ratingReceived !== 0 ? ratingTotal / ratingReceived : 0
    }
    return result
}

module.exports.meetingsListForUser = async (body) => {
    body = utils.joiValidatorHandler(joiSchema.meetingsListForUserJoiSchema, body)

    const query = {}
    query.user = Types.ObjectId(body._id)
    if (body.type === 'scheduled') query.status = { $in: ['pending', 'approved'] }
    if (body.type === 'review_required') query.status = 'professional_completed'
    if (body.type === 'completed') query.status = { $in: ['completed', 'client_cancelled'] }



    let data = await meetingsRepo.find(query, {}, { sort: { createdAt: -1 } })
        .populate({
            path: 'professional_id',
            model: 'user',
            select: {
                password: 0
            }
        }).populate({
            path: 'work_id',
            model: 'work'
        })

    const workIds = []
    for (let elem of data) {
        workIds.push(Types.ObjectId(elem._id))
    }
    if (workIds.length > 0) {
        const ratingData = await ratingsRepo.find({
            meeting_id: { $in: workIds }
        })
        if (ratingData && ratingData.length > 0) {
            const filteredData = filterRatingData(ratingData, 'meeting_id')
            data = JSON.parse(JSON.stringify(data))
            for (let eachResult of data) {
                eachResult['average_rate'] = filteredData.ratingJson[eachResult._id] / filteredData.countJson[eachResult._id] || 0
                eachResult['total_rating_received'] = filteredData.countJson[eachResult._id] || 0
            }
        }
    }

    return data
}

module.exports.cancelMeeting = async (body) => {
    utils.joiValidatorHandler(joiSchema.cancelMeetingJoiSchema, body)

    const [dataExists = null] = await meetingsRepo.find({
        user: Types.ObjectId(body._id),
        _id: Types.ObjectId(body.meeting_id),
        status: 'pending'
    })

    if (!dataExists) {
        throw {
            msg: 'No such job found. Please reload page.'
        }
    }

    await meetingsRepo.updateOne({
        user: Types.ObjectId(body._id),
        _id: Types.ObjectId(body.meeting_id),
        status: 'pending'
    }, {
        $set: {
            status: 'client_cancelled'
        }
    })

    return true
}

module.exports.submitReview = async (body) => {
    body = utils.joiValidatorHandler(joiSchema.submitReviewJoiSchema, body)

    const [userData = null] = await usersRepo.findData({
        _id: Types.ObjectId(body._id),
        user_type: 'client'
    })
    if (!userData) throw { msg: 'User data not found' }

    const [professionalData = null] = await usersRepo.findData({
        _id: Types.ObjectId(body.professional_id),
        user_type: 'professional'
    })
    if (!professionalData) throw { msg: 'Professional\'s data not found' }


    const [meetingData = null] = await meetingsRepo.find({
        _id: Types.ObjectId(body.meeting_id),
        status: 'professional_completed'
    })
    if (!meetingData) throw { msg: 'Meeting\'s data not found' }


    const [workData = null] = await worksRepo.findData({
        _id: Types.ObjectId(body.work_id)
    })
    if (!workData) throw { msg: 'Work\'s data not found' }

    await ratingsRepo.create({
        meeting_id: Types.ObjectId(body.meeting_id),
        work_id: Types.ObjectId(body.work_id),
        professional_id: Types.ObjectId(body.professional_id),
        user_id: Types.ObjectId(body._id),
        rate: body.work_rate
    })

    await meetingsRepo.updateOne({
        _id: Types.ObjectId(meetingData._id)
    }, {
        status: 'completed'
    })
    return true
}
