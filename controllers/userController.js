const bcrypt = require('bcryptjs')
const { Sequelize } = require('../models')
const db = require('../models')
const user = require('../models/user')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Followship = db.Followship
const Like = db.Like
const helpers = require('../_helpers')

const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = '6ff52e969355450'
const fs = require('fs')

const Op = Sequelize.Op

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    console.log(req.body)

    if (req.body.password !== req.body.passwordCheck) {
      req.flash('error_messages', '兩次密碼輸入不同')
      return res.redirect('/signup')
    } else {
      User.findOne({
        where: { [Op.or]: [{ email: req.body.email }, { account: req.body.account }] }, raw: true
      }).then(user => {
        if (user) {
          if (user.email === req.body.email) { req.flash('error_messages', '此email已經被註冊') }
          if (user.account === req.body.account) { req.flash('error_messages', '此account已經被註冊') }
          return res.redirect('/signup')
        } else {
          return User.create({
            name: req.body.name,
            account: req.body.account,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))  //salt = bcrypt.genSaltSync(10)
          }).then(user => {
            req.flash('success_messages', '成功註冊帳號!')
            return res.redirect('/signin')
          })
        }
      })
    }
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', "成功登入！")
    res.redirect('/tweets')
  },

  logout: (req, res) => {
    req.flash('success_messages', '成功登出!')
    req.logout()
    res.redirect('/signin')
  },

  getSetting: (req, res) => {
    return res.render('setting')
  },

  putSetting: (req, res) => {

    if (!req.body.name) {
      req.flash('error_messages', 'name did not exist')
      return res.redirect('/')
    }

    if (req.body.password !== req.body.passwordCheck) {
      req.flash('error_messages', '兩次密碼輸入不同')
      return res.redirect('back')
    }

    return User.findByPk(helpers.getUser(req).id)
      .then((user) => {
        user.update({
          name: req.body.name,
          email: req.body.email,
          account: req.body.account,
          password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
        })
      }).then(user => {
        console.log("updated!")
        req.flash('success_messages', '資料已被更新!')
        res.redirect('/')
      })
  },

  getFollower: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [Tweet,
        { model: User, as: 'Followers' }]
    })
      .then(user => {
        const followerList = user.Followers.map(user => ({
          ...user.dataValues,
          isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(user.id)
        }))
        // console.log(followerList)
        return res.render('follower', { user, followerList })
      })
  },

  getFollowing: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [Tweet,
        { model: User, as: 'Followings' }]
    })
      .then(user => {
        const followingList = user.Followings.map(user => ({
          ...user.dataValues,
          isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(user.id)
        }))
        return res.render('following', { user, followingList })
      })
  },

  getUser: (req, res) => {
    const checkUser = helpers.getUser(req).id === Number(req.params.id) ? true : false

    return User.findByPk(req.params.id, {
      include: [Tweet,
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    })
      .then(users => {
        return Tweet.findAll({
          where: { UserId: req.params.id },
          include: [User, Reply, Like],
          order: [['createdAt', 'DESC']]
        })
          .then(tweets => {
            return res.render('user', { users, tweets, checkUser })
          })
        // const userSelf = helpers.getUser(req).id
        // const isLiked = helpers.getUser(req).Followings.map(d => d.id).include(user.id)
      })
  },

  addFollowing: (req, res) => {
    return Followship.create({
      followerId: helpers.getUser(req).id,
      followingId: req.params.userId
    })
      .then((followship) => {
        return res.redirect('back')
      })
  },

  removeFollowing: (req, res) => {
    return Followship.findOne({
      where: {
        followerId: helpers.getUser(req).id,
        followingId: req.params.userId
      }
    })
      .then((followship) => {
        followship.destroy()
          .then((followship) => {
            return res.redirect('back')
          })
      })
  },

  addLike: (req, res) => {

    return Like.findOrCreate({
      where: { TweetId: req.params.id, UserId: helpers.getUser(req).id },
      defaults: {
        UserId: helpers.getUser(req).id,
        TweetId: req.params.id
      }
    }).then((like) => {
      return res.redirect('back')
    })
      .catch(error => console.log(error))
  },

  removeLike: (req, res) => {
    return Like.findOne({
      where: {
        UserId: helpers.getUser(req).id,
        TweetId: req.params.id
      }
    }).then(like => {
      like.destroy()
        .then(tweet => {
          return res.redirect('back')
        })
    })
      .catch(error => console.log(error))
  },

  putSelf: async (req, res) => {

    const { avatar, cover } = req.files
    const { files } = req

    if (helpers.getUser(req).id !== req.params.id) {
      req.flash('errorMessage', 'error')
      res.redirect('/tweets')
    }

    if (files) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      if (avatar) {
        await imgur.upload(avatar[0].path, (err, img) => {
          User.findByPk(helpers.getUser(req).id)
            .then(user => user.update({ avatar: img.data.link }))
        })
      }
      if (cover) {
        await imgur.upload(cover[0].path, (err, img) => {
          User.findByPk(helpers.getUser(req).id)
            .then(user => user.update({ cover: img.data.link }))
        })
      }
    }
    await User.findByPk(helpers.getUser(req).id).then(user =>
      user.update({
        name: req.body.name,
        introduction: req.body.introduction
      }))
    req.flash('successMessage', '更新成功！')
    res.redirect('back')
  },

  getUserLikes: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [Tweet,
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' },
        { model: Tweet, as: 'LikedTweets' }
      ]
    })
      .then(users => {
        return Like.findAll({
          where: { UserId: req.params.id },
          include: [{ model: Tweet, include: [User, Reply, Like] }],
          order: [['createdAt', 'DESC']]
        })
          .then(like => {
            // console.log(like)
            return res.render('likes', { users, like })
          })
        // const userSelf = helpers.getUser(req).id
        // const isLiked = helpers.getUser(req).Followings.map(d => d.id).include(user.id)
      })
  },

  getUserReplies: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [Tweet,
        { model: Reply, include: [User, Tweet, Like] },
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' },
        { model: Tweet, as: 'LikedTweets' }
      ]
    })
      .then(users => {
        return Tweet.findAll({
          where: { UserId: req.params.id },
          include: [User, Reply, Like],
          order: [['createdAt', 'DESC']]
        })
          .then(tweets => {
            const tweetsAndRepliesList = []
            tweets = tweets.map(tweet => ({
              ...tweet.dataValues
            }))
            console.log(users)
            console.log('----------------------------------')
            console.log(tweets)
            return res.render('replies', { users, tweets })

          })
        // const userSelf = helpers.getUser(req).id
        // const isLiked = helpers.getUser(req).Followings.map(d => d.id).include(user.id)
      })
  },

  getTopFollowers: (req, res, next) => {
    return User.findAll({
      include: [{ model: User, as: 'Followers' }]
    })
      .then(users => {
        users = users.map(user => ({
          ...user.dataValues,
          isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(user.id),
          FollowersCount: user.Followers.length
        }))
        // users = users.filter(user => user.name !== helpers.getUser(req).name && (!user.role))
        users = users.sort((a, b) => b.FollowersCount - a.FollowersCount).slice(0, 10)
        res.locals.users = users
        return next()
      })
  }

}

module.exports = userController