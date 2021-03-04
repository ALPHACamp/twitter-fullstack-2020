const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const helpers = require('../_helpers')
const Followship = db.Followship
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const sequelize = require('sequelize')
const getTopUser = require('../_helpers').getTopUser
const getSingleUserData = require('../_helpers').getSingleUserData
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const imgur = require('imgur')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID



const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  ///signup test
  signUp: (req, res) => {
    // confirm password
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signin')
    } else {
      // confirm unique user
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash('error_messages', '信箱重複！')
          return res.redirect('/signin')
        } else {
          User.findOne({ where: { account: req.body.account } }).then(user => {
            if (user) {
              req.flash('error_messages', '帳號重複')
              return res.redirect('/signin')
            } else
              User.create({
                account: req.body.account,
                name: req.body.name,
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
              }).then(user => {
                req.flash('success_messages', '成功註冊帳號！')
                return res.redirect('/signup')
              })
          })

        }
      })
    }
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

  addFollowing: async (req, res) => {
    if (Number(helpers.getUser(req).id) !== Number(req.body.id)) {
      await Followship.create({
        followerId: helpers.getUser(req).id,
        followingId: req.body.id
      })
      return res.redirect('back')
    }
    return res.redirect('back')
  },

  removeFollowing: async (req, res) => {
    const awaitRemove = await Followship.findOne({
      where: { followerId: helpers.getUser(req).id, followingId: req.params.id }
    })
    await awaitRemove.destroy()
    req.flash('success_messages', '成功取消追隨')
    return res.redirect('back')
  },

  getUserPage: async (req, res) => {
    const users = await getTopUser(req)
    let tweets = await Tweet.findAll({
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM Tweets AS Tweet
              WHERE Tweet.UserId = ${req.params.id}
            )`),
            'TweetsCount'
          ],
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM Followships AS Followship
              WHERE Followship.followerId = ${req.params.id}
            )`),
            'FollowingCount'
          ],
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM Followships As Followship
              WHERE Followship.followingId = ${req.params.id}
            )`),
            'FollowerCount'
          ]
        ]
      },
      order: [['createdAt', 'DESC']],
      where: { UserId: req.params.id },
      include: {
        model: User, include: [
          { model: Like },
          { model: User, as: 'Followings' },
          { model: User, as: 'Followers' },
          { model: Reply }
        ]
      }
    })

    tweets = tweets.map(r => ({
      ...r.dataValues,
      userName: r.User.name,
      userId: r.User.id,
      userAvatar: r.User.avatar,
      userCover: r.User.cover,
      userIntroduction: r.User.introduction,
      userAccount: r.User.account,
      totalLikes: r.User.Likes.length,
      totalReplies: r.User.Replies.length,
      isLiked: helpers.getUser(req).Likes ? helpers.getUser(req).Likes.map(d => d.TweetId).includes(r.id) : false
    }))
    const isFollowed = helpers.getUser(req).Followings.map(d => d.id).includes(Number(req.params.id))

    return res.render('user', { tweets, users, isFollowed })
  },


  getUserTweetsRepliesPage: async (req, res) => {
    //user data to show top 10 user
    const users = await getTopUser(req)
    let userView = await User.findByPk(req.params.id, {
      attributes: {
        include: [
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM Tweets AS Tweet
              WHERE Tweet.UserId = ${req.params.id}
            )`),
            'TweetsCount'
          ],
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM Followships AS Followship
              WHERE Followship.followerId = ${req.params.id}
            )`),
            'FollowingCount'
          ],
          [
            sequelize.literal(`(
              SELECT COUNT(*)
              FROM Followships AS Followship
              WHERE Followship.followingId = ${req.params.id}
            )`),
            'FollowerCount'
          ]
        ]
      },
      include: [
        { model: Reply, include: [{ model: Tweet, include: [Reply, Like] }] }
      ],
      order: [
        [Reply, 'createdAt', 'DESC']
      ]
    })
    userView = userView.toJSON()
    userView.Replies.map(r => {
      r.Tweet.description = `${r.Tweet.description.substring(0, 20)}...`
      r.Tweet.isLiked = helpers.getUser(req).Likes ? helpers.getUser(req).Likes.map(d => d.TweetId).includes(r.Tweet.id) : false
      r.Tweet.totalReplies = r.Tweet.Replies.length
      r.Tweet.totalLikes = r.Tweet.Likes.length
    })
    const isFollowed = helpers.getUser(req).Followings.map(d => d.id).includes(userView.id)

    return res.render('tweetsReplies', { users, userView, isFollowed })
  },


  getUserLikesPage: async (req, res) => {
    const userView = await getSingleUserData(req.params.id)
    userView.tweets = userView.Likes.map(like => {
      return like.Tweet
    })
    const isFollowed = helpers.getUser(req).Followings.map(d => d.id).includes(userView.id)
    const totalLikes = userView.Likes.length
    const users = await getTopUser(req)
    userView.tweets.map(t => {
      return t.totalReplies = t.Replies.length
    })
    console.log(userView.tweets)
    return res.render('likes', { userView, users, isFollowed, totalLikes })
  },


  editUserFromEditPage: async (req, res) => {
    const user = await User.findByPk(req.params.id)
    const avatar = req.files.avatar
    const cover = req.files.cover
    console.log(avatar)
    let avatarLink, coverLink = ''
    if (!avatar && !cover) {
      await user.update({
        avatar: user.avatar,
        cover: user.cover,
        name: req.body.name,
        introduction: req.body.introduction
      })
      return res.redirect('back')
    }
    imgur.setClientId(IMGUR_CLIENT_ID)
    if (avatar) {
      avatarLink = await helpers.imgPromise(avatar[0])
    }
    if (cover) {
      coverLink = await helpers.imgPromise(cover[0])
    }
    await user.update({
      avatar: avatarLink ? avatarLink : user.avatar,
      cover: coverLink ? coverLink : user.cover,
      name: req.body.name,
      introduction: req.body.introduction ? req.body.introduction : user.introduction
    })
    return res.redirect('back')
  },

  getUserFollowingPage: async (req, res) => {
    //userView為了partials左邊nav的user.id區隔開
    const userView = await getSingleUserData(req.params.id)
    const users = await getTopUser(req)
    return res.render('userFollowing', { userView, users })
  },
  getUserFollowerPage: async (req, res) => {
    //userView為了partials左邊nav的user.id區隔開
    let userView = await getSingleUserData(req.params.id)
    userView.Followers.map(user => {
      user.isFollowed = helpers.getUser(req).Followings.map(d => d.id).includes(userView.id)
    })
    const users = await getTopUser(req)
    return res.render('userFollower', { userView, users })
  },

  setUserPage: async (req, res) => {
    return User.findByPk(req.params.id, { raw: true }).then(user => {
      return res.render('userSet', { user: user })
    })
  },

  setUser: (req, res) => {
    User.findByPk(req.params.id)
      .then((user) => {
        user.update({
          account: req.body.account,
          name: req.body.name,
          email: req.body.eamil,
          password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
        })
          .then((user) => {
            req.flash('success_messages', 'User was successfully to update')
            return res.redirect('/tweets')
          })
      })

  },

}

module.exports = userController