// @ts-nocheck
'use strict'

const { Types } = require('mongoose')

const { joiValidatorHandler, sendEmail } = require('../utils/utils')

const joiSchema = require('../utils/joi-schema')
const worksRepo = require('../repositories/works')
const usersRepo = require('../repositories/users')
const meetingsRepo = require('../models/meetings')
const ratingsRepo = require('../models/ratings')
const moment = require('moment')

module.exports.addNewWork = async (body) => {

  joiValidatorHandler(joiSchema.addNewWorkJoiSchema, body)
  await worksRepo.createData(body)
  return body
}

module.exports.listWorks = async (body) => {
  joiValidatorHandler(joiSchema.listWorksJoiSchema, body)

  const query = {
    user_id: body._id
  }
  if (body.search_string && body.search_string !== '') {
    query['$or'] = [
      {
        title: new RegExp(body.search_string, 'gmi')
      },
      {
        description: new RegExp(body.search_string, 'gmi')
      }
    ]
  }

  const data = await worksRepo.findData(query, {}, { sort: { is_deleted: 1, createdAt: -1 } })
  return data
}

module.exports.fetchUpcomingList = async (body) => {
  joiValidatorHandler(joiSchema.fetchUpcomingListJoiSchema, body)

  const [checkUserExists = null] = await usersRepo.findData({
    _id: Types.ObjectId(body._id),
    user_type: 'professional',
    is_deleted: false
  })

  if (!checkUserExists) {
    throw {
      msg: 'User data not found!'
    }
  }

  const workData = await meetingsRepo.find({
    professional_id: Types.ObjectId(body._id),
    status: 'approved'
  }).populate({
    path: 'user',
    model: 'user',
    select: {
      password: 0
    }
  }).populate({
    path: 'work_id',
    model: 'work'
  })

  return workData
}


module.exports.fetchMeetingRequestList = async (body) => {
  joiValidatorHandler(joiSchema.fetchUpcomingListJoiSchema, body)

  const [checkUserExists = null] = await usersRepo.findData({
    _id: Types.ObjectId(body._id),
    user_type: 'professional',
    is_deleted: false
  })

  if (!checkUserExists) {
    throw {
      msg: 'User data not found!'
    }
  }

  const workData = await meetingsRepo.find({
    professional_id: Types.ObjectId(body._id),
    status: 'pending'
  }).populate({
    path: 'user',
    model: 'user',
    select: {
      password: 0
    }
  }).populate({
    path: 'work_id',
    model: 'work'
  })

  return workData
}


