const Brand     = require('../models/Brand')

const model = {
    public: ['-models', '-__v'],
    private: []
}

const getBrands = async (req, res) => {
    try{
        const brands = await Brand.find().select(model.public);
        res.json(brands);
    } catch (err) {
        console.log(err)
        res.status(500).json({message: err})
    }
}

const getBrand = async (req, res) => {
    const { id } = req.params;
    try{
        const brand = await Brand.findById(id).select(public);
        res.json(brand);
    } catch (err) {
        res.json({message: err})
    }
}

const getModels = async (req, res) => {
    const { id } = req.params;
    try{
        const { models } = await Brand.findById(id);
        res.json(models);
    } catch (err) {
        res.json({message: err})
    }
}


module.exports = {
    getBrand,
    getBrands,
    getModels
}
