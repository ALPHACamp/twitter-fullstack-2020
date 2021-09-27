const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const bcrypt = require('bcryptjs')
const { raw } = require('body-parser')
const { Op } = require("sequelize")
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const Followship = db.Followship
const helpers = require('../_helpers')

const userService = require('../services/userService')

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    const { account, name, email, password, checkPassword } = req.body
    if (!account || !name || !email || !password || !checkPassword) {
      req.flash('error_messages', '所有欄位都是必填');
      return res.redirect('/signup')
    }

    if (password !== checkPassword) {
      req.flash('error_messages', '兩次密碼輸入不一致');
      return res.redirect('/signup')
    }

    User.findAll({ where: { [Op.or]: [{ email }, { account }] } }).then(users => {
      if (users.some(item => item.account === account)) {
        req.flash('error_messages', '此帳號已有人使用！')
        return res.redirect('/signup')
      }

      if (users.some(item => item.email === email)) {
        req.flash('error_messages', '此信箱已有人使用！')
        return res.redirect('/signup')
      }

      User.create({
        account: account,
        name: name,
        email: email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
      }).then(() => {
        req.flash('success_messages', '成功註冊帳號！')
        return res.redirect('/signin')
      })

    })
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/tweets')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },

  getUserTweets: (req, res) => {
    userService.getUserTweets(req, res, data => {
      return res.render('userSelf', data)

      return res.render('userSelf', { tweets: data, tweetUser, topUsers, theUser: helpers.getUser(req).id })
    })
      .catch(err => console.log(err))
  },

  getUserSelfReply: async (req, res) => {
    const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
    const users = await User.findAll({
      include: [
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' }
      ],
      where: { role: "user" }
    })

    const replies = await Reply.findAll({
      raw: true,
      nest: true,
      where: { UserId: req.params.id },
      include: [User, { model: Tweet, include: [User] }],
      order: [['createdAt', 'DESC']]
    })
    const tweets = await Tweet.findAll({
      where: { UserId: req.params.id },
      include: [User, Reply],
      order: [['createdAt', 'DESC']]
    })

    const tweetUser = await User.findByPk(req.params.id)

    const topUsers = await users.map(user => ({
      ...user.dataValues,
      followerCount: user.Followers.length,
      isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(user.id)
    }))
      .sort((a, b) => b.followerCount - a.followerCount)
      .slice(0, 10)

    const followersCount = await Followship.count({
      where: { followingId: req.params.id }
    })
    const followingsCount = await Followship.count({
      where: { followerId: req.params.id }
    })

    return res.render('userSelfReply', { users, replies, tweets, tweetUser, followersCount, followingsCount, topUsers })
  },

  getUserSelfLike: async (req, res) => {
    const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

    const users = await User.findAll({
      include: [
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' }
      ],
      where: { role: "user" }
    })

    const likes = await Like.findAll({
      where: { UserId: req.params.id },
      include: [User, { model: Tweet, include: [User, Reply, { model: User, as: 'LikedUsers' }] }],
      order: [['createdAt', 'DESC']]
    })
    const tweets = await Tweet.findAll({
      where: { UserId: req.params.id },
      include: [User, Reply],
      order: [['createdAt', 'DESC']]
    })
    const tweetUser = await User.findByPk(
      req.params.id
    )
    const data = likes.map(like => ({
      id: like.Tweet.id,
      avatar: like.Tweet.User.avatar,
      name: like.Tweet.User.name,
      account: like.Tweet.User.account,
      createdAt: like.Tweet.createdAt,
      description: like.Tweet.description,
      RepliesLength: like.Tweet.Replies.length,
      LikedUsersLength: like.Tweet.LikedUsers.length,
      isLiked: like.Tweet.LikedUsers.map(d => d.id).includes(helpers.getUser(req).id)
    }))

    const topUsers =
      users.map(user => ({
        ...user.dataValues,
        followerCount: user.Followers.length,
        isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(user.id)
      }))
        .sort((a, b) => b.followerCount - a.followerCount)
        .slice(0, 10)

    const followersCount = await Followship.count({
      where: { followingId: req.params.id }
    })
    const followingsCount = await Followship.count({
      where: { followerId: req.params.id }
    })

    return res.render('userSelfLike', { data, tweets, tweetUser, followersCount, followingsCount, topUsers })
  },

  getUserSetting: (req, res) => {
    return res.render('setting', { renderType: "user" })
  },
  putUserSetting: async (req, res) => {
    const user = await User.findByPk(req.params.id)

    user.update({
      account: req.body.account,
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
    })
    req.flash('success_messages', 'user was successfully to update')
    res.redirect('/tweets')
  },

  putUserProfile: async (req, res) => {
    const user = await User.findByPk(req.params.id)
    const { name, description } = req.body
    const files = Object.assign({}, req.files)

    if (!name.trim('')) {
      return req.flash('error_messages', '請輸入有效名稱！')
    } else if (name.trim('').length > 50) {
      return req.flash('error_messages', '名稱不得超過50字！')
    }

    if (description.length > 160) {
      return req.flash('error_messages', '自我介紹不得超過160字！')
    }

    imgur.setClientID(IMGUR_CLIENT_ID)

    if (files.avatar && files.cover) {
      imgur.upload(files.avatar[0].path, async (err, avaImg) => {
        imgur.upload(files.cover[0].path, async (err, covImg) => {
          await user.update({
            name: req.body.name,
            avatar: files.avatar[0] ? avaImg.data.link : user.avatar,
            cover: files.cover[0].path ? covImg.data.link : user.cover,
            description: req.body.description
          })
        })
      })
      req.flash('success_messages', 'Your profile was successfully updated!')
      res.redirect('back')
    } else if (files.avatar && !files.cover) {
      imgur.upload(files.avatar[0].path, async (err, avaImg) => {
        await user.update({
          name: req.body.name,
          avatar: files.avatar[0] ? avaImg.data.link : user.avatar,
          description: req.body.description
        })
      })
      req.flash('success_messages', 'Your profile was successfully updated!')
      res.redirect('back')
    } else if (!files.avatar && files.cover) {
      imgur.upload(files.cover[0].path, async (err, covImg) => {
        await user.update({
          name: req.body.name,
          cover: files.cover[0].path ? covImg.data.link : user.cover,
          description: req.body.description
        })
      })
      req.flash('success_messages', 'Your profile was successfully updated!')
      res.redirect('back')
    } else {
      await user.update({
        name: req.body.name,
        description: req.body.description
      })
      req.flash('success_messages', 'Your profile was successfully updated!')
      res.redirect('back')
    }

  },

  // Like
  addLike: (req, res) => {
    Tweet.findByPk(req.params.tweetId)
      .then(tweet => {
        tweet.increment('likeCount', { by: 1 })
        Like.create({
          UserId: helpers.getUser(req).id,
          TweetId: req.params.tweetId
        })
      }).then(() => {
        return res.redirect('back')
      })
  },
  removeLike: (req, res) => {
    Tweet.findByPk(req.params.tweetId)
      .then(tweet => {
        tweet.decrement('likeCount', { by: 1 })
        Like.destroy({
          where: {
            UserId: helpers.getUser(req).id,
            TweetId: req.params.tweetId
          }
        })
      }).then(() => {
        return res.redirect('back')
      })
  },

  // Followship
  addFollowing: (req, res) => {
    const followerId = helpers.getUser(req).id
    const followingId = req.body.id

    // 確認不能追蹤自己
    if (Number(followerId) === Number(followingId)) {
      req.flash('error_messages', 'You can\'t follow yourself!')
      return res.end()
    }

    // 確認該筆追蹤尚未存在於followship中，若不存在才創建新紀錄
    Followship.findAll({
      where: {
        followerId, followingId
      }
    }).then(followship => {
      if (followship.length) {
        req.flash('error_messages', 'You already followed this user')
        return res.redirect('/tweets')
      } else {
        return Promise.all([
          User.findByPk(followerId)
            .then(user => {
              user.increment('followingCount', { by: 1 })
            }),
          User.findByPk(followingId)
            .then(user => {
              user.increment('followerCount', { by: 1 })
            }),
          Followship.create({
            followerId,
            followingId
          })
        ]).then(() => {
          return res.redirect('back')
        })
      }
    })
  },

  removeFollowing: (req, res) => {
    const followerId = helpers.getUser(req).id
    const followingId = req.params.userId
    return Followship.findOne({
      where: {
        followerId,
        followingId
      }
    }).then(followship => {
      return Promise.all([
        User.findByPk(followerId)
          .then(user => {
            user.decrement('followingCount', { by: 1 })
          }),
        User.findByPk(followingId)
          .then(user => {
            user.decrement('followerCount', { by: 1 })
          }),
        followship.destroy()
      ]).then((followship) => {
        return res.redirect('back')
      })
    })
  },

  getFollowers: (req, res) => {
    return Promise.all([
      Followship.findAll({
        where: { followingId: req.params.id },
        order: [
          ['createdAt', 'DESC'], // Sorts by createdAt in descending order
        ],
        nest: true,
        raw: true
      }),
      User.findAll({
        include: [
          Tweet,
          { model: User, as: 'Followings' },
          { model: User, as: 'Followers' }
        ],
        where: { role: "user" },
      }),
      User.findOne({
        where: { id: req.params.id },
        nest: true,
        raw: true
      }),
      Tweet.count({
        where: { Userid: req.params.id }
      })
    ]).then(([followers, usersdata, tweetUser, tweetCount]) => {

      const users = usersdata.map(user => ({
        ...user.dataValues,
        followerCount: user.Followers.length,
        isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(user.id) //登入使用者是否已追蹤該名user
      }))

      const data = followers.map(d => ({
        ...users.find(element => Number(element.id) === Number(d.followerId))
      }))

      const topUsers = users.sort((a, b) => b.followerCount - a.followerCount).slice(0, 10)
      res.render('userFollowship', { data, topUsers, currentUser: helpers.getUser(req).id, tweetUser, tweetCount, renderType: "follower" })
    })
  },

  getFollowings: (req, res) => {
    return Promise.all([
      Followship.findAll({
        where: { followerId: req.params.id },
        order: [
          ['createdAt', 'DESC'], // Sorts by createdAt in descending order
        ],
        nest: true,
        raw: true
      }),
      User.findAll({
        include: [
          Tweet,
          { model: User, as: 'Followings' },
          { model: User, as: 'Followers' }
        ],
        where: { role: "user" },
      }),
      User.findOne({
        where: { id: req.params.id },
        nest: true,
        raw: true
      }),
      Tweet.count({
        where: { Userid: req.params.id }
      })
    ]).then(([followings, usersdata, tweetUser, tweetCount]) => {

      const users = usersdata.map(user => ({
        ...user.dataValues,
        followerCount: user.Followers.length,
        isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(user.id) //登入使用者是否已追蹤該名user
      }))

      const data = followings.map(d => ({
        ...users.find(element => Number(element.id) === Number(d.followingId))
      }))

      const topUsers = users.sort((a, b) => b.followerCount - a.followerCount).slice(0, 10)
      res.render('userFollowship', { data, topUsers, currentUser: helpers.getUser(req).id, tweetUser, tweetCount, renderType: "following" })
    })
  }
}

module.exports = userController
