const mongoose = require('mongoose')

let userSchema = mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    phone:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    balance:{type:Number,default:0},
    demoBalance:{type:Number,default:0}
})
let planSchema = mongoose.Schema({
    planType:{type:String,required:true},
    planName:{type:String,required:true},
    cryptoName:{type:String,required:true},
    algorithm:{type:String,required:true},
    planDuration:{type:Number,required:true},
    profitability:{type:Number,required:true},
    price:{type:Number,required:true},
    availability:{type:Boolean,default:true}
})
let planContractSchema = mongoose.Schema({
    startDate:{type:Date,required:true}, 
    endDate:{type:Date,required:true},
    totalMined:{type:Number,default:0},
    planStatus:{type:Boolean,required:true},
    hashPower:{type:Number,required:true},
    userID:{type:String,required:true},
    planID:{type:String,required:true}
})
let demo_planContractSchema = mongoose.Schema({
    startDate:{type:Date,required:true}, 
    endDate:{type:Date,required:true},
    totalMined:{type:Number,default:0},
    planStatus:{type:Boolean,required:true},
    userID:{type:String,required:true},
    planID:{type:String,required:true}
})
let asicSchema = mongoose.Schema({
    asicName:{type:String,required:true},
    cryptoName:{type:String,required:true},
    algorithm:{type:String,required:true},
    hashPower:{type:Number,required:true},
    price:{type:Number,required:true},
    hostFees:{type:Number,required:true},
    availability:{type:Boolean,required:true}
})
let asicContractSchema = mongoose.Schema({
    startDate:{type:Date}, 
    totalMined:{type:Number,default:0},
    userID:{type:String,required:true},
    asicID:{type:String,required:true}
})
let depositSchema = mongoose.Schema({
    date:{type:Date,required:true},
    amount:{type:Number,required:true},
    transactionStatus:{type:String,required:true},
    userID:{type:String,required:true}
})
let withdrawalSchema = mongoose.Schema({
    address:{type:String,required:true},
    date:{type:Date,required:true},
    amount:{type:Number,required:true},
    transactionStatus:{type:String,required:true},
    userID:{type:String,required:true}
})

exports._User = mongoose.model('user',userSchema)
exports._Plan = mongoose.model('plan',planSchema)
exports._PlanContract = mongoose.model('planContract',planContractSchema)
exports._Demo_planContractSchema = mongoose.model('demo_planContract',demo_planContractSchema)
exports._Asic = mongoose.model('asic',asicSchema)
exports._AsicContract = mongoose.model('asicContract',asicContractSchema)
exports._Deposit = mongoose.model('deposit',depositSchema)
exports._Withdrawal = mongoose.model('withdrawal',withdrawalSchema)
