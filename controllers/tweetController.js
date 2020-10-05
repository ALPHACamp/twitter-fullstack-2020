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
        { model: User, as: 'LikeUsers' }
      ],
      order: [['createdAt', 'DESC']]
    }).then(tweets => {
      const data = tweets.map(t => ({
        ...t.dataValues,
        description: t.dataValues.description,
        isLiked: req.user.LikeTweets.map(d => d.id).includes(t.id),
      }))
      return User.findOne({ where: { id: req.user.id } })
        .then(user => {
          return res.render('tweets', { tweets: data, user })
        })
    })
      .catch(error => console.log(error))
  },

  getTweet: (req, res) => {
    Tweet.findByPk(req.params.id, {
      include: [
        User,
        { model: Reply, include: [User] },
        { model: User, as: 'LikeUsers' },
      ],
      order: [['Replies', 'createdAt', 'DESC']]
    }).then(tweet => {
      const isLiked = tweet.LikeUsers.map(user => user.id).includes(req.user.id)
      return res.render('tweet', {
        tweet,
        isLiked: isLiked,
      })

      // return User.findOne({ where: { id: req.user.id } })
      // .then(user => {
      //   console.log(user)
      //   return res.render('tweet', {
      //     tweet,
      //     isLiked
      //   })
      // })
    })
      .catch(error => console.log(error))
  },

  createTweet: (req, res) => {
    if (!req.body.description) {
      req.flash('error_message', "it can't be blank.")
      return res.redirect('back')
    }
    if (req.body.description.length > 140) {
      req.flash('error_message', "it can't be longer than 140 characters.")
      return res.redirect('back')
    }
    return Tweet.create({
      UserId: req.user.id,
      description: req.body.description
    }).then(tweet => {
      return res.redirect('/tweets')
    })
  },
  addLike: (req, res) => {
    return Like.create({
      UserId: req.user.id,
      TweetId: req.params.tweetId
    }).then((tweet) => {
      return res.redirect('back')
    })
  },
  removeLike: (req, res) => {
    return Like.findOne({
      where: {
        UserId: req.user.id,
        TweetId: req.params.tweetId
      }
    })
      .then((like) => {
        like.destroy()
          .then((tweet) => {
            return res.redirect('back')
          })
      })
  },
  getReply: (req, res) => {
    return Tweet.findByPk(req.params.id,
      {
        include: [{ model: Reply, include: [User] }]
      }).then(tweet => {
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
      return res.redirect('back')
    }
    Reply.create({
      TweetId: req.params.id,
      UserId: req.user.id,
      comment: req.body.comment,
    })
      .then((reply) => {
        res.redirect('back')
      })
      .catch(error => console.log(error))
  },

  addFavorite: (req, res) => {
    return Favorite.create({
      UserId: req.user.id,
      TweetId: req.params.tweetId
    })
      .then((tweet) => {
        return res.redirect('back')
      })
  },

}
module.exports = tweetController
