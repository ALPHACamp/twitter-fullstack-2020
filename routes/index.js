const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const admin = require('./modules/admin')
const users = require('./modules/users')
const tweets = require('./modules/tweets')
const api = require('./modules/api')

const { authenticatedUser } = require('../middleware/auth')
const {
  generalErrorHandler,
  apiErrorHandler
} = require('../middleware/error-handler.js')

const userController = require('../controllers/user-controller')

router.use('/admin', admin) // 未添加認證
router.use('/users', authenticatedUser, users)
router.use('/tweets', authenticatedUser, tweets)
router.use('/api', authenticatedUser, api)

router.post('/signup', userController.signUp)
router.get('/signup', userController.signUpPage)
router.post(
  '/signin',
  passport.authenticate('user-local', {
    failureRedirect: '/signin',
    failureFlash: true
  }),
  userController.signIn
)
router.get('/signin', userController.signInPage)
router.get('/logout', authenticatedUser, userController.logout)

router.post('/followships', authenticatedUser, userController.postFollow)
router.delete('/followships', authenticatedUser, userController.postUnfollow)

router.get('/', (req, res) => {
  res.redirect('/tweets')
})

router.use('/', apiErrorHandler)

module.exports = router
