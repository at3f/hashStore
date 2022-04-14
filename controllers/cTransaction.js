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
    status==="100"?fStatus="SUCCESS":fStatus="PENDING"
    if(!deposit){
        let userID = await mUser.getUserIDByAddress(currency,address)
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
    res.end()
}