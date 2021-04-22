const mongoose              = require('mongoose')
const { IntervalSchema }    = require('./Interval')
const Schema                = mongoose.Schema

const ModelSchema   = Schema({
    name: { type: String, required: true },

    //Parameters
    revisio: { type:IntervalSchema, default: {} },
})

const Model = mongoose.model('Models', ModelSchema)
module.exports = {
    Model,
    ModelSchema
}