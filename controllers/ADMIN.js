const mADMIN = require('../models/ADMIN')
const jtoken = require('./ADMINJWT')
const MAAS = require('./MAAS')

// exports.test = async (req,res)=>{
//     await mADMIN.testR(req.body.email,req.body.password)
//     res.sendStatus(200)
// }

var ADMINrefreshToken

const unsetotp = async ()=>{
    await setTimeout(async () => {
        await mADMIN.UNsetOTP()
    }, 30000);
}

const generatePassword = async ()=> {
    var length = 16,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

exports.isAdminPassword = async (req,res,next)=>{
    const password = req.body.password
    if(password){
        if((await mADMIN.isPassword(password))){
            next()
        }else{
            res.status(400).json({ message:'Wrong Password'})
        }
    }else{
        res.sendStatus(400)
    }
}
exports.sendOTP = async (req,res)=>{
    const OTP = await generatePassword()
    const admin = await mADMIN.setOTP(OTP)
    if(admin){
        await MAAS.send(admin.email,OTP,'admin')
        unsetotp()
        res.status(200).json( {message:'sent OTP for 30s'})
    }else{
        res.sendStatus(400)
    }
}

exports.ADMINlogin = async (req,res)=>{
    const OTP = req.body.otp
    if(OTP){
        if(OTP===(await mADMIN.getOTP())){
            let jwt = await jtoken.getAccessToken_RefreshToken(process.env.adminID)
            ADMINrefreshToken = jwt.refreshToken
            console.log(ADMINrefreshToken)
            res.status(200).json({jwt})
        }else{
            res.status(400).json( {message:'Wrong OTP'})
        }
    }else{
        res.sendStatus(400)
    }
}

exports.getNewAccessToken = async (req,res)=>{
    const { token } = req.body;
    if (!token) {
        return res.sendStatus(401);
    }

    if (ADMINrefreshToken!==token) {
        return res.sendStatus(401);
    }
    const x = await jtoken.getNewAccessTokenByRefreshToken(token)
    if(!x) return res.sendStatus(401);
    res.status(200).json({accessToken:x})
}

exports.ADMINLogout = (req, res) => {
    const { token } = req.body;
    if (ADMINrefreshToken!==token) {
        return res.sendStatus(401);
    }
    ADMINrefreshToken = ""
    console.log(ADMINrefreshToken)
    res.sendStatus(200)
};