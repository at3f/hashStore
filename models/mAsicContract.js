const AsicContract = require('../DBSchemas')._AsicContract

exports.getAsicsContract = async id =>{
    try{
        return await AsicContract.find({userID:id})
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
        await AsicContract.findByIdAndUpdate(id,data)
    } catch (error) {
        console.log(error)
    }
}

exports.expirationON = async id=>{
    try {
        await AsicContract.findByIdAndUpdate(id,{expired:on})
    } catch (error) {
        console.log(error)
    }
}

exports.getAsicsContract_needActivation = async ()=>{
    try {
        return await AsicContract.find({asicStatus:false})
    } catch (error) {
        console.log(error)
    }
}