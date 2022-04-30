const Seller = require('../DBSchemas')._Seller
const SellerWorkers = require('../DBSchemas')._SellerWorkers
const SellerPlans = require('../DBSchemas')._SellerPlans

exports.createSellerAcc = async data=>{
    try {
        let nseller = new Seller(data)
        let sellerSaved = await nseller.save()
        return sellerSaved
    } catch (error) {
        console.log(error)
    }
}
exports.getSellerAcc = async id=>{
    try {
        return await Seller.findById(id)
    } catch (error) {
        console.log(error)
    }
}
exports.getSellers = async ()=>{
    try {
        return await Seller.aggregate([
            { "$project": { 
                "sellerID": { "$toObjectId": "$_id" },
                "subscribers":1,
                "_id":0
                }
             },
            { "$lookup": {
                "from": "users",
                "localField": "sellerID",
                "foreignField": "_id",
                "pipeline": [
                    { "$project": { 
                        "_id":0,
                        "userName": 1,
                        "email":1,
                        "phone":1
                     }}
                  ],
                "as": "sellerData"
            }}
        ])
    } catch (error) {
        console.log(error)
    }
}
//====================
exports.updateSellerWorkerHashRate = async (id,hashrate)=>{
    await SellerWorkers.findByIdAndUpdate(id,{
        $inc : {
            availableHashrate:hashrate
        }
     })
}
exports.updateSellerWorkerconnectedUsers = async (id,user)=>{
    await SellerWorkers.findByIdAndUpdate(id,{
        $inc : {
            totalConnectedUsers:user
        }
     })
}
exports.updateSellerSubcribers = async (id,user)=>{
    await Seller.findByIdAndUpdate(id,{
        $inc : {
            subscribers:user
        }
     })
}
exports.addworker = async data=>{
    try {
        let nsellerworker = new SellerWorkers(data)
        let sellerworkerSaved = await nsellerworker.save()
        return sellerworkerSaved
    } catch (error) {
        console.log(error)
    }
}
exports.getworkers = async id =>{
    try {
        return await SellerWorkers.aggregate([
            { 
                "$match": {
                  "sellerID": id
                }
            },
            { "$project": { 
                "workerObjId": { "$toObjectId": "$_id" },
                "availableHashrate":1,
                "totalConnectedUsers":1,
                "sellerID":1
                }
             },
            { "$lookup": {
                "from": "asiccontracts",
                "localField": "workerObjId",
                "foreignField": "_id",
                "as": "workerData"
            }},
            
        ])
    } catch (error) {
        console.log(error)
    }
}
exports.getSellerWorkerByID = async id=>{
    try {
        return await SellerWorkers.findById(id)
    } catch (error) {
        console.log(error)
    }
}
//================================
exports.getSellerPlans = async id =>{
    try {
        return await SellerPlans.find({sellerID:id})
    } catch (error) {
        console.log(error)
    }
}
exports.getWorkerPlans = async id =>{
    try {
        return await SellerPlans.find({sellerWorkerID:id})
    } catch (error) {
        console.log(error)
    }
}
exports.getWorkerPlanByID = async id=>{
    try {
        return await SellerPlans.findById(id)
    } catch (error) {
        console.log(error)
    }
}
exports.addWorkerPlan = async data =>{
    try {
        let nworkerplan = new SellerPlans(data)
        let sellerplanSaved = await nworkerplan.save()
        return sellerplanSaved
    } catch (error) {
        console.log(error)
    }
}
exports.updateWorkerPlan = async (id,data) =>{
    try {
        return await SellerPlans.findByIdAndUpdate(id,data)
    } catch (error) {
        console.log(error)
    }
}
exports.deleteWorkerPlan = async id =>{
    try {
        return await SellerPlans.findByIdAndDelete(id)
    } catch (error) {
        console.log(error)
    }
}
