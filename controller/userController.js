const bcrypt = require('bcryptjs')
const { Tweet, User, Like, Reply } = require('../models')
const helpers = require('../_helpers')

const userController = {
  signUpPage: async (req, res) => {
    try {
      return res.render('signup', { status: 200 })
    } catch (err) {
      res.status(302)
      console.log('err')
      return res.redirect('back')
    }
  },
  signUp: async (req, res) => {
    try {
      const { account, name, email, password, checkPassword } = req.body

      const errors = []

      if (!name || !email || !password || !checkPassword || !account) {
        errors.push({ message: '所有欄位都是必填。' })
      }
      if (password !== checkPassword) {
        errors.push({ message: '密碼與確認密碼不相符！' })
      }
      if (name.length > 50) {
        errors.push({ message: '名稱上限為50字！' })
      }

      const userEmail = await User.findOne({ where: { email } })
      const userAccount = await User.findOne({ where: { account } })
      if (userEmail) {
        errors.push({ message: '這個 Email 已經註冊過了。' })
      }
      if (userAccount) {
        errors.push({ message: '這個 Account 已經註冊過了。' })
      }
      if (errors.length) {
        return res.render('signup', {
          errors,
          account,
          name,
          email,
          password,
          checkPassword
        })
      }

      await User.create({
        account,
        name,
        email,
        password: bcrypt.hashSync(
          req.body.password,
          bcrypt.genSaltSync(10),
          null
        ),
        avatar:
          'https://icon-library.com/images/default-user-icon/default-user-icon-17.jpg'
      })

      req.flash('success_messages', '註冊成功！')
      res.status(200)
      res.redirect('/signin')
    } catch (err) {
      res.status(302)
      console.log('err')
      return res.redirect('back')
    }
  },
  signInPage: (req, res) => {
    res.render('signin')
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
  getUser: async (req, res, next) => {
    try {
      const userId = req.params.id
      const user = await User.findByPk(userId, {
        include: [
          { model: Tweet, include: Reply },
          { model: Reply, include: User },
          { model: Like },
          { model: User, as: 'Followings' },
          { model: User, as: 'Followers' }
        ]
      })
      if (!user) throw new Error("user didn't exist!")
      // console.log(user.toJSON())
      // let personal 之後用來輸出到前端確認查看個人頁的user id是否是本人
      // 沒有完整登入流程，沒走passport就不會拿到req.user
      // 目前回傳給前端的user是上面資料庫從params.id找出來的user
      // 以下為第二種確認登入者id是否=params.id的方法
      // console.log('req.user', req.user)
      // req.user.id.toString() === req.params.id
      //   ? personal = true
      //   : personal = false
      return res.render('user', {
        user: user.toJSON()
      })
    } catch (err) {
      next(err)
    }
  },
  getLikes: async (req, res, next) => {
    try {
      const userId = req.params.id
      const user = await User.findByPk(userId, {
        include: [
          { model: Like, include: [{ model: Tweet, include: [Reply] }] }
        ],
        order: [['createdAt', 'DESC']]
      })
      if (!user) throw new Error("user didn't exist!")
      const tweets = user.toJSON().Likes.map(tweet => ({
        ...tweet,
        isLiked: true
      }))
      return res.render('likes', {
        tweets
      })
    } catch (err) {
      next(err)
    }
  },
  getUserTweets: async (req, res, next) => {
    try {
      const userId = req.params.id
      const user = await User.findByPk(userId, {
        include: [{ model: Tweet, include: [Reply, Like] }],
        order: [[Tweet, 'createdAt', 'DESC']]
      })
      if (!user) throw new Error("user didn't exist!")
      const likedTweetId =
        helpers.getUser(req) &&
        helpers.getUser(req).Likes &&
        helpers.getUser(req).Likes.map(liked => liked.TweetId)
      const tweets = user.toJSON().Tweets.map(tweet => ({
        ...tweet,
        isLiked: likedTweetId && likedTweetId.includes(tweet.id)
      }))
      return res.render('tweets', {
        user: user.toJSON(),
        tweets
      })
    } catch (err) {
      next(err)
    }
  },
  getReplies: async (req, res, next) => {
    try {
      const userId = req.params.id
      const user = await User.findByPk(userId, {
        include: [
          {
            model: Reply,
            include: [
              {
                model: Tweet,
                include: [
                  {
                    model: User,
                    attributes: ['name']
                  }
                ]
              }
            ]
          }
        ],
        order: [[Reply, 'createdAt', 'DESC']]
      })
      if (!user) throw new Error("user didn't exist!")
      return res.render('replies', {
        user: user.toJSON()
      })
    } catch (err) {
      next(err)
    }
  },
  addLike: (req, res, next) => {
    const { tweetId } = req.params
    return Promise.all([
      Tweet.findByPk(tweetId),
      Like.findOne({
        where: {
          userId: helpers.getUser(req).id,
          tweetId
        }
      })
    ])
      .then(([tweet, like]) => {
        if (!tweet) throw new Error("Tweet didn't exist!")
        if (like) throw new Error('You have already liked')
        return Like.create({
          userId: helpers.getUser(req).id,
          tweetId
        })
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  },
  removeLike: (req, res, next) => {
    return Like.findOne({
      where: {
        userId: helpers.getUser(req).id,
        tweetId: req.params.tweetId
      }
    })
      .then(like => {
        if (!like) throw new Error("You haven't liked ")
        return like.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  }
}
module.exports = userController
