const userController = require('../controllers/userController.js')

module.exports = (app) => {
  app.get('/register', userController.registerPage)
  app.post('/register', userController.register)
}
