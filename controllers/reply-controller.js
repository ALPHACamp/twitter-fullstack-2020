const { Tweet, User, Like, Reply, Followship } = require('../models')
const _helpers = require('../_helpers')

const replyController = {
  getReplies: async (req, res, next) => {
    try {
      const loginUserId = _helpers.getUser(req).id
      const TweetId = req.params.tid
      let [ loginUser, replies, topUsers, tweet ] = await Promise.all([
        User.findByPk(loginUserId, {
          include: [
            { model: User, as: 'Followings'},
            { model: User, as: 'Followers'},
            { model: Tweet, as: 'LikedTweets' }
          ],
        }),
        Reply.findAll({
          order: [['createdAt', 'ASC']],
          include: [ 
            { model: User },
            { model: Tweet, include: [User] },
            { model: Tweet, include: [Like] }
          ],
          where: { TweetId }
        }),
        User.findAll({
          include: [{ model: User, as: 'Followers' }]
        }),
        Tweet.findByPk(TweetId, {
          include: [User, Like]
      })
      ])
     
      if (!loginUser) throw new Error('使用者不存在')

      loginUser = loginUser.toJSON()
      tweet = tweet.toJSON()

      tweet.isLike = tweet.Likes.some(like => like.UserId === loginUserId);
      
      replies = replies.map(reply => ({
          ...reply.toJSON(),
          }))

      topUsers = topUsers.map(user => ({
          ...user.toJSON(),
          isFollow: user.Followers.some(f => f.id === loginUserId)
          }))
        .filter(user => user.role === 'user' && user.id !== loginUserId)
        .sort((a, b) => b.Followers.length - a.Followers.length)
        .slice(0, 10)

      return res.render('replies', {
        loginUser,
        replies,
        tweet,
        topUsers
      })
    } catch(err) {
      next(err)
    }
  },
  postReplies: async (req, res, next) => {
    try {
      const TweetId = req.params.tid
      const UserId = _helpers.getUser(req).id
      const { comment } = req.body
      
      if (!comment.trim()) throw new Error('Description is required!')
      if (comment.length > 140) throw new Error('Description cannot be longer than 140 characters!')

      await Reply.create({
        UserId,
        TweetId,
        comment
      })

      return res.redirect('back')

    } catch(err) {
      next(err)
    }
  },

}

module.exports = replyController