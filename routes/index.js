const express = require('express')
const router = express.Router()

const admin = require('./modules/admin')

const twitterController = require('../controllers/twitter-controller')
const userController = require('../controllers/user-controller')

router.use('/admin', admin)
router.get('/signup', userController.signUpPage)
router.get('/signin', userController.signInPage)
router.get('/setting', userController.getSetting)
router.get('/twitters', twitterController.getTwitters)
router.get('/users', userController.getUser)
router.use('/', (req, res) => res.redirect('/twitters'))

module.exports = router
