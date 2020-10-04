// const tweetService = require('../services/tweetService')
const helpers = require('../_helpers')
const db = require('../models');
const User = db.User;
const Tweet = db.Tweet;
const Reply = db.Reply;
const Like = db.Like;

const tweetController = {
  getTweets: (req, res) => {
    Tweet.findAll({
      include: [
        User,
        Reply,
        Like
      ],
      order: [['createdAt', 'DESC']]
    })
      .then((tweets) => {
        const data = tweets.map((t) => ({
          ...t.dataValues
        }))
        const likes = helpers.getUser(req).Likes
        const isLiked = likes.map((i) => i.id).includes(data.id)
        return res.render('tweets', {
          isLiked: isLiked,
          tweets: data,
          userSelf: helpers.getUser(req)
        })
      })
  }
}

module.exports = tweetController