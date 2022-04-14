const Coinpayments = require('coinpayments')

const client = new Coinpayments({
    key: "bf53298c1d7c602d68c48e18d9aa727232d69adc2129b4760f8a9fac8ae7e152",
    secret: "473E01A7E9255ce8535CdFc66262aD813B1c5a5AFDd27bCf17C59ca3683Dc43e"
});

exports.withdraw = async (amount,currency,address)=>{
    return await client.createWithdrawal({
        amount:amount,
        currency: currency,
        address:address,
        ipn_url:'https://dealer0.herokuapp.com/notify2'
    })
}
exports.getDepositAddress = async currency=>{
    return await client.getCallbackAddress({
        currency: currency,
        ipn_url:'https://cominer.herokuapp.com/api/deposit'
    })
}