const { User, Tweet, reply, Followship, Like } = require('../../models')
const helpers = require('../../_helpers')
const userController = {
  


  addLike: async (req, res, next) => {
    try {
      const tweetId = req.params.id
      const tweet = await Tweet.findByPk(tweetId)
      const like = await Like.findOne({ where: { userId: 1, tweetId } })
      if (!tweet) throw new Error("Tweet doesn't exist!")
      if (like) throw new Error('You have liked this Tweet!')
      await Like.create({ userId: 1, tweetId })
      res.redirect('/tweets')

    } catch (error) {
      console.log(error)
    }
  },
  removeLike: async (req, res, next) => {
    try {
      const tweetId = req.params.id
      const tweet = await Tweet.findByPk(tweetId)
      const like = await Like.findOne({ where: { userId: 1, tweetId } })
      if (!tweet) throw new Error("Tweet doesn't exist!")
      if (!like) throw new Error("You haven't liked this Tweet!")
      await like.destroy()
      res.redirect('/tweets')

    } catch (error) {
      console.log(error)
    }
  }
}
module.exports = userController
