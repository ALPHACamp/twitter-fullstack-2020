const bcrypt = require('bcryptjs')

const { User, Tweet, Reply, Like, sequelize } = require('../../models')
const helpers = require('../../_helpers')
const recommendUserHelper = require('../../helpers/recommand-followship-helper')
const userHelper = require('../../helpers/user-helper')
const userService = require('../../service/user-services')
const errorHandler = require('../../helpers/errors-helpers')

const INPUT_LENGTH_JS = 'inputLength.js'
const USER_PAGE_JS = 'userPage.js'

const userController = {
  /* admin 登入 */
  adminSignin: (req, res, next) => {
    try {
      return res.redirect('/admin')
    } catch (error) {
      return next(error)
    }
  },
  getAdminSignInPage: (req, res, next) => {
    try {
      if (helpers.ensureAuthenticated(req)) return res.redirect('/admin')
      return res.render('admin/signin')
    } catch (error) {
      return next(error)
    }
  },

  // 以下兩個logout重複需要合併優化
  adminLogout: (req, res, next) => {
    try {
      if (req && req.cookies) {
        res.cookie('jwtToken', '', { expires: new Date(0) })
        return res.redirect('/admin/signin', { role: 'admin' })
      }
      next()
    } catch (error) {
      return next(error)
    }
  },
  /* admin登入結束 */
  /* user登入 */

  getLoginPage: (req, res, next) => {
    try {
      if (helpers.ensureAuthenticated(req)) return res.redirect('/tweets') // 如果已經有user就轉去root
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
    try {
      return res.render('login/signup')
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
      const newUser = await User.create({
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
      if (req && req.cookies) {
        res.cookie('jwtToken', '', { expires: new Date(0) })
        return res.redirect('/signin')
      }
      // next()
    } catch (error) {
      return next(error)
    }
  },
  /* user登入結束 */
  getUserTweets: async (req, res, next) => {
    try {
      const javascripts = [INPUT_LENGTH_JS, USER_PAGE_JS]

      const user = await userHelper.getUserInfo(req)
      if (!user) throw new errorHandler.UserError("User didn't exist!")

      const tweets = await Tweet.findAll({
        include: [
          User
        ],
        where: { UserId: req.params.id },
        attributes: {
          include: [
            [sequelize.literal('( SELECT COUNT(*) FROM Replies WHERE Replies.tweet_id = Tweet.id)'), 'countReply'],
            [sequelize.literal('( SELECT COUNT(*) FROM Likes WHERE Likes.tweet_id = Tweet.id)'), 'countLike'],
            [sequelize.literal(`(SELECT COUNT(*) FROM Likes WHERE Likes.tweet_id = Tweet.id AND Likes.user_id = ${helpers.getUser(req).id})`), 'isLiked']
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
        tweets,
        user,
        recommendUser,
        javascripts
      })
    } catch (error) {
      next(error)
    }
  },
  getUserEditPage: async (req, res, next) => {
    const javascripts = [INPUT_LENGTH_JS, USER_PAGE_JS]
    await userService.getUserEditPage(req, (error, data) => {
      if (error) return next(error)

      // 為了配合api，將錯誤寫成json，再到這裡導入錯誤
      if (data.status === 'error') {
        throw new errorHandler.UserError(data.messages)
      }

      res.render('user/setting', {
        javascripts,
        ...data,
        isSettingPage: true,
        route: 'setting'
      })
    })
  },
  postUserInfo: async (req, res, next) => {
    await userService.postUserInfo(req, (err, data) => err ? next(err) : res.redirect('back'))
  },
  getLikeTweets: async (req, res, next) => {
    try {
      const userId = req.params.id
      const user = await userHelper.getUserInfo(req)
      if (!user) throw new errorHandler.UserError("User didn't exist")

      const javascripts = [INPUT_LENGTH_JS, USER_PAGE_JS]
      const recommendUser = await recommendUserHelper.topFollowedUser(req)

      const tweets = await Tweet.findAll({
        include: [
          User,
          {
            model: Like,
            where: { UserId: userId }
          }
        ],
        attributes: {
          include: [
            [sequelize.literal('( SELECT COUNT(*) FROM Replies WHERE Replies.tweet_id = Tweet.id)'), 'countReply'],
            [sequelize.literal('( SELECT COUNT(*) FROM Likes WHERE Likes.tweet_id = Tweet.id)'), 'countLike']
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
        user,
        recommendUser,
        javascripts
      })
    } catch (error) {
      next(error)
    }
  },
  getUserReplies: async (req, res, next) => {
    try {
      const userId = req.params.id
      const user = await userHelper.getUserInfo(req)
      if (!user) throw new errorHandler.UserError("User didn't exist")

      const javascripts = [INPUT_LENGTH_JS, USER_PAGE_JS]
      const recommendUser = await recommendUserHelper.topFollowedUser(req)

      const tweets = await Tweet.findAll({
        include: [
          User,
          {
            model: Reply,
            where: { UserId: userId }
          }
        ],
        attributes: {
          include: [
            [sequelize.literal('( SELECT COUNT(*) FROM Replies WHERE Replies.tweet_id = Tweet.id)'), 'countReply'],
            [sequelize.literal('( SELECT COUNT(*) FROM Likes WHERE Likes.tweet_id = Tweet.id)'), 'countLike']
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
        user,
        recommendUser,
        javascripts
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = userController
