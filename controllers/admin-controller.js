const { User, Like, Tweet, Reply } = require('../models');

const adminController = {

    getUsers: (req, res) => {
        User.findAll({
            include: [
                Like, Tweet,
                { model: User, as: 'Followers' },
                { model: User, as: 'Followings' },
            ],
        })
            .then(user => {
                let userFilter = user.filter(user => user.dataValues.account !== 'root')
                userFilter = userFilter.sort((a, b) => b.dataValues.Tweets.length - a.dataValues.Tweets.length)
                res.render('admin/users', { userByFind: userFilter })
            })
    },
    getTweets: (req, res) => {
        Tweet.findAll({
            include: User,
            order: [['createdAt', 'DESC']],
            limit: 10,
            raw: true,
            nest: true,
        })
            .then(tweets => {
                return res.render('admin/tweets', { tweets })
            })

    }
}
module.exports = adminController