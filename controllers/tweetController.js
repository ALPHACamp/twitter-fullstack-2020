const helpers = require('../_helpers')
const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like

const userService = require('../services/userService')

// for testing(helpers.getUser(req))
const user = {
  id: 11,
  email: 'user1@example.com',
  role: 'user',
  name: 'user1',
  avatar: `https://loremflickr.com/240/240/selfie,boy,girl/?random=${Math.random() * 100}`,
  introduction: 'adkoer mknmfdl pwroeioros mdlmvlk',
  account: 'user1',
  cover: `https://loremflickr.com/720/240/landscape/?random=${Math.random() * 100}`
}

const tweetController = {
  getTweets: (req, res) => {
    Tweet.findAll({ raw: true, nest: true, include: [User], order: [['createdAt', 'DESC']]}).then(tweets => {
      userService.getTopUser(req, res, topUser => {
        return res.render('tweets', { user, tweets, topUser })
      })
    })
  },
  getTweet: (req, res) => {
    Tweet.findByPk(req.params.id, { include: [
      User,
      Like,
      { model: Reply, include: [User] }
    ] }).then(tweet => {
      userService.getTopUser(req, res, topUser => {
        console.log(tweet.toJSON())
        return res.render('tweet', { user, tweet: tweet.toJSON(), topUser })
      })
    })
  },
  postTweet: (req, res) => {
    const description = req.body.description

    if (description.trim() === '') {
      return res.redirect('back')
    }
    if (description.length > 140) {
      return res.redirect('back')
    }
    return Tweet.create({
      UserId: helpers.getUser(req).id,
      description: description
    })
      .then((tweet) => {
        return res.redirect('back')
      })
  }
}

module.exports = tweetController