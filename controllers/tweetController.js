const helpers = require('../_helpers')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like

const tweetController = {
  getTweets: (req, res) => {
    return Tweet.findAll({
      include: [User, Reply,
        { model: User, as: 'LikedUsers' }],
      order: [['createdAt', 'DESC']]
    })
      .then(tweets => {
        const UserId = helpers.getUser(req).id
        // console.log("tweets", tweets)
        const data = tweets.map(t => ({
          ...t.dataValues,
          description: t.dataValues.description,
          isLiked: t.LikedUsers.map(d => d.id).includes(helpers.getUser(req).id)
        }))
        return User.findOne({ where: { id: UserId } })
          .then(users => {
            return res.render('tweets', { tweets: data, users })
          })
      })
      .catch(error => console.log(error))
  },

  getTweet: (req, res) => {
    return Tweet.findByPk(req.params.id, {
      include: [
        User,
        { model: Reply, include: [User] },
        { model: User, as: 'LikedUsers' }
      ],
      order: [['Replies', 'createdAt', 'DESC']]
    }).then(tweet => {
      // console.log(tweet)
      const UserId = helpers.getUser(req).id
      const isLiked = tweet.LikedUsers.map(d => d.id).includes(helpers.getUser(req).id)
      return res.render('tweet', { tweet, isLiked })
    })
      .catch(error => console.log(error))
  },

  postTweet: (req, res) => {
    if (!req.body.description) {
      req.flash('error_messages', '貼文不可空白')
      return res.redirect('back')
    }
    if (req.body.description.length > 140) {
      req.flash('error_messages', '貼文不得超過140個字')
      return res.redirect('back')

    }
    return Tweet.create({

      UserId: helpers.getUser(req).id,
      description: req.body.description
    }).then(tweet => {
      return res.redirect('/tweets')
    })
      .catch(error => console.log(error))
  },

  getReply: (req, res) => {
    return Tweet.findByPk(req.params.id,
      {
        include: [{ model: Reply, include: [User] }]
      }).then(tweet => {
        console.log(tweet)
        const data = tweet.Replies.map(t => ({
          ...t.dataValues,
          comment: t.comment
        }))

        return res.render('tweet', { tweet: data })
      })
      .catch(error => console.log(error))
  },

  postReply: (req, res) => {
    if (req.body.comment.length > 140) {
      req.flash('error_messages', '貼文不得超過140個字')
      return res.redirect('back')
    }
    if (!req.body.comment) {
      req.flash('error_messages', '回覆不可空白')
      return res.redirect('back')
    }
    Reply.create({
      TweetId: req.params.id,
      comment: req.body.comment,
      UserId: helpers.getUser(req).id
    })
      .then((reply) => {
        res.redirect('back')
      })
      .catch(error => console.log(error))
  },



}

module.exports = tweetController