const helpers = require('../_helpers')
const db = require('../models')
const { User, Followship, Tweet, Reply, Like } = db
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const tweetController = {
  getTweets: (req, res) => {
    return Tweet.findAll({
      include: [User, Reply,
        { model: User, as: 'LikedUsers' }],
      order: [['createdAt', 'DESC']]
    })
      .then(tweets => {
        const UserId = helpers.getUser(req).id
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
  postReply: (req, res) => {
    if (req.body.content.length > 140) {
      return res.redirect('back')
    }
    Reply.create({
      UserId: helpers.getUser(req).id,
      TweetId: req.params.id,
      content: req.body.content
    }).then((reply => {
      res.redirect('back')
    }))
  },
  getReply: (req, res) => {
    const id = req.params.id
    return Tweet.findByPk(id, { include: [Reply] })
      .then(tweet => {
        const replies = tweet.Replies
        return res.json({ replies })
      })
      .catch(err => console.log(err))
  },
  like: (req, res) => {
    Like.create({
      UserId: helpers.getUser(req).id,
      TweetId: req.params.id
    })
      .then(() => {
        return res.redirect('back')
      })
      .catch(error => {
        console.log(error)
        res.render('error', { message: 'error !' })
      })
  },
  unLike: (req, res) => {
    return Like.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        TweetId: req.params.id
      }
    })
      .then(like => {
        like.destroy()
          .then(() => {
            return res.redirect('back')
          })
      })
      .catch(error => {
        console.log(error)
        res.render('error', { message: 'error !' })
      })
  }
}

module.exports = tweetController
