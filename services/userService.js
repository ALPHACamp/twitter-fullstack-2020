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
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userService = {
  renderUserEdit: (req, res, callback) => {
    const currentUser = helpers.getUser(req)
    return User.findOne({
      where: { id: req.params.id },
      include: [
        { model: Tweet },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
      .then((user) => {
        //取得某使用者的個人資料
        const viewUser = Object.assign({}, {
          id: user.id,
          name: user.name,
          introduction: user.introduction,
          cover: user.cover,
          avatar: user.avatar,
        })
        callback({ viewUser })
      })
      .catch(err => console.log(err))
  },

  putUserEdit: async (req, res, callback) => {
    const { name, introduction } = req.body
    if (!name) {
      return callback({ status: 'error', message: "暱稱不能空白！" })
    }
    if (name.length > 50 || introduction.length > 160) {
      return callback({ status: 'error', message: "字數超出上限！" })
    }
    // const file = Object.assign({}, req.files)
    const { files } = req
    const isCoverDelete = req.body.isDelete
    const user = await User.findByPk(req.params.id)

    // if (files) {
    //files會有[Object: null prototype] {}
    imgur.setClientID(IMGUR_CLIENT_ID)
    if (files.avatar && files.cover) {
      imgur.upload(files.avatar[0].path, async (err, avaImg) => {
        imgur.upload(files.cover[0].path, async (err, covImg) => {
          await user.update({
            name: req.body.name,
            introduction: req.body.introduction,
            avatar: avaImg.data.link,
            cover: isCoverDelete ? '' : covImg.data.link
          })
          return callback({ status: 'success', message: 'user profile was successfully updated!' })
        })
      }
      )
    } else if (files.avatar && !files.cover) {
      imgur.upload(files.avatar[0].path, async (err, avaImg) => {
        await user.update({
          name: req.body.name,
          introduction: req.body.introduction,
          avatar: avaImg.data.link,
          cover: isCoverDelete ? '' : user.cover
        })
        return callback({ status: 'success', message: 'user profile was successfully updated!' })
      })
    } else if (!files.avatar && files.cover) {
      imgur.upload(files.cover[0].path, async (err, covImg) => {
        await user.update({
          name: req.body.name,
          introduction: req.body.introduction,
          cover: isCoverDelete ? '' : covImg.data.link,
        })
        return callback({ status: 'success', message: 'user profile was successfully updated!' })
      })
    } else {
      await user.update({
        name: req.body.name,
        introduction: req.body.introduction,
        cover: isCoverDelete ? '' : user.cover
      })
      callback({ status: 'success', message: 'user profile was successfully updated!' })
    }
  },

  getUserTweets: (req, res, callback) => {
    const currentUser = helpers.getUser(req)
    return Promise.all([
      Tweet.findAll({
        where: { UserId: req.params.id },
        include: [
          { model: Like, include: [User] },
          { model: Reply, include: [User] },
        ],
        order: [['createdAt', 'DESC']]
      }),
      User.findOne({
        where: { id: req.params.id },
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
        isLiked: tweet.Likes.map(d => d.UserId).includes(currentUser.id)
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
      return callback({ data, viewUser, currentUser, topUsers })
    })
      .catch(err => console.log(err))
  },
}

module.exports = userService