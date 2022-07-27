const router = require('express').Router()
const passport = require('../../../config/passport')
const adminController = require('../../../controllers/pages/admin-controller')
const { authenticated, authenticatedAdmin } = require('../../../middleware/auth')

router.get('/signin', adminController.getSignin)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), adminController.postSignin)

module.exports = router
