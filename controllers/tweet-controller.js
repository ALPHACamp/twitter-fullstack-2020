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
    const tweetId = req.params.id
    const replyText = req.body.comment
    console.log(replyText)
    if (!replyText.length) {
      return res.redirect('back')
    } else {
      return Reply.create({
        UserId: helpers.getUser(req).id,
        TweetId: tweetId,
        comment: replyText
      })
        .then(() => {
          req.flash('successFlashMessage', '成功回覆推文!')
          return res.redirect('back')
        })
        .catch(() => {
          req.flash('errorFlashMessage', '回覆推文失敗!')
          return res.redirect('back')
        })
    }
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