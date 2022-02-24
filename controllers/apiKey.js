exports.verifyClient = (req,res,next) =>{
    key = req.query.key
    if(key){
        if(key===process.env.api_key)next()
    }else {
        res.status(404).send("UnAuthorized Client")
    }
}