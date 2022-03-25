const appTest = require('express')()
const fetch = require('node-fetch')


calculateBTCProfitability = async (userHashrateMHs) => {
  return fetch("https://blockchain.info/q/getdifficulty")

}


calculateETHProfitability = async (userHashrateMHs) => {
        const res = await fetch('https://www.etherchain.org/index/data')
        const eth = await fetch('https://api.ethermine.org/poolStats')
        const data = await res.json()

        const blockTime = data.currentStats.block_time
        const networkHashRate = data.currentStats.hashrate
        const blockReward = data.currentStats.block_reward
        const etherPriceInUSD = (await eth.json()).data.price.usd
        const blocksPerMin = 60.0 / blockTime
        const ethPerMin = blocksPerMin * blockReward

        const userRatio = (userHashrateMHs * 1e6) / networkHashRate
        const userEtherPerMin = userRatio * ethPerMin
        return await userEtherPerMin*60*etherPriceInUSD
}
claculateETHhashrate = async (planPrice,profitRatio) =>{
    let dymmyHash = 100
    let dymmyProfit = (await calculateETHProfitability(dymmyHash))*24*365
    let expectedProfit = (profitRatio/100)*planPrice
    let expectedHash = (dymmyHash*expectedProfit)/dymmyProfit
    console.log(expectedHash)
}

calculateBTCProfitability(0).then(x=>{
  console.log(x)
})
  appTest.listen(5555,()=>{
    console.log('done on 5555')
})