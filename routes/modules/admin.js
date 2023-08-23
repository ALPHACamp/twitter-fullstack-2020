const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')

// Controllers
const adminController = require('../../controllers/admin-controller')

// Sign in
router.get('/signin', adminController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), adminController.signIn)

router.get('/tweets', adminController.getTweets)
router.use('/', (req, res) => res.redirect('/admin/tweets'))

module.exports = router
