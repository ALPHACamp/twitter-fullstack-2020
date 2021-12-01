const db = require('../models')
const Tweet = db.Tweet
const User = db.User

const tweetController = {
    getTweets: (req, res) => {
        Tweet.findAll({
            raw: true,
            nest: true,
            order: [['createdAt', 'DESC']],
            include: [
                User
            ]
        }).then(tweets => {
            console.log(tweets)
            return res.render('main', { tweets })
        }).catch(error => {
            console.log(error)
        })

    },

    postTweets: (req, res) => {
        const description = req.body.description
        const userId = req.user.id
        Tweet.create({
            description: description,
            UserId: userId
        }).then(tweet => {
            console.log(tweet)
            req.flash('success_messages', '成功新增推文!')
            return res.redirect('/tweets')
        }).catch(error => {
            console.log(error)
        })
        // 收到post信息, 寫入tweets表, 完成後跳轉推文首頁

    }
}

module.exports = tweetController