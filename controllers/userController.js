const { User, Reply, Tweet, Like } = require('../models')
const bcrypt = require('bcrypt-nodejs')
const { Op } = require('sequelize')
const helpers = require('../_helpers')

const userController = {
  registerPage: (req, res) => {
    return res.render('register')
  },

  register: (req, res) => {
    const { account, name, email, password, passwordCheck } = req.body

    const errors = []

    if (!account || !name || !email || !password || !passwordCheck) {
      errors.push({ message: '所有欄位都是必填。' })
    }
    if (password !== passwordCheck) {
      errors.push({ message: '密碼與確認密碼不相符！' })
    }
    if (errors.length) {
      return res.render('register', {
        errors,
        account,
        name,
        email,
        password,
        passwordCheck
      })
    }

    User.findOne({
      where: {
        [Op.or]: [
          { email },
          { account }
        ]
      }
    })
      .then(user => {
        if (user) {
          req.flash('error_messages', '信箱或是帳號重複！')
          return res.redirect('/register')
        }
        User.create({
          account,
          name,
          email,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
        }).then(user => {
          return res.redirect('/')
        })
      })
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/tweets')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  getUserTweets: (req, res) => {
    User.findByPk(req.params.id, {
      include: [
        //使用者Like過的所有推文
        { model: Like, include: [Tweet] },
        //使用者的推文包括推文的回覆、喜歡、使用者資訊
        {
          model: Tweet,
          limit: 10,
          order: [["createdAt", "DESC"]],
          include: [Reply, Like, User]
        },
        // 使用者的追蹤者
        { model: User, as: "Followers" },
        // 使用者追蹤的人
        { model: User, as: "Followings" }
      ]
    })
      .then((user) => {
        user = {
          ...user.dataValues,
          LikeCount: user.Likes.length,
          TweetCount: user.Tweets.length,
          FollowerCount: user.Followers.length,
          FollowingCount: user.Followings.length,
          isFollowing: helpers.getUser(req).Followings.map(d => d.id).includes(user.id)
        }
        const tweets = user.Tweets.map((tweet) => ({
          ...tweet.dataValues,
          LikeCount: tweet.dataValues.Likes.length,
          ReplyCount: tweet.dataValues.Replies.length,
          isLiked: tweet.dataValues.Likes.map(d => d.UserId).includes(helpers.getUser(req).id)
        }))
        res.render("userTweets", { user, tweets })
      })
  },
  getSetting: async (req, res) => {
    const user = await User.findByPk(req.params.id)
    if (user.id === helpers.getUser(req).id) {
      return res.render('userSetting', {
        account: user.toJSON().account,
        name: user.toJSON().name,
        email: user.toJSON().email,
        css: 'settingPage'
      })
    } else {
      req.flash('error_messages', '不能修改別人的資料')
      return res.redirect('/tweets')
    }
  },
  putSetting: async (req, res) => {
    const { account, name, email, password, passwordCheck } = req.body

    const errors = []

    if (!account || !name || !email || !password || !passwordCheck) {
      errors.push({ message: '所有欄位都是必填。' })
    }
    if (password !== passwordCheck) {
      errors.push({ message: '密碼與確認密碼不相符！' })
    }
    if (errors.length) {
      return res.render('userSetting', {
        errors,
        account,
        name,
        email,
        password,
        passwordCheck,
        css: 'settingPage'
      })
    }
    const user = await User.findByPk(req.params.id)
    if (user.id === helpers.getUser(req).id) {
      const duplicatedUser = await User.findOne({
        where: {
          [Op.or]: [
            { email },
            { account }
          ],
          id: {
            [Op.ne]: user.id
          }
        }
      })
      if (duplicatedUser) {
        errors.push({ message: '重複的帳號或email' })
        return res.render('userSetting', {
          account,
          name,
          email,
          password,
          passwordCheck,
          errors,
          css: 'settingPage'
        })
      }

      await user.update({
        account,
        name,
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null),
        passwordCheck
      })
      req.flash('success_messages', 'setting was successfully to update')
      return res.redirect(`/setting/${user.id}`)
    } else {
      req.flash('error_messages', '不能修改別人的資料')
      return res.redirect('/tweets')
    }
  }
}

module.exports = userController
