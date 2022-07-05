const router = require('express').Router()
const cPlan = require('../controllers/cplan')
const cPlanContract = require('../controllers/cPlanContract')
const jtoken = require('../controllers/JWT')
const jADMINtoken = require('../controllers/ADMINJWT')
const check = require('express-validator').check
const query = require('express-validator').query

router.post('/add',jADMINtoken.authorize,
                                        check('planType').custom(v=>{
                                            if(['long','short'].includes(v.toLowerCase())) return true
                                            return false
                                        }),
                                        check('planName').isLength({min:6,max:16}).matches(/^[A-Za-z0-9 .@]+$/),
                                        check('cryptoName').custom(v=>{
                                            if(['ETH','RVN','LTCT','BTC'].includes(v.toUpperCase())) return true
                                            return false
                                        }),
                                        check('algorithm').custom(v=>{
                                            if(['ETHASH','KAWPOW','LTCT256','SHA-256'].includes(v.toUpperCase())) return true
                                            return false
                                        }),
                                        check('planDuration').isInt({min:1,max:6}),
                                        check('profitability').isInt({min:100,max:200}),
                                        check('price').isInt({min:1,max:30000})
                                        ,cPlan.postAddPlan)//Admin
router.get('/',jtoken.authorize,
                                        query('planType').custom(v=>{
                                            if(['long','short'].includes(v.toLowerCase())) return true
                                            return false
                                        }),
                                        query('cryptoName').custom(v=>{
                                            if(['ETH','RVN','BTC'].includes(v.toUpperCase())) return true
                                            return false
                                        })
                                        ,cPlan.getGetPlans)
router.get('/admin',jADMINtoken.authorize,cPlan.GetPlans)//Admin
router.get('/:id',jADMINtoken.authorize,cPlan.getGetPlanByID)//Admin
router.put('/update/:id',jADMINtoken.authorize,
                                        check('planType').custom(v=>{
                                            if(['long','short'].includes(v.toLowerCase())) return true
                                            return false
                                        }),
                                        check('planName').isLength({min:6,max:16}).matches(/^[A-Za-z0-9 .@]+$/),
                                        check('cryptoName').custom(v=>{
                                            if(['ETH','RVN','LTCT','BTC'].includes(v.toUpperCase())) return true
                                            return false
                                        }),
                                        check('algorithm').custom(v=>{
                                            if(['ETHASH','KAWPOW','LTCT256','SHA-256'].includes(v.toUpperCase())) return true
                                            return false
                                        }),
                                        check('planDuration').isInt({min:1,max:6}),
                                        check('profitability').isInt({min:100,max:200}),
                                        check('price').isInt({min:1,max:30000}),
                                        check('availability').isBoolean()
                                        ,cPlan.putUpdatePlan)//Admin
router.delete('/delete/:id',jADMINtoken.authorize,cPlan.deleteDeletePlan)//Admin

router.post('/x/democontract/add',jtoken.authorize,
                                        check('planID').exists(),
                                        check('currency').custom(v=>{
                                            if(['LTCT'].includes(v)) return true
                                            return false
                                        })
                                        ,cPlanContract.postAddDemoPlanContract)
router.get('/x/democontract',jtoken.authorize,cPlanContract.getGetDemoPlansContract)
router.post('/x/contract/add',jtoken.authorize,
                                        check('planID').exists(),
                                        check('currency').custom(v=>{
                                            if(['ETH','RVN','BTC'].includes(v.toUpperCase())) return true
                                            return false
                                        })
                                        ,cPlanContract.postAddPlanContract)
router.get('/x/contract',jtoken.authorize,cPlanContract.getGetPlansContract)

router.get('/admin/getUserContracts/:id',jADMINtoken.authorize,cPlanContract.getUserPlansContract)//Admin

module.exports = router