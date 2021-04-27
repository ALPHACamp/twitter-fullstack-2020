const fs = require('fs')
const helpers = require('../_helpers')
const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet

let adminController = {
    loginPage: (req, res) => {
        return res.render('admin/login')
    },

    login: (req, res) => {
        req.flash('success_messages', '成功登入！')
        res.redirect('/admin/tweets')
    },

    logout: (req, res) => {
        req.flash('success_messages', '登出成功！')
        req.logout()
        res.redirect('/admin/login')
    },

    getTweets: (req, res) => {
        return Tweet.findAll({
            raw: true,
            nest: true,
            include: [User],
        }).then((tweets) => {
            console.log(tweets)
            return res.render('admin/tweets', { tweets })
        })
    },

    deleteTweet: (req, res) => {
        return Tweet.findByPk(req.params.id).then((tweet) => {
            tweet.destroy().then((tweet) => {
                res.redirect('/admin/tweets')
            })
        })
    },

    getUsers: (req, res) => {
        return User.findAll({
            include: [
                Tweet,
                { model: User, as: 'Followings' },
                { model: User, as: 'Followers' },
                { model: Tweet, as: 'LikedTweets' },
            ],
        }).then((users) => {
            users = users.map((user) => ({
                ...user.dataValues,
                TweetsCount: user.Tweets.length,
            }))
            users = users.sort((a, b) => b.TweetsCount - a.TweetsCount)
            return res.render('admin/users', { users })
        })
    },
}

module.exports = adminController