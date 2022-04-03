const router = require('express').Router()
const cADMIN = require('../controllers/ADMIN')
const jtoken = require('../controllers/JWT')

// router.post('/',cADMIN.test)
router.post('/FFAuth',cADMIN.isAdminPassword,cADMIN.sendOTP)
router.post('/MFAuth',cADMIN.ADMINlogin)
router.post('/getNewAccessToken',cADMIN.getNewAccessToken)
router.post('/logout',cADMIN.ADMINLogout)

module.exports = router