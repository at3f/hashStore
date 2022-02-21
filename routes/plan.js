const router = require('express').Router()
const cPlan = require('../controllers/cPlan')
const cPlanContract = require('../controllers/cPlanContract')
const jtoken = require('../controllers/JWT')

router.post('/plan/add',jtoken.authorize,cPlan.postAddPlan)
router.get('/plan',//jtoken.authorize,
cPlan.getGetPlans)
router.put('/plan/update/:id',jtoken.authorize,cPlan.putUpdatePlan)
router.delete('/plan/delete/:id',jtoken.authorize,cPlan.deleteDeletePlan)

router.post('/test',cPlanContract.postAddDemoPlanContract)

module.exports = router