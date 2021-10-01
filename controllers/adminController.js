const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const helpers = require('../_helpers')

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
        return User.findAll({
            attributes: [
                'id', 'name', 'email', 'avatar', 'cover', 'account'
            ],
            include: [
                { model: Tweet },
                { model: Tweet, as: 'LikedTweet' },
                { model: User, as: 'Followers' },
                { model: User, as: 'Followings' },
            ],
        }).then(users => {
            users = users.map(user => ({
                ...user.dataValues,
                tweetCount: user.Tweets.length,
                tweetLikeCount: user.LikedTweet.length,
                followingCount: user.Followings.length,
                followerCount: user.Followers.length
            }))
            users = users.sort((a, b) => b.tweetCount - a.tweetCount)
            return res.render('adminUser', { users: users })
        })
            .catch(next)
    },

    getTweets: (req, res, next) => {
        Tweet
            .findAll({
                raw: true,
                nest: true,
                include: [User],
                order: [['createdAt', 'DESC']],
            })
            .then((tweets) => {
                tweets = tweets.map(r => ({
                    ...r,
                    description: r.description.substring(0, 50),
                }))
                return res.render('adminTweet', { tweets: tweets })
            })
            .catch(next)
    }
}

module.exports = adminController