const PlanContract = require('../DBSchemas')._PlanContract

exports.demoContractSTATUSoff = async id =>{
    await PlanContract.findByIdAndUpdate(id,{planStatus:false})
}
exports.ContractSTATUSoff = async id =>{
    await PlanContract.findByIdAndUpdate(id,{planStatus:false})
}

exports.getPlansContract = async id =>{
    try{
        return await PlanContract.find({userID:id,demo:false})
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
        return await PlanContract.find({userID:id,demo:true})
    }catch(error){
        console.log(error)
    }
}

exports.addDemoPlanContract = async (data) =>{
    try{
        if((await PlanContract.find({userID:data.userID,demo:true}))[0]){return null}
        else{
            let ndemoplanContract = new PlanContract(data)
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
        await PlanContract.findByIdAndUpdate(id,{
            $push : {
                hourlyGains:hourlyGains
            },
            $inc : {
                totalMined:profit
            }
        })
    }catch(error){
        console.log(error)
    }
}
exports.addNewProfit_Contract = async (id,profit)=>{
    try{
        var hourlyGains = { date: Date.now(), profit: profit }
        await PlanContract.findByIdAndUpdate(id,{
            $push : {
                hourlyGains:hourlyGains
            },
            $inc : {
                totalMined:profit
            }
        })
    }catch(error){
        console.log(error)
    }
}
