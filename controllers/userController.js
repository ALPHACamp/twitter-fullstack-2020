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
    res.redirect('back')
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

        req.flash('success_messages', "資料被更新！")
        res.redirect('/tweets')

      })
  },

  getFollower: (req, res, next) => {
    return User.findByPk(req.params.id, {
      include: [Tweet,
        { model: User, as: 'Followers' }]
    })
      .then(users => {
        const name = users.dataValues.name
        const tweetsLength = users.dataValues.Tweets.length
        users = users.Followers.map(user => ({
          ...user.dataValues,
          introduction: user.dataValues.introduction.substring(0, 50),
          isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(user.id)
        }))
        users = users.sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)
        return res.render('follower', { users, name, tweetsLength })
      })
      .catch(err => { next(err) })
  },

  getFollowing: (req, res, next) => {
    return User.findByPk(req.params.id, {
      include: [Tweet,
        { model: User, as: 'Followings' }]
    })
      .then(users => {
        const name = users.dataValues.name
        const tweetsLength = users.dataValues.Tweets.length
        users = users.Followings.map(user => ({
          ...user.dataValues,
          introduction: user.dataValues.introduction.substring(0, 50),
          isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(user.id)
        }))
        users = users.sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)
        return res.render('following', { users, name, tweetsLength })
      })
      .catch(err => { next(err) })
  },

  getUser: (req, res, next) => {
    const checkUser = helpers.getUser(req).id === Number(req.params.id) ? true : false
    // console.log(helpers.getUser(req).Followings)
    return User.findByPk(req.params.id, {
      include: [Tweet,
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' }
      ]
    })
      .then(users => {
        return Tweet.findAll({
          where: { UserId: req.params.id },
          include: [User, Reply, Like,
            { model: User, as: 'LikedUsers' }],
          order: [['createdAt', 'DESC']]
        })
          .then(tweets => {
            tweets = tweets.map(t => ({
              ...t.dataValues,
              isLiked: t.LikedUsers.map(d => d.id).includes(helpers.getUser(req).id)
            }))
            return res.render('user', { users, tweets, checkUser })
          })
          .catch(err => { next(err) })
      })
      .catch(err => { next(err) })
  },

  addFollowing: (req, res, next) => {
    return Followship.create({
      followerId: helpers.getUser(req).id,
      followingId: req.params.userId
    })
      .then((followship) => {
        return res.redirect('back')
      })
      .catch(err => { next(err) })
  },

  removeFollowing: (req, res, next) => {
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
          .catch(err => { next(err) })
      })
      .catch(err => { next(err) })
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
    console.log(typeof (helpers.getUser(req).id))
    console.log(typeof (req.params.id))
    console.log("files", files)

    if (helpers.getUser(req).id !== Number((req.params.id))) {
      req.flash('error_messages', 'error')
      res.redirect('/tweets')
    }

    if (files) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      if (avatar) {
        console.log("avatar", avatar)
        await imgur.upload(avatar[0].path, (err, img) => {
          console.log("avatar:", img.data.link)
          User.findByPk(helpers.getUser(req).id)
            .then(user =>
              user.update({ avatar: img.data.link }))
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
    req.flash('success_messages', '更新成功！')
    res.redirect('back')
  },

  getUserLikes: (req, res, next) => {
    const checkUser = helpers.getUser(req).id === Number(req.params.id) ? true : false

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
          include: [{ model: Tweet, include: [User, Reply, Like, { model: User, as: 'LikedUsers' }] }
          ],
          order: [['createdAt', 'DESC']]
        })
          .then(likes => {
            return res.render('likes', { users, likes, checkUser })
          })
          .catch(err => { next(err) })
      })
      .catch(err => { next(err) })
  },

  getUserReplies: (req, res, next) => {
    const checkUser = helpers.getUser(req).id === Number(req.params.id) ? true : false

    return User.findByPk(req.params.id, {
      include: [
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
            return Reply.findAll({
              where: { UserId: req.params.id },
              include: [{ model: Tweet, include: [Reply, User, Like, { model: User, as: 'LikedUsers' }] }],
              order: [[['createdAt', 'DESC']]]
            })
              .then(replies => {
                const repliesList = []
                replies = replies.map(reply => ({
                  ...reply.dataValues,
                }))
                replies.forEach(reply => repliesList.push(reply.Tweet))
                const result = Array.from(new Set(repliesList.concat(tweets)))
                const set = new Set()
                let tweetsAndRepliesList = result.filter(tweet => !set.has(tweet.id) ? set.add(tweet.id) : false) // 取出不重複的tweet
                tweetsAndRepliesList = tweetsAndRepliesList.sort((a, b) => b.createdAt - a.createdAt)
                return res.render('replies', { users, tweetsAndRepliesList, checkUser })
              })
              .catch(err => { next(err) })
          })
          .catch(err => { next(err) })
      })
      .catch(err => { next(err) })
  },

  getTopFollowers: (req, res, next) => {
    return User.findAll({
      include: [{ model: User, as: 'Followers' }],
    }).then(users => {
      users = users.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(user.id)
      }))
      users = users.filter(user => user.name !== helpers.getUser(req).name)
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount).slice(0, 10)
      res.locals.getTopFollowers = users

      return next()
    })
      .catch(err => next(err))
  }
}

module.exports = userController