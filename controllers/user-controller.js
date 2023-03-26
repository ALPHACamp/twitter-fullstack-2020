const userController = {
    loginPage: (req, res) => {
        res.render('login')
    },
    registerPage: (req, res) => {
        res.render('register')
    },
    settingPage: (req, res) => {
        res.render('setting')
    },
    getUser: (req, res, next) => {
        res.render('users/profile')
    },
    getFollowers: (req, res, next) => {
        res.render('users/followers')
    },
    getFollowings: (req, res, next) => {
        res.render('users/followings')
    }
}

module.exports = userController