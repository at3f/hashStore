const mAsicContarct = require('../models/mAsicContract')
const mUser = require('../models/mUser')
const mAsic = require('../models/mAsic')
const eth = require('./ETH')
const mTransaction = require('../models/mTransaction')
const mFarm = require('../models/mFarm')
const validationResult = require('express-validator').validationResult

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
        if(!validationResult(req).isEmpty()) return res.status(400).json(validationResult(req))
        const {asicID,currency} = req.body
        const userID = req.user.id
        if(userID&&asicID&&currency){
            const asic = await mAsic.getAsicByID(asicID)
            if(!asic)return res.sendStatus(400)
            //===========
            const user = await mUser.getUser(userID)
            let coin = currency.toUpperCase()
            switch (coin) {
                case 'ETH':
                    const priceInETH = await eth.USDtoETH(asic.price)
                    if(priceInETH>user.balance.eth) return res.status(400).json({ message:'no sufficient balance'})
                    await mUser.UpdateBalance(userID,coin,-priceInETH)
                    break;
                case 'BTC':
                    const priceInBTC = await eth.USDtoBTC(asic.price)
                    if(priceInBTC>user.balance.btc) return res.status(400).json({ message:'no sufficient balance'})
                    await mUser.UpdateBalance(userID,coin,-priceInBTC)
                    break;
            }
            //===========
            let asicContract = await mAsicContarct.addAsicContract({
                startDate:Date.now()+1000*60*60*24*30, // month
                asicName:asic.asicName,
                userID:userID,
                asicID:asicID,
                hostFees:asic.hostFees,
                hashPower:asic.hashPower
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
        if(!validationResult(req).isEmpty()) return res.status(400).json(validationResult(req))
        const contractID = req.params.id
        const {address,workerID,pool} = req.body
        if(contractID&&address&&workerID&&pool){
            let asicContract = await mAsicContarct.updateAsicContract(contractID,{
                asicStatus:true,
                address:address,
                workerID:workerID,
                pool:pool
            })
            if(asicContract){
                await mUser.UpdateActiveAsics(asicContract.userID,1)
                const user = await mUser.getUser(asicContract.userID)
                await mFarm.add({
                    workerName:asicContract.asicName,
                    address:address,
                    workerID:workerID,
                    pool:pool,
                    owner:user.userName
                })
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

exports.getAsicContarctPayouts = async (req,res)=>{
    const userID = req.user.id
    const asicContractID = req.params.id
    if(!asicContractID || !userID) res.sendStatus(400)
    const payouts = await mTransaction.getPayouts(userID,asicContractID)
    res.status(200).json(payouts)
}
