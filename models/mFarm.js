const Farm = require('../DBSchemas')._Farm

exports.add = async (data)=>{
    try {
        let nworker = new Farm(data)
        let workerSaved = await nworker.save()
        return workerSaved
    } catch (error) {
        console.log(error)
    }
}
exports.delete = async id=>{
    try {
        return await Farm.findByIdAndDelete(id)
    } catch (error) {
        console.log(error)
    }
}
exports.end = async id=>{
    try {
        return await Farm.findByIdAndUpdate(id,{workerStatus:false})
    } catch (error) {
        console.log(error)
    }
}
exports.getActiveWorkers = async ()=>{
    try {
        return await Farm.find({workerStatus:true})
    } catch (error) {
        console.log(error)
    }
}
exports.getNotActiveWorkers = async ()=>{
    try {
        return await Farm.find({workerStatus:false})
    } catch (error) {
        console.log(error)
    }
}