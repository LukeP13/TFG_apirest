const mongoose      = require('mongoose')
const Schema        = mongoose.Schema

const {ModelSchema}         = require('./Model')

const BrandSchema   = Schema({
    name:   { type: String, required: true },
    models: [ ModelSchema ]
})

const Brand = mongoose.model('Brands', BrandSchema)
module.exports = Brand