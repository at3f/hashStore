const Deposit = require('../DBSchemas')._Deposit
const Withdraw = require('../DBSchemas')._Withdraw

exports.addDeposit = async data =>{
    try {
        let ndeposit = new Deposit(data)
        let depositSaved = ndeposit.save()
        return depositSaved
    } catch (error) {
        console.log(error)
    }
}
exports.UpdateDeposit = async (depositID,data) =>{
    try {
        return await Deposit.findByIdAndUpdate(depositID,data)
    } catch (error) {
        console.log(error)
    }
}
exports.getDeposits = async userID =>{
    try {
        return await Deposit.find({userID:userID})
    } catch (error) {
        console.log(error)
    }
}
exports.getDeposit = async id =>{
    try {
        return await Deposit.findById(id)
    } catch (error) {
        console.log(error)
    }
}
//=========================================================================
exports.addWithdraw = async data =>{
    try {
        let nwithdraw = new Withdraw(data)
        let withdrawSaved = nwithdraw.save()
        return withdrawSaved
    } catch (error) {
        console.log(error)
    }
}
exports.UpdateWithdraw = async (withdrawID,data)=>{
    try {
        return await Withdraw.findByIdAndUpdate(withdrawID,data)
    } catch (error) {
        console.log(error)
    }
}
exports.getWithdraws = async userID =>{
    try {
        return await Withdraw.find({userID:userID})
    } catch (error) {
        console.log(error)
    }
}

exports.totalWithdrawals = async ()=>{
    try {
        return await Withdraw.countDocuments()
    } catch (error) {
        console.log(error)
    }
}

exports.totalDeposits = async ()=>{
    try {
        return await Deposit.countDocuments({depositSource:"USER"})
    } catch (error) {
        console.log(error)
    }
}