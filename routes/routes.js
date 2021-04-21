const exrpess = require('express')
const router = exrpess.Router()
const userController = require('../controllers/userController')



router.get('/signup', userController.signUpPage)



module.exports = router