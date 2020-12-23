const express = require('express')
const router = express.Router()
const homeController = require('../controllers/homeController')
const { authenticated } = require('../middleware/auth')

const passport = require('../config/passport')

router.get('/', (req, res) => res.redirect('/tweets'))
router.get('/signin', homeController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), homeController.signIn)

router.get('/signup', homeController.signUpPage)
router.post('/signup', homeController.signup)

router.get('/logout', authenticated, homeController.logout)

router.post('/followships', authenticated, homeController.addFollowing)
router.delete('/followships/:id', authenticated, homeController.removeFollowing)

module.exports = router