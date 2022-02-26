const mAsicContarct = require('../models/mAsicContract')


exports.getGetAsicsContract = async (req,res)=>{
    try{
        const {userID} = req.body
        if(userID){
            const asicsContract = await mAsicContarct.getAsicsContract(userID)
            res.status(200).json(asicsContract)
        }else{
            res.sendStatus(400)
        }
    }catch(error){
        res.sendStatus(500)
    }
}

exports.postAddAsicContract = async (req,res)=>{
    try {
        const {userID,asicID} = req.body
        if(userID&&asicID){
            let asicContract = mAsicContarct.addAsicContract({
                startDate:Date.now()+1000*60*60*24*30, // month
                userID:userID,
                asicID:asicID
            })
            if(asicContract)res.sendStatus(201)
            else res.sendStatus(400)
        }else{
            res.sendStatus(400)
        }
    } catch (error) {
        console.log(error)
    }
}

exports.acceptAsicContract = async (req,res)=>{
    try {
        const {contractID} = req.params
        const {address} = req.body
        if(contractID){
            let asicContract = await mAsicContarct.updateAsicContract({
                asicStatus:true,
                address:address
            })
            if(asicContract)res.sendStatus(201)
            else res.sendStatus(400)
        }else{
            res.sendStatus(400)
        }
    } catch (error) {
        console.log(error)
    }
}

exports.endAsicContract = async(req,res)=>{
    try {
        const {contractID} = req.params
        if(contractID){
            let asicContract = await mAsicContarct.expirationON(contractID)
            if(asicContract)res.sendStatus(201)
            else res.sendStatus(400)
        }else{
            res.sendStatus(400)
        }
    } catch (error) {
        console.log(error)
    }
}
exports.activateAsicContarct = async(req,res)=>{
    try {
            let asicContracts = await mAsicContarct.getAsicsContract_needActivation()
            if(asicContracts)res.status(200).json(asicContracts)
            else res.sendStatus(400)
    } catch (error) {
        console.log(error)
    }
}