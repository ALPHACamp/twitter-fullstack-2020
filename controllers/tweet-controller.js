const { Tweet, User, Reply, Like } = require('../models')
const helper = require('../_helpers')

const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const userId = helper.getUser(req).id
      const [user, tweets] = await Promise.all([
        User.findByPk(userId,
          {
            attributes: ['id', 'name', 'avatar'],
            raw: true
          }),
        Tweet.findAll({
          order: [['createdAt', 'DESC']],
          attributes: ['id', 'description', 'createdAt'],
          include: [
            { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
            { model: Reply, attributes: ['id'] },
            { model: User, as: 'LikedUsers' }
          ]
        })
      ])
      if (!user) throw new Error("User didn't exist!")

      const data = tweets.map(tweet => ({
        ...tweet.toJSON(),
        isLiked: tweet.LikedUsers.some(item => item.id === userId)
      }))
      res.render('tweet', { user, tweets: data, leftColTab: 'userHome' })
    } catch (err) {
      next(err)
    }
  },
  postTweets: async (req, res, next) => {
    try {
      const userId = helper.getUser(req).id
      const postDescription = helper.postValidation(req.body.description)
      if (postDescription.length <= 0) throw new Error('送出推文不可為空白')
      if (postDescription.length > 140) throw new Error('送出推文超過限制字數140個字')
      const tweet = await Tweet.create({
        UserId: userId,
        description: postDescription
      })
      if (!tweet) throw new Error('推文不成功')
      req.flash('success_messages', '成功送出推文')
      res.redirect('/tweets')
    } catch (err) {
      next(err)
    }
  },
  likeTweets: async (req, res, next) => {
    try {
      const UserId = helper.getUser(req).id
      const TweetId = req.params.tweetId
      if (!TweetId) throw new Error('該篇貼文不存在，請重新整理')
      const existLike = await Like.findOne({ where: { UserId, TweetId } })
      if (existLike) throw new Error('您已喜歡過該篇貼文')
      const like = await Like.create({ UserId, TweetId })
      return res.status(302).json({ status: 'success', like })
      // res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  unlikeTweets: async (req, res, next) => {
    try {
      const UserId = helper.getUser(req).id
      const TweetId = req.params.tweetId
      if (!TweetId) throw new Error('該篇貼文不存在，請重新整理')
      const existLike = await Like.findOne({ where: { UserId, TweetId } })
      if (!existLike) throw new Error('您尚未喜歡該篇貼文')
      const unlike = await Like.destroy({
        where: { UserId, TweetId }
      })
      return res.status(302).json({ status: 'success', unlike })
      // res.redirect('back')
    } catch (err) {
      next(err)
    }
  }
}
module.exports = tweetController
