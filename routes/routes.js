const exrpess = require('express')
const router = exrpess.Router()
const userController = require('../controllers/userController')



router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)


module.exports = router