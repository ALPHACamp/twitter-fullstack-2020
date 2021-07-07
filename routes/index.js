const express = require('express')
const router = express.Router()
const helpers = require('../_helpers')
const userController = require('../controller/userController')
const adminController = require('../controller/adminController')
const tweetController = require('../controller/tweetController')

module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {// = req.isAuthenticated()
      return next()
    }
    res.redirect('/signin')
  }
  const authenticatedAdmin = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).role) {
        return next()
      }
      return res.redirect('/')//似乎都會跑這裡
    }
    res.redirect('/signin')
  }

  app.get('/admin/signin', adminController.adminSignInPage)
  app.post('/admin/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), adminController.adminSignIn)
  app.get('/admin/tweets', authenticatedAdmin, adminController.getAdminTweets)
  app.get('/admin/users', authenticatedAdmin, adminController.getAdminUsers)
  app.delete('/admin/tweets/:tweetId', authenticatedAdmin, adminController.deleteAdminTweet)

  //前台
  app.get('/', authenticated, (req, res) => res.redirect('/tweets'))
  app.get('/tweets', authenticated, tweetController.getTweets)

  //登入、註冊、登出
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  app.get('/logout', userController.logout)


  app.get('/', authenticated, (req, res) => res.redirect('/tweets'))
  app.get('/tweets', authenticated, tweetController.getTweets)

}