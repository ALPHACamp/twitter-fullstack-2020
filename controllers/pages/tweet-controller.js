const { User, Tweet, Reply, Followship, Like } = require('../../models')
const userController = require('../../controllers/pages/user-controller')
const dateFormatter = require('../../helpers/dateFormatter')
const helpers = require('../../_helpers')
const tweetController = {
  getTweets: async (req, res) => {
    const user = await User.findByPk(helpers.getUser(req).id, {
      include: [
        {
          model: User,
          as: 'Followings',
          include: {
            model: Tweet,
            include: [{ model: User }, { model: Reply }, { model: User, as: 'LikedUsers' }],
          }
        }
      ],
      nest: true
    })

    let followingTweets = user.toJSON().Followings.reduce((accumulator, currentValue) => {
      return accumulator.concat(currentValue.Tweets);
    }, []);

    followingTweets = followingTweets.map(tweet => ({
      ...tweet,
      replyCount: tweet.Replies.length,
      likeCount: tweet.LikedUsers.length,
      isLiked: tweet.LikedUsers.some(lu => lu.id === helpers.getUser(req).id)
    }))
    res.render('home', { user: user.toJSON(), tweets: followingTweets, isHome: true })
  },

  getTweet: async (req, res) => {
    try {
      let tweet = await Tweet.findByPk(req.params.id, {
        include: [
          {
            model: Reply,
            include: [
              { model: User },
              { model: Tweet, include: User }
            ],
            order: [['createdAt', 'DESC']]
          },
          { model: User },
          { model: User, as: 'LikedUsers' }
        ],
        order: [[{ model: Reply }, 'createdAt', 'DESC']],
        nest: true
      })

      tweet = tweet.toJSON()
      dateFormatter(tweet, 8)
      tweet.Replies.forEach(reply => {
        dateFormatter(reply, 8)
      })

      tweet.likeCount = tweet.LikedUsers.length
      tweet.replyCount = tweet.Replies.length
      tweet.isLiked = helpers.getUser(req).LikedTweets.some(lt => lt.id === tweet.id)

      res.render('tweet-profile', { tweet, replies: tweet.Replies, isHome: true })
    } catch (error) {
      console.log(error)
    }
  }


}
module.exports = tweetController
