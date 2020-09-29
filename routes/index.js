
const userController = require('../controllers/userController')



module.exports = (app, passport) => {


  const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {  // isAuthenticated 為passport內建之方法,回傳true or false
      return next()
    }
    res.redirect('/signin')
  }

  const authenticatedAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.isAmin) { return next() }  //如果是管理員的話
      return res.redirect('/') //如果不是就導回首頁
    }
    res.redirect('/signin')
  }

  //user login
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
<<<<<<< HEAD
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true
  }), userController.signIn)
  app.get('/logout', userController.logout)
  app.get('/main', (req, res) => res.render('mainpage'))

=======
  app.get('/signin', userController.signIn)
  
>>>>>>> 41c4e2da5f64bf7fd8ee1c34469a1bfbfd8d110f
}