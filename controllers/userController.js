const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const { User, Tweet, Reply, Like, Followship } = db
const helpers = require('../_helpers');

const userController = {
  registerPage: (req, res) => {
    return res.render('register', { layout: 'mainLogin' })
  },
  register: (req, res) => {
    if (req.body.confirmPassword !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/users/register')
    } else {
      // confirm unique user
      User.findOne({
        where: {
          $or: [
            { email: req.body.email },
            { account: req.body.account }
          ]
        }
      })
        .then(user => {
          if (user) {
            req.flash('error_messages', '信箱或賬號重複！')
            return res.redirect('/users/register')
          } else {
            User.create({
              name: req.body.name,
              email: req.body.email,
              account: req.body.account,
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null),
              role: 'user'
            }).then(user => {
              req.flash('success_messages', '成功註冊帳號！')
              return res.redirect('/users/login')
            })
          }
        })
    }
  },
  loginPage: (req, res) => {
    return res.render('login', { layout: 'mainLogin' })
  },
  login: (req, res) => {
    req.flash('success_messages', '成功登入！')
    return res.redirect('/tweets')
  },
  logout: (req, res) => {
    req.flash('success_messages', '成功登出！')
    req.logout()
    return res.redirect('/users/login')
  },
  adminLoginPage: (req, res) => {
    return res.render('admin/login', { layout: 'mainLogin' })
  },
  adminLogin: (req, res) => {
    req.flash('success_messages', '成功登入！')
    return res.redirect('/admin/tweets')
  },
  adminLogout: (req, res) => {
    req.flash('success_messages', '成功登出！')
    req.logout()
    return res.redirect('/admin/login')
  },
  getUserSettings: (req, res) => {
    const reqUser = helpers.getUser(req)
    return User.findByPk(reqUser.id).then(user => {
      return res.render('settings', {
        user: user.toJSON()
      })
    })
  },
  putUserSettings: (req, res) => {
    const { account, name, email, password, confirmPassword } = req.body
    const id = req.params.id
    let passwordCheck = true
    // check user auth
    if (helpers.getUser(req).id !== Number(id)) {
      req.flash('error_messages', 'You can only edit your account')
      return res.redirect('back')
    }
    // check data
    if (!account || !name || !email) {
      req.flash('error_messages', 'Account/Name/Email should not be empty')
      return res.redirect('back')
    }
    // check password
    if (password && !confirmPassword) {
      req.flash('error_messages', 'Please confirm password')
      passwordCheck = false
      return res.redirect('back')
    }
    if (!password && confirmPassword) {
      req.flash('error_messages', 'Password should not be empty')
      passwordCheck = false
      return res.redirect('back')
    }
    if (password || confirmPassword) {
      if (password !== confirmPassword) {
        req.flash('error_messages', 'Password and confirmed Password are not matched')
        passwordCheck = false
        return res.redirect('back')
      }
    }
    
    if (passwordCheck) {
      // user change password
      return User.findByPk(id).then(user => {
        user.update({
          account,
          name,
          email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
        })
      }).then(user => {
        req.flash('success_messages', '輸入成功！')
        return res.redirect('back')
      }).catch(err => console.log(err))
    } else {
      // user not change password
      return User.findByPk(id).then(user => {
        user.update({
          account,
          name,
          email
        })
      }).then(user => {
        req.flash('success_messages', '輸入成功！')
        return res.redirect('back')
      }).catch(err => console.log(err))
    }
  },
  getUserTweets: (req, res) => {
    const reqUserId = req.params.userId
    return User.findByPk(reqUserId, {
      order: [[{ model: Tweet }, 'createdAt', 'DESC']],
      include: [
        { model: Tweet, include:[Like, Reply] },
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' }
      ]
    }).then(user => {
      const tweets = user.toJSON().Tweets.map(tweet => ({
        avatar: user.toJSON().avatar,
        account: user.toJSON().account,
        name: user.toJSON().name,
        description: tweet.description.substring(0, 50),
        updatedAt: tweet.updatedAt,
        replyCount: tweet.Replies.length,
        likeCount: tweet.Likes.length
      }))
      return res.render('userTweets', {
        tweets,
        userId: user.toJSON().id,
        cover: user.toJSON().cover,
        avatar: user.toJSON().avatar,
        account: user.toJSON().account,
        name: user.toJSON().name,
        introduction: user.toJSON().introduction,
        followingsCount: user.toJSON().Followings.length,
        followersCount: user.toJSON().Followers.length,
        tweetsCount: tweets.length
      })
    })
  },
  getUserReplies: (req, res) => {
    const reqUserId = req.params.userId
    return User.findByPk(reqUserId, {
      order: [[{ model: Reply }, 'createdAt', 'DESC']],
      include: [
        { model: Reply, include: [{ model: Tweet, include: [User, Reply, Like] }] },
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' },
        Tweet
      ]
    }).then(user => {
      console.log('user.reply:', user.toJSON().Replies)
      const replies = user.toJSON().Replies.map(reply => ({
        avatar: user.toJSON().avatar,
        account: user.toJSON().account,
        name: user.toJSON().name,
        description: reply.Tweet.description.substring(0, 50),
        updatedAt: reply.Tweet.updatedAt,
        replyCount: reply.Tweet.Replies.length,
        likeCount: reply.Tweet.Likes.length
      }))
      return res.render('userReplies', {
        replies,
        userId: user.toJSON().id,
        cover: user.toJSON().cover,
        avatar: user.toJSON().avatar,
        account: user.toJSON().account,
        name: user.toJSON().name,
        introduction: user.toJSON().introduction,
        followingsCount: user.toJSON().Followings.length,
        followersCount: user.toJSON().Followers.length,
        tweetsCount: user.toJSON().Tweets.length
      })
    })
  },
  getUserLikes: (req, res) => {
    const reqUserId = req.params.userId
    return User.findByPk(reqUserId, {
      order: [[{ model: Like }, 'createdAt', 'DESC']],
      include: [
        { model: Like, include: [{ model: Tweet, include: [User, Reply, Like] }] },
        { model: User, as: 'Followings' },
        { model: User, as: 'Followers' },
        Tweet
      ]
    }).then(user => {
      const likes = user.toJSON().Likes.map(like => ({
        avatar: user.toJSON().avatar,
        account: user.toJSON().account,
        name: user.toJSON().name,
        description: like.Tweet.description.substring(0, 50),
        updatedAt: like.Tweet.updatedAt,
        replyCount: like.Tweet.Replies.length,
        likeCount: like.Tweet.Likes.length
      }))
      return res.render('userLikes', {
        likes,
        userId: user.toJSON().id,
        cover: user.toJSON().cover,
        avatar: user.toJSON().avatar,
        account: user.toJSON().account,
        name: user.toJSON().name,
        introduction: user.toJSON().introduction,
        followingsCount: user.toJSON().Followings.length,
        followersCount: user.toJSON().Followers.length,
        tweetsCount: user.toJSON().Tweets.length
      })
    })
  }
}

module.exports = userController