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

app.use(exp.json())

app.get('/api',async (req,res)=>{
    res.sendStatus("ok")
})

app.use('/api',user)

app.listen(process.env.port,()=>{
    console.log('done on 8888')
})