const router = require('express').Router()
const cAsic = require('../controllers/cAsic')
const cAsicContract = require('../controllers/cAsicContract')
const jtoken = require('../controllers/JWT')

router.post('/asic/add',jtoken.authorize,cAsic.postAddAsic)//Admin
router.get('/asic',jtoken.authorize,cAsic.getGetAsics)
router.get('/asic/:id',jtoken.authorize,cAsic.getGetAsicByID)//Admin
router.put('/asic/update/:id',jtoken.authorize,cAsic.putUpdateAsic)//Admin
router.delete('/asic/delete/:id',jtoken.authorize,cAsic.deleteDeletePlan)//Admin

module.exports = router