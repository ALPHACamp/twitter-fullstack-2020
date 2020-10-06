
const tweetService = require('../services/tweetService')
const db = require('../models');
const User = db.User;
const Like = db.Like;
const Tweet = db.Tweet;
const Reply = db.Reply;
const helpers = require('../_helpers');

const tweetController = {
  getTweets: (req, res) => {
    Tweet.findAll({
      include: [
        User,
        Reply,
        Like
      ],
      order: [['createdAt', 'DESC']]
    })
      .then((tweets) => {
        const data = tweets.map((t) => ({
          ...t.dataValues,
          isLiked: t.toJSON().Likes.map((i) => i.UserId).includes(helpers.getUser(req).id),
        }))
        const likes = helpers.getUser(req).Likes
        const isLiked = likes.map((i) => i.id).includes(data.id)
        return res.render('tweets', {
          isLiked: isLiked,
          tweets: data,
          user: helpers.getUser(req)
        })
      })
  },

  postTweets: (req, res) => {
    const tweetText = req.body.tweetText.trim()
    if (!tweetText || tweetText.length > 140) return res.redirect('back')
    Tweet.create({
      UserId: helpers.getUser(req).id,
      description: tweetText,
    })
      .then(() => {
        req.flash('successFlashMessage', '成功新增推文!')
        return res.redirect('/tweets')
      })
      .catch(() => {
        req.flash('errorFlashMessage', '新增推文失敗!')
        return res.redirect('back')
      })
  },

  postTweetLike: async (req, res) => {
    try {
      const [like, isCreated] = await Like.findOrCreate(
        {
          where: {
            Position: 'tweet',
            PositionId: req.params.id,
            UserId: helpers.getUser(req).id,
          },
          defaults: {
            UserId: helpers.getUser(req).id,
            Position: 'tweet',
            PositionId: req.params.id,
            isLike: true,
          }
        })
      if (isCreated) console.log('postTweetLike success')
      else console.log('postTweetLike already created')
      return res.redirect('back')
    }
    catch {
      console.log('postTweetLike error')
      return res.redirect('back')
    }
  },

  postTweetUnlike: (req, res) => {
    Like.findOne({
      where: {
        Position: 'tweet',
        PositionId: req.params.id,
        UserId: helpers.getUser(req).id,
      }
    })
      .then((like) => {
        return like.destroy()
          .then(() => { return res.redirect('back') })
          .catch(() => {
            console.log('deleteTweetLike error')
            return res.redirect('back')
          })
      })
      .catch(() => {
        console.log('queryTweetLike error')
        return res.redirect('back')
      })
  },

  postReplyLike: async (req, res) => {
    try {
      const [like, isCreated] = await Like.findOrCreate(
        {
          where: {
            Position: 'reply',
            PositionId: req.params.id,
            UserId: helpers.getUser(req).id,
          },
          defaults: {
            UserId: helpers.getUser(req).id,
            Position: 'reply',
            PositionId: req.params.id,
            isLike: true,
          }
        })
      if (isCreated) console.log('postReplyLike success')
      else console.log('postReplyLike already created')
      return res.redirect('back')
    }
    catch {
      console.log('postReplyLike error')
      return res.redirect('back')
    }
  },

  postReplyUnlike: (req, res) => {
    Like.findOne({
      where: {
        Position: 'reply',
        PositionId: req.params.id,
        UserId: helpers.getUser(req).id,
      }
    })
      .then((like) => {
        return like.destroy()
          .then(() => { return res.redirect('back') })
          .catch(() => {
            console.log('deleteReplyLike error')
            return res.redirect('back')
          })
      })
      .catch(() => {
        console.log('queryReplyLike error')
        return res.redirect('back')
      })
  },

  postReply: (req, res) => {
    let tweetId = req.params.id
    let replyText = req.body.replyText.trim()
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
  }



}

module.exports = tweetController