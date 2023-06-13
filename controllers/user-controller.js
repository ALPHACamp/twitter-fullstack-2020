const { User, Tweet, Like } = require('../models')
const bcrypt = require('bcryptjs')
const helpers = require('../_helpers')

const userController = {
  signinPage: (req, res) => {
    res.render('signin')
  },
  signupPage: (req, res) => {
    res.render('signup')
  },
  signin: (req, res) => {
    req.flash('success_messages', '成功登入!')
    res.redirect('/tweets')
  },
  signup: (req, res) => {
    const { account, name, email, password, passwordCheck } = req.body

    if (password !== passwordCheck) {
      throw new Error('密碼不符合!')
    }

    User.findOne({ where: { account } })
      .then(user => {
        if (user) {
          req.flash('error_messages', 'account 已重複註冊！')
          res.redirect('/signup')
          throw new Error('account already exists!')
        }
      })
      .catch(err => console.log(err))

    User.findOne({ where: { email } })
      .then(user => {
        if (user) {
          req.flash('error_messages', 'email 已重複註冊！')
          res.redirect('/signup')
          throw new Error('email already exists!')
        }
        return bcrypt.genSalt(10)
          .then(salt => bcrypt.hash(password, salt))
          .then(hash =>
            User.create({
              account,
              name,
              email,
              password: hash,
              role: 'user',
              avatar: 'https://ionicframework.com/docs/img/demos/avatar.svg',
              cover: '/images/profile/cover.png'
            })
          )
          .then(() => {
            req.flash('success_messages', '成功註冊帳號！')
            res.redirect('/signin')
          })
          .catch(err => console.log(err))
      })
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  postLike: async (req, res, next) => {
    const { tweetId } = req.params
    const loginUser = helpers.getUser(req)
    try {
      // 找出這筆推文資料和從likes中找是否已經存在喜歡紀錄
      const [tweet, like] = await Promise.all([
        Tweet.findByPk(tweetId),
        Like.findOne({
          where: {
            UserId: loginUser.id,
            TweetId: tweetId
          }
        })
      ])
      if (!tweet) throw new Error("Tweet didn't exist!")
      if (like) throw new Error('You have liked this tweet!')
      await Like.create({
        UserId: loginUser.id,
        TweetId: tweetId
      })
      res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  postUnlike: async (req, res, next) => {
    const { tweetId } = req.params
    const user = helpers.getUser(req)
    try {
      // 從likes中找是否存在喜歡紀錄
      const like = await Like.findOne({
        where: {
          UserId: user.id,
          TweetId: tweetId
        }
      })
      if (!like) throw new Error("You haven't liked this tweet")
      await like.destroy()
      res.redirect('back')
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController
