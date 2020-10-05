const helpers = require('../_helpers')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const Favorite = db.Favorite

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
        isFavorited: req.user.FavoritedTweets.map(d => d.id).includes(t.id),
        isLiked: req.user.LikeTweets.map(d => d.id).includes(t.id),
      }))
      return res.render('tweets', { tweets: data })
    })
  },

  getTweet: (req, res) => {
    Tweet.findByPk(req.params.id, {
      include: [
        User,
        { model: Reply, include: [User] },
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikeUsers' }
      ],
      order: [['Replies', 'createdAt', 'DESC']]
    }).then(tweet => {
      const isFavorited = tweet.FavoritedUsers.map(user => user.id).includes(req.user.id)
      const isLiked = tweet.LikeUsers.map(user => user.id).includes(req.user.id)
      return res.render('tweet', {
        tweet,
        isFavorited: isFavorited,
        isLiked: isLiked,
      })
    })
      .catch(error => console.log(error))
  },

  createTweet: (req, res) => {
    if (!req.body.description) {
      req.flash('error_message', "it can't be blank.")
      return res.redirect('/')
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
  addFavorite: (req, res) => {
    return Favorite.create({
      UserId: req.user.id,
      TweetId: req.params.tweetId
    })
      .then((tweet) => {
        return res.redirect('back')
      })
  },

  removeFavorite: (req, res) => {
    return Favorite.findOne({
      where: {
        UserId: req.user.id,
        TweetId: req.params.tweetId
      }
    })
      .then((favorite) => {
        favorite.destroy()
          .then((tweet) => {
            return res.redirect('back')
          })
      })
  }
}
module.exports = tweetController
