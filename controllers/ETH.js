const fetch = require('node-fetch')

const calculateETHProfitability = async (userHashrateMHs,ethCoin=false) => {
    var res = await fetch('https://www.etherchain.org/index/data')
    var eth = await fetch('https://api.blockchain.com/v3/exchange/tickers/ETH-USD')
    var data = await res.json()
    const blockTime = data.currentStats.block_time
    const networkHashRate = data.currentStats.hashrate
    const blockReward = data.currentStats.block_reward
    const etherPriceInUSD = (await eth.json()).price_24h
    const blocksPerMin = 60.0 / blockTime
    const ethPerMin = blocksPerMin * blockReward
    const userRatio = (userHashrateMHs * 1e6) / networkHashRate
    const userEtherPerMin = userRatio * ethPerMin
    if(ethCoin) return await userEtherPerMin*60
    return await userEtherPerMin*60*etherPriceInUSD
}

exports.claculateETHhashrate = async (planPrice,profitRatio,duration) =>{
let dymmyHash = 100
let dymmyProfit = (await calculateETHProfitability(dymmyHash))*24*duration
let expectedProfit = (profitRatio/100)*planPrice
let expectedHash = (dymmyHash*expectedProfit)/dymmyProfit
return expectedHash
}

exports.USDtoETH = async (usd)=>{
    var eth = await fetch('https://api.blockchain.com/v3/exchange/tickers/ETH-USD')
    const etherPriceInUSD = (await eth.json()).last_trade_price
    return usd/etherPriceInUSD
}

exports.calculateETHProfitability = calculateETHProfitability