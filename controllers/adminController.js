const adminController = {
    getTweets: (req, res) => {
        return res.render('admin/users')
    },

    getSignInPage: (req, res) => {
        return res.render('admin/signin')
    },
}

module.exports = adminController