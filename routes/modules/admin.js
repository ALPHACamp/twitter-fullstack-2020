const express = require('express')
const router = express.Router()

const passport = require('../../config/passport')

const adminController = require('../../controllers/admin-controller')

router.get('/signin', adminController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), adminController.signIn)

router.get('/', (req, res) => res.redirect('/admin/tweets'))

module.exports = router
