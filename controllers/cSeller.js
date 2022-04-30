const mSeller = require('../models/mSeller')
const mAsicContract = require('../models/mAsicContract')
const mAsic = require('../models/mAsic')
const mUser = require('../models/mUser')
const mPlanContarct = require('../models/mPlanContract')
const eth = require('./ETH')

exports.beASeller = async (req,res)=>{
    const userID = req.user.id
    const workers = await mAsicContract.getActiveAsicContracts(userID)
    if(!workers[0]) return res.sendStatus(400)
    if((await mSeller.getSellerAcc(userID)))return res.sendStatus(400)
    const seller = await mSeller.createSellerAcc({
        _id:userID
    })
    if(!seller)return res.sendStatus(400)
    const sec = 1000,
          min = 60*sec,
          hour = 60*min,
          day = 24*hour,
          month = 30*day,
          year = 12*month+5*day
     await workers.filter(worker => (+worker.startDate+2*year)>Date.now())
    .forEach( async worker => {
        await mSeller.addworker({
            _id:worker._id,
            availableHashrate:worker.hashPower,
            sellerID:userID
        })
        
    })
    res.sendStatus(200)
}

exports.getworkers = async (req,res)=>{
    const userID = req.user.id
    if(!userID)return res.sendStatus(400)
    let workers = await mSeller.getworkers(userID)
    res.status(200).json(workers)
}
exports.ADMINgetworkers = async (req,res)=>{
    const userID = req.params.id
    if(!userID)return res.sendStatus(400)
    let workers = await mSeller.getworkers(userID)
    res.status(200).json(workers)
}

exports.addPlan = async (req,res)=>{
    const sellerWorkerID = req.params.id
    const {planName,price,hashPower} = req.body
    const userID = req.user.id
    const sellerWorker = await mSeller.getSellerWorkerByID(sellerWorkerID)
    if(!sellerWorker||!(userID===sellerWorker.sellerID)||!(sellerWorker.availableHashrate>=hashPower))return res.sendStatus(400)
    const asicContract = await mAsicContract.getAsicContarctByID(sellerWorkerID)
    if(!asicContract) return res.sendStatus(400)
    const asic = await mAsic.getAsicByID(asicContract.asicID)
    if(!asic) return res.sendStatus(400)
    const plan = await mSeller.addWorkerPlan({
        planName:planName,
        cryptoName:asic.cryptoName,
        algorithm:asic.algorithm,
        price:price,
        hashPower:hashPower,
        sellerWorkerID:sellerWorkerID,
        sellerID:userID
    })
    if(!plan) return res.sendStatus(400)
    res.sendStatus(200)
}

exports.updatePlan = async (req,res)=>{
    const userID = req.user.id
    const sellerWorkerID = req.params.id
    const planID = req.params.planID
    const {planName,price,hashPower} = req.body
    const sellerWorker = await mSeller.getSellerWorkerByID(sellerWorkerID)
    if(!sellerWorker||!(userID===sellerWorker.sellerID)||!(sellerWorker.availableHashrate>=hashPower))return res.sendStatus(400)
    const plan = await mSeller.updateWorkerPlan(planID,{
        planName:planName,
        price:price,
        hashPower:hashPower,
    })
    if(!plan) return res.sendStatus(400)
    res.sendStatus(200)
}
exports.deletePlan = async (req,res)=>{
    const userID = req.user.id
    const sellerWorkerID = req.params.id
    const planID = req.params.planID
    const sellerWorker = await mSeller.getSellerWorkerByID(sellerWorkerID)
    if(!sellerWorker||!(userID===sellerWorker.sellerID))return res.sendStatus(400)
    const plan = await mSeller.deleteWorkerPlan(planID)
    if(!plan) return res.sendStatus(400)
    res.sendStatus(200)
}
exports.getWorkerPlans = async (req,res)=>{
    const sellerWorkerID = req.params.id
    const workerPlans = await mSeller.getWorkerPlans(sellerWorkerID)
    if(!workerPlans) return res.sendStatus(400)
    res.status(200).json({workerPlans})
}


exports.getSellers = async (req,res)=>{
    const sellers = await mSeller.getSellers()
    if(!sellers)return res.sendStatus(400)
    res.status(200).json({sellers})
}
exports.getSellerPlans = async (req,res)=>{
    const sellerID = req.params.id
    if(!sellerID)return res.sendStatus(400)
    const sellerPlans = await mSeller.getSellerPlans(sellerID)
    if(!sellerPlans)return res.sendStatus(400)
    res.status(200).json({sellerPlans})
}

exports.addPlanContract = async (req,res)=>{
    const userID = req.user.id
    const {planID,currency} = req.body
    if(!userID||!planID||!currency)return res.sendStatus(400)
    const plan = await mSeller.getWorkerPlanByID(planID)
    if(!plan||userID===plan.sellerID) return res.sendStatus(400)
    const sellerWorker = await mSeller.getSellerWorkerByID(plan.sellerWorkerID)
    const worker = await mAsicContract.getAsicContarctByID(plan.sellerWorkerID)
    const sec = 1000,
            min = 60*sec,
            hour = 60*min,
            day = 24*hour,
            month = 30*day,
            year = 12*month+5*day
    if(sellerWorker.availableHashrate<plan.hashPower||(+worker.startDate+2*year)<Date.now())return res.status(400).json({ message:'try another seller or another plan'})
    const user = await mUser.getUser(userID)
    let coin = currency.toUpperCase()
    switch (coin) {
        case 'ETH':
            const priceInETH = await eth.USDtoETH(plan.price)
            if(priceInETH>user.balance.eth) return res.status(400).json({ message:'no sufficient balance'})
            await mUser.UpdateBalance(userID,coin,-priceInETH)
            await mUser.UpdateBalance(plan.sellerID,coin,priceInETH)
            break;
        case 'BTC':
            const priceInBTC = await eth.USDtoBTC(plan.price)
            if(priceInBTC>user.balance.btc) return res.status(400).json({ message:'no sufficient balance'})
            await mUser.UpdateBalance(userID,coin,-priceInBTC)
            await mUser.UpdateBalance(plan.sellerID,coin,priceInBTC)
            break;
        default:
            return res.sendStatus(400)
            break
    }
    const startDate = Date.now(),
            endDate = startDate+year
        let planContract = await mPlanContarct.addPlanContract({
            demo:false,
            cryptoName:plan.cryptoName,
            startDate:startDate, 
            endDate:endDate,
            hashPower:plan.hashPower,
            userID:userID,
            planID:planID,
            seller:true,
            sellerWorkerID:plan.sellerWorkerID
        })

        if(planContract){
            await mUser.UpdateActivePlans(userID,1)
            await mSeller.updateSellerWorkerHashRate(plan.sellerWorkerID,-plan.hashPower)
            await mSeller.updateSellerWorkerconnectedUsers(plan.sellerWorkerID,1)
            await mSeller.updateSellerSubcribers(plan.sellerID,1)
        }else{
            res.sendStatus(400)
        }
        res.sendStatus(200)
}
exports.getPlanContractsBySellerWorkerID = async (req,res)=>{
    const sellerWorkerID = req.params.id
    if(!sellerWorkerID)return res.sendStatus(400)
    const planContracts = await mPlanContarct.getSellerWorkerPlanContracts(sellerWorkerID)
    if(!planContracts)return res.sendStatus(400)
    res.status(200).json({planContracts})
}