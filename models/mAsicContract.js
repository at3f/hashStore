const AsicContract = require('../DBSchemas')._AsicContract

exports.getAsicContarctByID = async id=>{
    try{
        return await AsicContract.findById(id)
    }catch(error){
        console.log(error)
    }
}
exports.getAsicsContract = async id =>{
    try{
        return await AsicContract.find({userID:id})
    }catch(error){
        console.log(error)
    }
}
exports.getActiveAsicContracts = async id =>{
    try{
        return await AsicContract.find({userID:id,asicStatus:true})
    }catch(error){
        console.log(error)
    }
}
exports.addAsicContract = async (data) =>{
    try{
        let nasicContract = new AsicContract(data)
        let asicContractSaved = await nasicContract.save()
        return asicContractSaved
    }catch(error){
        console.log(error)
    }
}

exports.updateAsicContract = async (id,data)=>{
    try {
        return await AsicContract.findByIdAndUpdate(id,data)
    } catch (error) {
        console.log(error)
    }
}

exports.expirationON = async id=>{
    try {
        return await AsicContract.findByIdAndUpdate(id,{expired:true,asicStatus:false})
    } catch (error) {
        console.log(error)
    }
}

exports.getAsicsContract_needActivation = async ()=>{
    try {
        return await AsicContract.find({asicStatus:false,expired:false})
    } catch (error) {
        console.log(error)
    }
}
exports.getAsicsContract_notneedActivation = async ()=>{
    try {
        return await AsicContract.find({asicStatus:true})
    } catch (error) {
        console.log(error)
    }
}

exports.getAsicContarctByAddress = async (address)=>{
    try {
        return await AsicContract.findOne({address:address})
    } catch (error) {
        console.log(error)
    }
}

exports.addNewProfit_Contract = async (id,profit)=>{
    try{
        await AsicContract.findByIdAndUpdate(id,{
            $inc : {
                totalMined:profit
            }
        })
    }catch(error){
        console.log(error)
    }
}


exports.totalActiveAsicContarcts = async () =>{
    try{
        return await AsicContract.countDocuments({asicStatus:true})
    }catch(error){
        console.log(error)
    }
}
exports.totalAsicContarctsOnDemand = async () =>{
    try{
        return await AsicContract.countDocuments({asicStatus:false,expired:false})
    }catch(error){
        console.log(error)
    }
}

exports.checkAsicContract = async asicID =>{
    try {
        return await AsicContract.find({asicID:asicID})
    } catch (error) {
        console.log(error)
    }
}