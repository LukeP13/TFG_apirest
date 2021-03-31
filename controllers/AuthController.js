require('dotenv/config')

const User          = require('../models/User')
const bcrypt        = require('bcryptjs')
const jwt           = require('jsonwebtoken')
const fs            = require('fs')
const { promisify } = require('util')

const unlinkAsync = promisify(fs.unlink)

const register = async (req, res, next) => {

    const hashedPass = await bcrypt.hash(req.body.password, 10);

    let user = new User ({
        username:   req.body.username,
        email:      req.body.email,
        password:   hashedPass,
        phone:      req.body.phone,
        avatar:     req.file ? req.file.path : null
    })

    user.save()
        .then(_ => res.json({ message: 'User Added Successfully!' }))
        .catch(async err => {
            if(req.file) await unlinkAsync(req.file.path)
            switch(err.code){
                case 11000: //Duplicate
                    return res.status(400).json({ status: 'error', error: 'Username or Email already exist' })
                default:
                    return res.status(500).json({ status: 'error', message: err.message })
            }
        })
}

const login = (req, res, next) => {
    let _username = req.body.username
    let _password = req.body.password

    User.findOne({$or: [{email:_username}, {username:_username}]})
        .then(user => {
            const correct = bcrypt.compare(_password, user.password)

            if(correct){
                let token = jwt.sign({name: user.name}, process.env.JWT_TOKEN_KEY, {expiresIn: process.env.LOGIN_EXPIRE_TIME || '1h'})
                res.json({
                    message: 'Login successful!',
                    token
                })
            } else {
                res.status(401).json({
                    status:  'error',
                    message: 'Username or Password incorrect!'
                })
            }
        })
        .catch(_ => {
            res.status(404).json({
                status: 'error',
                message: 'No user found!'
            })
        })
}

module.exports = {
    register,
    login
}