const db = require('../models')

const { User, Like, Tweet, Reply } = db
const helpers = require('../_helpers')
const pageLimit = 10

const twitterController = {

  getTwitters: (req, res) => {
    let offset = 0

    if (req.query.page) {
      offset = (Number(req.query.page) - 1) * pageLimit
    }

    Promise.all([
      Tweet.count(),
      Tweet.findAll({
        include: [User, { model: Like }, { model: Reply, include: [User] }],
        order: [['createdAt', 'DESC']],
        offset: offset,
        limit: pageLimit
      })
    ]).then(([count, result]) => {
      const page = Number(req.query.page) || 1
      const pages = Math.ceil(count / pageLimit)
      const totalPages = Array.from({ length: pages }).map((item, index) => index + 1)
      const prev = page - 1 <= 0 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1
      const tweets = result.map(t => ({
        ...t.dataValues,
        description: t.dataValues.description.substring(0, 50),
        User: t.User.dataValues,
        replies: t.Replies,
        tweetLiked: t.Likes.filter(like => like.likeOrNot === true).length,
        tweetDisliked: t.Likes.filter(like => like.likeOrNot === false).length
      }))
      return res.render('tweets', { tweets, totalPages, prev, next, page })
    })
  },

  createTwitters: (req, res, next) => {
    const description = req.body.homeDescription || req.body.description
    const UserId = helpers.getUser(req).id

    if (!description) {
      req.flash('error_messages', '內容不能為空白')
      return res.status(302).redirect('back')
    } else if (description.length > 140) {
      req.flash('error_messages', '內容不能超過140字')
      return res.status(302).redirect('back')
    }

    return Tweet.create({
      UserId, description
    })
      .then((tweet) => {
        return res.status(302).redirect('back')
      })
      .catch(error => {
        console.log('createTwitter is error', error)
        return res.status(400).redirect('back')
      })
  },

  postTwitters_thumbs_up: (req, res) => {
    tweetId = req.params.id
    userId = helpers.getUser(req).id
    Like.findOne({
      where: { UserId: userId, TweetId: tweetId }
    }).then(like => {
      if (like) {
        like.update({
          likeOrNot: true
        })
          .then((like) => {
            return res.redirect('back')
          })
      } else {
        Like.create({
          UserId: userId,
          TweetId: tweetId,
          likeOrNot: true
        })
          .then((like) => {
            return res.redirect('back')
          })
      }
    })
  },

  postTwitters_thumbs_down: (req, res) => {
    tweetId = req.params.id
    userId = helpers.getUser(req).id
    Like.findOne({
      where: { UserId: userId, TweetId: tweetId }
    }).then(like => {
      if (like) {
        like.update({
          likeOrNot: false
        })
          .then((like) => {
            return res.redirect('back')
          })
      } else {
        Like.create({
          UserId: userId,
          TweetId: tweetId,
          likeOrNot: false
        })
          .then((like) => {
            return res.redirect('back')
          })
      }
    })
  },

  getTwitter: (req, res) => {
    const tweetId = req.params.id
    Tweet.findByPk(tweetId, { include: [{ model: Like }, { model: Reply, include: [User] }, User] })
      .then((tweet) => {
        tweetLiked = tweet.Likes.filter(like => like.likeOrNot === true).length
        tweetDisliked = tweet.Likes.filter(like => like.likeOrNot === false).length
        res.render('tweet', { tweet: tweet.toJSON(), tweetLiked, tweetDisliked })
      }).catch(err => console.log(err))
  },

  postReply: (req, res) => {
    const tweetId = req.params.id
    const comment = req.body.comment
    if (!comment) {
      req.flash('error_messages', '內容不能為空白')
      return res.redirect('back')
    }
    return Reply.create({
      TweetId: tweetId,
      UserId: helpers.getUser(req).id,
      comment: req.body.comment
    }).then(reply => {
      res.redirect('back')
    })
  },

  /// /////
  // tweet test like
  /// /////
  postTwitters_unlike: (req, res) => {
    tweetId = req.params.id
    userId = helpers.getUser(req).id
    Like.findOne({
      where: { UserId: userId, TweetId: tweetId }
    }).then(like => {
      like.destroy()
        .then((u) => {
          return res.status(302).redirect('back')
          // return res.status(302).json({ status: 'success', message: "" })
        })
      // return res.redirect('back')
    })
  }
}

module.exports = twitterController
