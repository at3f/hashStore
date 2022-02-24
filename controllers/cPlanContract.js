const mPlanContarct = require('../models/mPlanContract')
const mPlan = require('../models/mPlan')
const mUser = require('../models/mUser')
const eth = require('./ETH')

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


const Add_ETH_demoProfit = async demoPlanContract =>{
    await mUser.UpdateActiveDemoPlans(demoPlanContract.userID,1)
    const end = demoPlanContract.endDate
    const hashPower = demoPlanContract.hashPower
    z = Date.now() + 100000
    //need job scheduler better then that scheduler
    const x = await setInterval(async () => {
        if(z<Date.now()) {
            clearInterval(x)
            await mPlanContarct.demoContractSTATUSoff(demoPlanContract._id)
            await mUser.UpdateActiveDemoPlans(demoPlanContract.userID,-1)
            return
        }

        //let btcProfit = await eth.calculateBTCProfitability(hashPower,true)
        let ethProfit = await eth.calculateETHProfitability(hashPower,true)
        await mPlanContarct.addNewProfit_demoContract(demoPlanContract._id,ethProfit)
    }, 1000); // per hour 1000*60*60
}

//\\ +++To Be Implemented+++ //\\
// let ethContracts=[]
// const contractManagement = 

const Add_ETH_Profit = async PlanContract =>{
    await mUser.UpdateActivePlans(PlanContract.userID,1)
    const end = PlanContract.endDate
    const hashPower = PlanContract.hashPower
    z = Date.now() + 100000
    //need job scheduler better then that scheduler
    const x = await setInterval(async () => {
        if(z<Date.now()) {
            clearInterval(x)
            await mPlanContarct.ContractSTATUSoff(PlanContract._id)
            await mUser.UpdateActivePlans(PlanContract.userID,-1)
            return
        }
        //let btcProfit = await eth.calculateBTCProfitability(hashPower,true)
        let ethProfit = await eth.calculateETHProfitability(hashPower,true)
        await mPlanContarct.addNewProfit_Contract(PlanContract._id,ethProfit)
    }, 5000); // per hour 1000*60*60
}

//============================================================================================
// function to restore endContract and Add_ETH_Profit when server off then on (load contracts)
//============================================================================================

//===================================================================
exports.getGetPlansContract = async (req,res)=>{
    try{
        const {userID} = req.body
        if(userID){
            const plansContract = await mPlanContarct.getPlansContract(userID)
            if(plansContract[0]){
               res.status(200).json(plansContract)
            }else{
                res.sendStatus(400)
            }
        }else{
            res.sendStatus(400)
        }
    }catch(error){
        res.sendStatus(500)
    }
}
exports.getGetDemoPlansContract = async (req,res)=>{
    try{
        const {userID} = req.body
        if(userID){
            const DemoPlansContract = await mPlanContarct.getDemoPlansContract(userID)
            if(DemoPlansContract[0]){
               res.status(200).json(DemoPlansContract)
            }else{
                res.sendStatus(400)
            }
        }else{
            res.sendStatus(400)
        }
    }catch(error){
        res.sendStatus(500)
    }
}

exports.postAddPlanContract = async (req,res)=>{
    try{
        const {userID,planID} = req.body
            if(userID&&planID){
                const sec = 1000,
                      min = 60*sec,
                      hour = 60*min,
                      day = 24*hour,
                      month = 30*day,
                      year = 12*month+5*day
               const startDate = Date.now()
               const plan = await mPlan.getPlanByID(planID)
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
                    startDate:startDate, 
                    endDate:endDate,
                    hashPower:hashPower,
                    userID:userID,
                    planID:planID
                })
                    if(planContract){
                        // run userProfitCalculator
                        Add_ETH_Profit(planContract)
                        //==============
                        res.sendStatus(201)
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
        const {userID,planID} = req.body
        if((await mUser.get_N_UserActiveDemoPlans(userID))>0) return res.status(400).send("U reached the max Number of demo plans")
            if(userID&&planID){
                const sec = 1000,
                      min = 60*sec,
                      hour = 60*min,
                      day = 24*hour,
                      month = 30*day,
                      year = 12*month+5*day
               const startDate = Date.now()
               const plan = await mPlan.getPlanByID(planID)
               var endDate 
               var hashPower
               if(plan.planType==='short'){
                endDate = startDate + plan.planDuration*month
                hashPower = await eth.claculateETHhashrate(plan.price,plan.profitability,plan.planDuration*30)
               }else{
                endDate = startDate + plan.planDuration*year
                hashPower = await eth.claculateETHhashrate(plan.price,plan.profitability,plan.planDuration*365)
               }
               //more secure  (to reduce duplicated requests)
               if((await mUser.get_N_UserActiveDemoPlans(userID))>0) return res.status(400).send("U reached the max Number of demo plans")
               if(startDate&&endDate&&hashPower){
                let demoPlanContract = await mPlanContarct.addDemoPlanContract({
                    startDate:startDate, 
                    endDate:endDate,
                    hashPower:hashPower,
                    userID:userID,
                    planID:planID
                })
                    if(demoPlanContract){
                        // run userProfitCalculator
                        await Add_ETH_demoProfit(demoPlanContract)
                        //=====
                        res.sendStatus(201)
                    }else{
                        res.status(400).send("U reached the max Number of demo plans")
                    }
               }
                }else{
                    res.sendStatus(500)
                }
    }catch(error){
        res.sendStatus(500)
    }
}