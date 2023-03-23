const { User, Tweet, reply, Followship, Like } = require('../../models')
const tweetController = {

  getTweets:  async (req, res) => {
    const user = await User.findByPk(1, {
      include:
      {
        model: User,
        as: 'Followings',
        include: {
          model: Tweet,
          include: { model: User }
        }
      },
      nest: true
    })

    const followingTweets = user.toJSON().Followings.reduce((accumulator, currentValue) => {
      return accumulator.Tweets.concat(currentValue.Tweets);
    });
    console.log(followingTweets)
    res.render('home', { tweets: followingTweets })

  }


  // postTweet: (req, res, next) => {

  // },
  
  // postReply: (req, res, next) => {

  // },

  // addLike: (req, res, next) => {

  // },

  // removeLike: (req, res, next) => {

  // },

  // addFollowing: (req, res, next) => {

  // },

  // removeFollowing: (req, res, next) => {

  // },
}
module.exports = tweetController
