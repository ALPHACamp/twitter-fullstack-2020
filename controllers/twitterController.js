const db = require('../models')
const { User, Like, Tweet, Reply } = db
const helpers = require('../_helpers')

const twitterController = {
  getTwitters: (req, res) => {
    return res.render('tweets')
  },

  postTwitters_thumbs_up: (req, res) => {
    tweetId = req.params.id
    userId = req.user.id
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
    userId = req.user.id
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
  getReplies: (req, res) => {
    const tweetId = req.params.id
    Tweet.findByPk(tweetId, { include: [{ model: Reply, include: [User] }, User] })
      .then((tweet) => {
        res.render('replies', { tweet: tweet.toJSON() })
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
  }
}

module.exports = twitterController