const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')
const tweetController = require("../controllers/tweetController");
const { addFavorite } = require('../controllers/tweetController');

module.exports = (app, passport) => {

  const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/signin')
  }

  const authenticatedAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.isAmin) { return next() }
      return res.redirect('/')
    }
    res.redirect('/signin')
  }

  app.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/tweets'))
  app.get("/admin/tweets", authenticatedAdmin, adminController.getTweets);
  app.get('/admin/signin', adminController.signinPage)
  app.post('/admin/signin', passport.authenticate('local', {
    failureRedirect: '/admin/signin',
    failureFlash: true
  }), adminController.signIn)
  app.post('/admin/tweets/:id', authenticatedAdmin, adminController.deleteTweet)
  app.get('/admin/users', authenticatedAdmin, adminController.getUsers)

  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true
  }), userController.signIn)
  app.get('/logout', userController.logout)


  app.get("/", (req, res) => res.redirect("/tweets"))
  app.get("/tweets", authenticated, tweetController.getTweets)
  app.get("/tweets/:id", authenticated, tweetController.getTweet)
  app.post('/tweets', authenticated, tweetController.createTweet)
  app.post('/tweets/:id/replies', authenticated, tweetController.postReply)
  app.get('/tweets/:id/replies', authenticated, tweetController.getReply)




  // add like
  app.post('/like/:tweetId', authenticated, tweetController.addLike)
  app.delete('/like/:tweetId', authenticated, tweetController.removeLike)
  // setting使用者能編輯自己的 account、name、email 和 password
  app.get('/setting', authenticated, userController.getSetting)
  app.put('/setting', authenticated, userController.putSetting)


  // 使用者能編輯自己的自我介紹、個人頭像與封面
  app.get('/user/:id', authenticated, userController.getUser)
  app.get('/user/:id/follower', authenticated, userController.getFollower)
  app.get('/user/:id/following', authenticated, userController.getFollowing)
  app.get('/user/self/edit', authenticated, userController.editUser)
  app.put('/users/:id', authenticated, userController.putUser)
  app.post('/following/:id', authenticated, userController.addFollowing)
  app.delete('/following/:id', authenticated, userController.removeFollowing)

  app.get("/user/other/:id", authenticated, userController.otherUser)
}



