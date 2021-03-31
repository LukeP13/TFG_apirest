require('dotenv/config')

const jwt = require('jsonwebtoken')

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

module.exports = authenticate;