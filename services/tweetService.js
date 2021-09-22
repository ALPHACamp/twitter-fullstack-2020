const db = require('../models')
const Tweet = db.Tweet
const Followship = db.Followship
const User = db.User
const Like = db.Like
const Reply = db.Reply
const helpers = require('../_helpers')
const { Op } = require("sequelize")
const sequelize = require('sequelize')

const tweetService = {
  postTweets: (req, res, callback) => {
    if (!req.body.description) {
      return callback({ status: 'error', message: "請輸入貼文內容" })
    }
    if (req.body.description.length > 140 ) {
      return callback({ status: 'error', message: "貼文不得超過140字" })
    }
    return Tweet.create({
      UserId: helpers.getUser(req).id,
      description: req.body.description
    })
      .then((tweet) => {
        callback({ status: 'success', message: 'tweet was successfully created' })
      })
  },

  getTweets: async (req, res, callback) => {
    const currentUser = helpers.getUser(req)

    const tweets = await Tweet.findAll({
      include: [
        { model: User, attributes: ['id', 'name', 'avatar', 'account'] },
        { model: Like },
        { model: Reply }
      ],
      order: [['createdAt', 'DESC']],
    })

    const users = await Followship.findAll({
      attributes: ['followingId', [sequelize.fn('COUNT', sequelize.col('followingId')), 'count']],
      include: [
        { model: User, as: 'FollowingLinks' }, //self-referential super-many-to-many
      ],
      group: ['followingId'],
      order: [[sequelize.col('count'), 'DESC']],
      limit: 10, raw: true, nest: true
    })

    const tweetsNew = await tweets.map(r => ({
      ...r.dataValues,
      User: r.User.dataValues,
      isLiked: r.Likes.map(d => d.UserId).includes(helpers.getUser(req).id),
      Likes: r.Likes.length,
      Replies: r.Replies.length,
    }))

    //B. 右側欄位: 取得篩選過的使用者 & 依 followers 數量排列前 10 的使用者推薦名單(排除追蹤者為零者)
    //排除admin
    const normalUsers = users.filter(d => d.FollowingLinks.role !== 'admin')
    const topUsers = normalUsers.map(user => ({
      id: user.FollowingLinks.id,
      name: user.FollowingLinks.name ? (user.FollowingLinks.name.length > 12 ? user.FollowingLinks.name.substring(0, 12) + '...' : user.FollowingLinks.name) : 'noName',
      account: user.FollowingLinks.account ? (user.FollowingLinks.account.length > 12 ? user.FollowingLinks.account.substring(0, 12) + '...' : user.FollowingLinks.account) : 'noAccount',
      avatar: user.FollowingLinks.avatar,
      followersCount: user.count,
      isFollowed: currentUser.Followings.map((d) => d.id).includes(user.FollowingLinks.id),
      isSelf: Boolean(user.FollowingLinks.id === currentUser.id),
    }))

    return callback({
      tweets: tweetsNew,
      topUsers,
      currentUser
    })
  },
}

module.exports = tweetService