const express = require('express')
const router = express.Router()

const passport = require('../../config/passport')

const adminController = require('../../controller/admin-controller')

const { authenticatedAdmin } = require('../../middleware/auth')

router.get('/signin', adminController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), adminController.signIn)
router.get('/logout', adminController.logout)

router.get('/tweets', authenticatedAdmin, adminController.getTweets)

router.use('/', (req, res) => res.redirect('/admin/tweets'))

module.exports = router
