// 後續做到 User, Reply, Like 記得加進來
const { User, Tweet, Reply, Like, Followship } = require('../models')
const sequelize = require('sequelize')
const { Op } = require('sequelize')
const helpers = require('../_helpers')

const tweetController = {
  postTweet: (req, res) => {

    const UserId = helpers.getUser(req).id
    const description = req.body.description

    if (!description.trim()) {
      req.flash('error_messages', '推文不可空白')
      res.redirect('back')
    } else if (description.length > 140) {
      req.flash('error_messages', '推文不得超過 140 個字')
      res.redirect('back')
    } else {
      return Tweet.create({
        UserId,
        description
      })
        .then(() => {
          return res.redirect('/tweets')
        })
        .catch((error) => console.log(error))
    }
  },
  getTweet: (req, res) => {
    console.log(tweet)
    res.render('replies')
  },
  getTweets: async (req, res, next) => {
    const loginUser = helpers.getUser(req).id
    // const followedUser = await Followship.findAll({
    //   attributes: ['followingId'],
    //   where: {
    //     followerId: helpers.getUser(req).id
    //   },
    //   nest: true,
    //   raw: true
    // })
    // console.log(followedUser)
    return Tweet.findAll({
      attributes: {
        include: [
          [sequelize.literal(`(SELECT COUNT(*) FROM Replies WHERE tweet_id = Tweet.id)`), 'repliesCount'],
          [sequelize.literal(`(SELECT COUNT(*) FROM Likes WHERE tweet_id = Tweet.id)`), 'likesCount'],
          [sequelize.literal(`(SELECT (COUNT(*)>0) FROM Likes WHERE user_id = ${loginUser} AND tweet_id = Tweet.id)`), 'isliked']
        ]
      },
      // where: { UserId: { [Op.or]: [followedUser.following_id] } },
      include: { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
      order: [['createdAt', 'DESC']],
      nest: true,
      raw: true
    })
      .then(tweets => {
        const data = tweets.map(tweet => ({
          ...tweet,
          isLiked: Boolean(tweet.isLiked),
        }))
        res.render('tweets', { Tweets: data })
      })
      .catch(err => next(err))
  }
}


module.exports = tweetController
