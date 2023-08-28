const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const adminController = require('../../controllers/admin-controller')
const { authenticatedAdmin } = require('../../middleware/auth')

// const helpers = require('../_helpers')
router.get('/signin', adminController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), adminController.signIn)
router.get('/logout', adminController.logOut)

router.get('/tweets', authenticatedAdmin, adminController.getTweets)
router.delete('/tweets/:id', authenticatedAdmin, adminController.deleteTweet)
router.get('/users', authenticatedAdmin, adminController.getUsers)
router.use('/', (req, res) => { res.redirect('/admin/signin') })

module.exports = router
