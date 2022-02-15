const appTest = require('express')()
const fetch = require('node-fetch')



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

 calculateETHProfitability(1000).then(u=>{
    console.log(u)
 })

claculateETHhashrate = async (planPrice,profitRatio) =>{
    let dymmyHash = 100
    let dymmyProfit = (await calculateETHProfitability(dymmyHash))*24*365
    let expectedProfit = (profitRatio/100)*planPrice
    let expectedHash = (dymmyHash*expectedProfit)/dymmyProfit
    console.log(expectedHash)
}

claculateETHhashrate(10000,125)


  appTest.listen(5555,()=>{
    console.log('done on 5555')
})