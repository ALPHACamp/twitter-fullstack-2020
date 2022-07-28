const { User, Tweet, sequelize } = require('../../models')
const bcrypt = require('bcryptjs')

const { isAdmin, userInfoHelper } = require('../../helpers/user-helpers')

const userConroller = {
  getSignin: (req, res) => {
    res.render('signin')
  },
  postSignin: (req, res) => {
    const ADMIN = 'admin'
    if (req.user.role === ADMIN) {
      req.logout()
      req.flash('error_messages', '帳號不存在')
      return res.redirect('/signin')
    }
    req.flash('success_messages', '成功登入')
    return res.redirect('/tweets')
  },
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    // 查看不符合的條件
    if (!account || !name || !email || !password || !checkPassword) throw new Error('請填寫每個欄位')
    if (password !== checkPassword) throw new Error('密碼與確認密碼不相符!')
    if (name.length > 50) throw new Error('名稱長度超出上限 50 字！')

    // 並確認 email 與 account 不能重複
    return Promise.all([
      User.findOne({ where: { email } }),
      User.findOne({ where: { account } })
    ])
      .then(([userEmail, userAccount]) => {
        if (userEmail) throw new Error('Email 已經存在!')
        if (userAccount) throw new Error('Account 已經存在!')
        return bcrypt.hash(password, 10)
      })
      .then(hash => User.create({
        account,
        name,
        email,
        password: hash
      }))
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  getTweets: (req, res, next) => {
    const UserId = req.params.userId

    return Promise.all([
      userInfoHelper(UserId),
      Tweet.findAll({
        attributes: {
          include: [
            [sequelize.literal('(SELECT COUNT(`id`) FROM `Replies` WHERE `TweetId` = `Tweet`.`id`)'), 'replyCounts'],
            [sequelize.literal('(SELECT COUNT(`id`) FROM `Likes` WHERE `TweetId` = `Tweet`.`id`)'), 'likeCounts']
          ]
        },
        include: [User],
        where: { UserId },
        order: [['createdAt', 'ASC']]
      })
    ])
      .then(([user, tweets]) => {
        if (!user || isAdmin(user)) throw new Error('使用者不存在')

        tweets = tweets.map(tweet => ({
          ...tweet.toJSON(),
          isLiked: req.user?.Likes.some(like => like.TweetId === tweet.id)
        }))
        res.render('user', { user, tweets })
      })
      .catch(err => next(err))
  }
}

module.exports = userConroller
