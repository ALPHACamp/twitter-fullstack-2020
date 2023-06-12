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
  signin: (req, res, next) => {
    req.flash('success_messages', '成功登入!')
    res.redirect('/tweets')
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) {
      throw new Error('Passwords do not match!')
    }
    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')
        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash =>
        User.create({
          name: req.body.name,
          email: req.body.email,
          password: hash,
          role: 'user',
          avatar: `https://loremflickr.com/140/140/portrait/?lock=${Math.random() * 100}`,
          cover: `https://loremflickr.com/640/200/landscape/?lock=${Math.random() * 100}`
        })
      )
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！')
        res.redirect('/signin')
      })
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