module.exports.fetchCompletedList = async (body) => {
  joiValidatorHandler(joiSchema.fetchUpcomingListJoiSchema, body)

  const [checkUserExists = null] = await usersRepo.findData({
    _id: Types.ObjectId(body._id),
    user_type: 'professional',
    is_deleted: false
  })

  if (!checkUserExists) {
    throw {
      msg: 'User data not found!'
    }
  }

  let workData = await meetingsRepo.find({
    professional_id: Types.ObjectId(body._id),
    status: { $in: ['professional_completed', 'completed'] }
  }, {}, { 'sort': { completed_on: -1 } }).populate({
    path: 'user',
    model: 'user',
    select: {
      password: 0
    }
  }).populate({
    path: 'work_id',
    model: 'work'
  })

  const workIds = []
  for (let elem of workData) {
    workIds.push(Types.ObjectId(elem._id))
  }
  if (workIds.length > 0) {
    const ratingData = await ratingsRepo.find({
      meeting_id: { $in: workIds }
    })
    if (ratingData && ratingData.length > 0) {
      const filteredData = filterRatingData(ratingData, 'meeting_id')
      workData = JSON.parse(JSON.stringify(workData))
      for (let eachResult of workData) {
        eachResult['average_rate'] = filteredData.ratingJson[eachResult._id] / filteredData.countJson[eachResult._id] || 0
        eachResult['total_rating_received'] = filteredData.countJson[eachResult._id] || 0
      }
    }
  }

  return workData
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


module.exports.updateWorkStatus = async (body) => {
  joiValidatorHandler(joiSchema.updateWorkStatusJoiSchema, body)
  const data = await worksRepo.updateData({
    _id: Types.ObjectId(body._id)
  }, {
    $set: {
      is_deleted: body.is_deleted
    }
  })
  return true
}

module.exports.completeMeeting = async (body) => {
  joiValidatorHandler(joiSchema.completeMeetingJoiSchema, body)
  const [dataExists = null] = await meetingsRepo.find({
    professional_id: Types.ObjectId(body._id),
    _id: Types.ObjectId(body.meeting_id),
    status: 'approved'
  })

  if (!dataExists) {
    throw {
      msg: 'No such job found. Please reload page.'
    }
  }

  await meetingsRepo.updateOne({
    professional_id: Types.ObjectId(body._id),
    _id: Types.ObjectId(body.meeting_id),
    status: 'approved'
  }, {
    $set: {
      status: 'professional_completed',
      completed_on: new Date()
    }
  })
  return true
}

module.exports.approveMeeting = async (body) => {
  body = joiValidatorHandler(joiSchema.approveMeetingJoiSchema, body)

  if (body.action === 'reject') {
    await meetingsRepo.updateOne({
      professional_id: Types.ObjectId(body._id),
      _id: Types.ObjectId(body.meeting_id),
      status: 'pending'
    }, {
      $set: {
        status: 'rejected',
        completed_on: new Date()
      }
    })
    return true;
  }

  const [dataExists = null] = await meetingsRepo.find({
    professional_id: Types.ObjectId(body._id),
    _id: Types.ObjectId(body.meeting_id),
    status: 'pending'
  })

  if (!dataExists) {
    throw {
      msg: 'No such job found. Please reload page.'
    }
  }

  await meetingsRepo.updateOne({
    professional_id: Types.ObjectId(body._id),
    _id: Types.ObjectId(body.meeting_id),
    status: 'pending'
  }, {
    $set: {
      status: 'approved',
      completed_on: new Date()
    }
  })

  const [userData = null] = await usersRepo.findData({
    _id: Types.ObjectId(dataExists.user)
  }, {
    email: 1,
    name: 1
  })

  const mailOptions = {
    to: userData['email'],
    from: process.env.SMTP_USER,
    subject: 'Helping Hands - Video Meeting Accepted',
    html: `Hello ${userData['name']},
      <br>Professional from Helping Hands platform has accepted your video meeting. He will be at your doorstep on ${moment(dataExists.selected_date).format('DD-MM-yyyy')}
      <br><br>
      Thanks And Regards,
      Helping Hands Team`
  }
  await sendEmail(mailOptions)

  return true
}

module.exports.remindForReview = async (body) => {
  joiValidatorHandler(joiSchema.remindForReviewJoiSchema, body)

  const [userExists = null] = await usersRepo.findData({
    _id: Types.ObjectId(body.user),
    is_deleted: false
  })

  if (!userExists) {
    throw {
      msg: 'User data not found. Please contact us'
    }
  }

  const [meetingData = null] = await meetingsRepo.find({
    _id: Types.ObjectId(body.meeting_id),
    is_deleted: false
  })

  if (!meetingData) {
    throw {
      msg: 'Meeting data not found. Please contact us'
    }
  }

  const [workData = null] = await worksRepo.findData({
    _id: Types.ObjectId(meetingData['work_id'])
  }, {
    title: 1
  })

  const mailOptions = {
    to: userExists['email'],
    from: process.env.SMTP_USER,
    subject: 'Helping Hands - Rating Attention Required',
    html: `Hello ${userExists['name']},
      <br>Professional from Helping Hands platform is looking for your Reviews and
      Complete Meeting Status.
      Please rate and complete the work with name <b>${workData['title']}</b>
      <br><br>
      Thanks And Regards,
      Helping Hands Team`
  }
  await sendEmail(mailOptions)

  return true
}
