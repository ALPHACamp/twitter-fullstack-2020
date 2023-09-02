const bcrypt = require('bcryptjs')

const { User, Tweet, Reply, Like, Followship, sequelize } = require('../../models')
const { Op } = require('sequelize')
const helpers = require('../../_helpers')
const userService = require('../../service/user-services')
const errorHandler = require('../../helpers/errors-helpers')

const INPUT_LENGTH_JS = 'inputLength.js'
const USER_PAGE_JS = 'userPage.js'
const CHECK_PASSWORD_JS = 'checkPassword.js'

const userHelper = {
  getUserInfo: req => {
    return User.findByPk(req.params.id, {
      attributes: {
        include: [
          [sequelize.literal('( SELECT COUNT(*) FROM Followships WHERE Followships.follower_id = User.id)'), 'followingCount'],
          [sequelize.literal('( SELECT COUNT(*) FROM Followships WHERE Followships.following_id = User.id)'), 'followerCount'],
          [sequelize.literal('( SELECT COUNT(*) FROM Tweets WHERE Tweets.user_id = User.id)'), 'tweetsCount'],
          [sequelize.literal(
              `(SELECT COUNT(*) FROM Followships
                WHERE Followships.follower_id = ${helpers.getUser(req).id}
                AND Followships.following_id = ${req.params.id}
              )`), 'isFollowed']
        ]
      },
      raw: true,
      nest: true
    })
  },

  getFollowings: async req => {
    const userId = req.params.id
    const userWithfollowings = await User.findByPk(userId, {
      include: [
        {
          model: User,
          as: 'Followings',
          attributes: [
            'id',
            'name',
            'account',
            'avatar',
            'introduction',
            [sequelize.literal(
              `(SELECT COUNT(*) FROM Followships
                WHERE Followships.follower_id = ${userId}
                AND Followships.following_id = Followings.id
              )`), 'isFollowed'] // 查看此User是否已追蹤
          ],
          through: {
            model: Followship,
            attributes: ['createdAt']
          }
        }
      ],
      order: [[{ model: User, as: 'Followings' }, { model: Followship }, 'createdAt', 'DESC']]

    })

    return userWithfollowings.toJSON()
  },

  getFollowers: async req => {
    const userId = req.params.id
    const userWithfollowers = await User.findByPk(userId, {
      include: [
        {
          model: User,
          as: 'Followers',
          attributes: [
            'id',
            'name',
            'account',
            'avatar',
            'introduction',
            [sequelize.literal(
              `(SELECT COUNT(*) FROM Followships
                WHERE Followships.follower_id = ${userId}
                AND Followships.following_id = Followers.id
              )`), 'isFollowed'] // 查看此User是否已追蹤
          ],
          through: {
            model: Followship,
            attributes: ['createdAt']
          }
        }
      ],
      order: [[{ model: User, as: 'Followers' }, { model: Followship }, 'createdAt', 'DESC']]

    })

    return userWithfollowers.toJSON()
  },

  topFollowedUser: req => {
    return User.findAll({
      where: {
        id: { [Op.ne]: helpers.getUser(req).id }, // 不要出現登入帳號
        role: { [Op.ne]: 'admin' } // admin不推薦, ne = not
      },
      attributes: {
        include: [
          // 使用 sequelize.literal 創建一個 SQL 子查詢來計算帖子數量
          [sequelize.literal('(SELECT COUNT(*) FROM Followships WHERE Followships.following_id = User.id)'), 'followerCount'], // User不要加s, 坑阿！
          // req.user是追別人的,  findAll的user是被追的人
          [sequelize.literal(
            `(SELECT COUNT(*) FROM Followships
              WHERE Followships.follower_id = ${helpers.getUser(req).id}
              AND Followships.following_id = User.id
            )`), 'isFollowed'] // 查看此User是否已追蹤
        ]
      },
      limit: 10,
      order: [['followerCount', 'DESC']],
      raw: true,
      nest: true
    })
  }
}

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

      const recommendUser = await userHelper.topFollowedUser(req)

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
    const followings = await userHelper.getFollowings(req)
    const recommendUser = await userHelper.topFollowedUser(req)

    return res.render('user/followings', {
      userTab: 'followings',
      followings,
      recommendUser
    })
  },

  getFollowers: async (req, res, next) => {
    const followers = await userHelper.getFollowers(req)
    const recommendUser = await userHelper.topFollowedUser(req)

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

      const recommendUser = await userHelper.topFollowedUser(req)

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

    try {
      const viewingUser = await userHelper.getUserInfo(req)
      if (!viewingUser) throw new errorHandler.UserError("User didn't exist")

      const recommendUser = await userHelper.topFollowedUser(req)

      const replies = await Reply.findAll({
        where: {
          UserId: viewingUserId
        },
        include: [
          {
            model: Tweet,
            include: [{
              model: User,
              attributes: ['account'],
              require: true
            }],
            attributes: [],
            required: true
          },
          {
            model: User,
            attributes: ['name', 'account', 'avatar'],
            require: true
          }
        ],
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })

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
  }
}

module.exports = {
  userController,
  userHelper
}
