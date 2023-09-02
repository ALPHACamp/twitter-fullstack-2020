const bcrypt = require('bcryptjs')

const { User, Tweet, Reply, Like, sequelize } = require('../../models')
const helpers = require('../../_helpers')
const userService = require('../../service/user-services')
const errorHandler = require('../../helpers/errors-helpers')

const INPUT_LENGTH_JS = 'inputLength.js'
const USER_PAGE_JS = 'userPage.js'
const CHECK_PASSWORD_JS = 'checkPassword.js'
const LOAD_USER_TWEET_JS = 'unlimitScrolldown/loadUserTweet.js'
const LOAD_USER_LIKE_TWEET_JS = 'unlimitScrolldown/loadUserLikeTweet.js'
const LOAD_USER_REPLY_TWEET_JS = 'unlimitScrolldown/loadUserReplyTweet.js'
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
    const javascripts = [INPUT_LENGTH_JS, CHECK_PASSWORD_JS]
    const { account, name, email, password, checkPassword } = req.body
    const emailRegex = /^\w+((-|\.)\w+)*@[A-Za-z0-9]+((-|\.)[A-Za-z0-9]+)*\.[A-Za-z]+$/
    const errors = []

    if (!account || !name || !email || !password || !checkPassword) {
      errors.push({ messages: '所有欄位皆為必填' })
    }

    if (name.length > 50) {
      errors.push({ messages: '暱稱不得超過50字' })
    }

    if (!emailRegex.test(email)) {
      errors.push({ messages: 'Email格式不正確!' })
    }

    if (password !== checkPassword) {
      errors.push({ messages: '密碼與確認密碼不相符!' })
    }

    if (errors.length) {
      return res.render('login/signup', {
        javascripts,
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

      req.flash('success_messages', '註冊成功!')

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

        req.flash('success_messages', '你已成功登出!')

        res.redirect('/signin')
      })
    } catch (error) {
      return next(error)
    }
  },
  /* user登入結束 */

  getUserTweets: async (req, res, next) => {
    const javascripts = [INPUT_LENGTH_JS, USER_PAGE_JS, LOAD_USER_TWEET_JS]
    const limit = 8
    const page = 0

    try {
      const viewingUser = await userService.getUserInfo(req)

      if (!viewingUser) throw new errorHandler.UserError("User didn't exist!")

      const tweets = await userService.getUserTweets(req, limit, page)

      const recommendUser = await userService.topFollowedUser(req)

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

  getUserTweetsUnload: async (req, res, next) => {
    try {
      let { limit, page } = req.query
      limit = parseInt(limit)
      page = parseInt(page)

      if ((limit !== 0 && !limit) || (page !== 0 && !page) || isNaN(limit) || isNaN(page)) {
      // 檢查是否有提供有效的 limit 和 page
        return res.json({ message: 'error', data: {} })
      }

      const userTweetsUnload = await userService.getUserTweets(req, limit, page)

      if (!userTweetsUnload) {
        return res.json({ message: 'error', data: {} })
      }

      return res.json({ message: 'success', data: userTweetsUnload })
    } catch (error) {
      return next(error)
    }
  },
  getUserEditPage: async (req, res, next) => {
    const javascripts = [INPUT_LENGTH_JS, USER_PAGE_JS, CHECK_PASSWORD_JS]
    const loadingUser = req.user.id

    await userService.getUserEditPage(req, (error, data) => {
      if (error) return next(error)

      // 為了配合api，將錯誤寫成json，再到這裡導入錯誤
      if (data.status === 'error') {
        req.flash('error_messages', data.messages)
        return res.redirect(`/users/${loadingUser}`)
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
    await userService.postUserInfo(req, (error, data) => {
      if (error) {
        return next(error)
      }

      req.flash('success_messages', '修改成功!')

      res.redirect('back')
    })
  },

  getFollowings: async (req, res, next) => {
    const followings = await userService.getFollowings(req)
    const recommendUser = await userService.topFollowedUser(req)

    return res.render('user/followings', {
      userTab: 'followings',
      followings,
      recommendUser
    })
  },

  getFollowers: async (req, res, next) => {
    const followers = await userService.getFollowers(req)
    const recommendUser = await userService.topFollowedUser(req)

    return res.render('user/followers', {
      userTab: 'followers',
      followers,
      recommendUser
    })
  },

  getLikeTweets: async (req, res, next) => {
    const javascripts = [INPUT_LENGTH_JS, USER_PAGE_JS, LOAD_USER_LIKE_TWEET_JS]
    const limit = 8
    const page = 0
    try {
      const viewingUser = await userService.getUserInfo(req)
      if (!viewingUser) throw new errorHandler.UserError("User didn't exist")

      const recommendUser = await userService.topFollowedUser(req)

      const tweets = await userService.getLikeTweets(req, limit, page)
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

  getLikeTweetsUnload: async (req, res, next) => {
    try {
      let { limit, page } = req.query
      limit = parseInt(limit)
      page = parseInt(page)

      if ((limit !== 0 && !limit) || (page !== 0 && !page) || isNaN(limit) || isNaN(page)) {
      // 檢查是否有提供有效的 limit 和 page
        return res.json({ message: 'error', data: {} })
      }

      const tweets = await userService.getLikeTweets(req, limit, page)
      return res.json(tweets)
    } catch (error) {
      next(error)
    }
  },
  getUserReplies: async (req, res, next) => {
    const javascripts = [INPUT_LENGTH_JS, USER_PAGE_JS, LOAD_USER_REPLY_TWEET_JS]
    const limit = 8
    const page = 0

    try {
      const viewingUser = await userService.getUserInfo(req)
      if (!viewingUser) throw new errorHandler.UserError("User didn't exist")

      const recommendUser = await userService.topFollowedUser(req)

      const replies = await userService.getUserReplies(req, limit, page)

      return res.render('user/tweets', {
        route: 'user',
        userTab: 'replies',
        replies,
        viewingUser,
        recommendUser,
        javascripts
      })
      // return res.json(replies)
    } catch (error) {
      next(error)
    }
  },
  getUserRepliesUnload: async (req, res, next) => {
    try {
      let { limit, page } = req.query
      limit = parseInt(limit)
      page = parseInt(page)

      if ((limit !== 0 && !limit) || (page !== 0 && !page) || isNaN(limit) || isNaN(page)) {
      // 檢查是否有提供有效的 limit 和 page
        return res.json({ message: 'error', data: {} })
      }

      const replies = await userService.getUserReplies(req, limit, page)
      return res.json(replies)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = {
  userController,
  userService
}
