const express = require('express')
const router = express.Router()
// const { authenticated } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')
const passport = require('../config/passport')
const userController = require('../controller/user-controller')
const exampleController = require('../controller/example-controller')

router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)

router.get('/users/:id', userController.getUser)

router.get('/logout', userController.logout)
router.get('/', exampleController.indexPage)
router.use('/', generalErrorHandler)

module.exports = router
