const { User, Tweet, Reply, Like } = require('../models')
const helpers = require('../_helpers')

const replyController = {
  getTweetReplies: (req, res, next) => {
    const reqUser = helpers.getUser(req)
    const { id } = req.params
    const userId = req.user.id

    Promise.all([
      Tweet.findByPk(id, {
        include: [{ model: User }, { model: Reply }, { model: Like }]
        // raw: true,
        // nest: true
      }),
      Reply.findAll({
        where: { tweetId: id },
        order: [['createdAt', 'DESC']],
        include: [{ model: User }, { model: Tweet, include: User }],
        raw: true,
        nest: true
      }),
      Like.findAll({
        where: { UserId: helpers.getUser(req).id },
        raw: true
      }),
      User.findAll({
        include: [{ model: User, as: 'Followers' }],
        where: { role: 'user' }
      }),
      User.findByPk(userId)
    ])
      .then(([tweet, replies, likes, users, user]) => {
        const likedTweets = likes.map(like => (like.tweetId))
        const isLiked = likedTweets.includes(tweet.id)
        // topUser
        const topUsers = users
          .map(u => ({
            ...u.toJSON(),
            name: u.name.substring(0, 20),
            account: u.account.substring(0, 20),
            // 計算追蹤者人數
            followerCount: u.Followers.length,
            // 判斷目前登入使用者是否已追蹤該 user 物件
            isFollowed: req.user && req.user.Followings.some(f => f.id === u.id)
          }))
          .sort((a, b) => b.followerCount - a.followerCount)

        res.render('replies', { tweet: tweet.toJSON(), replies, isLiked, topUsers, reqUser, user: user.toJSON() })
      })
      .catch(err => next(err))
  },
  postReply: (req, res, next) => {
    const userId = helpers.getUser(req).id
    const { tweetId } = req.params
    const { comment } = req.body
    if (!comment) throw new Error('內容不可空白！')
    Reply.create({ userId, tweetId, comment })
      .then(() => {
        const { tweetId } = req.params
        res.redirect(`/tweets/${tweetId}/replies`)
      })
      .catch(err => next(err))
  }
}

module.exports = replyController
