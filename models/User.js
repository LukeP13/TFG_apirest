const mongoose      = require('mongoose')
const Schema        = mongoose.Schema

const UserSchema    = Schema({
    //Login details
    username: { type: String, required: true, unique: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },

    //Optional
    phone:  { type: String },
    avatar: { type: String }
}, { timestamps: true})

const User = mongoose.model('Users', UserSchema)
module.exports = User