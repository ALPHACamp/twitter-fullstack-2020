// const assert = require('assert')
const helpers = require("../_helpers")
const { User, Tweet, Like, Reply } = require('../models')

const replyController = {
  postReply: async (req, res, next) => {
    try {
      const comment = req.body.comment
      if (!comment.length) {
        req.flash('error_messages', '回覆不可以空白!')
        return res.redirect('back')
      }
      if (comment.length > 140) {
        req.flash('error_messages', '回覆不可超過140字!')
        return res.redirect('back')
      }
      await Reply.create({
        UserId: helpers.getUser(req).id,
        TweetId: req.params.id,
        comment: comment
      })
      req.flash('success_msg', '成功回覆')
      return res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  getReplies: async (req, res, next) => {
    try {
      const replies = await Reply.findAll({
        raw: true,
        nest: true,
        where: { TweetId: req.params.id },
        include: [
          User,
          { model: Tweet, include: [User] },
          { model: Tweet, include: [Like] }
        ],
        order: [['createdAt', 'DESC']]
      })
      const tweet = await Tweet.findByPk(req.params.id, {
        include: [User, Like],
      })
      const user = helpers.getUser(req)

      return res.render('replies', { tweet: tweet.toJSON(), replies, user })
    } catch (err) {
      next(err)
    }
    // try {
    //   const user = helpers.getUser(req)
    //   const likedTweetsId = req.user?.Likes.map(like => like.TweetId)
    //   const personal = await User.findByPk(Number(req.params.id), {
    //     include: [
    //       { model: Tweet }
    //     ]
    //   })
    //   const replies = await Reply.findAll({
    //     where: {
    //       ...personal ? { TweetId: personal.id } : {}
    //     },
    //     include: [
    //       User,
    //       { model: Tweet, include: [User] }
    //     ],
    //     order: [
    //       ['created_at', 'DESC'],
    //       ['id', 'ASC']
    //     ],
    //     raw: true,
    //     nest: true
    //   })

    //   const tweet = await Tweet.findByPk(req.params.id, {
    //     include: [User, Like],
    //   })
    //   return res.render('replies', { tweet: tweet.toJSON(), replies, user })
    // } catch (err) {
    //   next(err)
    // }
  }
}

module.exports = replyController
