const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const helpers = require("../_helpers")

const tweetController = {
    //main
    getTweets: async (req, res) => {
        Tweet.findAll({
            order: [['createdAt', 'DESC']],
            include: [User]

        }).then(tweets => {
            const data = tweets.map(t => ({
                ...t.dataValues,
                description: t.dataValues.description.substring(0, 100),
                userName: t.User.name
            }))
            return res.render('tweets', {
                tweets: data
            })
        })
    },
    //新增推文
    postTweets: (req, res) => {
        const tweetsDesc = req.body.text
        if (tweetsDesc == " ") {
            req.flash('error_messages', '不可空白')
            return res.redirect("/tweets")
        } else {
            if (tweetsDesc.length > 140) {
                req.flash('error_messages', '不可超過140字')
                return res.redirect("/tweets")
            } else {
                return Tweet.create({
                    description: tweetsDesc,
                    UserId: helpers.getUser(req).id
                }).then((tweet) => {
                    req.flash('success_messages', '新增一則tweet')
                    return res.redirect("/tweets")
                })
            }
        }
    },
    //查看單一推文reply
    getReplylist: (req, res) => {
        return Tweet.findByPk(req.params.id, {
            include: User
        }).then(tweet => {
            return res.render('replylist', {
                tweet: tweet.toJSON()
            })
        })
    }
}

module.exports = tweetController
