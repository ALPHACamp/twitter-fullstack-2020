const helpers = require('../_helpers')
const db = require('../models')
const { User, Tweet, Reply, Like } = db

const tweetController = {
  getTweets: (req, res) => {
    Tweet.findAll({
      include: [
        User,
        Reply,
        { model: User, as: 'LikedUsers' }
      ],
      order: [['createdAt', 'DESC']]
    }).then(data => {
      const tweets = data.map(d => ({
        ...d.dataValues,
        isLiked: d.LikedUsers.map(i => i.id).includes(helpers.getUser(req).id)
      }))
      res.render('tweets', { tweets })
    }).catch(err => console.log(err))
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
    }).catch(err => console.log(err))
  },
  postTweet: (req, res) => {
    if (!req.body.description) {
      req.flash('error_messages', '貼文不可空白')
      res.redirect('back')
    } else if (req.body.description.length > 140) {
      req.flash('error_messages', '貼文不得超過140個字')
      res.redirect('back')
    } else {
      return Tweet.create({
        UserId: helpers.getUser(req).id,
        description: req.body.description
      }).then(tweet => {
        return res.redirect('/tweets')
      })
        .catch(error => console.log(error))
    }
  },
  postReply: (req, res) => {
    if (req.body.content.length > 140) {
      res.redirect('back')
    } else if (!req.body.content) {
      req.flash('error_messages', '回覆不可為空白')
      return res.redirect('back')
    }
    Reply.create({
      UserId: helpers.getUser(req).id,
      TweetId: req.params.id,
      content: req.body.content
    }).then(() => {
      res.redirect('back')
    })
  },
  getReply: (req, res) => {
    const id = req.params.id
    Tweet.findByPk(id, {
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
    }).catch(err => console.log(err))
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
