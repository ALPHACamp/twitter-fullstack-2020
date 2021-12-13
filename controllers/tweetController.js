const helpers = require('../_helpers')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like


const tweetController = {
  getTweets: (req, res) => {
    Tweet.findAll({
      raw: true,
      nest: true,
      include: [
        User,
        { model: User, as: 'LikeUsers' }
      ],
      order: [['createdAt', 'DESC']]
    }).then(tweets => {
      Reply.findAll({
        raw: true,
        nest: true
      })
      .then(replies=>{
        tweets.forEach(tweet=>{
          let replyNum = 0;
          replies.forEach(reply=>{
            if(tweet.id === reply.TweetId) replyNum++;
          })
          tweet.replyNum = replyNum;
          tweet.isLiked = req.user.LikeTweets.map(d => d.id).includes(tweet.id)
        })
        return User.findOne({ where: { id: helpers.getUser(req).id } })
              .then(user => {
                return res.render('tweets', { tweets, user: user.toJSON(), users: res.locals.users })
              })
      })
    })
    .catch(error => console.log(error))
  },

  getTweet: (req, res) => {
    return Tweet.findByPk(req.params.id, {
      include: [
        User,
        {model: User, as: 'LikeUsers'}
      ],
    }).then(tweet => {
      Reply.findAll({
        where: { TweetId: tweet.id },
        raw: true,
        nest: true,
        include: [User],
        order: [['createdAt', 'DESC'  ]]
      }).then(replies=>{
        replies.map(reply=>{
          reply.ownerId = tweet.User.id;
          reply.ownerAccount = tweet.User.account;
        })
        const isLiked = tweet.LikeUsers.some(t => t.id === helpers.getUser(req).id)
        return res.render('tweet', { tweet, replies, isLiked })
      })
    })
  },

  createTweet: (req, res) => {
    if (!req.body.description) {
      req.flash('error_messages', "請輸入內容")
      return res.redirect('back')
    }
    if (req.body.description.length > 140) {
      req.flash('error_messages', "字數不的超過140個字")
      return res.redirect('back')
    }
    return Tweet.create({
      UserId: helpers.getUser(req).id,
      description: req.body.description
    }).then(tweet => {
      req.flash('success_messages', "推文建立成功")
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
  },
  postReply: (req, res) => {
    if (req.body.comment.length > 140) {
      return res.redirect('back')
    }
    return Reply.create({
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
