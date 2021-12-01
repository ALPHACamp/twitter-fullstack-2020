
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')
const tweetController = require('../controllers/tweetController')
const replyController = require('../controllers/replyController')

module.exports = (app, passport) => {
  // ADMIN

  // OTHERS

  // USER
  app.get('/signup', userController.signUpPage)

  // TWEET

  // REPLY

  // LIKE

  // FOLLOWSHIP
}