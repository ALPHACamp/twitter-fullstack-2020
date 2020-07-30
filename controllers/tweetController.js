const helpers = require('../_helpers')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like

const tweetController = {
  getTweets: (req, res) => {
    if (helpers.getUser(req).role === 'admin') { return res.redirect('back') }
    Tweet.findAll({
      include: [
        User,
        Reply,
        { model: User, as: 'LikedUsers' }
      ],
      order: [['createdAt', 'DESC']]
    }).then(tweets => {
      const data = tweets.map(t => ({
        ...t.dataValues,
        // isLiked: helpers.getUser(req).LikedTweets.map(d => d.id).includes(t.id)
        isLiked: t.LikedUsers.map(i => i.id).includes(helpers.getUser(req).id)
      }))
      res.render('tweets', { tweets: data })
    })
  },
  postTweet: (req, res) => {
    if (!req.body.description) {
      return res.redirect('/')
    }
    if (req.body.description.length > 140) {
      return res.redirect('/')
    }
    return Tweet.create({
      UserId: helpers.getUser(req).id,
      description: req.body.description,
    }).then(tweet => {
      return res.redirect('/')
    })
  },
  getTweet: (req, res) => {
    Tweet.findByPk(req.params.id, {
      include: [
        User,
        { model: User, as: 'LikedUsers' },
        { model: Reply, include: [User] }
      ],
      order: [['Replies', 'createdAt', 'DESC']]
    }).then(tweet => {
      res.render('tweet', {
        tweet: tweet.toJSON(),
        isLiked: tweet.LikedUsers.map(d => d.id).includes(helpers.getUser(req).id)
      })
    })
  },
  postReply: (req, res) => {
    if (req.body.comment.length > 140) {
      return res.redirect('back')
    }
    Reply.create({
      UserId: helpers.getUser(req).id,
      TweetId: req.params.id,
      comment: req.body.comment
    }).then((reply => {
      res.redirect('back')
    }))
  },
  getReply: (req, res) => {
    const id = req.params.id
    return Tweet.findByPk(id, { include: [Reply] })
      .then(tweet => {
        const replies = tweet.Replies
        return res.send(replies)
      })
      .then(() => res.redirect('/tweets'))
  },
  addLike: (req, res) => {
    Like.create({
      UserId: helpers.getUser(req).id,
      TweetId: req.params.id
    }).then((tweet) => {
      return res.redirect('back')
    })
  },
  removeLike: (req, res) => {
    Like.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        TweetId: req.params.id
      }
    }).then(like => {
      like.destroy()
        .then(tweet => {
          return res.redirect('back')
        })
    })
  }
}

module.exports = tweetController