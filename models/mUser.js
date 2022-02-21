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
            email:user.email,
            phone:user.phone,
            balance:user.balance,
            demoBalance:user.demoBalance,
            activePlans:user.activePlans,
            devices:user.devices
        }
    }else{
        return 'Wrong credentials'
    }
}

exports.update = async (email,password,newPassword)=>{
    let user = await User.findOne({email:email})
    if(user&&await hasher.compare(password,user.password)){
        return await User.updateOne({email:email},{password:await hasher.hash(newPassword,10)})
    }else{
        return null
    }
}

exports.delete = async (email,password)=>{
    let user = await User.findOne({email:email})
    if(user&&await hasher.compare(password,user.password)){
        return await User.deleteOne({email:email})
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
// updateBalance