const userController = {
    loginPage: (req, res) => {
        res.render('login')
    },
    registerPage: (req, res) => {
        res.render('register')
    },
    getUser: (req, res, next) => {
        res.render('users')
    }
}

module.exports = userController