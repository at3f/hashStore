const mPlan = require('../models/mplan')
const mUser = require('../models/mUser')
const eth = require('./ETH')



const getPlansHashPower = async (plans)=>{
    const PlansHashPower = []
    for (let i = 0; i < plans.length; i++) {
        PlanHash = await eth.claculateETHhashrate(plans[i].price,130)
        PlansHashPower.push((plans[i]._id).toString(),PlanHash)
    }
    return PlansHashPower
}

exports.postAddPlan = async (req,res)=>{
    try{
        const {planType,planName,cryptoName,
            algorithm,planDuration,profitability,price} = req.body
            if(planType&&planName&&cryptoName&&
                algorithm&&planDuration&&profitability&&price){
                    let plan = await mPlan.addPlan({
                        planType:planType,
                        planName:planName,
                        cryptoName:cryptoName,
                        algorithm:algorithm,
                        planDuration:planDuration,
                        profitability:profitability,
                        price:price
                    })
                        if(plan){
                            res.sendStatus(201)
                        }else{
                            res.sendStatus(400)
                        }
                }else{
                    res.sendStatus(500)
                }
    }catch(error){
        res.sendStatus(500)
    }
}

exports.getGetPlans =async (req,res) =>{

    await mPlan.addPlanContract({
        startDate:Date.now(), 
        endDate:Date.now(),
        hashPower:765,
        userID:'76487464',
        planID:'87657688'
    })

    try{
        const {planType,cryptoName} = req.query
        if(planType&&cryptoName){
            const plans = await mPlan.getPlans(planType,cryptoName)
            if(plans[0]){
                // only years
               const PlansHashPower = await getPlansHashPower(plans)
               res.status(200).json({plans,PlansHashPower})
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
exports.putUpdatePlan = async (req,res)=>{
    try{
        const id = req.params.id
        const {planType,planName,cryptoName,
            algorithm,planDuration,profitability,price} = req.body
            if(id&&planType&&planName&&cryptoName&&
                algorithm&&planDuration&&profitability&&price){
                    let plan = await mPlan.updatePlan(id,{
                        planType:planType,
                        planName:planName,
                        cryptoName:cryptoName,
                        algorithm:algorithm,
                        planDuration:planDuration,
                        profitability:profitability,
                        price:price
                    })
                        if(plan){
                            res.sendStatus(200)
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
exports.deleteDeletePlan = async (req,res)=>{
    try{
        const id = req.params.id
            if(id){
                let plan = await mPlan.deletePlan(id)
                        if(plan){
                            res.sendStatus(200)
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

//==================================================


const endDemoContarct = (contractID,start,end) =>{
    const time = end-start 
    setTimeout(async () => {
       await mPlan.demoContractSTATUSoff(contractID)
    }, time);
}


exports.getGetPlansContract = async (req,res)=>{
    try{
        const {userID} = req.body
        if(userID){
            const plansContract = await mPlan.getPlansContract(userID)
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
                // not supported hash calc in short terms or n of years
                hashPower = await eth.claculateETHhashrate(plan.price,105)
               }else{
                endDate = startDate + plan.planDuration*year
                hashPower = await eth.claculateETHhashrate(plan.price,130)
               }
               if(startDate&&endDate&&hashPower){
                let planContract = await mPlan.addPlanContract({
                    startDate:startDate, 
                    endDate:endDate,
                    hashPower:hashPower,
                    userID:userID,
                    planID:planID
                })
                    if(planContract){
                        await mUser.UpdateActivePlans(userID)
                        // run userProfitCalculator
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
                // not supported hash calc in short terms or n of years
                hashPower = await eth.claculateETHhashrate(plan.price,105)
               }else{
                endDate = startDate + plan.planDuration*year
                hashPower = await eth.claculateETHhashrate(plan.price,130)
               }
               //more secure  (to reduce duplicated requests)
               if((await mUser.get_N_UserActiveDemoPlans(userID))>0) return res.status(400).send("U reached the max Number of demo plans")
               if(startDate&&endDate&&hashPower){
                let demoPlanContract = await mPlan.addDemoPlanContract({
                    startDate:startDate, 
                    endDate:endDate,
                    hashPower:hashPower,
                    userID:userID,
                    planID:planID
                })
                    if(demoPlanContract){
                        await mUser.UpdateActiveDemoPlans(userID)
                        // run userProfitCalculator
                        await endDemoContarct(demoPlanContract._id,startDate,startDate+100000)
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