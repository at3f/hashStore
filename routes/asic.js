const router = require('express').Router()
const cAsic = require('../controllers/cAsic')
const cAsicContract = require('../controllers/cAsicContract')
const jtoken = require('../controllers/JWT')
const jADMINtoken = require('../controllers/ADMINJWT')
const check = require('express-validator').check

router.post('/add',jADMINtoken.authorize,
                                        check('asicName').isLength({min:6,max:16}).matches(/^[A-Za-z0-9 .@]+$/),
                                        check('cryptoName').custom(v=>{
                                            if(['ETH','BTC'].includes(v.toUpperCase())) return true
                                            return false
                                        }),
                                        check('algorithm').custom(v=>{
                                            if(['ETHASH','SHA-256'].includes(v.toUpperCase())) return true
                                            return false
                                        }),
                                        check('price').isInt({min:1,max:30000}),
                                        check('hashPower').isFloat({min:1,max:9999999}),
                                        check('hostFees').isInt({min:1,max:50})
                                        ,cAsic.postAddAsic)//Admin
router.get('/',jtoken.authorize,cAsic.getGetAsics)
router.get('/admin',jADMINtoken.authorize,cAsic.getGetAsics)
router.get('/:id',jADMINtoken.authorize,cAsic.getGetAsicByID)//Admin
router.put('/update/:id',jADMINtoken.authorize,
                                        check('asicName').isLength({min:6,max:16}).matches(/^[A-Za-z0-9 .@]+$/),
                                        check('cryptoName').custom(v=>{
                                            if(['ETH','BTC'].includes(v.toUpperCase())) return true
                                            return false
                                        }),
                                        check('algorithm').custom(v=>{
                                            if(['ETHASH','SHA-256'].includes(v.toUpperCase())) return true
                                            return false
                                        }),
                                        check('price').isInt({min:1,max:30000}),
                                        check('hashPower').isFloat({min:1,max:9999999}),
                                        check('hostFees').isInt({min:1,max:50}),
                                        check('availability').isBoolean()
                                        ,cAsic.putUpdateAsic)//Admin
router.delete('/delete/:id',jADMINtoken.authorize,cAsic.deleteDeleteAsic)//Admin

router.get('/x/contract',jtoken.authorize,cAsicContract.getGetAsicsContract)
router.get('/x/contract/payouts/:id',jtoken.authorize,cAsicContract.getAsicContarctPayouts)
router.post('/x/contract/add',jtoken.authorize,
                                        check('asicID').exists(),
                                        check('currency').custom(v=>{
                                            if(['ETH','RVN','BTC'].includes(v.toUpperCase())) return true
                                            return false
                                        })
                                        ,cAsicContract.postAddAsicContract)
router.get('/x/contract/onDemand',jADMINtoken.authorize,cAsicContract.getNotActiveAsicsContract)//Admin
router.get('/x/contract/activeContracts',jADMINtoken.authorize,cAsicContract.getActiveAsicsContract)//Admin
router.put('/x/contract/activate/:id',jADMINtoken.authorize,
                                        check('workerID').isLength({min:2,max:16}),
                                        check('pool').isLength({min:3,max:16}).matches(/^[A-Za-z0-9 .@]+$/)
                                        ,cAsicContract.activateAsicContarct)//Admin
router.put('/x/contract/expire/:id',jADMINtoken.authorize,cAsicContract.endAsicContract)//Admin

router.get('/admin/getUserContracts/:id',jADMINtoken.authorize,cAsicContract.getUserAsicsContract)//Admin
module.exports = router