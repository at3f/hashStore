const PlanContract = require('../DBSchemas')._PlanContract
const DemoPlanContract = require('../DBSchemas')._Demo_planContract

exports.demoContractSTATUSoff = async id =>{
    await DemoPlanContract.findByIdAndUpdate(id,{planStatus:false})
}
exports.ContractSTATUSoff = async id =>{
    await PlanContract.findByIdAndUpdate(id,{planStatus:false})
}

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

exports.addNewProfit_demoContract = async (id,profit)=>{
    try{
        var hourlyGains = { date: Date.now(), profit: profit }
        await DemoPlanContract.findByIdAndUpdate(id,{
            $push:{
                hourlyGains:hourlyGains
            }
        })
        await DemoPlanContract.findByIdAndUpdate(id,{
            $inc : {totalMined:profit}
        })
    }catch(error){
        console.log(error)
    }
}
exports.addNewProfit_Contract = async (id,profit)=>{
    try{
        var hourlyGains = { date: Date.now(), profit: profit }
        await PlanContract.findByIdAndUpdate(id,{
            $push:{
                hourlyGains:hourlyGains
            }
        })
        await PlanContract.findByIdAndUpdate(id,{
            $inc : {totalMined:profit}
        })
    }catch(error){
        console.log(error)
    }
}