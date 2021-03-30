const express           = require('express')
const router            = express.Router()

const UserController    = require('../controllers/UserController')


router.get('/'              , UserController.getUsers)
router.get('/:id'           , UserController.getUser);
router.patch('/:id'         , UserController.patchUser);
router.patch('/:id/password', UserController.passwordChange)
router.delete('/:id'        , UserController.deleteUser);


//EXPORT
module.exports = router;