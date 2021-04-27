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

let userController = {
  loginPage: (req, res) => {
    return res.render('login')
  },

  login: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/tweets')
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
      error.push({ message: '所有欄位都是必填。' })
    }

    if (password !== confirmPassword) {
      error.push({ message: '密碼與確認密碼不一致！' })
    }

    if (email !== currentEmail) {
      await User.findOne({ where: { email } }).then(user => {
        if (user) {
          error.push({ message: '信箱重複！' })
          return res.redirect('/users/:id/setting')
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
          error.push({ message: '帳號重複！' })
          return res.redirect('/users/:id/setting')
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

  //   const isFollowing = user.Followers.map(d => d.id).includes(req.user.id)
  //   const isLiked = user.LikedUsers.map(d => d.id).includes(req.user.id)
  //   res.render('Profile', {
  //     userNow: user.toJSON(),
  //     isFollowing: isFollowing,
  //     isLiked: isLiked
  //   })
  // })

  addLike: (req, res) => {
    return Like.create({
      UserId: req.user.id,
      TweetId: req.params.tweetId
    })
      .then((tweet) => {
        console.log("tweetID =======", req.params.tweetId)
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
            console.log("dettweetID =======", req.params.tweetId)
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
        console.log("add req.user.id====", req.user.id)
        console.log("req.params.userId====", req.params.userId)
        return res.redirect('back')
      })
  },
  removeFollowing: (req, res) => {
    const followerId = req.user.id
    const followingId = req.params.userId

    Followship.destroy({ where: { followerId, followingId } })

    console.log("remove req.user.id====", req.user.id)
    console.log("req.params.userId====", req.params.userId)
    return res.redirect('back')

  }
}

module.exports = userController