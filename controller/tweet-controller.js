// 後續做到 User, Reply, Like 記得加進來
const { User, Tweet, Reply, Like, Followship } = require('../models')
const sequelize = require('sequelize')
const { Op } = require('sequelize')
const helper = require('../_helpers')

const tweetController = {
  postTweet: (req, res) => {

    // const UserId = helper.getUser(req).id
    const description = req.body.description

    if (!description.trim()) {
      req.flash('error_messages', '推文不可空白')
      res.redirect('back')
    } else if (description.length > 140) {
      req.flash('error_messages', '推文不得超過 140 個字')
      res.redirect('back')
    } else {
      return Tweet.create({
        UserId: helper.getUser(req).id,
        description
      })
        .then(() => {
          return res.redirect('/tweets')
        })
        .catch((error) => console.log(error))
    }
  },
  getTweets: (req, res, next) => {
    // const loginUser = helper.getUser(req).id
    return Promise.all(
      [Tweet.findAll({
        attributes: {
          include: [
            [sequelize.literal(`(SELECT COUNT(*) FROM Replies WHERE tweet_id = Tweet.id)`), 'repliesCount'],
            [sequelize.literal(`(SELECT COUNT(*) FROM Likes WHERE tweet_id = Tweet.id)`), 'likesCount'],
            [sequelize.literal(`(SELECT (COUNT(*)>0) FROM Likes WHERE user_id = ${helper.getUser(req).id} AND tweet_id = Tweet.id)`), 'isLiked']
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
            isFollowed: helper.getUser(req).Followings.some(f => f.id === user.id)
          }))
          .sort((a, b) => b.followCount - a.followCount)
        // console.log(data)
        res.render('tweets', { Tweets: data, result })
      })
      .catch(err => next(err))
  },
  getReplies: (req, res, next) => {
    res.render('replies')
  },
  getUserFollower: (req, res) => {
    const queryUserId = req.params.id
    return Promise.all([
      User.findByPk(queryUserId, {
        attributes: ['id', 'name',
          [sequelize.literal('(SELECT COUNT(*) FROM Tweets WHERE user_id = User.id)'), 'tweetsCount']],
        nest: true,
        raw: true
      }),
      Followship.findAll({
        include: [{
          model: User,
          as: 'Followers',
          attributes: ['id', 'account', 'name', 'avatar', 'introduction',
            // [sequelize.literal(`(SELECT (COUNT(*) > 0) FROM Followships WHERE Followships.followerId = ${helper.getUser(req).id} AND Followships.followingId=Followers.id)`), 'isFollowed']
          ]
        }],
        where: { followingId: queryUserId },
        order: [['createdAt', 'DESC']],
        nest: true,
        raw: true
      })
    ])
      .then(([user, followers]) =>
        res.render('follower', { user, followers })
      )
      .catch(err => next(err))
  },
  addLike: (req, res, next) => {
    const id = req.params.id
    return Promise.all([Tweet.findByPk(id), Like.findOne({ where: { UserId: helper.getUser(req).id, TweetId: id } })])
      .then(([tweet, like]) => {
        if (!tweet) throw new Error("Tweet didn't exist!")
        if (like) throw new Error('You have liked this restaurant!')
        return Like.create({ UserId: helper.getUser(req).id, TweetId: id })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeLike: (req, res, next) => {
    const id = req.params.id
    return Like.findOne({ where: { UserId: helper.getUser(req).id, TweetId: id } })
      .then(like => {
        if (!like) throw new Error(`You haven't like this tweet!`)
        return like.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  }
}


module.exports = tweetController