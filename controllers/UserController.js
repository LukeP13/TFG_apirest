const User = require('../models/User');
const bcrypt    = require('bcryptjs')



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

const patchUser = async (req, res) => {
    //Doesn't change Password
    try{
        const user = await User.findById(req.params.id);

        const updated = await User.updateOne(
            { _id: req.params.id }, 
            { $set: {
                username: req.body.username != undefined ? req.body.username : user.username,
                email: req.body.email != undefined ? req.body.email : user.email,
                phone: req.body.phone != undefined ? req.body.phone : user.phone
            }}
        );
        res.json(updated);
    } catch(err) {
        res.json({message: err})
    }
}

const passwordChange = (req, res, next) => {
    let oldPassword = req.body.oldPassword
    let newPassword = req.body.newPassword

    User.findById(req.params.id)
        .then(user => {
            if(user){
                bcrypt.compare(oldPassword, user.password, function(err, result){
                    if(err){
                        res.json({
                            error: "Error compare"
                        })
                    }

                    if(result){
                        bcrypt.hash(newPassword, 10, async function(err, hashedPass){
                            if(err){
                                res.json({
                                    error: err
                                })
                            }
                            try{
                                const user = await User.updateOne(
                                    { _id: req.params.id }, 
                                    { $set: {
                                        password: hashedPass
                                    }}
                                );
                                res.json(user);
                            } catch(err) {
                                res.json({ message: "error update" })
                            }
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

const deleteUser = async (req, res) => {
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
    patchUser,
    deleteUser,
    passwordChange
}