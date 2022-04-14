const router = require('express').Router()
const cTransaction = require('../controllers/cTransaction')
const jtoken = require('../controllers/JWT')

router.get('/getdepositaddress',jtoken.authorize,cTransaction.getDepositAddress)
router.post('/deposit',cTransaction.verifyNotification,cTransaction.depositNotification)

module.exports = router