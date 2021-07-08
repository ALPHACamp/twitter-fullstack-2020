const twitController = require('../controllers/twitController.js')
const adminController = require('../controllers/adminController.js')

module.exports = app => {

  //首頁路由
  app.get('/', (req, res) => res.redirect('/twitters'))
  app.get('/twitters', twitController.getTwitters)

  //admin

  app.get('/admin', (req, res) => res.redirect('/admin/twitters'))
  app.get('/admin/twitters', adminController.getTwitters)

  app.get('/admin/signin', adminController.adminSignin)
  app.get('/admin/users', adminController.adminUsers)

  app.get('/user/self', (req, res) => {
    res.render('user')
  })

  app.get('/signin', (req, res) => {
    res.render('signin')
  })

  app.get('/signup', (req, res) => {
    res.render('signup')
  })

  app.get('/setting', (req, res) => {
    res.render('setting')
  })

}

