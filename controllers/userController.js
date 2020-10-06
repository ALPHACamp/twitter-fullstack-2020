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

    return User.findByPk(req.user.id)
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

  getUserFollower: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [Tweet,
        { model: User, as: 'Followers' }]
    })
      .then(users => {
        followerList = users.Followers.map(user => ({
          ...user.dataValues,
          introduction: user.dataValues.introduction.substring(0, 50),
          isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(user.id)
        }))
        followerList = followerList.sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)
        return res.render('follower', { users: users.toJSON(), followerList })
      })
  },

  getUserFollowing: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [Tweet,
        { model: User, as: 'Followings' }],
    })
      .then(users => {
        followingList = users.Followings.map(user => ({
          ...user.dataValues,
          introduction: user.dataValues.introduction.substring(0, 50),
          isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(user.id)
        }))
        console.log(followingList)
        followingList = followingList.sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)
        return res.render('following', { users: users.toJSON(), followingList })
      })
  },

  getUser: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [Tweet,
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
            console.log(tweets)
            return res.render('user', { users, tweets })
          })
        // const userSelf = helpers.getUser(req).id
        // const isLiked = helpers.getUser(req).Followings.map(d => d.id).include(user.id)
      })
  },

  addFollowing: (req, res) => {
    if (helpers.getUser(req).id === Number(req.params.id)) {
      res.flash('error_messages', '請勿追蹤自己')
      return res.redirect('back')
    }
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

  getUserLikes: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [Tweet,
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' },
        { model: Tweet, as: 'LikedTweets' }
      ]
    })
      .then(users => {
        // console.log(users.toJSON())
        return res.render('likes', { users: users.toJSON() })
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