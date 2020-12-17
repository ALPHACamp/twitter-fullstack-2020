const { Console } = require('console')
const db = require('../models')
const tweet = require('../models/tweet')
const { Op } = require('sequelize')
const Tweet = db.Tweet
const User = db.User
const Like = db.Like
const Reply = db.Reply


module.exports = {
    getTweets: (req, res) => {
        Tweet.findAll({ include: [{ model: User }, Like, Reply] }).then(tweets => {
            tweets = JSON.parse(JSON.stringify(tweets))
            const userLiked = req.user.Likes.map(d => d.TweetId)
            const data = tweets.map(tweet => ({
                ...tweet,
                countLikes: tweet.Likes.length,
                countReplies: tweet.Replies.length,
                isLike: userLiked.includes(tweet.id)
            }))
            res.render('tweets', { data: data })
        })
    },
    replyTweet: (req, res) => {
        const reply = {
            UserId: req.user.id,
            TweetId: req.params.id,
            comment: req.body.comment
        }
        Reply.create(reply).then(() => {
            res.redirect('/tweets')
        }).catch(err => console.log(err))
    },
    likeTweet: (req, res) => {
        const like = {
            UserId: req.user.id,
            TweetId: req.params.id,
        }
        Like.create(like).then(() => {
            res.redirect('/tweets')
        }).catch(err => console.log(err))
    },
    unlikeTweet: (req, res) => {
        const unlike = {
            UserId: req.user.id,
            TweetId: req.params.id,
        }
        Like.findOne({ where: unlike }).then(like => {
            like.destroy()
        }).then(() => {
            res.redirect('/tweets')
        }).catch(err => console.log(err))
    }
}


