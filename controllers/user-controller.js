const userController = {
    login_page: (req, res) => {
        res.render('login')
    },
    register_page: (req, res) => {
        res.render('register')
    },
    getUser: (req, res, next) => {
        res.render('users')
    }
}

module.exports = userController