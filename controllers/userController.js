const bcrypt = require('bcryptjs')
const helpers = require('../_helpers')
const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Like = db.Like
const Followship = db.Followship

const userService = require('../services/userService')

const userController = {
  //註冊頁面
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    if (!req.body.email || !req.body.name || !req.body.account || !req.body.password) {
      req.flash('error_msg', '所有欄位皆為必填')
      res.redirect('signup')
    }
    if (req.body.checkPassword !== req.body.password) {
      req.flash('error_msg', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      User.findOne({ where: { email: req.body.email } })
        .then(user => {
          if (user) {
            req.flash('error_msg', '信箱已重複註冊！')
            return res.redirect('/signup')
          } else {
            User.findOne({ where: { account: req.body.account } })
              .then(user => {
                if (user) {
                  req.flash('error_msg', '帳號已重複註冊！')
                  return res.redirect('/signup')
                } else {
                  User.create({
                    account: req.body.account,
                    name: req.body.name,
                    email: req.body.email,
                    password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
                  })
                    .then(user => {
                      req.flash('success_msg', '成功註冊帳號！')
                      return res.redirect('/signin')
                    })
                }      
              })
            }
        })
    }
  },

  signInPage: (req, res) => {
    if (res.locals.user) {
      delete res.locals.user
    }

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
    const { name, email, password, checkPassword, account } = req.body
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
      { model: User, as: 'Followings' },
      { model: User, as: 'Followers' },
      { model: Tweet, include: [ Reply, { model: User, as: 'LikedUsers'}] },
      { model: Reply, include: [{ model: Tweet, include: [User] }] },
      { model: Like, include: [{ model: Tweet, include: [User, Reply, { model: User, as: 'LikedUsers' }]}]}
    ] }).then(user => {
      // to avoid conflicting with res.locals.user
      const userData = {
        ...user.toJSON(),
        tweetCount: user.Tweets.length,
        followingCount: user.Followings.length,
        followerCount: user.Followers.length,
        isFollowed: helpers.getUser(req).Followings.map(item => item.id).includes(user.dataValues.id)
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
  },
  getUserTweets: (req, res) => {
    User.findByPk(req.params.id, { include: { model: Tweet, include: [
      { model: User, as: 'LikedUsers' },
      { model: Reply, include: [User] }
    ] } }).then(user => {
      // to avoid conflicting with res.locals.user
      const userData = {
        ...user.toJSON()
      }

      userData.Tweets = userData.Tweets.map(tweet => ({
        ...tweet,
        replyCount: tweet.Replies.length,
        isReplied: tweet.Replies.map(item => item.UserId).includes(helpers.getUser(req).id),
        likeCount: tweet.LikedUsers.length,
        isLiked: tweet.LikedUsers.map(item => item.id).includes(helpers.getUser(req).id)
      }))

      userService.getTopUser(req, res, topUser => {
        return res.render('userTweets', { userData, topUser })
      })
    })
  },
  getLikes: (req, res) => {
    User.findByPk(req.params.id, { include: { model: Tweet, as: 'LikedTweets', include: [
      User,
      { model: User, as: 'LikedUsers'},
      { model: Reply, include: [ User ]}
    ]} }).then(user => {
      // to avoid conflicting with res.locals.user
      const userData = {
        ...user.toJSON()
      }

      userData.LikedTweets = userData.LikedTweets.map(tweet => ({
        ...tweet,
        replyCount: tweet.Replies.length,
        isReplied: tweet.Replies.map(item => item.UserId).includes(helpers.getUser(req).id),
        likeCount: tweet.LikedUsers.length,
        isLiked: tweet.LikedUsers.map(item => item.id).includes(helpers.getUser(req).id)
      }))

      userService.getTopUser(req, res, topUser => {
        return res.render('likes', { userData, topUser })
      })
    })
  },
  addFollowing: (req, res) => {
    if (helpers.getUser(req).id === Number(req.body.id)) {
      req.flash('error_msg', '不能自己追蹤自己')
      return res.redirect(200, 'back')
    }
    return Followship.create({
      followerId: helpers.getUser(req).id,
      followingId: req.body.id
    })
      .then((followship) => {
        req.flash('success_msg', '追蹤成功')
        return res.redirect('back')
      })
  },
  removeFollowing: (req, res) => {
    return Followship.findOne({
      where: {
        followerId: helpers.getUser(req).id,
        followingId: req.params.id
      } })
      .then((followship) => {
        followship.destroy()
          .then((followship) => {
            req.flash('success_msg', '取消追蹤')
            return res.redirect('back')
          })
      })
  },

  getFollowings: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        Tweet,
        { model: User, as: 'Followings' }
      ]
    })
      .then(user => {
        const userData = user.toJSON()
        userData.Followings = user.Followings.map((Followings) => ({
          ...Followings.dataValues,
          isFollowed: helpers.getUser(req).Followings.map((er) => er.id).includes(Followings.id)
        }))
        userData.tweetCount = user.Tweets.length
        userData.Followings.sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)
        userService.getTopUser(req, res, topUser => {
          return res.render('followings', { userData, topUser })
        })
      })
  },

  getFollowers: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        Tweet,
        { model: User, as: 'Followers' }
      ]
    })
      .then(user => {
        const userData = user.toJSON()
        userData.Followers = user.Followers.map((Followers) => ({
          ...Followers.dataValues,
          isFollowed: helpers.getUser(req).Followings.map((er) => er.id).includes(Followers.id)
        }))
        userData.tweetCount = user.Tweets.length
        userData.Followers.sort((a, b) => b.Followship.createdAt - a.Followship.createdAt)
        userService.getTopUser(req, res, topUser => {
          return res.render('followers', { userData, topUser })
        })
      })
  },

  updateProfile: (req, res) => {
    apiController.postUser(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_msg', data['message'])
        return res.redirect('back')
      }
      req.flash('success_msg', data['message'])
      return res.status(200)
    })
  }
}

module.exports = userController