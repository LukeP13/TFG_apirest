const express       = require('express')
const router        = express.Router()

const AuthController    = require('../controllers/AuthController')
const upload            = require('../middleware/uploadImages')
const { registerValidation } = require('../middleware/dataValidation')

router.post('/register', registerValidation, upload.single('avatar'), AuthController.register)
router.post('/login', AuthController.login)

module.exports = router;