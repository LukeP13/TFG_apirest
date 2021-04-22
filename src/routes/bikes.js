const express           = require('express')
const router            = express.Router()

const BikeController    = require('../controllers/BikeController')

/**** Routes ****/
router.get('/', BikeController.getBikes)
router.get('/:id', BikeController.getBike)

router.post('/', BikeController.postBike)

router.patch('/:id', BikeController.patchBike)

router.delete('/:id', BikeController.deleteBike)


// EXPORT
module.exports = router;