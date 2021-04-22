require('dotenv/config')

const jwt = require('jsonwebtoken')

const User = require('../models/User')

const authenticate = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1]
        const decode = jwt.verify(token, process.env.JWT_TOKEN_KEY)

        req.user = decode
        next()
    }
    catch(error) {
        res.status(401).json({
            message: 'Authentication Failed!'
        })
    }
}

//User must be authenticated (use authenticate before)
const fullUser = async (req, res, next) => {
    const { _id } = req.user;

    const user = await User.findById(_id);
    if(user){
        req.user = user;
        next();
    }
    else res.status(404).json({
        message: 'Authentication - user not found'
    })
    
}

module.exports = {
    default: authenticate,
    fullUser: fullUser,
}