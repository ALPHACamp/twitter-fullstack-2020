const { User, Tweet, Reply, Followship, Like } = require('../../models')
const userController = require('../../controllers/pages/user-controller')
const dateFormatter = require('../../helpers/dateFormatter')
const helpers = require('../../_helpers')
const tweetController = {
  getTweets: async (req, res, next) => {
    try{
    const user = await User.findByPk(helpers.getUser(req).id, {
      include: [
        {
          model: Tweet,
          include: 
            [{ model: User }, { model: Reply }, { model: Like }]
        },
        {
          model: User,
          as: 'Followings',
          include: {
            model: Tweet,
            include: [{ model: User }, { model: Reply }, { model: Like }]
          }
        }
      ],
      nest: true
    })

    let followingTweets = user.toJSON().Followings.reduce((accumulator, currentValue) => {
      return accumulator.concat(currentValue.Tweets);
    }, []);
    let allTweets = followingTweets.concat(user.toJSON().Tweets)

    allTweets = allTweets.map(tweet => ({
      ...tweet,
      replyCount: tweet.Replies.length,
      likeCount: tweet.Likes.length,
      isLiked: tweet.Likes.some(like => like.UserId === helpers.getUser(req).id)
    }))
    allTweets.sort((a, b) => b.createdAt - a.createdAt)
    allTweets.forEach(tweet => {
      dateFormatter(tweet, 8)
    })
    res.render('tweets', { user: user.toJSON(), tweets: allTweets, isHome: true })
  }catch(error){
    console.log(error)
    next(error)
  }


  },

  getTweet: async (req, res, next) => {
    try {
      let tweet = await Tweet.findByPk(req.params.id, {
        include: [
          {
            model: Reply,
            include: [
              { model: User },
              { model: Tweet, include: User }
            ]
          },
          { model: Like },
          { model: User }
        ],
        order: [[{ model: Reply }, 'createdAt', 'DESC']],
        nest: true
      })

      tweet = tweet.toJSON()
      dateFormatter(tweet, 8)
      tweet.Replies.forEach(reply => {
        dateFormatter(reply, 8)
      })

      tweet.likeCount = tweet.Likes.length
      tweet.replyCount = tweet.Replies.length
      tweet.isLiked = tweet.Likes.some(like => like.UserId === helpers.getUser(req).id)

      res.render('tweet-profile', { tweet, replies: tweet.Replies, isHome: true })
    } catch (error) {
      console.log(error)
      next(error)
    }
  }


}
module.exports = tweetController
