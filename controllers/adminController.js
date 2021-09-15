const adminController = {
    signInPage: (req, res) => {
        return res.render('admin')
    },

    signIn: (req, res) => {
        req.flash('success_messages', '成功登入！')
        res.redirect('/admin/tweets')
    },

    logout: (req, res) => {
        req.flash('success_messages', '登出成功！')
        req.logout()
        res.redirect('/admin/login')
    },

    getTweets: (req, res) => {
        return res.render('adminTweet')
    },
}

module.exports = adminController