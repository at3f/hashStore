const router = require('express').Router()
const cFarm = require('../controllers/cFarm')
const jADMINtoken = require('../controllers/ADMINJWT')
const check = require('express-validator').check

// add worker
// delete worker
// end worker
// get active workers
// get notActive workers

router.post('/addworker',jADMINtoken.authorize,
                                            check('workerName').isLength({min:6,max:16}).matches(/^[A-Za-z0-9 ]+$/),
                                            check('workerID').isLength({min:2,max:16}),
                                            check('pool').isLength({min:3,max:16}).matches(/^[A-Za-z0-9]+$/)
                                            ,cFarm.addWorker)
router.delete('/deleteworker/:id',jADMINtoken.authorize,cFarm.deleteWorker)
router.put('/endworker/:id',jADMINtoken.authorize,cFarm.endWorker)
router.get('/getactiveworkers',jADMINtoken.authorize,cFarm.getActiveWorkers)
router.get('/getnotactiveworkers',jADMINtoken.authorize,cFarm.getNotActiveWorkers)

module.exports = router