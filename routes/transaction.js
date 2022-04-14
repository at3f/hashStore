const router = require('express').Router()
const cTransaction = require('../controllers/cTransaction')
const jtoken = require('../controllers/JWT')

router.get('/getdepositaddress',jtoken.authorize,cTransaction.getDepositAddress)
router.get('/getdeposits',jtoken.authorize,cTransaction.getDeposits)

router.post('/setwithdrawrequest',jtoken.authorize,cTransaction.setWithdrawRequest)
router.get('/getwithdraws',jtoken.authorize,cTransaction.getWithdraws)


router.post('/deposit',cTransaction.verifyNotification,cTransaction.depositNotification)
router.post('/withdraw',cTransaction.verifyNotification,cTransaction.withdrawNotification)

module.exports = router