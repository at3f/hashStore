const router = require('express').Router()
const cTransaction = require('../controllers/cTransaction')
const jtoken = require('../controllers/JWT')
const jADMINtoken = require('../controllers/ADMINJWT')


router.get('/getdepositaddress',jtoken.authorize,cTransaction.getDepositAddress)
router.get('/getdeposits',jtoken.authorize,cTransaction.getDeposits)

router.post('/setwithdrawrequest',jtoken.authorize,cTransaction.setWithdrawRequest)
router.get('/getwithdraws',jtoken.authorize,cTransaction.getWithdraws)

router.get('/admin/:id/getUserdeposits',jADMINtoken.authorize,cTransaction.getUserDeposits)
router.get('/admin/:id/getUserwithdraws',jADMINtoken.authorize,cTransaction.getUserWithdraws)


router.post('/deposit',cTransaction.verifyNotification,cTransaction.depositNotification)
router.post('/withdraw',cTransaction.verifyNotification,cTransaction.withdrawNotification)

module.exports = router