const PlanContract = require('../DBSchemas')._PlanContract

exports.getSellerWorkerPlanContracts = async (sellerWorkerID)=>{
    try {
        return await PlanContract.aggregate([
            { 
                "$match": {
                  "sellerWorkerID": sellerWorkerID
                }
            },
            { "$lookup": {
                "let": { "planObjId": { "$toObjectId": "$planID" } },
                "from": "sellerplans",
                "pipeline": [
                  { "$match": 
                        { 
                            "$expr": { 
                                "$eq": [ 
                                    "$_id", "$$planObjId"
                                 ]
                             }
                         }
                  },
                  { "$project": { 
                    "_id":0,
                    "planName": 1,
                    }
                  }
                ],
                "as": "planDetails"
              }
            },
            { "$lookup": {
                "let": { "userObjId": { "$toObjectId": "$userID" } },
                "from": "users",
                "pipeline": [
                  { "$match": 
                        { 
                            "$expr": { 
                                "$eq": [ 
                                    "$_id", "$$userObjId"
                                 ]
                             }
                         }
                  },
                  { "$project": { 
                    "_id":0,
                    "userName": 1,
                    "email":1,
                    "phone":1
                    }
                  }
                ],
                "as": "userDetails"
              }
            },
            { "$project": { 
                "_id":0,
                "startDate":1,
                "endDate":1,
                "totalMined":1,
                "planDetails":1,
                "userDetails":1,
                }
             },
        ])
    } catch (error) {
        console.log(error)
    }
}

exports.demoContractSTATUSoff = async id =>{
    try {
        await PlanContract.findByIdAndUpdate(id,{planStatus:false})
    } catch (error) {
        console.log(error)
    }
}
exports.ContractSTATUSoff = async id =>{
    try {
        await PlanContract.findByIdAndUpdate(id,{planStatus:false})
    } catch (error) {
        console.log(error)
    }
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
            let ndemoplanContract = new PlanContract(data)
            let demoplanContractSaved = await ndemoplanContract.save()
            return demoplanContractSaved
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


exports.getActiveContracts = async()=>{
    try{
        return await PlanContract.find({planStatus:true,seller:false})
    }catch(error){
        console.log(error)
    }
}

exports.totalPlanContarcts = async ()=>{
    try {
        return await PlanContract.countDocuments({demo:false})
    } catch (error) {
        console.log(error)
    }
}

exports.getWorkerPlanContracts = async id=>{
    try {
        return await PlanContract.find({sellerWorkerID:id,planStatus:true})
    } catch (error) {
        console.log(error)
    }
}