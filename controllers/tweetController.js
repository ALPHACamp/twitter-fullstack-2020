const db = require('../models')
const tweet = require('../models/tweet')
const { Op } = require('sequelize')
const helper = require('../_helpers')
const user = require('../models/user')
const Tweet = db.Tweet
const User = db.User
const Like = db.Like
const Reply = db.Reply



module.exports = {
    getTweets: (req, res) => {
        const selfUser = helper.getUser(req)
        Promise.all([
            User.findAll({ include: [{ model: User, as: 'Followers' }] }).then(users => {
                users = JSON.parse(JSON.stringify(users))
                users.sort((a, b) => b.Followers.length - a.Followers.length)
                users.slice(0, 10)
                users = users.map(user => ({
                    ...user,
                    isFollowed: user.Followers.map(d => d.id).includes(selfUser.id)
                }))
                users = users.filter(user => user.id !== selfUser.id)
                return users
            }),
            Tweet.findAll({ include: [User, Like, Reply], order: [['createdAt', 'DESC']] }).then(tweets => {
                tweets = JSON.parse(JSON.stringify(tweets))
                const userLiked = helper.getUser(req).Likes ? helper.getUser(req).Likes.map(d => d.TweetId) : []
                const data = tweets.map(tweet => ({
                    ...tweet,
                    countLikes: tweet.Likes.length,
                    countReplies: tweet.Replies.length,
                    isLike: userLiked.includes(tweet.id)
                }))
                return data
            })]).then(([sidebarFollowings, data]) => {
                console.log(sidebarFollowings)
                res.render('tweets', { data, selfUser, sidebarFollowings })
            })

    },
    getReply: (req, res) => {
        const id = req.params.id
        const selfUser = helper.getUser(req)
        Promise.all([
            Tweet.findByPk(id, { include: [User, { model: Reply, include: [User], raw: true }, Like] }).then(tweet => {
                tweet = tweet.toJSON()
                const userLiked = helper.getUser(req).Likes ? helper.getUser(req).Likes.map(d => d.TweetId) : []
                const data = {
                    ...tweet,
                    countLikes: tweet.Likes.length,
                    countReplies: tweet.Replies.length,
                    isLike: userLiked.includes(tweet.id)
                }
                return data
            }),
            User.findAll({ include: [{ model: User, as: 'Followers' }] }).then(users => {
                users = JSON.parse(JSON.stringify(users))
                users.sort((a, b) => b.Followers.length - a.Followers.length)
                users.slice(0, 10)
                users = users.map(user => ({
                    ...user,
                    isFollowed: user.Followers.map(d => d.id).includes(selfUser.id)
                }))
                users = users.filter(user => user.id !== selfUser.id)
                return users
            })
        ]).then(([data, sidebarFollowings]) => res.render('tweet', { data, selfUser, sidebarFollowings }))
    },
    postTweets: (req, res) => {
        if (req.body.description.length > 140 || req.body.description.length < 1) {
            req.flash('error_msg', '字數限制140字')
            res.redirect('/tweets')
            return
        }
        const tweet = {
            UserId: helper.getUser(req).id,
            description: req.body.description
        }
        Tweet.create(tweet).then(() => {
            res.redirect('tweets')
        }).catch(err => console.log(err))
    },
    postReply: (req, res) => {
        if (req.body.comment < 1) {
            req.flash('error_msg', '請輸入內容')
            res.redirect('/tweets')
            return
        }
        const reply = {
            UserId: helper.getUser(req).id,
            TweetId: req.params.id,
            comment: req.body.comment
        }
        Reply.create(reply).then(() => {
            res.redirect('back')
        }).catch(err => console.log(err))
    },
    likeTweet: (req, res) => {
        const like = {
            UserId: helper.getUser(req).id,
            TweetId: req.params.id
        }
        Like.create(like).then(() => {
            res.redirect('back')
        }).catch(err => console.log(err))
    },
    unlikeTweet: (req, res) => {
        const unlike = {
            UserId: helper.getUser(req).id,
            TweetId: req.params.id,
        }
        Like.findOne({ where: unlike }).then(like => {
            like.destroy()
        }).then(() => {
            res.redirect('back')
        }).catch(err => console.log(err))
    }
}


