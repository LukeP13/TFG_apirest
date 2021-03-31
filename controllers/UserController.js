const User      = require('../models/User');
const bcrypt    = require('bcryptjs')

const fs            = require('fs')
const { promisify } = require('util')

const compare = promisify(bcrypt.compare)


const getUsers = async (req, res) => {
    try{
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.json({message: err})
    }
}

const getUser = async (req, res) => {
    try{
        const user = await User.findById(req.params.id);
        res.json(user);
    } catch (err) {
        res.status(404).json({message: err})
    }
}

const update = async (req, res) => {
    //Doesn't change Password
    try{
        const user = await User.findById(req.params.id);

        const updated = await User.updateOne(
            { _id: req.params.id }, 
            { $set: {
                username:   req.body.username != null ? req.body.username : user.username,
                email:      req.body.email    != null ? req.body.email    : user.email,
                phone:      req.body.phone    != null ? req.body.phone    : user.phone,
                avatar:     req.file                  ? req.file.path     : user.avatar
            }}
        );
        res.json(updated)
    } catch(err) {
        res.json({message: err})
    }
}

const passwordUpdate = (req, res, next) => {
    const { id } =  req.params
    const { oldPassword, newPassword } = req.body

    User.findById(id)
        .then(async user => {
            const correct = await bcrypt.compare(oldPassword, user.password)
            
            if(correct) {
                await User.updateOne(
                    { _id: id },
                    { $set: { 
                        password: await bcrypt.hash(newPassword, 10)
                    }}
                )
                res.status(200).json({ message: 'Password updated!' })
            } else {
                res.status(401).json({ 
                    status:  'error',
                    message: 'Password incorrect'
                })
            }
        })
        .catch(_ => {
            res.status(404).json({
                status:  'error',
                message: 'No user found!'
            })
        })
}

const remove = async (req, res) => {
    try{
        const removedUser = await User.deleteOne({_id: req.params.id});
        res.json(removedUser);
    } catch(err) {
        res.json({message: err})
    }
}

module.exports = {
    getUser,
    getUsers,
    update,
    passwordUpdate,
    remove
}