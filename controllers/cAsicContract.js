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