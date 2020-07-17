const db = require('../models')
const Tweet = db.Tweet
const User = db.User
const Reply = db.Reply

const tweetController = {
  getHomePage: (req, res) => {
    // 推薦追蹤名單
    User.findAll({
      include: [
        { model: User, as: 'Followers' }
      ]
    })
      .then(users => {
        users = users.map(user => ({
          ...user.dataValues,
          followerCount: user.Followers.length,
          isFollowed: user.Followers.map(er => er.id).includes(req.user.id)
        }))
        users = users.sort((a, b) => b.followerCount - a.followerCount).slice(0, 6)
        // 顯示已追蹤人的tweets
        let followings = req.user.Followings.map(user => user.id)
        followings.push(req.user.id)
        Tweet
          .findAll({
            where: { userId: followings },
            raw: true,
            nest: true,
            include: [User],
            order: [['createdAt', 'DESC']]
          })
          .then((tweets) => {
            res.render('home', { tweets: tweets, recommendFollowings: users })
          })
          .catch(err => res.send(err))
      })
  },
  postTweet: (req, res) => {
    res.json(req.body)
  },
  getReplyPage: (req, res) => {
    const tweetId = req.params.tweetId
    Tweet.findByPk(tweetId, {
      raw: true, nest: true,
      include: [User, Reply]
    })
      .then((tweet) => {
        Reply.findAll({
          where: { tweetId: tweet.id },
          raw: true,
          nest: true,
          include: [User],
          order: [['createdAt', 'ASC']]
        })
          .then((replies) => {
            res.render('reply', { tweet, replies })
          })
      })
      .catch(err => res.send(err))
  },
  replyTweet: (req, res) => {
    res.send(req.body)
  }
}

module.exports = tweetController