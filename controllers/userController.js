const bcrypt = require('bcryptjs')
const helpers = require('../_helpers')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like

const userService = require('../services/userService')

const userController = {
  //註冊頁面
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    if (req.body.checkPassword !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      User.findOne({ where: { email: req.body.email } })
        .then(user => {
          if (user) {
            req.flash('error_messages', '信箱重複！')
            return res.redirect('/signup')
          } else {
            User.create({
              account: req.body.account,
              name: req.body.name,
              email: req.body.email,
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
              role: 'user'
            })
              .then(user => {
                req.flash('success_messages', '成功註冊帳號！')
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
    req.flash('success_msg', '成功登入！')
    res.redirect('/tweets')
  },

  editPage: (req, res) => {
    return User.findByPk(helpers.getUser(req).id)
      .then((user) => {
        res.render('edit', { user: user.toJSON() })
      })
  },

  editData: (req, res) => {
    const { name, email, password, checkPassword } = req.body
    const currentUser = helpers.getUser(req)
    if (!email || !name || !password || !checkPassword) {
      req.flash('error_msg', '所有欄位皆為必填')
      return res.redirect('back')
    }

    if (checkPassword !== password) {
      req.flash('error_msg', '兩次密碼輸入不同！')
      return res.redirect('back')
    }
    if (email !== currentUser.email) {
      return User.findOne({ where: { email: email }})
        .then((user) => {
          if (user) {
            req.flash('error_msg', '信箱已存在')
            return res.redirect('back')
          }
        })
    }
    if (account !== currentUser.account) {
      return User.findOne({ where: { account: account } })
        .then((user) => {
          if (user) {
            req.flash('error_msg', '帳號已存在')
            return res.redirect('back')
          }
        })
    }
    return User.findByPk(currentUser.id)
      .then((user) => {
        user.update({
          name: name,
          account: account,
          email: email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
        })
        return res.redirect('/tweets')
      })
  },


  logout: (req, res) => {
    req.flash('success_msg', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },

  getUser: (req, res) => {
    User.findByPk(req.params.id, { include: [
      { model: Tweet, include: [ Reply, { model: User, as: 'LikedUsers'}] },
      { model: Reply, include: [{ model: Tweet, include: [User] }] },
      { model: Like, include: [{ model: Tweet, include: [User, Reply, { model: User, as: 'LikedUsers' }]}]}
    ] }).then(user => {
      // to avoid conflicting with res.locals.user
      userData = {
        ...user.toJSON(),
        tweetCount: user.Tweets.length,
        followingCount: helpers.getUser(req).Followings.length,
        followerCount: helpers.getUser(req).Followers.length,
        isFollowed: helpers.getUser(req).Followings.map(item => item.id).includes(req.params.id)
      }

      userData.Tweets = userData.Tweets.map(tweet => ({
        ...tweet,
        replyCount: tweet.Replies.length,
        isReplied: tweet.Replies.map(item => item.UserId).includes(helpers.getUser(req).id),
        likeCount: tweet.LikedUsers.length,
        isLiked: tweet.LikedUsers.map(item => item.id).includes(helpers.getUser(req).id)
      }))

      userData.Likes = userData.Likes.map(like => {
        return {
          Tweet: like.Tweet,
          replyCount: like.Tweet.Replies.length,
          isReplied: like.Tweet.Replies.map(item => item.UserId).includes(helpers.getUser(req).id),
          likeCount: like.Tweet.LikedUsers.length,
          isLiked: like.Tweet.LikedUsers.map(item => item.id).includes(helpers.getUser(req).id)
        }
      })

      userService.getTopUser(req, res, topUser => {
        return res.render('user', { userData, topUser })
      })
    })
  }
}

module.exports = userController