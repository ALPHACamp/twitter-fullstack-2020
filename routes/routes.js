const exrpess = require('express')
const router = exrpess.Router()
const passport = require('../config/passport')
const userController = require('../controllers/userController')
const tweetController = require('../controllers/tweetController')

router.get('/', (req, res) => { res.redirect('/tweets') })
router.get('/tweets', tweetController.getTweets)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logOut)


module.exports = router