const mAsicContarct = require('../models/mAsicContract')
const mUser = require('../models/mUser')
const mAsic = require('../models/mAsic')
const eth = require('./ETH')

exports.getGetAsicsContract = async (req,res)=>{
    try{
        const userID = req.user.id
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
        const {asicID,currency} = req.body
        const userID = req.user.id
        if(userID&&asicID&&currency){
            const asic = await mAsic.getAsicByID(asicID)
            if(!asic) res.sendStatus(400)
            //===========
            const user = await mUser.getUser(userID)
            switch (currency) {
                case 'ETH':
                    const priceInETH = await eth.USDtoETH(asic.price)
                    if(priceInETH>user.balance.eth) return res.status(400).json({ message:'no sufficient balance'})
                    await mUser.UpdateBalance(userID,currency,-priceInETH)
                    break;
                case 'BTC':
                    const priceInBTC = await eth.USDtoBTC(plan.price)
                    if(priceInBTC>user.balance.btc) return res.status(400).json({ message:'no sufficient balance'})
                    await mUser.UpdateBalance(userID,currency,-priceInBTC)
                    break;
                default:
                    return res.sendStatus(400)
                    break
            }
            //===========
            let asicContract = await mAsicContarct.addAsicContract({
                startDate:Date.now()+1000*60*60*24*30, // month
                asicName:asic.asicName,
                userID:userID,
                asicID:asicID,
                hostFees:asic.hostFees
            })
            if(asicContract)res.status(200).json({})
            else res.sendStatus(400)
        }else{
            res.sendStatus(400)
        }
    } catch (error) {
        console.log(error)
    }
}

exports.activateAsicContarct = async (req,res)=>{
    try {
        const contractID = req.params.id
        const {address,workerID} = req.body
        if(contractID&&address&&workerID){
            let asicContract = await mAsicContarct.updateAsicContract(contractID,{
                asicStatus:true,
                address:address,
                workerID:workerID
            })
            if(asicContract){
                await mUser.UpdateActiveAsics(asicContract.userID,1)
                res.sendStatus(200)
            }
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
        const contractID = req.params.id
        if(contractID){
            let asicContract = await mAsicContarct.expirationON(contractID)
            if(asicContract){
                await mUser.UpdateActiveAsics(asicContract.userID,-1)
                res.sendStatus(200)
            }
            else res.sendStatus(400)
        }else{
            res.sendStatus(400)
        }
    } catch (error) {
        console.log(error)
    }
}

exports.getNotActiveAsicsContract = async(req,res)=>{
    try {
            let asicContracts = await mAsicContarct.getAsicsContract_needActivation()
            if(asicContracts)res.status(200).json(asicContracts)
            else res.sendStatus(400)
    } catch (error) {
        console.log(error)
    }
}
//==========
exports.getActiveAsicsContract = async(req,res)=>{
    try {
            let asicContracts = await mAsicContarct.getAsicsContract_notneedActivation()
            if(asicContracts)res.status(200).json(asicContracts)
            else res.sendStatus(400)
    } catch (error) {
        console.log(error)
    }
}
exports.getUserAsicsContract = async (req,res)=>{
    try{
        const userID = req.params.id
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