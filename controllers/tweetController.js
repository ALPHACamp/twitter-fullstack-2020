const helpers = require('../_helpers')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like

const tweetController = {
    getTweets: (req, res) => {
        Tweet.findAll({
            include: [
                User,
                Reply,
                {model: User, as: 'LikeUsers'}
            ],
            order: [['createdAt', 'DESC']]
        }).then(tweets => {
            const data = tweets.map(t => ({
              ...t.dataValues, 
              description: t.dataValues.description,
              isLiked: t.LikeUsers.map(d => d.id).includes(t.id)
            }))
            return res.render('tweets', {tweets: data})
          })
      },
      getTweet: (req, res) => {
        Tweet.findByPk(req.params.id, {
          include:[
            User,
            {model: Reply, include:[User]}, 
            {model: User, as: 'LikeUsers'}
          ],
          order: [['Replies','createdAt', 'DESC']]
        }).then(tweet => {
          const isLiked = tweet.LikeUsers.map(d => d.id).includes(tweet.id)
                return res.render('tweet', {
                  tweet, 
                  isLiked })
          })
        .catch(error => console.log(error))
      },
    

}

module.exports = tweetController
