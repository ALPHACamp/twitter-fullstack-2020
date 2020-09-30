const db = require('../models')
const Tweet = db.Tweet
const User = db.User

const adminController = {
    getTweets: (req, res) => {
        return Tweet.findAll({
            raw: true,
            nest: true,
            include: User
        })
            .then(tweets => {
                return res.render('admin/tweets', { tweets })
            })
    }
}

module.exports = adminController