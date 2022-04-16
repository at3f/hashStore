const router = require('express').Router()
const cPlan = require('../controllers/cplan')
const cPlanContract = require('../controllers/cPlanContract')
const jtoken = require('../controllers/JWT')
const jADMINtoken = require('../controllers/ADMINJWT')

router.post('/add',jADMINtoken.authorize,cPlan.postAddPlan)//Admin
router.get('/',jtoken.authorize,cPlan.getGetPlans)
router.get('/admin',jADMINtoken.authorize,cPlan.AdminGetPlans)//Admin
router.get('/:id',jADMINtoken.authorize,cPlan.getGetPlanByID)//Admin
router.put('/update/:id',jADMINtoken.authorize,cPlan.putUpdatePlan)//Admin
router.delete('/delete/:id',jADMINtoken.authorize,cPlan.deleteDeletePlan)//Admin

router.post('/x/democontract/add',jtoken.authorize,cPlanContract.postAddDemoPlanContract)
router.get('/x/democontract',jtoken.authorize,cPlanContract.getGetDemoPlansContract)
router.post('/x/contract/add',jtoken.authorize,cPlanContract.postAddPlanContract)//rqeuired payment or sufficient balance
router.get('/x/contract',jtoken.authorize,cPlanContract.getGetPlansContract)

router.get('/admin/getUserContracts/:id',jADMINtoken.authorize,cPlanContract.getUserPlansContract)//Admin

module.exports = router