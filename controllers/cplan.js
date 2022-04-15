const mPlan = require('../models/mplan')
const eth = require('./ETH')

let coins = ["ETH","BTC"]

const getETHPlansHashPower = async (plans,type)=>{
    const PlansHashPower = []
    for (let i = 0; i < plans.length; i++) {
        PlanHash = await eth.claculateETHhashrate(plans[i].price,plans[i].profitability,plans[i].planDuration*type)
        PlansHashPower.push((plans[i]._id).toString(),PlanHash)
    }
    return PlansHashPower
}

exports.postAddPlan = async (req,res)=>{
    try{
        const {
            planType,
            planName,
            cryptoName,
            algorithm,
            planDuration,
            profitability,
            price
        } = req.body
            if(planType&&planName&&coins.includes(cryptoName)&&algorithm&&planDuration&&profitability&&price){
                    let plan = await mPlan.addPlan({
                        planType:planType,
                        planName:planName,
                        cryptoName:cryptoName,
                        algorithm:algorithm,
                        planDuration:planDuration,
                        profitability:profitability,
                        price:price,
                        availability:true
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

exports.getGetPlanByID = async (req,res)=>{
    try {
        const id = req.params.id
        if(id){
            res.status(200).json(await mPlan.getPlanByID(id))
        }else{
            res.sendStatus(400)
        }
    } catch (error) {
        console.log(error)
    }
}

exports.getGetPlans =async (req,res) =>{
    try{
        const {planType,cryptoName} = req.query
        if(planType&&coins.includes(cryptoName)){
            const plans = await mPlan.getPlans(planType,cryptoName)
            if(plans[0]){
               var type
               planType==="long"?type=365:type=30
               const PlansHashPower = await getETHPlansHashPower(plans,type)
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
            if(id&&planType&&planName&&coins.includes(cryptoName)&&
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

