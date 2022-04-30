//----------->seller
// user need to be seller
// get sellerworkers by sellerID
// get seller plans by seller worker id
// get plan contracts by seller worker id
// C,U,D plans by insure that plan(sellerWorkerID)--> sellerID===userID for U,D

//----------->user
// get sellers
// get all seller plans by seller id
// subscribe in sellerPlan

//----------->admin
// get sellers
// get sellerworkers by sellerID
// get seller plans by seller worker id
// get plan contracts by seller worker id
//=========================================
// ==> deposit for asic contract & planContracts with that asic contract

const router = require('express').Router()
const cSeller = require('../controllers/cSeller')
const jToken = require('../controllers/JWT')
const jADMINtoken = require('../controllers/ADMINJWT')
const check = require('express-validator').check
const query = require('express-validator').query

//======================SELLER========================
router.post('/createsellerstore',jToken.authorize,cSeller.beASeller)
router.get('/getworkers',jToken.authorize,cSeller.getworkers)
router.post('/addworkerplan/:id',jToken.authorize,cSeller.addPlan)
router.put('/updateworkerplan/:id/:planID',jToken.authorize,cSeller.updatePlan)
router.delete('/deleteworkerplan/:id/:planID',jToken.authorize,cSeller.deletePlan)
router.get('/getworkerplans/:id',jToken.authorize,cSeller.getWorkerPlans)
router.get('/getplancontracts/:id',jToken.authorize,cSeller.getPlanContractsBySellerWorkerID)
//======================USER========================
router.get('/getsellers',jToken.authorize,cSeller.getSellers)
router.get('/getsellerplans/:id',jToken.authorize,cSeller.getSellerPlans)
router.post('/addplancontarct',jToken.authorize,cSeller.addPlanContract)
//======================ADMIN========================
router.get('/admin/getsellers',jADMINtoken.authorize,cSeller.getSellers)
router.get('/admin/getworkers/:id',jADMINtoken.authorize,cSeller.ADMINgetworkers)
router.get('/admin/getworkerplans/:id',jADMINtoken.authorize,cSeller.getWorkerPlans)
router.get('/admin/getplancontracts/:id',jADMINtoken.authorize,cSeller.getPlanContractsBySellerWorkerID)
//===================================================
module.exports = router
