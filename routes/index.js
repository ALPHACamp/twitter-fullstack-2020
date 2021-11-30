const userController = require('../controllers/userController')

module.exports = (app) => {
  app.get('/', (req, res) => res.render('index'))

  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
}
