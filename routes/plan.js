const router = require('express').Router()
const cPlan = require('../controllers/cPlan')
const cPlanContract = require('../controllers/cPlanContract')
const jtoken = require('../controllers/JWT')


router.post('/add',jtoken.authorize,cPlan.postAddPlan)//Admin
router.get('/',jtoken.authorize,cPlan.getGetPlans)
router.get('/:id',jtoken.authorize,cPlan.getGetPlanByID)//Admin
router.put('/update/:id',jtoken.authorize,cPlan.putUpdatePlan)//Admin
router.delete('/delete/:id',jtoken.authorize,cPlan.deleteDeletePlan)//Admin

router.post('/x/democontract/add',jtoken.authorize,cPlanContract.postAddDemoPlanContract)
router.get('/x/democontract',jtoken.authorize,cPlanContract.getGetDemoPlansContract)
router.post('/x/contract/add',jtoken.authorize,cPlanContract.postAddPlanContract)//rqeuired payment or sufficient balance
router.get('/x/contract',jtoken.authorize,cPlanContract.getGetPlansContract)

module.exports = router