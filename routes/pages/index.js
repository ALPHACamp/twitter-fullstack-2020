const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')

const admin = require('./modules/admin')

const adminController = require('../../controllers/pages/admin-controller')
const userController = require('../../controllers/pages/user-controller')

const { authenticated, authenticatedAdmin } = require('../../middleware/auth')

// admin route
router.get('/admin/signin', adminController.getSignin)
router.post('/admin/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), adminController.postSignin)
router.use('/admin', authenticatedAdmin, admin)

// user route
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.getSignin)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.postSignin)
router.get('/', (req, res) => res.send('Hello World!'))

module.exports = router
