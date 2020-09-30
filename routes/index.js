const tweetsController = require('../controllers/tweetController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController')
const replyController = require('../controllers/replyController.js')
const passport = require('../config/passport')

const { authenticated, authenticatedAdmin } = require('../middleware/auth')

module.exports = app => {
//====================tweets======================================
app.get('/',authenticated, (req, res) => res.redirect('/tweets'))
app.get('/tweets',authenticated, tweetsController.getTweets)
app.post('/tweets', authenticated, tweetsController.postTweets)
app.get('/replylist/:id', authenticated, tweetsController.getReplylist)

app.post('/replies', authenticated, replyController.postReply)

//=====================admin====================================
app.get('/admin',authenticatedAdmin, (req, res) => res.redirect('/admin/tweets'))
app.get('/admin/tweets',authenticatedAdmin, adminController.getTweets)

//================signup/signin======================================
app.get('/admin/signin', adminController.signInPage)
app.post('/admin/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), authenticatedAdmin, adminController.signIn)
app.get('/admin/logout', adminController.logout)
app.get('/signin', userController.signInPage)
app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), authenticated, userController.signIn)
app.get('/logout', userController.logout)

//=====================user====================================
app.get('/users/:id/tweets', authenticated, userController.getUserTweets)
}
