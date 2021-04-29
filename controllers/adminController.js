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
        User.findOne({ where: { account: req.body.account } }).then(user => {
            if (user.role == 'admin') {
                req.flash('success_messages', '成功登入！')
                res.redirect('/admin/tweets')

            } else {
                req.flash('error_messages', '登入失敗！')
                return res.redirect('/admin/signin')
            }
        })
    },

    signout: (req, res) => {
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
        const id = Number(req.params.id)
        await Tweet.findByPk(id).then(tweet => {
            if (tweet !== null) {
                tweet.destroy()
        }}).catch(err => console.log(err))
        await Reply.destroy({ where: { TweetId: id } }).then(reply => {
            console.log('reply destroy success')
        }).catch(err => console.log(err))
        await Like.destroy({ where: { TweetId: id } }).then(like => {
            console.log('like destroy success')
        }).catch(err => console.log(err))
        req.flash('success_messages', '成功刪除文章！')
        return res.redirect('/admin/tweets')
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
            users = users.filter((user) => (user.name !== helpers.getUser(req).name))
            users = users.sort((a, b) => b.TweetsCount - a.TweetsCount)
            
            return res.render('admin/users', { users })
        })
    },
}

module.exports = adminController