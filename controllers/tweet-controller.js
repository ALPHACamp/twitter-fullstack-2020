const { Tweet, User, Reply, Like, Followship } = require('../models')
const helpers = require('../_helpers')
const tweetController = {
  getTweets: (req, res, next) => {
  return Tweet.findAll({
      include: [User, Reply],
      order: [['createdAt', 'DESC']],
      limit: 20,
      raw: true,
      nest: true,
    })
      .then(tweets => {
        return res.render('tweets', { tweets })
      })
      .catch(err => next(err))
  },
  postTweet: (req, res, next) => {
    //const userId = Number(helpers.getUser(req).id)
    const description = req.body.description
    const tD = description.trim()
    if (!tD){
      req.flash('error_messages',"內容不可以空白")
      res.redirect('back')
    } else if (tD.length > 140){
      req.flash('error_messages', "內容不可以超過 140 字")
    }
    return Tweet.create({ description })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  getReplies: (req, res, next) => {
    console.log('req.params', req.params.id)
    Tweet.findByPk(req.params.id,
      {
        include: [
          Like, User,
          {
            model: Reply, include: [Like, User,
              {
                model: Reply, as: 'followingByReply',
                include: [User, Like]
              }]
          },
        ]
      })
      .then(tweet => {
        const isLiked = tweet.Likes.map((i) => i.UserId).includes(helpers.getUser(req).id)
        const reply = tweet.toJSON().Replies.map(i => {
          i.isLiked = i.Likes.map(id => id.UserId).includes(helpers.getUser(req).id)
          i.followingByReply.map(j => {
            j.isLiked = j.Likes.map(id => id.UserId).includes(helpers.getUser(req).id)
          })
          return i
        })
        res.render('replies', {
          isLiked,
          tweet: tweet.toJSON(),
          reply,
          LocaleDate: tweet.toJSON().updatedAt.toLocaleDateString(),
          LocaleTime: tweet.toJSON().updatedAt.toLocaleTimeString(),
        })
      })
  },
  postReply: (req, res, next) => {
    const { comment } = req.body
    if (!comment) throw new Error('內容不可以空白')
    if (comment.trim() === '') throw new Error('內容不可以空白')
    if (comment.length > 140) throw new Error('不可超過 140 字')
    return Reply.create({ comment })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  addLike: (req, res, next) => {
    const tweetId = req.params.id
    const userId = helpers.getUser(req).id
    return Tweet.findByPk(tweetId)
      .then(tweet => {
        if (!tweet) throw new Error("這則貼文不存在")
        return Like.create({ tweetId })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeLike: (req, res, next) => {
    const tweetId = req.params.id
    const userId = Number(helpers.getUser(req).id)

    return Like.findOne({
      where: {
        //userId,
        tweetId
      }
    })
    .then(like => {
      if (!like) throw new Error("這則貼文還沒按like")
      return like.destroy()
    })
    .then(() => res.redirect('back'))
    .catch(err => next(err))
  }
}
module.exports = tweetController