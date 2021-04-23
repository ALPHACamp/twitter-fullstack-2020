const { Tweet, Reply, User, Followship, Like } = require('../models')
const { getUser } = require('../_helpers')

const tweetController = {
  getTweets: (req, res) => {
    Tweet.findAll(
      {
        include: [
          User,
          Reply,
          // Like
        ],
        order: [['createdAt', 'DESC']]
      }
    ).then((tweets) => {
      const pageTitle = '首頁'
      const isUserPage = true;
      tweets = tweets.map(d => {
        return {
          ...d.dataValues,
          name: d.User.name,
          account: d.User.account,
          replyAmount: d.Replies.length
        }
      })
      res.render('tweets', { tweets, pageTitle, isUserPage })
    })
      .catch(e => {
        console.warn(e)
      })
  },
  getTweet: (req, res) => {
    const tweet_id = req.params.id

    Tweet.findOne(
      {
        where: { id: tweet_id },
        include: [Reply]
      }
    ).then((tweet) => {

      // console.log(tweet.Replies)
      const pageTitle = '推文'

      res.render('tweet', { tweet: tweet.toJSON(), pageTitle })
    })
      .catch(e => {
        console.warn(e)
      })
  },
  getAddTweet: (req, res) => {

  },
  addTweet: (req, res) => {
    const user_id = getUser(req).id
    const { description } = req.body

    Tweet.create(
      {
        UserId: user_id,
        description
      }
    ).then(() => {
      res.redirect('back')
    })
      .catch(e => console.warn(e))
  }
}

module.exports = tweetController