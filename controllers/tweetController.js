const db = require('../models') 
const Tweet = db.Tweet
const User = db.User
const helpers = require("../_helpers")

let tweetController = {
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
    }
}

module.exports = tweetController
