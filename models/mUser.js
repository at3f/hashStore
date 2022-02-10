const mongoose = require('mongoose')
const hasher = require('bcrypt')

let userSchema = mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    phone:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    balance:{type:Number,default:0}
})
let User = mongoose.model('user',userSchema)

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
        return user
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

// updateBalance