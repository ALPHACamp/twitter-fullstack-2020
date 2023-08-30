const bcrypt = require('bcryptjs')

const { User, Tweet, Reply, Like, sequelize } = require('../../models')
const helpers = require('../../_helpers')
const recommendUserHelper = require('../../helpers/recommand-followship-helper')
const userHelper = require('../../helpers/user-helper')
const userService = require('../../service/user-services')
const errorHandler = require('../../helpers/errors-helpers')

const INPUT_LENGTH_JS = 'inputLength.js'
const USER_PAGE_JS = 'userPage.js'
const CHECK_PASSWORD_JS = 'checkPassword.js'

const userController = {
  /* user登入 */
  getLoginPage: (req, res, next) => {
    try {
      if (helpers.ensureAuthenticated(req)) {
        return res.redirect('/tweets')
      }

      return res.render('login/signin')
    } catch (error) {
      return next(error)
    }
  },

  postLogin: (req, res, next) => {
    try {
      return res.redirect('/tweets')
    } catch (error) {
      return next(error)
    }
  },
  getSignupPage: (req, res, next) => {
    const javascripts = [INPUT_LENGTH_JS, CHECK_PASSWORD_JS]

    try {
      return res.render('login/signup', { javascripts })
    } catch (error) {
      return next(error)
    }
  },
  postSignup: async (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    const errors = []

    if (!account || !name || !email || !password || !checkPassword) {
      errors.push({ messages: '所有欄位皆為必填' })
    }

    if (name.length > 50) {
      errors.push({ messages: '暱稱不得超過50字' })
    }

    if (password !== checkPassword) {
      errors.push({ messages: '密碼與確認密碼不相符!' })
    }

    if (errors.length) {
      return res.render('login/signup', {
        errors,
        account,
        name,
        email,
        password,
        checkPassword
      })
    }

    try {
      const isAccountExist = await User.findOne({ where: { account } })
      const isEmailExist = await User.findOne({ where: { email } })

      if (isAccountExist) {
        errors.push({ messages: 'account 已重複註冊！' })
      }

      if (isEmailExist) {
        errors.push({ messages: 'email 已重複註冊！' })
      }

      if (errors.length) {
        return res.render('login/signup', {
          errors,
          account,
          name,
          email,
          password,
          checkPassword
        })
      }

      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(password, salt)
      await User.create({
        account,
        name,
        email,
        password: hash
      })

      return res.redirect('/signin')
    } catch (error) {
      return next(error)
    }
  },

  getLogout: (req, res, next) => {
    try {
      req.logout(function (err) {
        if (err) {
          return next(err)
        }

        res.redirect('/signin')
      })
    } catch (error) {
      return next(error)
    }
  },
  /* user登入結束 */

  getUserTweets: async (req, res, next) => {
    const javascripts = [INPUT_LENGTH_JS, USER_PAGE_JS]
    const viewingUserId = req.params.id
    const loggingUserId = helpers.getUser(req).id

    try {
      const viewingUser = await userHelper.getUserInfo(req)

      if (!viewingUser) throw new errorHandler.UserError("User didn't exist!")

      const tweets = await Tweet.findAll({
        include: [
          {
            model: User,
            required: true
          }
        ],
        where: { UserId: viewingUserId },
        attributes: {
          include: [
            [sequelize.literal('( SELECT COUNT(*) FROM Replies WHERE Replies.tweet_id = Tweet.id)'), 'countReply'],
            [sequelize.literal('( SELECT COUNT(*) FROM Likes WHERE Likes.tweet_id = Tweet.id)'), 'countLike'],
            [sequelize.literal(`(SELECT COUNT(*) FROM Likes WHERE Likes.tweet_id = Tweet.id AND Likes.user_id = ${loggingUserId})`), 'isLiked']
          ]
        },
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })

      const recommendUser = await recommendUserHelper.topFollowedUser(req)

      return res.render('user/tweets', {
        route: 'user',
        userTab: 'tweets',
        javascripts,
        tweets,
        viewingUser,
        recommendUser
      })
    } catch (error) {
      next(error)
    }
  },

  getUserEditPage: async (req, res, next) => {
    const javascripts = [INPUT_LENGTH_JS, USER_PAGE_JS, CHECK_PASSWORD_JS]

    await userService.getUserEditPage(req, (error, data) => {
      if (error) return next(error)

      // 為了配合api，將錯誤寫成json，再到這裡導入錯誤
      if (data.status === 'error') {
        throw new errorHandler.UserError(data.messages)
      }

      res.render('user/setting', {
        isSettingPage: true,
        route: 'setting',
        javascripts,
        ...data
      })
    })
  },

  postUserInfo: async (req, res, next) => {
    await userService.postUserInfo(req, (err, data) => err
      ? next(err)
      : res.redirect('back'))
  },

  getFollowings: async (req, res, next) => {
    const followings = await userHelper.getFollowings(req)
    const recommendUser = await recommendUserHelper.topFollowedUser(req)

    return res.render('user/followings', {
      userTab: 'followings',
      followings,
      recommendUser
    })
  },

  getFollowers: async (req, res, next) => {
    const followers = await userHelper.getFollowers(req)
    const recommendUser = await recommendUserHelper.topFollowedUser(req)

    return res.render('user/followers', {
      userTab: 'followers',
      followers,
      recommendUser
    })
  },

  getLikeTweets: async (req, res, next) => {
    const javascripts = [INPUT_LENGTH_JS, USER_PAGE_JS]
    const viewingUserId = req.params.id
    const loggingUserId = helpers.getUser(req).id

    try {
      const viewingUser = await userHelper.getUserInfo(req)
      if (!viewingUser) throw new errorHandler.UserError("User didn't exist")

      const recommendUser = await recommendUserHelper.topFollowedUser(req)

      const tweets = await Tweet.findAll({
        include: [
          {
            model: User,
            required: true
          },
          {
            model: Like,
            where: { UserId: viewingUserId }
          }
        ],
        attributes: {
          include: [
            [sequelize.literal('( SELECT COUNT(*) FROM Replies WHERE Replies.tweet_id = Tweet.id)'), 'countReply'],
            [sequelize.literal('( SELECT COUNT(*) FROM Likes WHERE Likes.tweet_id = Tweet.id)'), 'countLike'],
            [sequelize.literal(`(SELECT COUNT(*) FROM Likes WHERE Likes.tweet_id = Tweet.id AND Likes.user_id = ${loggingUserId})`), 'isLiked']
          ]
        },
        order: [[Like, 'createdAt', 'DESC']],
        raw: true,
        nest: true
      })

      return res.render('user/tweets', {
        route: 'user',
        userTab: 'likes',
        tweets,
        viewingUser,
        recommendUser,
        javascripts
      })
    } catch (error) {
      next(error)
    }
  },
  getUserReplies: async (req, res, next) => {
    const javascripts = [INPUT_LENGTH_JS, USER_PAGE_JS]
    const viewingUserId = req.params.id
    const loggingUserId = helpers.getUser(req).id

    try {
      const viewingUser = await userHelper.getUserInfo(req)
      if (!viewingUser) throw new errorHandler.UserError("User didn't exist")

      const recommendUser = await recommendUserHelper.topFollowedUser(req)

      const tweets = await Tweet.findAll({
        include: [
          {
            model: User,
            required: true
          },
          {
            model: Reply,
            where: { UserId: viewingUserId }
          }
        ],
        attributes: {
          include: [
            [sequelize.literal('(SELECT COUNT(*) FROM Replies WHERE Replies.tweet_id = Tweet.id)'), 'countReply'],
            [sequelize.literal('( SELECT COUNT(*) FROM Likes WHERE Likes.tweet_id = Tweet.id)'), 'countLike'],
            [sequelize.literal(`(SELECT COUNT(*) FROM Likes WHERE Likes.tweet_id = Tweet.id AND Likes.user_id = ${loggingUserId})`), 'isLiked']
          ]
        },
        order: [[Reply, 'createdAt', 'DESC']],
        raw: true,
        nest: true
      })

      return res.render('user/tweets', {
        route: 'user',
        userTab: 'replies',
        tweets,
        viewingUser,
        recommendUser,
        javascripts
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = userController
