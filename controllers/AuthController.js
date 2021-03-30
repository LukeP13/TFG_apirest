require('dotenv/config')

const User      = require('../models/User')
const bcrypt    = require('bcryptjs')
const jwt       = require('jsonwebtoken')

const register = (req, res, next) => {
    bcrypt.hash(req.body.password, 10, function(err, hashedPass){
        if(err){
            res.json({
                error: err
            })
        }

        let user = new User ({
            username:   req.body.username,
            email:      req.body.email,
            password:   hashedPass,
            phone:      req.body.phone
        })
        user.save()
            .then(user => {
                res.json({
                    message: 'User Added Successfully!'
                })
            })
            .catch(err => {
                res.json({
                    message: 'An error occured!'
                })
            })
    })
}

const login = (req, res, next) => {
    let _username = req.body.username
    let _password = req.body.password

    User.findOne({$or: [{email:_username}, {username:_username}]})
        .then(user => {
            if(user){
                bcrypt.compare(_password, user.password, function(err, result){
                    if(err){
                        res.json({
                            error: err
                        })
                    }

                    if(result){
                        let token = jwt.sign({name: user.name}, process.env.JWT_TOKEN_KEY, {expiresIn: process.env.LOGIN_EXPIRE_TIME || '1h'})
                        res.json({
                            message: 'Login successful!',
                            token
                        })
                    } else {
                        res.json({
                            message: 'Username or Password incorrect!'
                        })
                    }
                })
            } else {
                res.json({
                    message: 'No user found!'
                })
            }
        })
}

module.exports = {
    register,
    login
}