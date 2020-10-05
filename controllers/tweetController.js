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
        { model: User, as: 'LikeUsers' }
      ],
      order: [['createdAt', 'DESC']]
    }).then(tweets => {
      const data = tweets.map(t => ({
        ...t.dataValues,
        description: t.dataValues.description,
        isLiked: t.LikeUsers.map(d => d.id).includes(t.id)
      }))
      return res.render('tweets', { tweets: data })
    })
  },

  getTweet: (req, res) => {
    Tweet.findByPk(req.params.id, {
      include: [
        User,
        { model: Reply, include: [User] },
        { model: User, as: 'LikeUsers' }
      ],
      order: [['Replies', 'createdAt', 'DESC']]
    }).then(tweet => {
      const isLiked = tweet.LikeUsers.map(d => d.id).includes(tweet.id)
      return res.render('tweet', {
        tweet,
        isLiked
      })
    })
      .catch(error => console.log(error))
  },

  createTweet: (req, res) => {
    if (!req.body.description) {
      req.flash('error_message', "it can't be blank.")
      return res.redirect('/')
    }
    if (req.body.description.length > 140) {
      req.flash('error_message', "it can't be longer than 140 characters.")
      return res.redirect('back')
    }
    return Tweet.create({
      UserId: req.user.id,
      description: req.body.description
    }).then(tweet => {
      return res.redirect('/tweets')
    })
  },
  addLike: (req, res) => {
    return Like.create({
      UserId: req.user.id,
      TweetId: req.params.id
    }).then((tweet) => {
      return res.redirect('back')
    })
  },
  removeLike: (req, res) => {
    return Like.findOne({
      where: {
        UserId: req.user.id,
        TweetId: req.params.id
      }
    })
      .then((like) => {
        like.destroy()
          .then((tweet) => {
            return res.redirect('back')
          })
      })
  },
}
module.exports = tweetController
