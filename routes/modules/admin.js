const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')

const { authenticated, authenticatedAdmin } = require('../../middleware/auth')

const adminController = require('../../controllers/admin-controller')

router.get('/signin', adminController.signinPage)
// router.post('/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), adminController.signin)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/admin/signin' }), adminController.signin)

router.get('/tweets', authenticatedAdmin, (req, res) => res.send('building'))

module.exports = router