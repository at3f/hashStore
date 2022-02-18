const Plan = require('../DBSchemas')._Plan
const PlanContract = require('../DBSchemas')._PlanContract
const DemoPlanContract = require('../DBSchemas')._Demo_planContractSchema


// getAllPlansBy(planType,cryptoName)
// addPlan ===> admin
// getPlanByID ===> admin
// updatePlanBy(ID) ===> admin
// deletePlanBy(ID) ===> admin

// getAllplansContractByUserID
// addPlanContract
// updatePlanContractTotalMined&hourlyGains&ContractStatus ====> SYSTEM

exports.demoContractSTATUSoff = async id =>{
    await DemoPlanContract.findByIdAndUpdate(id,{planStatus:false})
}

exports.addPlan = async (data) =>{
        try{
            let nplan = new Plan(data)
            let planSaved = await nplan.save()
            return planSaved
        }catch(error){
            console.log(error)
        }
}
exports.getPlans = async (planType,cryptoName) =>{
    try{
        return await Plan.find({cryptoName:cryptoName,planType:planType})
    }catch(error){
        console.log(error)
    }
}
exports.getPlanByID = async id =>{
    try{
        return plan = await Plan.findById(id)
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
exports.getPlansContract = async id =>{
    try{
        return await PlanContract.find({userID:id})
    }catch(error){
        console.log(error)
    }
}
exports.addPlanContract = async (data) =>{
    try{
        let nplanContract = new PlanContract(data)
        let planContractSaved = await nplanContract.save()
        return planContractSaved
    }catch(error){
        console.log(error)
    }
}

exports.getDemoPlansContract = async id =>{
    try{
        return await DemoPlanContract.find({userID:id})
    }catch(error){
        console.log(error)
    }
}
exports.addDemoPlanContract = async (data) =>{
    try{
        if((await DemoPlanContract.find({userID:data.userID}))[0]){return null}
        else{
            let ndemoplanContract = new DemoPlanContract(data)
            let demoplanContractSaved = await ndemoplanContract.save()
            return demoplanContractSaved
        }
    }catch(error){
        console.log(error)
    }
}