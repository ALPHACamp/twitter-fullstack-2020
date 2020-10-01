const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const helpers = require("../_helpers")

const tweetController = {
    //main
    getTweets:(req, res) => {
        Tweet.findAll({
            order: [['createdAt', 'DESC']],
            include: [User]

        }).then(tweets => {
            const data = tweets.map(t => ({
                ...t.dataValues,
                description: t.dataValues.description.substring(0, 100),
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
    //單一推文
    getTweetCreate: (req, res) => {
        return Tweet.findByPk(req.params.id, {
          include: [
            User,
            { model: Reply, include: [User] },
          ]
        }).then(tweet => {
            return res.render('create', {
                tweet: tweet.toJSON()
            })
        })
    },
    postCreateview:(req, res) => {
        const tweetDesc = req.body.text
        return Tweet.create({
            description: tweetDesc,
            UserId: helpers.getUser(req).id
        }).then(tweet => {
            Tweet.findByPk(req.params.id, {
                include: [
                    User,
                    { model: Reply, include: [User] },
                ]
            }).then(reply => {
                console.log(reply)
                return res.render('createview', {
                    tweet: tweet.toJSON()
                })
            })
        })
    },
}

module.exports = tweetController
