const ADMIN = require('../DBSchemas')._ADMIN
const hasher = require('bcrypt')

// exports.testR = async (email,password) =>{
//     new ADMIN({
//         email:email,
//         password: await hasher.hash(password,10)
//     }).save()
// }

exports.isPassword = async password =>{
    try {
        const admin = await ADMIN.findById(process.env.adminID)
        return await hasher.compare(password,admin.password)
    } catch (error) {
        console.log(error)
    }
}
exports.setOTP = async OTP =>{
    try {
        return (await ADMIN.findByIdAndUpdate(process.env.adminID,{OTP:OTP}))
    } catch (error) {
        console.log(error)
    }
}
exports.UNsetOTP = async () =>{
    try {
        await ADMIN.findByIdAndUpdate(process.env.adminID,{$unset: {OTP: 1 }})
    } catch (error) {
        console.log(error)
    }
}

exports.getOTP = async ()=>{
    try {
        return (await ADMIN.findById(process.env.adminID)).OTP
    } catch (error) {
        console.log(error)
    }
}