const { Tweet, Reply, Like } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  getTweets: (req, res) => {
    Tweet.findAll(
      {
        order: [['createdAt', 'DESC']]
      }
    ).then((tweets) => {

      tweets = tweets.map((d, i) => ({
        ...d.dataValues
      }))

      const pageTitle = '首頁'
      const isUserPage = true;

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
  likeTweet: (req, res) => {
    const loginUser = helpers.getUser(req)
    //不能重複喜歡
    Like.findOne({
      where: {
        UserId: loginUser.id,
        TweetId: req.params.id
      }
    })
      .then(like => {
        if (like) {
          req.flash('warning_msg', 'You cannot like the same tweet twice')
          return res.redirect('back')
        }
        return Like.create({
          UserId: loginUser.id,
          TweetId: req.params.id
        })
          .then(() => res.redirect('back'))
          .catch(err => res.send(err))
      })
  },
  unlikeTweet: (req, res) => {
    const loginUser = helpers.getUser(req)
    Like.findOne({
      where: {
        UserId: loginUser.id,
        TweetId: req.params.id
      }
    })
      .then(like => {
        if (!like) return res.redirect('back')
        return like.destroy()
          .then(() => res.redirect('back'))
          .catch(err => res.send(err))
      })
  }
}

module.exports = tweetController