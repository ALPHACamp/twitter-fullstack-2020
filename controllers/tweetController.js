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
        { model: User, as: 'LikedUsers' }
      ],
      order: [['createdAt', 'DESC']]
    }).then(data => {
      const tweets = data.map(item => ({
        ...item.dataValues,
        isLiked: item.LikedUsers.map(i => i.id).includes(helpers.getUser(req).id)
      }))
      // res.json(tweets)
      res.render('tweets', { tweets: tweets })
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
      req.flash('error_messages', '推文不可為空白')
      res.redirect('/tweets')
    }
    else if (req.body.description.length > 140) {
      req.flash('error_messages', '推文內容不可超過 140 個字')
      res.redirect('/tweets')
    }
    else {
      return Tweet.create({
        UserId: helpers.getUser(req).id,
        description: req.body.description,
      }).then(() => {
        return res.redirect('/')
      }).catch(err => console.log(err))
    }
  },
  postReply: (req, res) => {
    if (!req.body.comment) {
      req.flash('error_messages', '回覆不可為空白')
      return res.redirect('back')
    }
    Reply.create({
      UserId: helpers.getUser(req).id,
      TweetId: req.params.id,
      comment: req.body.comment
    }).then(() => {
      res.redirect('back')
    }).catch(err => console.log(err))
  },
  getReply: (req, res) => {
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
  addLike: (req, res) => {
    Like.create({
      UserId: helpers.getUser(req).id,
      TweetId: req.params.id
    }).then(() => {
      return res.redirect('back')
    }).catch(err => console.log(err))
  },
  removeLike: (req, res) => {
    Like.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        TweetId: req.params.id
      }
    }).then(like => {
      like.destroy()
        .then(() => {
          return res.redirect('back')
        }).catch(err => console.log(err))
    }).catch(err => console.log(err))
  }
}

module.exports = tweetController