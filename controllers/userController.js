const fs = require('fs')
const helpers = require('../_helpers')
const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const e = require('express')
const user = require('../models/user')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const Followship = db.Followship
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const defaultProfilePic = 'https://i.stack.imgur.com/34AD2.jpg'

let userController = {
  getTopUsers: (req, res, next) => {
    return User.findAll({
      include: [{ model: User, as: 'Followers' }]
    }).then(users => {
      users = users.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(user.id)
      }))
      users = users.filter((user) => ((user.name !== helpers.getUser(req).name) && (user.isAdmin == 0)))
      users = users
        .sort((a, b) => b.followerCount - a.followerCount)
        .slice(0, 10)
      res.locals.recommendedUsers = users
      return next()
    })
  },

  loginPage: (req, res) => {
    return res.render('login')
  },

  login: (req, res) => {
    User.findOne({ where: { account: req.body.account } }).then(user => {
      if (user.isAdmin == 1) {
        req.flash('error_messages', '登入失敗！')
        return res.redirect('/login')
      } else {
        req.flash('success_messages', '成功登入！')
        res.redirect('/tweets')
      }
    })
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/login')
  },


  registerPage: (req, res) => {
    return res.render('register')
  },
  userRegister: (req, res) => {
    if (req.body.confirmPassword !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/register')
    }
    else {
      // confirm unique account
      User.findOne({ where: { account: req.body.account } }).then(user => {
        if (user) {
          req.flash('error_messages', '帳號重複！')
          return res.redirect('/register')
        }
        else {
          // confirm unique user
          User.findOne({ where: { email: req.body.email } }).then(user => {
            if (user) {
              req.flash('error_messages', '信箱重複！')
              return res.redirect('/register')
            } else {
              User.create({
                account: req.body.account,
                name: req.body.name,
                email: req.body.email,
                avatar: defaultProfilePic,
                password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
                image: null
              }).then(user => {
                req.flash('success_messages', '成功註冊帳號！')
                return res.redirect('/login')
              })
            }
          })
        }
      })
    }
  },

  settingPage: (req, res) => {
    if (helpers.getUser(req).id !== Number(req.params.id)) {
      return res.redirect('back')
    } else {
      return User.findByPk(req.params.id, { raw: true })
        .then(user => {
          return res.render('setting', {
            user: user
          })
        })
    }
  },
  putSetting: async (req, res) => {
    const id = req.params.id
    const { email: currentEmail, account: currentAccount } = helpers.getUser(req)
    const { account, name, email, password, confirmPassword } = req.body
    const error = []
    let newEmail = ''
    let newAccount = ''

    if (!account || !name || !email || !password || !confirmPassword) {
      req.flash('error_messages', '所有欄位都是必填。')
      return res.redirect('back')
    }

    if (password !== confirmPassword) {
      req.flash('error_messages', '密碼與確認密碼不一致！')
      return res.redirect('back')
    }

    if (email !== currentEmail) {
      await User.findOne({ where: { email } }).then(user => {
        if (user) {
          req.flash('error_messages', '信箱重複！')
          return res.redirect('back')
        } else {
          newEmail = email
        }
      })
    }

    if (email === currentEmail) {
      newEmail = email
    }

    if (account !== currentAccount) {
      await User.findOne({ where: { account } }).then(user => {
        if (user) {
          req.flash('error_messages', '帳號重複！')
          return res.redirect('back')
        } else {
          newAccount = account
        }
      })
    }

    if (account === currentAccount) {
      newAccount = account
    }

    if (error.length !== 0) {
      return res.render('setting', {
        error
      })
    }

    return User.findByPk(id)
      .then(user => user.update({ name, password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)), email: newEmail, account: newAccount }))
      .then(() => {
        req.flash('success_messages', '用戶帳號資料更新成功！')
        res.redirect('/tweets')
      })
  },

  getUser: (req, res) => {

    return User.findByPk(req.params.id, {
      include: [
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
        { model: Tweet, include: [Like, Reply] }
      ], order: [[Tweet, 'createdAt', 'DESC']]
    })
      .then(user => {

        return Like.findAll({ where: { UserId: helpers.getUser(req).id }, raw: true, nest: true })
          .then((likes) => {
            const results = user.toJSON()
            likes = likes.map(like => like.TweetId)
            results.Tweets.forEach(tweet => {
              tweet.isLiked = likes.includes(tweet.id)
            })
            results.tweetCount = results.Tweets.length
            results.isFollowed = user.Followers.map((er) => er.id).includes(helpers.getUser(req).id)
            return res.render('profile', {
              results: results,
              currentId: helpers.getUser(req).id
            })
          })
      })

  },
  getReplied: (req, res) => {

    return User.findByPk(req.params.id, {
      include: [
        Tweet,
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
        //   { model: Reply, include: { model: Tweet, include: User } },
        //   { model: Tweet, include: [Like, Reply] }
        // ]
        { model: Reply, include: [{ model: Tweet, include: [Reply, Like, User] }] }]
      , order: [[Reply, 'createdAt', 'DESC']]
    })
      .then(user => {

        return Like.findAll({ where: { UserId: helpers.getUser(req).id }, raw: true, nest: true })
          .then((likes) => {
            const results = user.toJSON()
            likes = likes.map(like => like.TweetId)
            results.Replies.forEach(reply => {
              reply.Tweet.isLiked = likes.includes(reply.Tweet.id)
            })
            results.isFollowed = user.Followers.map((er) => er.id).includes(helpers.getUser(req).id)
            return res.render('repliedTweet', {
              results: results,
              currentId: helpers.getUser(req).id
            })

          })
      })

  },

  getLiked: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [Tweet,
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' },
        { model: Like, include: [{ model: Tweet, include: [Reply, Like, User] }] },
      ]
      ,
      order: [[Like, 'createdAt', 'DESC']]
    })
      .then(user => {

        return Like.findAll({ where: { UserId: helpers.getUser(req).id }, raw: true, nest: true })
          .then((likes) => {
            const results = user.toJSON()
            likes = likes.map(like => like.TweetId)
            results.Likes.forEach(reply => {
              reply.Tweet.isLiked = likes.includes(reply.Tweet.id)
            })
            results.tweetCount = results.Tweets.length
            results.isFollowed = user.Followers.map((er) => er.id).includes(helpers.getUser(req).id)
            return res.render('likedTweet', {
              results: results,
              currentId: helpers.getUser(req).id
            })
          })
      })

  },

  addLike: (req, res) => {
    return Like.create({
      UserId: req.user.id,
      TweetId: req.params.tweetId
    })
      .then((tweet) => {
        return res.redirect('back')
      })
  },
  removeLike: (req, res) => {

    return Like.findOne({
      where: {
        UserId: req.user.id,
        TweetId: req.params.tweetId
      }
    })
      .then((like) => {
        like.destroy()
          .then((tweet) => {
            return res.redirect('back')
          })
      })
  },
  getFollowers: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [{ model: User, as: 'Followers' }, { model: Tweet, include: [User] }]
    }).then((user) => {
      user.update({ followerCount: user.Followers.length })
      const results = user.toJSON()
      results.Followers = user.Followers.map((follower) => ({
        ...follower.dataValues,
        isFollowed: req.user.Followings.map((er) => er.id).includes(follower.id)
      }))
      results.tweetCount = user.Tweets.length
      results.Followers.sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)
      res.render('follower', { results: results })
    })
      .catch((err) => res.send(err))
  },




  getFollowings: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [{ model: User, as: 'Followings' }, { model: Tweet }]
    }).then((user) => {
      user.update({ followerCount: user.Followings.length })
      const results = user.toJSON()
      results.Followings = user.Followings.map((Followings) => ({
        ...Followings.dataValues,
        isFollowed: req.user.Followings.map((er) => er.id).includes(Followings.id)
      }))
      results.tweetCount = user.Tweets.length
      results.Followings.sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)
      res.render('following', { results: results })
    })
      .catch((err) => res.send(err))
  },
  addFollowing: (req, res) => {
    if (helpers.getUser(req).id === Number(req.params.id)) {
      req.flash('error_messages', '使用者不能追隨自己！')
      return res.redirect('back')
    }
    return Followship.create({
      followerId: req.user.id,
      followingId: req.params.userId
    })
      .then((followship) => {
        return res.redirect('back')
      })
  },
  removeFollowing: (req, res) => {
    const followerId = req.user.id
    const followingId = req.params.userId

    Followship.destroy({ where: { followerId, followingId } })

    return res.redirect('back')

  },

  postProfile: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "請輸入名稱")
      return res.redirect('back')
    }
    if (!req.body.introduction) {
      req.flash('error_messages', "請輸入自我介紹")
      return res.redirect('back')
    }

    const { files } = req
    if (files.avatar !== undefined & files.cover === undefined) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(files.avatar[0].path, (err, img) => {
        return User.findByPk(req.params.id)
          .then((user) => {
            user.update({
              name: req.body.name,
              introduction: req.body.introduction,
              avatar: files ? img.data.link : user.avatar,
            }).then((user) => {
              req.flash('success_messages', '更新成功!')
              res.redirect(`/profile/${user.id}`)
            })
          })
      })
    }

    if (files.avatar === undefined & files.cover !== undefined) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(files.cover[0].path, (err, img) => {
        return User.findByPk(req.params.id)
          .then((user) => {
            user.update({
              name: req.body.name,
              introduction: req.body.introduction,
              cover: files ? img.data.link : user.cover,
            }).then((user) => {
              req.flash('success_messages', '更新成功!')
              res.redirect(`/profile/${user.id}`)
            })
          })
      })
    }

    if (files.avatar !== undefined & files.cover !== undefined) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(files.avatar[0].path, (err, img) => {
        return User.findByPk(req.params.id)
          .then((user) => {
            user.update({
              name: req.body.name,
              introduction: req.body.introduction,
              avatar: files ? img.data.link : user.avatar,
            })
              .then(() => {
                imgur.setClientID(IMGUR_CLIENT_ID);
                imgur.upload(files.cover[0].path, (err, img) => {
                  return User.findByPk(req.params.id)
                    .then((user) => {
                      user.update({
                        name: req.body.name,
                        introduction: req.body.introduction,
                        cover: files ? img.data.link : user.cover,
                      }).then((user) => {
                        req.flash('success_messages', '更新成功!')
                        res.redirect(`/profile/${user.id}`)
                      })
                    })
                })
              })
          })
      })
    }

    else {
      return User.findByPk(req.params.id)
        .then((user) => {
          user.update({
            name: req.body.name,
            introduction: req.body.introduction,
            avatar: user.avatar,
            cover: user.cover,
          })
            .then((user) => {
              req.flash('success_messages', '更新成功!')
              res.redirect(`/profile/${user.id}`)
            })
        })
    }
  },

}

module.exports = userController