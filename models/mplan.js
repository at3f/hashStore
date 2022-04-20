const Plan = require('../DBSchemas')._Plan



// getAllPlansBy(planType,cryptoName)
// addPlan ===> admin
// getPlanByID ===> admin
// updatePlanBy(ID) ===> admin
// deletePlanBy(ID) ===> admin

// getAllplansContractByUserID
// addPlanContract
// updatePlanContractTotalMined&hourlyGains&ContractStatus ====> SYSTEM


exports.addPlan = async (data) =>{
        try{
            let nplan = new Plan(data)
            let planSaved = await nplan.save()
            return planSaved
        }catch(error){
            console.log(error)
        }
}
exports.getPlans = async (planType,cryptoName,admin=false) =>{
    try{
        if(admin) return await Plan.find()
        return await Plan.find({cryptoName:cryptoName,planType:planType})
    }catch(error){
        console.log(error)
    }
}
exports.getPlanByID = async id =>{
    try{
        return await Plan.findById(id)
    }catch(error){
        console.log(error)
    }
}
exports.updatePlan = async (id,data)=>{
    try{
        return await Plan.findByIdAndUpdate(id,data)
    }catch(error){
        console.log(error)
    }
}
exports.deletePlan = async id =>{
    try{
        return await Plan.findByIdAndDelete(id)
    }catch(error){
        console.log(error)
    }
}

//======================================================
exports.totalPlans = async ()=>{
    try {
        return await Plan.countDocuments()
    } catch (error) {
        console.log(error)
    }
}

exports.planSubscribtion = async ()=>{
     return await Plan.aggregate([
     { "$addFields": { "planID": { "$toString": "$_id" }}},
     { "$lookup": {
       "from": "plancontracts",
       "localField": "planID",
       "foreignField": "planID",
       "as": "output"
     }},{
        $project:{
          _id:0,
          planName: 1,
          planType:1,
          cryptoName:1,
          numOfSubscribtions: {"$size": "$output"},
        }
      }])
}