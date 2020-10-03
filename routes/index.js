const userController = require('../controllers/userController')
const adminController = require('../controllers/adminController')
const tweetController = require('../controllers/tweetController')

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

  //user login

  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true
  }), userController.signIn)
  app.get('/logout', userController.logout)



  // adminController
  app.get('/admin', (req, res) => { res.redirect('/admin/tweets') })
  app.get('/admin/tweets', adminController.getTweets)
  app.delete('/admin/tweets/:id', adminController.deleteTweet)
  app.get('/admin/users', adminController.getUsers)
  app.get('/admin/signin', adminController.signinPage)
  app.post('/admin/signin', adminController.signIn)


  // tweetController
app.get("/", (req, res) => res.redirect("/tweets"))
app.get("/tweets", tweetController.getTweets)
app.get("/tweets/:id", tweetController.getTweet)
app.post('/tweets/:id', tweetController.postTweet)


  // setting使用者能編輯自己的 account、name、email 和 password
  app.get('/setting', userController.getSetting)
  app.put('/setting', userController.putSetting)


  // 使用者能編輯自己的自我介紹、個人頭像與封面
  app.get('/user/self', userController.getUser)
  app.get('/user/self/edit', userController.editUser)
  app.put('/users/:id', userController.putUser)
}







