const helpers = require('../_helpers')
const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply
const Like = db.Like

const userService = require('../services/userService')

// for testing(helpers.getUser(req))
/*const user = {
  id: 11,
  email: 'user1@example.com',
  role: 'user',
  name: 'user1',
  avatar: `https://loremflickr.com/240/240/selfie,boy,girl/?random=${Math.random() * 100}`,
  introduction: 'adkoer mknmfdl pwroeioros mdlmvlk',
  account: 'user1',
  cover: `https://loremflickr.com/720/240/landscape/?random=${Math.random() * 100}`
}*/

const tweetController = {
  getTweets: (req, res) => {
    if (helpers.getUser(req).role === 'admin') {
      return res.redirect('/admin/tweets')
    }
    Tweet.findAll({ order: [['createdAt', 'DESC']], include: [
      User,
      Reply,
      { model: User, as: 'LikedUsers' }
    ]}).then(tweets => {
      console.log(tweets)
      tweets = tweets.map(tweet => {
        if (tweet.dataValues !== undefined) {
          return {
            ...tweet.dataValues,
            replyCount: tweet.Replies.length,
            isReplied: tweet.Replies.map(item => item.UserId).includes(helpers.getUser(req).id),
            likeCount: tweet.LikedUsers.length,
            isLiked: tweet.LikedUsers.map(item => item.id).includes(helpers.getUser(req).id)
          }
        }
      })

      userService.getTopUser(req, res, topUser => {
        return res.render('tweets', { tweets, topUser })
      })
    })
  },
  getTweet: (req, res) => {
    Tweet.findByPk(req.params.id, { include: [
      User,
      { model: User, as: 'LikedUsers'},
      { model: Reply, include: [User] }
    ] }).then(tweet => {
      tweet = {
        ...tweet.toJSON(),
        replyCount: tweet.Replies.length,
        isReplied: tweet.Replies.map(item => item.UserId).includes(helpers.getUser(req).id),
        likeCount: tweet.LikedUsers.length,
        isLiked: helpers.getUser(req).LikedTweets.map(item => item.id).includes(tweet.id)
      }

      userService.getTopUser(req, res, topUser => {
        return res.render('tweet', { tweet, topUser })
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