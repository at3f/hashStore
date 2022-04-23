const mFarm = require('../models/mFarm')
const validationResult = require('express-validator').validationResult


exports.addWorker = async (req,res)=>{
    if(!validationResult(req).isEmpty()) return res.status(400).json(validationResult(req))
    const {workerName,address,workerID,pool} = req.body
    if(!workerName||!address||!workerID||!pool) return res.sendStatus(400)
    const worker = await mFarm.add({
        workerName:workerName,
        address:address,
        workerID:workerID,
        pool:pool
    })
    if(!worker) return res.sendStatus(400)
    res.sendStatus(200)
}

exports.deleteWorker = async(req,res)=>{
    const id = req.params.id
    if(!id)return res.sendStatus(400)
    const worker = await mFarm.delete(id)
    if(!worker) return res.sendStatus(400)
    res.sendStatus(200)
}

exports.endWorker = async(req,res)=>{
    const id = req.params.id
    if(!id)return res.sendStatus(400)
    const worker = await mFarm.end(id)
    if(!worker) return res.sendStatus(400)
    res.sendStatus(200)
}

exports.getActiveWorkers = async (req,res)=>{
    const workers = await mFarm.getActiveWorkers()
    if(!workers) return res.sendStatus(400)
    res.status(200).json(workers)
}

exports.getNotActiveWorkers = async (req,res)=>{
    const workers = await mFarm.getNotActiveWorkers()
    if(!workers) return res.sendStatus(400)
    res.status(200).json(workers)
}