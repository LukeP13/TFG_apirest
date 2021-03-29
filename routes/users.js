const express = require('express');
const router = express.Router();
const User = require('../models/User');


//Restrict permissions
router.get('/', async (req, res) => {
    try{
        const users = await User.find();
        res.json(users);

    } catch (err) {
        res.json({message: err})
    }
});

//Get one user
router.get('/:id', async (req, res) => {
    try{
        const user = await User.findById(req.params.id);
        res.json(user);
    } catch (err) {
        res.status(404).json({message: err})
    }
});


//Post user
router.post('/', async (req, res) => {
    console.log(req.body);
    const user = new User({
        username: req.body.username,
        password: req.body.password,
        name: req.body.name,
        email: req.body.email
    });

    try{
        const savedUser = await user.save();
        res.json(savedUser);
    } catch (err) {
        res.json({message: err})
    }
});


//PATCH
router.patch('/:id', async (req, res) => {
    try{
        const removedUser = await User.updateOne(
            { _id: req.params.id }, 
            { $set: req.body }
        );
        res.json(removedUser);
    } catch(err) {
        res.json({message: err})
    }
});


//DELETE
router.delete('/:id', async (req, res) => {
    try{
        const removedUser = await User.deleteOne({_id: req.params.id});
        res.json(removedUser);
    } catch(err) {
        res.json({message: err})
    }
});


//EXPORT
module.exports = router;