const mPlanContarct = require('../models/mPlanContract')
const mPlan = require('../models/mplan')
const mUser = require('../models/mUser')
const eth = require('./ETH')
const validationResult = require('express-validator').validationResult

// const endDemoContarct = (contractID,userID,start,end) =>{
//     const time = end-start 
//     setTimeout(async () => {
//        await mPlanContarct.demoContractSTATUSoff(contractID)
//        await mUser.UpdateActiveDemoPlans(userID,-1)
//     }, time);
// }
// const endContarct = (contractID,userID,start,end) =>{
//     const time = end-start 
//     setTimeout(async () => {
//        await mPlanContarct.ContractSTATUSoff(contractID)
//        await mUser.UpdateActivePlans(userID,-1)
//     }, time);
// }
// const Add_ETH_Profit = async PlanContract =>{
//     await mUser.UpdateActivePlans(PlanContract.userID,1)
//     const end = PlanContract.endDate
//     const hashPower = PlanContract.hashPower
//     z = Date.now() + 100000
//     //need job scheduler better then that scheduler
//     const x = await setInterval(async () => {
//         if(z<Date.now()) {
//             clearInterval(x)
//             await mPlanContarct.ContractSTATUSoff(PlanContract._id)
//             await mUser.UpdateActivePlans(PlanContract.userID,-1)
//             return
//         }
//         //let btcProfit = await btc.calculateBTCProfitability(hashPower,true)
//         let ethProfit = await eth.calculateETHProfitability(hashPower,true)
//         await mPlanContarct.addNewProfit_Contract(PlanContract._id,ethProfit)
//     }, 5000); // per hour 1000*60*60
// }
// const Add_ETH_demoProfit = async demoPlanContract =>{
//     await mUser.UpdateActiveDemoPlans(demoPlanContract.userID,1)
//     const end = demoPlanContract.endDate
//     const hashPower = demoPlanContract.hashPower
//     z = Date.now() + 100000
//     //need job scheduler better then that scheduler
//     const x = await setInterval(async () => {
//         if(z<Date.now()) {
//             clearInterval(x)
//             await mPlanContarct.demoContractSTATUSoff(demoPlanContract._id)
//             await mUser.UpdateActiveDemoPlans(demoPlanContract.userID,-1)
//             return
//         }

//         //let btcProfit = await eth.calculateBTCProfitability(hashPower,true)
//         let ethProfit = await eth.calculateETHProfitability(hashPower,true)
//         await mPlanContarct.addNewProfit_demoContract(demoPlanContract._id,ethProfit)
//     }, 1000); // per hour 1000*60*60
// }

let Contracts=[]
let contractManagerStatus=false
const contractManager = async ()=>{
    contractManagerStatus=true
    var ethProfit,TestEthProfit
    const period = 1000*60*60

    const m = await setInterval(async () => {
        if(Contracts.length===0){
            clearInterval(m)
            contractManagerStatus=false
            return
        }
        TestEthProfit = await eth.calculateETHProfitability(100,true)
        //TestBtcProfit = await btc.calculateBTCProfitability(100,true)
        Contracts.forEach(async c => {
            //c.startDate+100000 INSTEAD of c.endDate
            if(!c.demo){
                if(+c.endDate<Date.now()){
                    await mPlanContarct.ContractSTATUSoff(c._id)
                    await mUser.UpdateActivePlans(c.userID,-1)
                    Contracts = Contracts.filter(t => t !== c)
                    return
                }
                switch (c.cryptoName) {
                    case 'ETH':
                        ethProfit=c.hashPower*TestEthProfit/100
                        await mPlanContarct.addNewProfit_Contract(c._id,ethProfit)
                        await mUser.UpdateBalance(c.userID,c.cryptoName,ethProfit)
                        break
                    case 'BTC':
                        //btcProfit=c.hashPower*TestBtcProfit/100
                        //await mPlanContarct.addNewProfit_Contract(c._id,btcProfit)
                        //await mUser.UpdateBalance(c.userID,c.cryptoName,btcProfit)
                        break
                }
            }else{
                if(+c.endDate<Date.now()){
                    await mPlanContarct.demoContractSTATUSoff(c._id)
                    await mUser.UpdateActiveDemoPlans(c.userID,-1)
                    Contracts = Contracts.filter(t => t !== c)
                    return
                }
                ethProfit=c.hashPower*TestEthProfit/100
                await mPlanContarct.addNewProfit_demoContract(c._id,ethProfit)
                await mUser.UpdateBalance(c.userID,"LTCT",ethProfit)
            }
            
        })
    }, period);
    
}

//============================================================================================
// function to restore contractManager when server restart (load contracts)
//============================================================================================

exports.contractManagerLoader = async () =>{
     const activeContracts = await mPlanContarct.getActiveContracts()
     Contracts = activeContracts
     if(Contracts.length>0)contractManager()
}

//===================================================================
exports.getGetPlansContract = async (req,res)=>{
    try{
        const userID = req.user.id
        if(userID){
            const plansContract = await mPlanContarct.getPlansContract(userID)
               res.status(200).json(plansContract)
        }else{
            res.sendStatus(400)
        }
    }catch(error){
        res.sendStatus(500)
    }
}
exports.getGetDemoPlansContract = async (req,res)=>{
    try{
        const userID = req.user.id
        if(userID){
            const DemoPlansContract = await mPlanContarct.getDemoPlansContract(userID)
               res.status(200).json(DemoPlansContract)
        }else{
            res.sendStatus(400)
        }
    }catch(error){
        res.sendStatus(500)
    }
}

