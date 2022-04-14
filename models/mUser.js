const hasher = require('bcrypt')
const User = require('../DBSchemas')._User

exports.register = async (userName,email,phone,password) =>{
    try {
        let userMail = await User.findOne({email:email})
        let userPhone = await User.findOne({phone:phone})
        let userUserName = await User.findOne({userName:userName})
        if(userPhone) return 'Phone is used'
        else if(userUserName) return 'User Name is used'
        else if(userMail) return 'Email is used'
        else{
            let nuser = new User({
                userName:userName,
                email:email,
                phone:phone,
                password: await hasher.hash(password,10)
            })
            let userSaved = nuser.save()
            return userSaved
            }
    } catch (error) {
        console.log(error)
    }
}

exports.isUser = async(userName,password)=>{
    try {
        let user = await User.findOne({userName:userName})
        if(user&&await hasher.compare(password,user.password)){
            return true
        }else{
            return false
        }
    } catch (error) {
        console.log(error)
    }
}
exports.setOTP = async(userName,OTP) =>{
    try {
        return (await User.findOneAndUpdate({userName:userName},{OTP:OTP}))
    } catch (error) {
        console.log(error)
    }
}
exports.UNsetOTP = async userName =>{
    try {
        await User.findOneAndUpdate({userName:userName},{$unset: {OTP: 1 }})
    } catch (error) {
        console.log(error)
    }
}

exports.getUserAuth = async userName =>{
    try {
        var usersProjection = { 
            __v: false,
            password: false,
            email: false,
            phone:false,
            createdAt:false,
            updatedAt:false
        }; 
        return (await User.findOne({userName:userName},usersProjection))
    } catch (error) {
        console.log(error)
    }
}

// exports.login = async (email,password)=>{
//     let user = await User.findOne({email:email})
//     if(user&&await hasher.compare(password,user.password)){
//         return {
//             userID:user._id,
//             name:user.name,
//             email:user.email,
//             phone:user.phone,
//             balance:user.balance,
//             demoBalance:user.demoBalance,
//             activePlans:user.activePlans,
//             activeDemoPlans:user.activeDemoPlans,
//             devices:user.devices
//         }
//     }else{
//         return 'Wrong credentials'
//     }
// }

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

//===================================================================================
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
        return await User.findByIdAndUpdate(id,{password:await hasher.hash(newPassword,10),$unset: {'temporary.code': 1 }})
    } catch (error) {
        console.log(error)
    }
}

exports.getUser = async id =>{
    try {
        var usersProjection = { 
            __v: false,
            _id:false,
            password: false,
            email: false,
            phone:false,
            createdAt:false,
            updatedAt:false,
            depositAddress:false
        };    
        const user = await User.findById(id,usersProjection)
        if(user){
            return user
        }
        return false
    } catch (error) {
        console.log(error)
    }
}

// exports.setVcode = async id=>{
//     try {
//         if(id){
//             let code = Math.floor(Math.random() * 100000000000)
//             await User.findByIdAndUpdate(id,{'temporary.code':code})
//             return code
//         }
//     } catch (error) {
//         console.log(error)
//     }
// }
// exports.verifyAccount = async (id,code)=>{
//     try {
//         const user = await User.findById(id)
//         if(user.temporary.code==code){
//             await User.findByIdAndUpdate(id,{verified:true,$unset: {'temporary.code': 1 }})
//             return true
//         }
//         return false
//     } catch (error) {
//         console.log(error)
//     }
// }
// exports.getVerifiedStatus = async email =>{
//     try {
//         const user = await User.findOne({email:email})
//         return user.verified
//     } catch (error) {
//         console.log(error)
//     }
// }
exports.getAllUsers = async ()=>{
    try {
        var usersProjection = { 
            __v: false,
            password: false,
            createdAt:false,
        };
        return (await User.find({},usersProjection))
    } catch (error) {
        console.log(error)
    }
}
//==============================================
exports.setAddress = async (userID,address,currency)=>{
    try {
        switch (currency) {
            case 'ETH':
                await User.findByIdAndUpdate(userID,{'depositAddress.eth':address})
                break;
            case 'BTC':
                await User.findByIdAndUpdate(userID,{'depositAddress.btc':address})
                break;
            case 'LTCT':
                await User.findByIdAndUpdate(userID,{'depositAddress.ltct':address})
                break;
        }
    } catch (error) {
        console.log(error)
    }
}
exports.getAddress = async (userID,currency)=>{
    try {
        let userAddress
        switch (currency) {
            case 'ETH':
                userAddress = (await User.findById(userID)).depositAddress.eth
                break;
            case 'BTC':
                userAddress = (await User.findById(userID)).depositAddress.btc
                break;
            case 'LTCT':
                userAddress = (await User.findById(userID)).depositAddress.ltct
                break;
        }
        return userAddress
    } catch (error) {
        console.log(error)
    }
}

exports.getUserIDByAddress = async (currency,address) =>{
    try {
        switch (currency) {
            case 'ETH':
                return (await User.findOne({'depositAddress.eth':address}))._id
                break;
            case 'BTC':
                return (await User.findOne({'depositAddress.btc':address}))._id
                break;
            case 'LTCT':
                return (await User.findOne({'depositAddress.ltct':address}))._id
                break;
        }
    } catch (error) {
        console.log(error)
    }
}