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

    // getTweets: (req, res, next) => {
    //     Tweet.findAll({ raw: true, nest: true })
    //         .then(tweets => {
    //             return res.render('adminTweet', { tweets: tweets })
    //         })
    //         .catch(next)
    // },

    deleteTweet: (req, res, next) => {
        Tweet.findByPk(req.params.id)
            .then(tweet => {
                //test
                console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
                console.log(tweet)
                console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%")
                //test尾
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
        const a = req.body.TweetId
        return Promise.all([
            User.findAll({
                raw: true,
                nest: true,
                where: {
                    isAdmin: true,
                    id: req.params.id
                },
                include: [{ model: User, as: 'Followers' }]
            }),
            Tweet.findAndCountAll({
                raw: true,
                nest: true,
                order: [['createdAt', 'DESC']],
                include: [User]
            }),
        ]).then(([followship, tweets, tweet]) => {
            tweets = tweets.rows.map(r => ({
                ...r,
                description: r.description.substring(0, 50),
                isLiked: req.user.LikedTweet.map(d => d.id).includes(r.id),
            }))
            return res.render('adminTweet', {
                tweets: tweets,
            })

        })
            .catch(next)
    },

}

module.exports = adminController