const jwt = require('jsonwebtoken')

exports.getAccessToken_RefreshToken = async (user)=>{
    const id = user.userID
    const accessToken = await jwt.sign({id},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:'86400s'})
    const refreshToken = await jwt.sign({id},
        process.env.REFRESH_TOKEN_SECRET)
        return {accessToken,refreshToken}
}


exports.getNewAccessTokenByRefreshToken = async (token) => {
    return await jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        const id = user.id
        return jwt.sign({id},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'86400s'})
    })
    
};

exports.authorize = (req, res, next) => {

    const authHeader = req.headers.authorization
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(401);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

