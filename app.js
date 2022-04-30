const exp = require('express')
const cors = require('cors')
const app = exp()
require('dotenv').config()
const mongoose = require('mongoose')
mongoose.connect(process.env.db).then(()=>{
    console.log("DB connected")
}).catch(err=>{
    console.log(err)
})

const user = require('./routes/user')
const plan = require('./routes/plan')
const asic = require('./routes/asic')
const ADMIN = require('./routes/ADMIN')
const transaction = require('./routes/transaction')
const farm = require('./routes/farm')
const seller = require('./routes/seller')
const cLoader = require('./controllers/cPlanContract')

app.use(exp.urlencoded({ extended: true }))
app.use(exp.json())
app.use(cors())

// yourNumber = parseInt(0x81dae8d5e161e8);
// const web3 = require('web3')
// app.get('/api',async (req,res)=>{
//     res.send(web3.utils.fromWei(1637077241+'', 'ether'))
// })

 const fetch = require('node-fetch')
// app.get('/api2',async (req,res)=>{
//     fetch('https://api-etc.ethermine.org/miner/0x53832d554c163ab5c01198b7b209d79472f3cf33/payouts')
//     .then(res => res.json())
//     .then(json => {
//         res.send(json.data);
//     })
//     setInterval(function(){ 
//         console.log(+new Date)
//     }, 3000);
// })

const apiKey = require('./controllers/apiKey')
app.use('/api/farm',apiKey.verifyClient,farm)
app.use('/api/seller',apiKey.verifyClient,seller)
app.use('/api/transaction',transaction)
app.use('/api',apiKey.verifyClient,user)
app.use('/api/plan',apiKey.verifyClient,plan)
app.use('/api/asic',apiKey.verifyClient,asic)
app.use('/admin',apiKey.verifyClient,ADMIN)

app.get('/',apiKey.verifyClient,(req,res)=>{
    res.send("API is ON")
})

app.listen(process.env.PORT||8888,'0.0.0.0',()=>{
    cLoader.contractManagerLoader()
    console.log('done on 8888')
})