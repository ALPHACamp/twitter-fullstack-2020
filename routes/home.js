const express = require('express')
const router = express.Router()
const authenticated = require('../middleware/auth').authenticated
const userauthenticated = require('../middleware/auth').userauthenticated
const userController = require('../controllers/userController')
const tweetController = require('../controllers/tweetController')
const passport = require('passport')

router.get('/', authenticated, (req, res) => res.redirect('/tweets'))
router.get('/tweets', userauthenticated, tweetController.getTweet)

router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', {
  successRedirect: '/tweets',
  failureRedirect: '/signin',
  successFlash: true,
  failureFlash: true
}))
router.get('/logout', userController.logout)
router.get('/chatroom', userauthenticated, userController.getChatRoom)

///admin router
/*router.get('/admin/signin', adminController.signInPage)
///一直導錯
router.post('/admin/signin', authenticatedAdmin, passport.authenticate('local', {
  successRedirect: 'admin/tweets',
  failureRedirect: 'admin/signin',
  failureFlash: true
}))
///
router.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)
router.delete('/admin/tweets/:id', authenticatedAdmin, adminController.deleteTweet)
router.get('/admin/userlist', authenticatedAdmin, adminController.getUsers)*/

module.exports = router