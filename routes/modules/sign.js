const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const { authenticated } = require('../../middleware/auth')

const loginController = require('../../controllers/loginController')

// signup
router.get('/signup', loginController.signUpPage)
router.post('/signup', loginController.signUp)


// signin
router.get('/signin', loginController.signInPage)
router.post('/signin', passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true
  }),
  loginController.signIn
)

router.get('/logout', loginController.logOut)

// 如果使用者訪問首頁，就導向 /tweets 的頁面
router.get('/', authenticated, (req, res) => {res.redirect('/tweets')})

module.exports = router
