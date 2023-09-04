const { Tweet, User, Like, Reply, sequelize } = require('../models')
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
            where: { [Op.or]: [{ role: 'user' }, { role: null }] },
            attributes: {
                name : 'name',
                account: 'account',
                cover: 'cover',
                avatar: 'avatar',
                include: [[sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE Tweets.user_id = User.id)'), 'tweetsCount'],
                          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.follower_id = User.id)'), 'Followings'],
                          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.following_id = User.id)'), 'Followers'],
                          [sequelize.literal('(SELECT COUNT(*) FROM Likes LEFT JOIN Tweets ON Tweets.id = Likes.tweet_id WHERE Tweets.user_id = User.id)'),
                          'likesCount']
                        ]
            },
            order: [[sequelize.literal('tweetsCount'), 'DESC']],
            raw: true
        })
            .then(users => {
                return users.map(user => ({
                    ...user,
                    tweetsCount: controllerHelper.ifThousand(user.tweetsCount),
                    likesCount: controllerHelper.ifThousand(user.likesCount)
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