const hasher = require('bcrypt')
const User = require('../DBSchemas')._User

exports.register = async (name,email,phone,password) =>{
    try {
        let user = await User.findOne({email:email})
    if(user){
        return 'Email is used'
    }else{
        user = null
        user = await User.findOne({phone:phone})
        if(user){
            return 'Phone is used' 
        }else{
            let nuser = new User({
                name:name,
                email:email,
                phone:phone,
                password: await hasher.hash(password,10)
            })
            let userSaved = nuser.save()
            return userSaved
        }
    }
    } catch (error) {
        console.log(error)
    }
}
exports.login = async (email,password)=>{
    let user = await User.findOne({email:email})
    if(user&&await hasher.compare(password,user.password)){
        return {
            userID:user._id,
            name:user.name,
            email:user.email,
            phone:user.phone,
            balance:user.balance,
            demoBalance:user.demoBalance,
            activePlans:user.activePlans,
            activeDemoPlans:user.activeDemoPlans,
            devices:user.devices
        }
    }else{
        return 'Wrong credentials'
    }
}

exports.update = async (id,password,newPassword)=>{
    let user = await User.findById(id)
    if(user&&await hasher.compare(password,user.password)){
        return await User.findByIdAndUpdate(id,{password:await hasher.hash(newPassword,10)})
    }else{
        return null
    }
}

exports.delete = async (id,password)=>{
    let user = await User.findById(id)
    if(user&&await hasher.compare(password,user.password)){
        return await User.findByIdAndRemove(id)
    }else{
        return null
    }
}

exports.UpdateActivePlans = async (id,op) =>{
     await User.findByIdAndUpdate(id,{
        $inc : {
            activePlans:op
        }
     })
}

exports.UpdateActiveDemoPlans = async (id,op) =>{
    await User.findByIdAndUpdate(id,{
        $inc : {
            activeDemoPlans:op
        }
    })
}


exports.get_N_UserActiveDemoPlans = async id =>{
    return (await User.findById(id)).activeDemoPlans
}

exports.UpdateBalance = async (id,currency,profit)=>{
    switch (currency) {
        case 'ETH':
            await User.findByIdAndUpdate(id,{
                $inc : {
                    'balance.eth':profit
                }
            })
            break
        case 'BTC':
            await User.findByIdAndUpdate(id,{
                $inc : {
                    'balance.btc':profit
                }
            })
            break
    }
}
exports.UpdateDemoBalance = async (id,currency,profit)=>{
    switch (currency) {
        case 'ETH':
            await User.findByIdAndUpdate(id,{
                $inc : {
                    'demoBalance.eth':profit
                }
            })
            break
        case 'BTC':
            await User.findByIdAndUpdate(id,{
                $inc : {
                    'demoBalance.btc':profit
                }
            })
            break
    }
}

exports.UpdateActiveAsics = async (id,op) =>{
    await User.findByIdAndUpdate(id,{
       $inc : {
            devices:op
       }
    })
}

exports.isMail = async mail =>{
    try {
        const user = await User.findOne({email:mail})
        if(user){
            let code = Math.floor(Math.random() * 10000000)
            await User.findByIdAndUpdate(user._id,{'temporary.code':code})
            return code
        }
        return false
    } catch (error) {
        console.log(error)
    }
}

exports.compareCode = async (mail,code) =>{
    try {
        const user = await User.findOne({email:mail})
        if(user){
            if(user.temporary.code == code)return user
            return 'Wrong Number'
        }
        return false
    } catch (error) {
        console.log(error)
    }
}
exports.updateNewPassword = async (id,newPassword)=>{
    try {
        return await User.findByIdAndUpdate(id,{password:await hasher.hash(newPassword,10),'temporary.code':0})
    } catch (error) {
        console.log(error)
    }
}

exports.getUser = async id =>{
    try {
        const user = await User.findById(id)
        if(user){
            return user
        }
        return false
    } catch (error) {
        console.log(error)
    }
}

exports.setVcode = async id=>{
    try {
        if(id){
            let code = Math.floor(Math.random() * 100000000000)
            await User.findByIdAndUpdate(id,{'temporary.code':code})
            return code
        }
    } catch (error) {
        console.log(error)
    }
}
exports.verifyAccount = async (id,code)=>{
    try {
        const user = await User.findById(id)
        if(user.temporary.code==code){
            await User.findByIdAndUpdate(id,{verified:true,'temporary.code':0})
            return true
        }
        return false
    } catch (error) {
        console.log(error)
    }
}