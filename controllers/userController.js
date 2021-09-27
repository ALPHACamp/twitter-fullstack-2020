const bcrypt = require('bcrypt-nodejs')
const helpers = require('../_helpers')
const db = require('../models')
const { User, Tweet, Reply, Followship, Like } = db
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userController = {
  signupPage: (req, res) => {
    return res.render('signup')
  },

  signup: (req, res) => {
    if (req.body.checkPassword !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      User.findOne({ where: { account: req.body.account } }).then((user) => {
        if (user) {
          req.flash('error_messages', '帳號已重複註冊！')
          return res.redirect('/signup')
        } else {
          User.findOne({ where: { email: req.body.email } }).then((user) => {
            if (user) {
              req.flash('error_messages', '信箱已重複註冊！')
              return res.redirect('/signup')
            } else {
              User.create({
                account: req.body.account,
                name: req.body.name,
                email: req.body.email,
                password: bcrypt.hashSync(
                  req.body.password,
                  bcrypt.genSaltSync(10),
                  null
                )
              }).then((user) => {
                req.flash('success_messages', '成功註冊帳號！')
                return res.redirect('/signin')
              })
            }
          })
        }
      })
    }
  },

  signinPage: (req, res) => {
    return res.render('signin')
  },

  signin: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.locals.url = req.url
    res.redirect('/tweets')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },

  getUserTweets: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        {
          model: Tweet,
          include: [Reply, { model: User, as: 'LikedUsers' }]
        },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ],
      order: [[Tweet, 'createdAt', 'DESC']]
    }).then((user) => {
      const thisUser = user.toJSON()
      const currentUserId = helpers.getUser(req).id

      thisUser.Tweets.forEach((tweet) => {
        tweet.isLiked = tweet.LikedUsers.map((d) => d.id).includes(
          currentUserId
        )
      })
      thisUser.isFollowed = helpers
        .getUser(req)
        .Followings.map((item) => item.id)
        .includes(user.id)

      return res.render('userTweets', {
        users: thisUser,
        currentUserId: currentUserId
      })
    })
  },
  getPopularUser: (req, res, next) => {
    return User.findAll({
      include: [{ model: User, as: 'Followers' }]
    }).then((users) => {
      users = users.map((user) => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: helpers
          .getUser(req)
          .Followings.map((d) => d.id)
          .includes(user.id)
      }))
      users = users.filter(
        (user) =>
          user.role === 'user' && user.name !== helpers.getUser(req).name
      )
      users = users
        .sort((a, b) => b.FollowerCount - a.FollowerCount)
        .slice(0, 6)
      res.locals.recommendedList = users
      return next()
    })
  },

  editAccount: (req, res) => {
    return res.render('setting')
  },

  putAccount: async (req, res) => {
    const id = req.params.id
    const { email: currentEmail, account: currentAccount } =
      helpers.getUser(req)
    const { account, name, email, password, passwordCheck } = req.body

    const error = []
    let newEmail = ''
    let newAccount = ''

    if (currentEmail === email) {
      newEmail = currentEmail
    }
    if (currentAccount === account) {
      newAccount = currentAccount
    }
    if (password !== passwordCheck) {
      error.push({ message: '兩次密碼輸入不同！' })
    }

    if (currentEmail !== email) {
      await User.findOne({ where: { email } }).then((user) => {
        if (user) {
          error.push({ message: '信箱已經被註冊' })
        } else {
          newEmail = email
        }
      })
    }

    if (currentAccount !== account) {
      await User.findOne({ where: { account } }).then((user) => {
        if (user) {
          error.push({ message: '帳號已存在' })
        } else {
          newAccount = account
        }
      })
    }

    if (error.length !== 0) {
      return res.render('setting', { error })
    }

    if (!password) {
      return User.findByPk(id)
        .then((user) =>
          user.update({ name, email: newEmail, account: newAccount })
        )
        .then(() => {
          const success = []
          success.push({ message: '成功更新帳號資訊!' })
          return res.render('setting', { success })
        })
    } else {
      return User.findByPk(id)
        .then((user) =>
          user.update({
            name,
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
            email: newEmail,
            account: newAccount
          })
        )
        .then(() => {
          req.flash('success_messages', '成功更新帳號資訊!')
          res.redirect('/tweets')
        })
    }
  },

  getUserFollowers: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [Tweet, { model: User, as: 'Followers' }]
    }).then((user) => {
      user.update({ followerCount: user.Followers.length })
      const results = user.toJSON()
      results.Followers = user.Followers.map((user) => ({
        ...user.dataValues,
        isFollowed: helpers
          .getUser(req)
          .Followings.map((d) => d.id)
          .includes(user.id)
      }))
      results.tweetCount = user.Tweets.length
      results.Followers.sort(
        (a, b) => b.Followship.createdAt - a.Followship.createdAt
      )
      return res.render('follower', {
        results
      })
    })
  },
  getUserFollowings: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [Tweet, { model: User, as: 'Followings' }]
    }).then((user) => {
      user.update({ followingCount: user.Followings.length })
      const results = user.toJSON()
      results.Followings = user.Followings.map((user) => ({
        ...user.dataValues,
        isFollowed: helpers
          .getUser(req)
          .Followings.map((d) => d.id)
          .includes(user.id)
      }))
      results.tweetCount = user.Tweets.length
      results.Followings.sort(
        (a, b) => b.Followship.createdAt - a.Followship.createdAt
      )
      return res.render('following', {
        results
      })
    })
  },

  follow: (req, res) => {
    const followTargetId = req.body.id
    const currentUserId = helpers.getUser(req).id
    if (Number(followTargetId) === currentUserId) {
      req.flash('error_messages', '不能追蹤自己！')
      return res.redirect(200, 'back')
    } else {
      return Followship.create({
        followerId: currentUserId,
        followingId: followTargetId
      }).then(() => {
        return res.redirect('back')
      })
    }
  },

  unFollow: (req, res) => {
    const followTargetId = req.params.id
    const currentUserId = helpers.getUser(req).id
    return Followship.findOne({
      where: {
        followerId: currentUserId,
        followingId: followTargetId
      }
    })
      .then((favorite) => {
        favorite.destroy().then(() => {
          return res.redirect('back')
        })
      })
      .catch((error) => {
        console.log(error)
        res.render('error', { message: 'error' })
      })
  },

  getUserLikes: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        Tweet,
        {
          model: Like,
          include: [
            {
              model: Tweet,
              include: [Reply, Like, User]
            }
          ]
        },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ],
      order: [[Like, 'createdAt', 'DESC']]
    }).then((user) => {
      const thisUser = user.toJSON()
      const currentUserId = helpers.getUser(req).id

      thisUser.Likes.forEach((tweet) => {
        tweet.isLiked = tweet.Tweet.Likes.map((d) => d.UserId).includes(
          currentUserId
        )
      })
      thisUser.isFollowed = helpers
        .getUser(req)
        .Followings.map((item) => item.id)
        .includes(thisUser.id)

      return res.render('user/like', {
        users: thisUser,
        currentUserId: currentUserId
      })
    })
  },

  getUserReplies: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        Tweet,
        {
          model: Reply,
          include: [
            {
              model: Tweet,
              include: [Reply, Like, User]
            }
          ]
        },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ],
      order: [[Reply, 'createdAt', 'DESC']]
    }).then((user) => {
      const thisUser = user.toJSON()
      const currentUserId = helpers.getUser(req).id

      thisUser.Replies.forEach((tweet) => {
        tweet.isLiked = tweet.Tweet.Likes.map((d) => d.UserId).includes(
          currentUserId
        )
      })
      thisUser.isFollowed = helpers
        .getUser(req)
        .Followings.map((item) => item.id)
        .includes(thisUser.id)

      return res.render('reply', {
        users: thisUser,
        currentUserId: currentUserId
      })
    })
  }
}

module.exports = userController
