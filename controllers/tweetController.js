const db = require('../models')
const tweet = require('../models/tweet')
const { Op } = require('sequelize')
const helper = require('../_helpers')
const Tweet = db.Tweet
const User = db.User
const Like = db.Like
const Reply = db.Reply


module.exports = {
    getTweets: (req, res) => {
        Tweet.findAll({ include: [User, Like, Reply], order: [['createdAt', 'DESC']] }).then(tweets => {
            tweets = JSON.parse(JSON.stringify(tweets))
            const userLiked = helper.getUser(req).Likes ? helper.getUser(req).Likes.map(d => d.TweetId) : []
            const data = tweets.map(tweet => ({
                ...tweet,
                countLikes: tweet.Likes.length,
                countReplies: tweet.Replies.length,
                isLike: userLiked.includes(tweet.id)
            }))
            res.render('tweets', { data: data })
        })
    },
    getReply: (req, res) => {
        res.send(req.params.id)
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
            res.redirect('/tweets')
        }).catch(err => console.log(err))
    },
    likeTweet: (req, res) => {
        const like = {
            UserId: helper.getUser(req).id,
            TweetId: req.params.id
        }
        Like.create(like).then(() => {
            res.redirect('/tweets')
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
            res.redirect('/tweets')
        }).catch(err => console.log(err))
    }
}


