const express           = require('express')
const router            = express.Router()

const BrandsController  = require('../controllers/BrandController')


/**** Routes ****/
router.get('/', BrandsController.getBrands)
router.get('/:id', BrandsController.getBrand);
router.get('/:id/models', BrandsController.getModels)

//EXPORT
module.exports = router;