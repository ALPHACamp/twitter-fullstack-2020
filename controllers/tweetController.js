// REBASE 01
const db = require('../models')
const user = require('../models/user')
const Tweet = db.Tweet
const Reply = db.Reply
const User = db.User
const Like = db.Like
const Followship = db.Followship

const helpers = require('../_helpers')

const tweetService = require('../services/tweetService')

const tweetController = {
  // 首頁
  getTweets: (req, res) => {
    tweetService.getTweets(req, res, data => {
      return res.render('index', data)
    })
  },

  postTweet: async (req, res) => {
    let { description } = req.body
    if (!description.trim()) {
      req.flash('error_messages', '推文不能空白！')
      return res.redirect('back')
    }
    if (description.length > 140) {
      req.flash('error_messages', '推文不能為超過140字！')
      return res.redirect('back')
    }
    await Tweet.create({
      description: req.body.description,
      UserId: helpers.getUser(req).id
    })
    res.redirect('/tweets')
  },

  getTweet: (req, res) => {
    return Promise.all([
      Tweet.findByPk(req.params.id, {
        include: [
          User,
          { model: Reply, include: [User] },
          { model: User, as: 'LikedUsers' }
        ],
        order: [['Replies', 'createdAt', 'DESC']]
      }).then(tweet => {
        const isLiked = tweet.LikedUsers.map(d => d.id).includes(helpers.getUser(req).id)
        return res.render('tweet', { 
          tweet: tweet.toJSON(), 
          isLiked 
        })
      })
    ])
  },
}

module.exports = tweetController
