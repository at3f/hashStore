const jwt = require('jsonwebtoken')

exports.getAccessToken_RefreshToken = async (user)=>{
    const u = user.email
    const accessToken = await jwt.sign({u},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:'30s'})
    const refreshToken = await jwt.sign({u},
        process.env.REFRESH_TOKEN_SECRET)
        return {accessToken,refreshToken}
}


exports.getNewAccessTokenByRefreshToken = async (token) => {
    return await jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }
        return jwt.sign({user},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'60s'})
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

// API Key