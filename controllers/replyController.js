const helpers = require('../_helpers')
const { User, Reply, Tweet, Like } = require('../models')
const replyController = {
  getReply: async (req, res, next) => {
    try {
      let tweet = await Tweet.findByPk(req.params.tweet_id,
        {
          include: [
            User, Like, Reply,
            { model: Reply, include: User }
          ],
          order: [['createdAt', 'DESC']]
        })

      let users = await User.findAll({
        include: [
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      })

      const user = await User.findByPk(helpers.getUser(req).id,
        {
          raw: true,
          nest: true
        })

      const likes = await Like.findAll({
        where: { UserId: helpers.getUser(req).id }
      })
      const likedCount = tweet.Likes.length
      const repliedCount = tweet.Replies.length
      const isLiked = likes.map(l => l.TweetId).includes(tweet.id)


      users = await users.map(user => ({
        ...user.toJSON(),
        followerCount: user.Followers.length,
        isFollowed: helpers.getUser(req).Followings.map(f => f.id).includes(user.id)
      }))
      users = users.sort((a, b) => b.followerCount - a.followerCount)
        .slice(0, 10)
      return res.render('tweet', { tweet: tweet.toJSON(), users, user, likedCount, repliedCount, isLiked })
    } catch (err) {
      next(err)
    }
  },
  postReply: async (req, res, next) => {
    try {
      const { comment } = req.body
      if (!comment) {
        req.flash('error_messages', '回覆內容不存在！')
        return res.redirect('back')
      }
      if (comment.trim() === '') {
        req.flash('error_messages', '回覆內容不能為空！')
        return res.redirect('back')
      }
      if (comment && comment.length > 140) {
        req.flash('error_messages', '回覆內容不能超過140字!')
        return res.redirect('back')
      }
      await Reply.create({
        UserId: helpers.getUser(req).id,
        TweetId: req.params.tweet_id,
        comment
      })
      req.flash('success_messages', '成功新增回覆！')
      return res.redirect(`/tweets/${req.params.tweet_id}/replies`)
    }
    catch (err) {
      next(err)
    }
  }
}
module.exports = replyController
