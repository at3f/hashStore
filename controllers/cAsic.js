const mAsic = require('../models/mAsic')
const mAsicContarct = require('../models/mAsicContract')
const validationResult = require('express-validator').validationResult

exports.postAddAsic = async (req,res)=>{
    try{
        if(!validationResult(req).isEmpty()) return res.status(400).json(validationResult(req))
        const {
            asicName,
            cryptoName,
            algorithm,
            hashPower,
            price,
            hostFees,
        } = req.body
            if(asicName&&cryptoName&&algorithm&&hashPower&&price&&hostFees){
                    let asic = await mAsic.addAsic({
                        asicName:asicName,
                        cryptoName:cryptoName.toUpperCase(),
                        algorithm:algorithm.toUpperCase(),
                        hashPower:hashPower,
                        price:price,
                        hostFees:hostFees
                    })
                        if(asic){
                            res.sendStatus(200)
                        }else{
                            res.sendStatus(400)
                        }
                }else{
                    res.sendStatus(500)
                }
    }catch(error){
        res.sendStatus(500)
    }
}

exports.getGetAsicByID = async (req,res)=>{
    try {
        const id = req.params.id
        if(id){
            res.status(200).json(await mAsic.getAsicByID(id))
        }else{
            res.sendStatus(400)
        }
    } catch (error) {
        console.log(error)
    }
}

exports.getGetAsics =async (req,res) =>{
    try{
            const asics = await mAsic.getAsics()
            if(asics[0]){
               res.status(200).json(asics)
            }else{
                res.sendStatus(400)
            }
    }catch(error){
        res.sendStatus(500)
    }
}

exports.putUpdateAsic = async (req,res)=>{
    try{
        if(!validationResult(req).isEmpty()) return res.status(400).json(validationResult(req))
        const id = req.params.id
        const {
            asicName,
            cryptoName,
            algorithm,
            hashPower,
            price,
            hostFees,
            availability,
        } = req.body
            if(id&&asicName&&cryptoName&&algorithm&&hashPower&&price&&hostFees){
                    let asic = await mAsic.updateAsic(id,{
                        asicName:asicName,
                        cryptoName:cryptoName.toUpperCase(),
                        algorithm:algorithm.toUpperCase(),
                        hashPower:hashPower,
                        price:price,
                        hostFees:hostFees,
                        availability:availability
                    })
                        if(asic){
                            res.sendStatus(200)
                        }else{
                            res.sendStatus(400)
                        }
            }else{
                res.sendStatus(400)
            }
    }catch(error){
        res.sendStatus(500)
    }
}

exports.deleteDeleteAsic = async (req,res)=>{
    try{
        const id = req.params.id
            if(id){
                const chck = await mAsicContarct.checkAsicContract(id)
                if(chck[0])return res.sendStatus(400)
                let asic = await mAsic.deleteAsic(id)
                        if(asic){
                            res.sendStatus(200)
                        }else{
                            res.sendStatus(400)
                        }
            }else{
                res.sendStatus(400)
            }
    }catch(error){
        res.sendStatus(500)
    }
}