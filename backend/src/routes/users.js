'use strict'
const router = require('express').Router()
const usersCtrl = require('../controller/users')

router.post('/register', usersCtrl.register)
router.get('/verify-account', usersCtrl.verifyAccount)
router.post('/changeImage', usersCtrl.changeProfilePicture)
router.post('/upload/image', usersCtrl.uploadImage)
router.post('/update/profile', usersCtrl.updateMyProfile)
router.post('/login', usersCtrl.login)
router.post('/forgot-password', usersCtrl.forgotPassword)
router.post('/change-password', usersCtrl.changePassword)
router.get('/mypProfile', usersCtrl.myProfile)
router.post('/load/work/list', usersCtrl.loadWorkList)
router.post('/add/job/to/fav', usersCtrl.addJobToFav)
router.post('/get/work/details', usersCtrl.getWorkDetails)
router.post('/meetings/list', usersCtrl.meetingsListForUser)
router.post('/cancel/meeting', usersCtrl.cancelMeeting)
router.post('/submit/review', usersCtrl.submitReview)

module.exports = router