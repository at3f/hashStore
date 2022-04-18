const router = require('express').Router()
const cTransaction = require('../controllers/cTransaction')
const jtoken = require('../controllers/JWT')
const jADMINtoken = require('../controllers/ADMINJWT')


router.get('/getdepositaddress',jtoken.authorize,cTransaction.getDepositAddress)
router.get('/getdeposits',jtoken.authorize,cTransaction.getDeposits)

// router.post('/setwithdrawrequest',jtoken.authorize,cTransaction.setWithdrawRequest)
router.get('/getwithdraws',jtoken.authorize,cTransaction.getWithdraws)

router.get('/admin/:id/getUserdeposits',jADMINtoken.authorize,cTransaction.getUserDeposits) //Admin
router.get('/admin/:id/getUserwithdraws',jADMINtoken.authorize,cTransaction.getUserWithdraws) //Admin
router.get('/admin/getdepositaddressForAsicContarct',jADMINtoken.authorize,cTransaction.getDepositAddressForAsicContarct) //Admin

router.post('/depositForAsic',cTransaction.verifyNotification,cTransaction.depositNotificationForAsicContract)
router.post('/deposit',cTransaction.verifyNotification,cTransaction.depositNotification)
router.post('/withdraw',cTransaction.verifyNotification,cTransaction.withdrawNotification)

module.exports = router