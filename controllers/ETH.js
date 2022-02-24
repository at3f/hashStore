const fetch = require('node-fetch')

const calculateETHProfitability = async (userHashrateMHs,ethCoin=false) => {
    var res = await fetch('https://www.etherchain.org/index/data')
    var eth = await fetch('https://api.ethermine.org/poolStats')
    var data = await res.json()
    const blockTime = data.currentStats.block_time
    const networkHashRate = data.currentStats.hashrate
    const blockReward = data.currentStats.block_reward
    const etherPriceInUSD = (await eth.json()).data.price.usd
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

exports.calculateETHProfitability = calculateETHProfitability