const fs = require('fs')
const helpers = require('../_helpers')
const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like

let adminController = {
    signinPage: (req, res) => {
        return res.render('admin/signin')
    },

    signin: (req, res) => {
        req.flash('success_messages', '成功登入！')
        return res.redirect('/admin/tweets')
    },

    logout: (req, res) => {
        req.flash('success_messages', '登出成功！')
        req.logout()
        res.redirect('/admin/signin')
    },

    getTweets: async (req, res) => {
        await Tweet.findAll({
            include: [User, Reply, Like],
            order: [['createdAt', 'DESC']],
        })
            .then((tweets) => {
                const data = tweets.map(r => ({
                    ...r.dataValues,
                    description: r.description.substring(0, 50),
                    isLiked: helpers.getUser(req).LikedTweets.map(d => d.id).includes(r.id)
                }))
                return res.render('admin/tweets', {
                    tweets: data,
                })

            })
    },
    // getTweets: async (req, res) => {
    //     await Tweet.findAll({
    //         raw: true,
    //         nest: true,
    //         include: [User],
    //         order: [['createdAt', 'DESC']],
    //     }).then((tweets) => {
    //         const data = tweets.map(t => ({
    //             ...t.dataValues,
    //             description: t.description.substring(0, 50),
    //             name: t.User.name,
    //             account: t.User.account,
    //             avatar: t.User.avatar,
    //             id: t.User.id,
    //         }))
    //         return res.render('admin/tweets', { tweets: data })
    //     })
    // },

    deleteTweet: async (req, res) => {
        await Tweet.findByPk(req.params.id).then((tweet) => {
            tweet.destroy().then((tweet) => {
                req.flash('success_messages', '成功刪除文章！')
                res.redirect('/admin/tweets')
                done();
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