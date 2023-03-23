const userController = {
    login_page: (req, res) => {
        res.render('login')
    },
    getUser: (req, res, next) => {
        res.render('users')
    }
}

module.exports = userController