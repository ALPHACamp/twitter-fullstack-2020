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

  app.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/main'))
  app.get('/admin/main', authenticatedAdmin, adminController.getTweets)

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

  // add favorite
  app.post('/favorite/:tweetId', authenticated, tweetController.addFavorite)
  app.delete('/favorite/:tweetId', authenticated, tweetController.removeFavorite)


  // add like
  app.post('/like/:id', authenticated, tweetController.addLike)

  // setting使用者能編輯自己的 account、name、email 和 password
  app.get('/setting', authenticated, userController.getSetting)
  app.put('/setting', authenticated, userController.putSetting)


  // 使用者能編輯自己的自我介紹、個人頭像與封面
  app.get('/user/:id', authenticated, userController.getUser)
  app.get('/user/self/edit', authenticated, userController.editUser)
  app.put('/users/:id', authenticated, userController.putUser)

  app.get("/user/other/:id", authenticated, userController.otherUser)
}



