const router = require('express').Router()
const cAsic = require('../controllers/cAsic')
const cAsicContract = require('../controllers/cAsicContract')
const jtoken = require('../controllers/JWT')
const jADMINtoken = require('../controllers/ADMINJWT')

router.post('/add',jADMINtoken.authorize,cAsic.postAddAsic)//Admin
router.get('/',jtoken.authorize,cAsic.getGetAsics)
router.get('/admin',jADMINtoken.authorize,cAsic.getGetAsics)
router.get('/:id',jADMINtoken.authorize,cAsic.getGetAsicByID)//Admin
router.put('/update/:id',jADMINtoken.authorize,cAsic.putUpdateAsic)//Admin
router.delete('/delete/:id',jADMINtoken.authorize,cAsic.deleteDeletePlan)//Admin

router.get('/x/contract',jtoken.authorize,cAsicContract.getGetAsicsContract)
router.get('/x/contract/payouts/:id',jtoken.authorize,cAsicContract.getAsicContarctPayouts)
router.post('/x/contract/add',jtoken.authorize,cAsicContract.postAddAsicContract)
router.get('/x/contract/onDemand',jADMINtoken.authorize,cAsicContract.getNotActiveAsicsContract)//Admin
router.get('/x/contract/activeContracts',jADMINtoken.authorize,cAsicContract.getActiveAsicsContract)//Admin
router.put('/x/contract/activate/:id',jADMINtoken.authorize,cAsicContract.activateAsicContarct)//Admin
router.put('/x/contract/expire/:id',jADMINtoken.authorize,cAsicContract.endAsicContract)//Admin

router.get('/admin/getUserContracts/:id',jADMINtoken.authorize,cAsicContract.getUserAsicsContract)//Admin
module.exports = router