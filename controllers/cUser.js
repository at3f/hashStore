const mUser = require('../models/mUser')
const jtoken = require('./JWT')
const MAAS = require('./MAAS')

let refreshTokens = []
const unsetotp = async userName=>{
    await setTimeout(async () => {
        await mUser.UNsetOTP(userName)
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

exports.postRegister = async (req,res)=>{
    const { userName,email,phone, password } = req.body;
    if(userName&&email&&password&&phone){
       let user = await mUser.register(userName,email,phone,password)
       if(user.email){
           res.sendStatus(201)
       }else{
           res.status(400).json(user)
       }
    }else{
        res.send('User name & Email & Password & phone are required')
    }
}

exports.isUser = async (req,res,next)=>{
    const { userName, password } = req.body;
    if(userName&&password){
        if((await mUser.isUser(userName, password))){
            next()
        }else{
            res.json('Wrong credentials')
        }
    }else{
        res.status(403).json('Wrong credentials')
    }
}
exports.sendOTP = async (req,res)=>{
    const { userName } = req.body;
    const OTP = await generatePassword()
    const user = await mUser.setOTP(userName,OTP)
    if(user){
        await MAAS.send(user.email,OTP,user.userName)
        await unsetotp(user.userName)
        res.status(200).json('sent OTP for 30s')
    }else{
        res.sendStatus(400)
    }
}
exports.Userlogin = async (req,res)=>{
    const {userName,otp} = req.body
    if(userName&&otp){
        let user = await mUser.getUserAuth(userName)
        if(user.OTP===otp){
            let jwt = await jtoken.getAccessToken_RefreshToken(user._id)
            refreshTokens.push(jwt.refreshToken)
            console.log(refreshTokens)
            res.status(202).json({jwt,user})
        }else{
            res.status(400).json('Wrong OTP')
        }
    }else{
        res.sendStatus(400)
    }
}

exports.postLogout = (req, res) => {
    const { token } = req.body;
    if (!refreshTokens.includes(token)) {
        return res.sendStatus(401);
    }
    refreshTokens = refreshTokens.filter(t => t !== token);
    console.log(refreshTokens)
    res.sendStatus(202)
};

exports.getNewAccessToken = async (req,res)=>{
    const { token } = req.body;
    if (!token) {
        return res.sendStatus(401);
    }

    if (!refreshTokens.includes(token)) {
        return res.sendStatus(401);
    }
    const x = await jtoken.getNewAccessTokenByRefreshToken(token)
    res.status(202).json(x)
}

exports.UpdatePassword = async(req,res)=>{
    const { password, newPassword } = req.body;
    const id = req.user.id
    if(id&&password&&newPassword){
        if(await mUser.update(id,password,newPassword)) res.sendStatus(201)
        else{
            res.status(402).send('right old Password is required')
        }
    }else{
        console.log(req.user)
        res.status(401).send('right old Password is required')
    }
}
exports.deleteUser = async(req,res,next)=>{
    const password = req.body.password
    const id = req.user.id
    if(id&&password){
        if(await mUser.delete(id,password)) next()
        else{
            res.status(401).send('right old Password is required')
        }
    }else{
        res.status(400).send('right old Password is required')
    }
}

exports.getUserData = async (req,res)=>{
    let user =await mUser.getUser(req.user.id)
    if(user)res.status(200).json(user)
}

//=======================================================================
exports.sendCode = async (req,res) =>{
    const email = req.body.email
    const found = await mUser.isMail(email)
    if(found){
        await MAAS.send(email,found)
        res.sendStatus(200)
    }else{
        res.status(401).send('Email Not Found!')
    }
}

exports.verifyCode = async (req,res) =>{
    const {email,code} = req.body
    if(email&&code){
        let rez = await mUser.compareCode(email,code)
        if(rez.email){
            let jwt = await jtoken.getToken(rez._id,code)
            res.status(200).json(jwt)
        }else{
            res.status(401).send(rez)
        }
    }else{
        res.sendStatus(400)
    }
}
exports.resetPassword = async (req,res)=>{
    const newPassword = req.body.newPassword
    const id = req.user.id
    if(newPassword&&id){
        let newUser = await mUser.updateNewPassword(id,newPassword)
        if(newUser) res.sendStatus(201)
    }else{
        res.sendStatus(400)
    }
}

//================================================================================
// exports.sendVerificationMail = async (req,res)=>{
//     const email = req.body.email
//     const id = req.user.id
//     if(id){
//         const code = await mUser.setVcode(id)
//         await MAAS.send(email,code,id)
//         res.sendStatus(200)
//     }else{
//         res.sendStatus(400)
//     }
// }
// exports.VerificationMail = async (req,res)=>{
//     const code = req.params.code
//     const id = req.params.id
//     if(code){
//         const verified = await mUser.verifyAccount(id,code)
//         if(verified) res.status(200).json('verified')
//         else res.sendStatus(400)
//     }else{
//         res.sendStatus(400)
//     }
// }
// exports.isVerified = async (req,res,next)=>{
//     email = req.body.email
//     if(!(await mUser.getVerifiedStatus(email))){
//         res.status(400).json('not Verified')}
//     else
//         next()
// }
//================================================================================
