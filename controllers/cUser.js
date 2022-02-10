const mUser = require('../models/mUser')
const jtoken = require('./JWT')

let refreshTokens = []

exports.postRegister = async (req,res)=>{
    const { name,email,phone, password } = req.body;
    if(name&&email&&password&&phone){
       let user = await mUser.register(name,email,phone,password)
       if(user.email){
           res.sendStatus(201)
       }else{
           res.status(400).json(user)
       }
    }else{
        res.send('Email & Password & phone are required')
    }
}

exports.postLogin = async (req,res)=>{
    const { email, password } = req.body;
    if(email&&password){
        let user = await mUser.login(email, password)
        if(user.email){
            let jwt = await jtoken.getAccessToken_RefreshToken(user)
            refreshTokens.push(jwt.refreshToken)
            console.log(refreshTokens)
            res.status(202).json({jwt,user})
        }else{
            res.status(403).json(user)
        }
    }else{
        res.status(403).json('Wrong credentials')
    }
}

exports.postLogout = (req, res) => {
    const { token } = req.body;
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
    const email = req.user.u
    if(email&&password&&newPassword){
        if(await mUser.update(email,password,newPassword)) res.sendStatus(201)
        else{
            res.status(402).send('right old Password is required')
        }
    }else{
        res.status(401).send('right old Password is required')
    }
}
exports.deleteUser = async(req,res,next)=>{
    const password = req.body.password
    const email = req.user.u
    if(email&&password){
        if(await mUser.delete(email,password)) next()
        else{
            res.status(401).send('right old Password is required')
        }
    }else{
        res.status(400).send('right old Password is required')
    }
}

// addBalance