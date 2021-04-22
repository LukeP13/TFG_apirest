const mongoose      = require('mongoose')
const Schema        = mongoose.Schema

const TIME = {
    SECOND: 1000,
    MINUTE: 1000*60,
    HOUR:   1000*60*60,
    DAY:    1000*60*60*24,
    MONTH:  1000*60*60*24*30,
    YEAR:   1000*60*60*24*30*12
}

const IntervalSchema = Schema({
    time: { type: Number, default: TIME.MONTH},
    distance: { 
        value: { type: Number, default: 4000 },
        unit:  { type: String, default: "KM" }
    }
})

module.exports = {
    IntervalSchema
}