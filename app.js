const exp = require('express')
const app = exp()
require('dotenv').config()
const mongoose = require('mongoose')
mongoose.connect(process.env.dbUrl).then(()=>{
    console.log("DB connected")
}).catch(err=>{
    console.log(err)
})

const user = require('./routes/user')
const plan = require('./routes/plan')

app.use(exp.json())

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

app.use('/api',user)
app.use('/api',plan)

let x = false
let b = 0
app.get('/testUpdateBalance',(req,res,next)=>{
    if(x) {
        console.log('calculatingDurationTime&updatingUsersBalance ON')
        next()}
}, (req,res)=>{
        setInterval(function(){ 
        b=+new Date
        }, 3000);
        if(x) x=!x
})
app.get('/b',(req,res)=>{
    res.send(b+'')
})

app.listen(process.env.port,()=>{
    console.log('done on 8888')
    x=true
    //fetch('http://127.0.0.1:8888/testUpdateBalance')
})