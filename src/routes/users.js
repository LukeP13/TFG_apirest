const express           = require('express')
const router            = express.Router()

const UserController    = require('../controllers/UserController')
const upload            = require('../middlewares/uploadImages')


/**** Routes ****/

router.get('/', UserController.getUsers);
router.get('/:id', UserController.getUser);

router.patch('/:id', upload.single('avatar'), UserController.update);
router.patch('/:id/password', UserController.passwordUpdate)

router.delete('/:id', UserController.remove);


//EXPORT
module.exports = router;