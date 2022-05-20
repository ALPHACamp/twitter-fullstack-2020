const { Tweet, User, Reply } = require('../models')
const helper = require('../_helpers')
const apiServices = require('../service/api-services')

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
  likeTweets: (req, res, next) => {
    apiServices.likeTweets(req, (err, data) => err ? next(err) : res.status(302).json({ status: 'success', data }))
  },
  unlikeTweets: (req, res, next) => {
    apiServices.unlikeTweets(req, (err, data) => err ? next(err) : res.status(302).json({ status: 'success', data }))
  }
}
module.exports = tweetController
