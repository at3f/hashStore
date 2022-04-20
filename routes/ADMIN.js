const router = require('express').Router()
const cADMIN = require('../controllers/ADMIN')
const jADMINtoken = require('../controllers/ADMINJWT')

// router.post('/',cADMIN.test)
router.post('/FFAuth',cADMIN.isAdminPassword,cADMIN.sendOTP)
router.post('/2FAuth',cADMIN.ADMINlogin)
router.post('/getNewAccessToken',cADMIN.getNewAccessToken)
router.post('/logout',cADMIN.ADMINLogout)
router.get('/OVERVIEW',cADMIN.getOverViewData)
module.exports = router