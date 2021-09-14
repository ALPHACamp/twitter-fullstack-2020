const userController = require('../controllers/userController')

module.exports = app => {
    app.get('/users/register', userController.signUpPage)
    app.post('/users/register', userController.signUp)
}   