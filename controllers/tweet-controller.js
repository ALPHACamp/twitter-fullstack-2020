const { Tweet, User, Like, Reply, Followship } = require('../models')
const _helpers = require('../_helpers')

const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const loginUserId = _helpers.getUser(req).id
      let [ user, tweetList, topUsers ] = await Promise.all([
        User.findByPk(loginUserId, {
          include: [
            { model: User, as: 'Followings'},
            { model: User, as: 'Followers'},
            { model: Tweet, as: 'LikedTweets' }
          ],
        }),
        Tweet.findAll({
          order: [['createdAt', 'DESC']],
          include: [User, Reply, Like]
        }),
        User.findAll({
          include: [{ model: User, as: 'Followers' }]
        })
      ])

      user = user.toJSON()
      
      const likedTweetsId = user?.LikedTweets ? user.LikedTweets.map(lt => lt.id) : []

      tweetList = tweetList.map(tweet => ({
          ...tweet.toJSON(),
          description: tweet.description.substring(0, 50),
          isLike: likedTweetsId.includes(tweet.id)
        }))

      topUsers = topUsers.map(user => ({
          ...user.toJSON(),
          isFollow: user.Followers.some(f => f.id === loginUserId)
          }))
        .filter(user => user.role === 'user' && user.id !== loginUserId)
        .sort((a, b) => b.Followers.length - a.Followers.length)
        .slice(0, 10)

      return res.render('tweets', {
        user,
        tweetList,
        loginUserId,
        topUsers
      })
    } catch(err) {
      next(err)
    }
  },
  postTweet: async (req, res, next) => {
    try {
      const UserId = _helpers.getUser(req).id
      const { description } = req.body
      
      if (!description.trim()) throw new Error('Description is required!')
      if (description.length > 140) throw new Error('Description cannot be longer than 140 characters!')

      await Tweet.create({
        UserId,
        description
      })

      return res.redirect('/tweets')

    } catch(err) {
      next(err)
    }
  },
  likeTweet: async (req, res, next) => {
    try {
      const UserId = _helpers.getUser(req).id
      const TweetId = req.params.tid
      
      const likedTweet = await Like.findOne({
          where: { TweetId, UserId }
        })

      if (likedTweet) throw new Error("You have Liked this tweet!")

      await Like.create({
        UserId,
        TweetId
      })

      return res.redirect('back')

    } catch(err) {
      next(err)
    }
  },
  unlikeTweet: async (req, res, next) => {
    try {
      const UserId = _helpers.getUser(req).id
      const TweetId = req.params.tid
      
      const likedTweet = await Like.findOne({
          where: { TweetId, UserId }
        })

      if (!likedTweet) throw new Error("You haven't Liked this tweet!")

      await likedTweet.destroy()

      return res.redirect('back')

    } catch(err) {
      next(err)
    }
  }
}

module.exports = tweetController