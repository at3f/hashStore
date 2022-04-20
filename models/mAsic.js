const Asic = require('../DBSchemas')._Asic

exports.addAsic = async (data) =>{
    try{
        let nasic = new Asic(data)
        let asicSaved = await nasic.save()
        return asicSaved
    }catch(error){
        console.log(error)
    }
}
exports.getAsics = async cryptoName =>{
    try{
        return await Asic.find()
    }catch(error){
        console.log(error)
    }
}
exports.getAsicByID = async id =>{
    try{
        return asic = await Asic.findById(id)
    }catch(error){
        console.log(error)
    }
}
exports.updateAsic = async (id,data)=>{
    try{
        return await Asic.findByIdAndUpdate(id,data)
    }catch(error){
        console.log(error)
    }
}
exports.deleteAsic = async id =>{
    try{
        return await Asic.findByIdAndDelete(id)
    }catch(error){
        console.log(error)
    }
}
exports.totalAsics = async ()=>{
    try {
        return await Asic.countDocuments()
    } catch (error) {
        console.log(error)
    }
}

exports.asicSubscribtion = async ()=>{
    return await Asic.aggregate([
    { "$addFields": { "asicID": { "$toString": "$_id" }}},
    { "$lookup": {
      "from": "asiccontracts",
      "localField": "asicID",
      "foreignField": "asicID",
      "as": "output"
    }},{
       $project:{
         _id:0,
         asicName: 1,
         numOfSubscribtions: {"$size": "$output"},
       }
     }])
}