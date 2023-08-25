const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const adminController = require('../../controllers/admin-controller')

// const helpers = require('../_helpers')
router.get('/signin', adminController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), adminController.signIn)
router.get('/logout', adminController.logOut)
router.use('/', (req, res) => { res.redirect('/admin/signin') })

module.exports = router
