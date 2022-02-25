const router = require('express').Router()
const cPlan = require('../controllers/cPlan')
const cPlanContract = require('../controllers/cPlanContract')
const jtoken = require('../controllers/JWT')


router.post('/plan/add',jtoken.authorize,cPlan.postAddPlan)//Admin
router.get('/plan',jtoken.authorize,cPlan.getGetPlans)
router.get('/plan/:id',jtoken.authorize,cPlan.getGetPlanByID)//Admin
router.put('/plan/update/:id',jtoken.authorize,cPlan.putUpdatePlan)//Admin
router.delete('/plan/delete/:id',jtoken.authorize,cPlan.deleteDeletePlan)//Admin

router.post('/democontract/add',jtoken.authorize,cPlanContract.postAddDemoPlanContract)
router.get('/democontract',jtoken.authorize,cPlanContract.getGetDemoPlansContract)
router.post('/contract/add',jtoken.authorize,cPlanContract.postAddPlanContract)//rqeuired payment or sufficient balance
router.get('/contract',jtoken.authorize,cPlanContract.getGetPlansContract)

module.exports = router