const db = require('../models')
const Tweet = db.Tweet
const User = db.User

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
        res.redirect('/admin/signin')
    },

    getTweets: (req, res, next) => {
        Tweet.findAll({ raw: true, nest: true })
            .then(tweets => {
                return res.render('adminTweet', { tweets: tweets })
            })
            .catch(next)
    },

    deleteTweet: (req, res, next) => {
        Tweet.findByPk(req.params.id)
            .then(tweet => {
                tweet.destroy()
            })
            .then(() => {
                res.redirect('/admin/tweets')
            })
            .catch(next)
    },

    getUsers: (req, res, next) => {
        User.findAll({ raw: true, nest: true })
            .then(users => {
                console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
                console.log(users)
                return res.render('adminUser', { users: users })
            })
            .catch(next)
    },


}

module.exports = adminController