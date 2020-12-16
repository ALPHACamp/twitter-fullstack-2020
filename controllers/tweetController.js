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
            console.log(data[0])
            res.render('tweets', { data: data })
        })
    }
}


