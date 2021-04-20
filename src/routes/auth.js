const express           = require('express')
const router            = express.Router()

const AuthController    = require('../controllers/AuthController')
const upload            = require('../middlewares/uploadImages')

const { 
    registerValidation, 
    loginValidation 
} = require('../middlewares/validations/dataValidation')


router.post('/register', registerValidation, upload.single('avatar'), AuthController.register)
router.post('/login', loginValidation, AuthController.login)

module.exports = router;