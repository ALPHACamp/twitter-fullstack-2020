const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')

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

  app.get('/admin', (req, res) => res.redirect('/admin/main'))
  app.get('/admin/main', adminController.getTweets)

  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true
  }), userController.signIn)
  app.get('/logout', userController.logout)
  app.get('/main', (req, res) => res.render('mainpage'))

}



// 首頁
app.get('/', restController.getmainPage)
app.get('/main', restController.getmainPage)

// setting使用者能編輯自己的 account、name、email 和 password
app.get('/setting', restController.getSetting)
app.put('/setting', restController.putSetting)


// 使用者能編輯自己的自我介紹、個人頭像與封面
app.get('/user/self', userController.getUser)
app.get('/user/self/edit', userController.editUser)
app.put('/users/:id', userController.putUser)