exports.postAddPlanContract = async (req,res)=>{
    try{
        if(!validationResult(req).isEmpty()) return res.status(400).json(validationResult(req))
        const {planID,currency} = req.body
        const userID = req.user.id
            if(userID&&planID&&currency){
                const plan = await mPlan.getPlanByID(planID)
                if(!plan||!plan.availability) return res.sendStatus(400)
                //===========
                const user = await mUser.getUser(userID)
                let coin = currency.toUpperCase()
                switch (coin) {
                    case 'ETH':
                        const priceInETH = await eth.USDtoETH(plan.price)
                        if(priceInETH>user.balance.eth) return res.status(400).json({ message:'no sufficient balance'})
                        await mUser.UpdateBalance(userID,coin,-priceInETH)
                        break;
                    case 'BTC':
                        const priceInBTC = await eth.USDtoBTC(plan.price)
                        if(priceInBTC>user.balance.btc) return res.status(400).json({ message:'no sufficient balance'})
                        await mUser.UpdateBalance(userID,coin,-priceInBTC)
                        break;
                    default:
                        return res.sendStatus(400)
                        break
                }
                //===========
                const sec = 1000,
                      min = 60*sec,
                      hour = 60*min,
                      day = 24*hour,
                      month = 30*day,
                      year = 12*month+5*day
               const startDate = Date.now()
               var endDate 
               var hashPower
               if(plan.planType==='short'){
                endDate = startDate + plan.planDuration*month
                hashPower = await eth.claculateETHhashrate(plan.price,plan.profitability,plan.planDuration*30)
               }else{
                endDate = startDate + plan.planDuration*year
                hashPower = await eth.claculateETHhashrate(plan.price,plan.profitability,plan.planDuration*365)
               }
               if(startDate&&endDate&&hashPower){
                let planContract = await mPlanContarct.addPlanContract({
                    demo:false,
                    cryptoName:plan.cryptoName,
                    startDate:startDate, 
                    endDate:endDate,
                    hashPower:hashPower,
                    userID:userID,
                    planID:planID
                })
                    if(planContract){
                        await mUser.UpdateActivePlans(planContract.userID,1)
                        Contracts.push(planContract)
                        if(Contracts.length===1)contractManager()
                        // run userProfitCalculator
                        //Add_ETH_Profit(planContract)
                        //==============
                        res.status(200).json({})
                    }else{
                        res.sendStatus(400)
                    }
               }
                }else{
                    res.sendStatus(500)
                }
    }catch(error){
        res.sendStatus(500)
    }
}
exports.postAddDemoPlanContract = async (req,res)=>{
    try{
        if(!validationResult(req).isEmpty()) return res.status(400).json(validationResult(req))
        const {planID,currency} = req.body
        const userID = req.user.id
        const plan = await mPlan.getPlanByID(planID)
        if(!plan||!plan.availability) return res.sendStatus(400)
        //===========
        const user = await mUser.getUser(userID)
        const priceInLTCT = plan.price
        if(priceInLTCT>user.balance.ltct) return res.status(400).json({ message:'no sufficient LTCT balance'})
        await mUser.UpdateBalance(userID,currency.toUpperCase(),-priceInLTCT)                    
                //===========
            if(userID&&planID&&currency){
                const sec = 1000,
                      min = 60*sec,
                      hour = 60*min,
                      day = 24*hour,
                      month = 30*day,
                      year = 12*month+5*day
               const startDate = Date.now()
               var endDate 
               var hashPower
               if(plan.planType==='short'){
                endDate = startDate + plan.planDuration*day
                hashPower = await eth.claculateETHhashrate(plan.price,plan.profitability,plan.planDuration*30)
               }else{
                endDate = startDate + plan.planDuration*3*day
                hashPower = await eth.claculateETHhashrate(plan.price,plan.profitability,plan.planDuration*365)
               }
               if(startDate&&endDate&&hashPower){
                let demoPlanContract = await mPlanContarct.addDemoPlanContract({
                    demo:true,
                    cryptoName:plan.cryptoName,
                    startDate:startDate, 
                    endDate:endDate,
                    hashPower:hashPower,
                    userID:userID,
                    planID:planID
                })
                    if(demoPlanContract){
                        await mUser.UpdateActiveDemoPlans(demoPlanContract.userID,1)
                        Contracts.push(demoPlanContract)
                        if(Contracts.length===1)contractManager()
                        res.status(200).json({})
                    }else{
                        res.sendStatus(400)
                    }
               }
                }else{
                    res.sendStatus(500)
                }
    }catch(error){
        console.log(error)
        res.sendStatus(500)
    }
}

exports.getUserPlansContract = async (req,res)=>{
    try{
        const userID = req.params.id
        if(userID){
            const plansContract = await mPlanContarct.getPlansContract(userID)
               res.status(200).json(plansContract)
        }else{
            res.sendStatus(400)
        }
    }catch(error){
        res.sendStatus(500)
    }
}