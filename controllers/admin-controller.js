const { Tweet, User, Like, Reply } = require('../models')
const { Op } = require('sequelize')
const controllerHelper = require('../helpers/controller-helpers')
const adminController = {
    getTweets: (req, res, next) => {
        Tweet.findAll({
            include: [User],
            raw: true,
            nest: true
        })
            .then(tweets => {
                const maxLength = 50
                tweets = tweets.map(tweet => ({
                    ...tweet,
                    description: tweet.description.slice(0, maxLength)
                }))
                res.render('admin/tweets', { tweets })
            })
            .catch(err => next(err))
    },
    getUsers: (req, res, next) => {
        User.findAll({
            include: [{ model: Tweet, include: Like }, { model: User, as: 'Followers' }, { model: User, as: 'Followings' }],
            where: { [Op.or]: [{ role: 'user' }, { role: null }] }
        }
        )
            .then(users => {
                return users.map(user => ({
                    ...user.toJSON(),
                    tweetsCount: controllerHelper.countTweets(user.Tweets.length),
                    Followers: user.Followers.length,
                    Followings: user.Followings.length,
                    likesCount: controllerHelper.countLikes(user, user.Tweets.length)
                }))
            })
            .then(users => {
                res.render('admin/users', { users })
            })
            .catch(err => next(err))
    },
    deleteTweet: (req, res, next) => {
        const id = req.params.id
        Tweet.findByPk(id)
        .then(tweet => {
            if (!tweet) throw new Error("推文不存在")
            return Reply.destroy({ where: { TweetId: id } })
        })
        .then(() => Like.destroy({ where: { TweetId: id } }))
        .then(() => Tweet.destroy({ where: { id } }))
        .then(() => res.redirect('/admin/tweets'))
    }
}

module.exports = adminController