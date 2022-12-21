// 後續做到 User, Reply, Like 記得加進來
const { User, Tweet, Reply, Like, Followship } = require('../models')
const sequelize = require('sequelize')
const { Op } = require('sequelize')
const { getUser } = require('../_helpers')

const tweetController = {
  postTweet: (req, res) => {

    const UserId = getUser(req).id
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
  getTweets: (req, res, next) => {
    const loginUser = getUser(req).id
    return Promise.all(
      [Tweet.findAll({
        attributes: {
          include: [
            [sequelize.literal(`(SELECT COUNT(*) FROM Replies WHERE tweet_id = Tweet.id)`), 'repliesCount'],
            [sequelize.literal(`(SELECT COUNT(*) FROM Likes WHERE tweet_id = Tweet.id)`), 'likesCount'],
            [sequelize.literal(`(SELECT (COUNT(*)>0) FROM Likes WHERE user_id = ${loginUser} AND tweet_id = Tweet.id)`), 'isliked']
          ],
        },
        // where: { UserId: { [Op.or]: [followedUser.following_id] } },
        include: { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
        order: [['createdAt', 'DESC']],
        nest: true,
        raw: true
      }), User.findAll({
        include: [{ model: User, as: 'Followers' }]
      })])
      .then(async ([tweets, users]) => {
        const data = await tweets.map(tweet => ({
          ...tweet,
          isLiked: Boolean(tweet.isLiked),
        }))
        const result = await users
          .map(user => ({
            ...user.toJSON(),
            followCount: user.Followers.length,
            isFollowed: getUser(req).Followings.some(f => f.id === user.id)
          }))
          .sort((a, b) => b.followCount - a.followCount)
        res.render('tweets', { Tweets: data, result })
      })
      .catch(err => next(err))
  },
  getReplies: (req, res, next) => {
    res.render('replies')
  }
}


module.exports = tweetController