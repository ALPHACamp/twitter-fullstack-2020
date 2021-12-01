const userController = require('../controllers/userController')

module.exports = (app) => {

  app.get('/', (req, res) => res.send('Hello World!'))

  app.get('/signup', userController.signUpPage )
}