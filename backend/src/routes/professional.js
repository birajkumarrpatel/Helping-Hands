'use strict'
const router = require('express').Router()
const professionalCtrl = require('../controller/professional')

router.post('/add/work', professionalCtrl.addNewWork)
router.post('/list/works', professionalCtrl.listWorks)
router.post('/update/work/status', professionalCtrl.updateWorkStatus)
router.post('/fetch/upcoming/list', professionalCtrl.fetchUpcomingList)
router.post('/fetch/meeting/request/list', professionalCtrl.fetchMeetingRequestList)
router.post('/fetch/completed/list', professionalCtrl.fetchCompletedList)
router.post('/complete/meeting', professionalCtrl.completeMeeting)
router.post('/approve/meeting', professionalCtrl.approveMeeting)
router.post('/remind/for/review', professionalCtrl.remindForReview)

module.exports = router