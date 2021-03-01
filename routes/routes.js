const express = require('express')
const router = express.Router()
const passport = require('passport')

const userController = require('../controllers/userController')

router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', {
  failureRedirect: '/signin'
}), userController.signIn)

router.get('/', (req, res) => res.send('test'))

module.exports = router