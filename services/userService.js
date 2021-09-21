const helpers = require('../_helpers')
const bcrypt = require('bcryptjs')
const { Op } = require("sequelize")
const sequelize = require('sequelize')

const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const Followship = db.Followship


const imgur = require('imgur-node-api')
const { fakeServer } = require('sinon')
const followship = require('../models/followship')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

let userService = {
  postTweets: (req, res, callback) => {
    if (!req.body.description) {
      return callback({ status: 'error', message: "請輸入貼文內容" })
    }
    return Tweet.create({
      UserId: helpers.getUser(req).id,
      description: req.body.description
    })
      .then((tweet) => {
        callback({ status: 'success', message: 'tweet was successfully created' })
      })
  },

  getUserTweets: (req, res, callback) => {
    const currentUser = helpers.getUser(req)
    return Promise.all([
      Tweet.findAll({
        where: { UserId: req.params.user_id },
        include: [
          { model: Like, include: [User] },
          { model: Reply, include: [User] },
        ],
        order: [['createdAt', 'DESC']]
      }),
      User.findOne({
        where: { id: req.params.user_id },
        include: [
          { model: Tweet },
          { model: User, as: 'Followers' },
          { model: User, as: 'Followings' }
        ]
      }),
      Followship.findAll({
        attributes: ['followingId', [sequelize.fn('COUNT', sequelize.col('followingId')), 'count']],
        include: [
          { model: User, as: 'FollowingLinks' } //self-referential super-many-to-many
        ],
        group: ['followingId'],
        order: [[sequelize.col('count'), 'DESC']],
        limit: 10, raw: true, nest: true
      }),
    ]).then(([tweets, user, users]) => {
      //整理某使用者的所有推文 & 每則推文的留言數和讚數 & 登入中使用者是否有按讚
      const data = tweets.map(tweet => ({
        id: tweet.id,
        description: tweet.description,
        tweetedAt: tweet.createdAt,
        replyCount: tweet.Replies.length,
        likeCount: tweet.Likes.length,
        // isLiked: tweet.Likes.map(d => d.UserId).includes(currentUser.id)
      }))
      //A. 取得某使用者的個人資料 & followship 數量 & 登入中使用者是否有追蹤
      const viewUser = Object.assign({}, {
        id: user.id,
        name: user.name,
        account: user.account,
        introduction: user.introduction,
        cover: user.cover,
        avatar: user.avatar,
        tweetsCount: user.Tweets.length,
        followingsCount: user.Followings.length,
        followersCount: user.Followers.length,
        isFollowed: currentUser.Followings.map((d) => d.id).includes(user.id),
        isSelf: Boolean(user.id === currentUser.id)
      })
      //B. 右側欄位: 取得篩選過的使用者 & 依 followers 數量排列前 10 的使用者推薦名單(排除追蹤者為零者)
      const normalUsers = users.filter(d => d.FollowingLinks.role === 'normal')//排除admin
      const topUsers = normalUsers.map(user => ({
        id: user.FollowingLinks.id,
        name: user.FollowingLinks.name.length > 12 ? user.FollowingLinks.name.substring(0, 12) + '...' : user.FollowingLinks.name,
        account: user.FollowingLinks.account.length > 12 ? user.FollowingLinks.account.substring(0, 12) + '...' : user.FollowingLinks.account,
        avatar: user.FollowingLinks.avatar,
        followersCount: user.count,
        isFollowed: currentUser.Followings.map((d) => d.id).includes(user.FollowingLinks.id),
        isSelf: Boolean(user.FollowingLinks.id === currentUser.id),
      }))
      callback({ data, viewUser, currentUser, topUsers })
    })
      .catch(err => console.log(err))
  },
}

module.exports = userService