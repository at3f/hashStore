const COINPAYMENT = require('./COINPAYMENT')
const mTransaction = require('../models/mTransaction')
const mUser = require('../models/mUser')
const { verify } = require('coinpayments-ipn')


exports.getDepositAddress = async (req,res)=>{
    const currency = req.query.currency
    const userID = req.user.id
    if(!currency || !userID) return res.sendStatus(400)
    let userAddress = await mUser.getAddress(userID,currency)
    if(!userAddress) {
        userAddress = (await COINPAYMENT.getDepositAddress(currency)).address
        await mUser.setAddress(userID,userAddress,currency)
    }
    res.status(200).json({address:userAddress})
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
    if(status==="100") await mUser.UpdateBalance(userID,currency,amount)
    if(!deposit){
        if(!userID) return res.end()
        await mTransaction.addDeposit({
            _id:deposit_id,
            amount:+amount,
            currency:currency,
            transactionStatus:fStatus,
            txn_id:txn_id,
            userID:userID
        })
        return res.end()
    }
    await mTransaction.UpdateDeposit(deposit._id,{
        transactionStatus:fStatus
    })
    if(status==="100") await mUser.UpdateBalance(userID,currency,amount)
    res.end()
}

exports.setWithdrawRequest = async (req,res)=>{
    const {currency,amount,address} = req.body
    if(amount<=0||!currency||!amount||!address) return res.status(400).json({msg:'invalid credentials'})
    const userID = req.user.id
    const user = await mUser.getUser(userID)
    switch (currency) {
        case 'ETH':
            if(amount>user.balance.eth) return res.status(400).json({msg:'no sufficient balance'})
            break;
        case 'BTC':
            if(amount>user.balance.btc) return res.status(400).json({msg:'no sufficient balance'})
            break;
        case 'LTCT':
            if(amount>user.balance.ltct) return res.status(400).json({msg:'no sufficient balance'})
            break;
        default:
            return res.status(400).json({error:'invalid currency'})
            break
    }
    await mUser.UpdateBalance(userID,currency,-amount)
    const withdraw = await COINPAYMENT.withdraw(amount,currency,address)
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