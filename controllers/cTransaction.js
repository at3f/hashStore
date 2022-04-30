const COINPAYMENT = require('./COINPAYMENT')
const mTransaction = require('../models/mTransaction')
const mUser = require('../models/mUser')
const mAsicContarct = require('../models/mAsicContract')
const mAsic = require('../models/mAsic')
const { verify } = require('coinpayments-ipn')
const validationResult = require('express-validator').validationResult

exports.getDepositAddress = async (req,res)=>{
    if(!validationResult(req).isEmpty()) return res.status(400).json(validationResult(req))
    const currency = req.query.currency
    const userID = req.user.id
    if(!currency || !userID) return res.sendStatus(400)
    let userAddress = await mUser.getAddress(userID,currency.toUpperCase())
    if(!userAddress) {
        userAddress = (await COINPAYMENT.getDepositAddress(currency.toUpperCase())).address
        await mUser.setAddress(userID,userAddress,currency)
    }
    res.status(200).json({address:userAddress})
}

exports.getDepositAddressForAsicContarct = async (req,res)=>{
    const asicID = req.query.asicID
    if(!asicID)return res.sendStatus(400)
    const asic = (await mAsic.getAsicByID(asicID))
    if(!asic) return res.sendStatus(400)
    const currency = asic.cryptoName
    let asicContractAddress = (await COINPAYMENT.getDepositAddressForAsicContract(currency)).address
    res.status(200).json({address:asicContractAddress})
}

exports.getDeposits = async (req,res)=>{
    const userID = req.user.id
    if(!userID) return res.sendStatus(400)
    let deposits = await mTransaction.getDeposits(userID)
    res.status(200).json(deposits)
}

exports.verifyNotification = (req, res, next) => {
    const {
        MERCHANT_ID,
        IPN_SECRET
      } = process.env
    if (
      !req.get(`HMAC`) ||
      !req.body.ipn_mode ||
      req.body.ipn_mode !== `hmac` ||
      MERCHANT_ID !== req.body.merchant
    ) {
      return res.sendStatus(400)
    }
    let isValid;
    isValid = verify(req.get(`HMAC`), IPN_SECRET, req.body);
    if (!isValid) {
      return res.sendStatus(400)
    }
    next()
  }

exports.depositNotification = async (req, res) => {
    const {address,amount,currency,deposit_id,status,txn_id} = req.body
    let fStatus
    let deposit =await mTransaction.getDeposit(deposit_id)
    let userID = await mUser.getUserIDByAddress(currency,address)
    status==="100"?fStatus="SUCCESS":fStatus="PENDING"
    if(status==="100") await mUser.UpdateBalance(userID,currency,amount-amount*0.005)
    if(!deposit){
        if(!userID) return res.end()
        await mTransaction.addDeposit({
            _id:deposit_id,
            amount:+amount-amount*0.005,
            currency:currency,
            transactionStatus:fStatus,
            txn_id:txn_id,
            userID:userID,
            depositSource:"USER"
        })
        return res.end()
    }
    await mTransaction.UpdateDeposit(deposit._id,{
        transactionStatus:fStatus
    })
    res.end()
}

exports.depositNotificationForAsicContract = async (req, res) => {
    const {address,amount,currency,deposit_id,status,txn_id} = req.body
     let fStatus
     let deposit =await mTransaction.getDeposit(deposit_id)
     let asicContract = await mAsicContarct.getAsicContarctByAddress(address)
     if(!asicContract) return res.end()
     let profit = (+amount-(asicContract.hostFees/100)*(+amount))
     status==="100"?fStatus="SUCCESS":fStatus="PENDING"
     if(status==="100") {
         await mAsicContarct.addNewProfit_Contract(asicContract._id,profit)
         await mUser.UpdateBalance(asicContract.userID,currency,profit)
    }
    if(!deposit){
        await mTransaction.addDeposit({
            _id:deposit_id,
            amount:profit,
            currency:currency,
            transactionStatus:fStatus,
            txn_id:txn_id,
            userID:asicContract.userID,
            depositSource:asicContract.asicName,
            asicContractID:asicContract._id
        })
        return res.end()
    }
    await mTransaction.UpdateDeposit(deposit._id,{
        transactionStatus:fStatus
    })
    res.end()
}

exports.setWithdrawRequest = async (req,res)=>{
    if(!validationResult(req).isEmpty()) return res.status(400).json(validationResult(req))
    const {currency,amount,address} = req.body
    if(amount<=0||!currency||!amount||!address) return res.status(400).json({ message:'invalid credentials'})
    const userID = req.user.id
    const user = await mUser.getUser(userID)
    let coin = currency.toUpperCase()
    switch (coin) {
        case 'ETH':
            if(amount>user.balance.eth) return res.status(400).json({message:'no sufficient balance'})
            break;
        case 'BTC':
            if(amount>user.balance.btc) return res.status(400).json({message:'no sufficient balance'})
            break;
        case 'LTCT':
            if(amount>user.balance.ltct) return res.status(400).json({message:'no sufficient balance'})
            break;
        case 'RVN':
            if(amount>user.balance.rvn) return res.status(400).json({message:'no sufficient balance'})
            break;
        default:
            return res.status(400).json({message:'invalid currency'})
            break
    }
    await mUser.UpdateBalance(userID,coin,-amount)
    const withdraw = await COINPAYMENT.withdraw(amount,coin,address)
    if(!withdraw) return res.status(400)
    await mTransaction.addWithdraw({
        _id:withdraw.id,
        address:address,
        amount:+amount,
        currency:currency,
        transactionStatus:"PENDING",
        userID:userID
    })
    res.status(200).json({withdrawID:withdraw.id})
}

exports.withdrawNotification = async (req, res) => {
    const {id,txn_id} = req.body
    const withdraw = await mTransaction.UpdateWithdraw(id,{
        transactionStatus:"SUCCESS",
        txn_id:txn_id
    })
    res.end()
}

exports.getWithdraws = async (req,res)=>{
    const userID = req.user.id
    if(!userID) return res.sendStatus(400)
    let withdraws = await mTransaction.getWithdraws(userID)
    res.status(200).json(withdraws)
}

exports.getUserDeposits = async (req,res)=>{
    const userID = req.params.id
    if(!userID) return res.sendStatus(400)
    let deposits = await mTransaction.getDeposits(userID)
    res.status(200).json(deposits)
}

exports.getUserWithdraws = async (req,res)=>{
    const userID = req.params.id
    if(!userID) return res.sendStatus(400)
    let withdraws = await mTransaction.getWithdraws(userID)
    res.status(200).json(withdraws)
}