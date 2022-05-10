const bcrypt = require('bcryptjs')
const { Tweet, User, Like, Reply } = require('../models')
const { Op } = require('sequelize')
const helpers = require('../_helpers')

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: (req, res) => {
    const { account, name, email, password, passwordCheck } = req.body
    const errors = []
    if (!account || !name || !email || !password || !passwordCheck) {
      errors.push({ message: '所有欄位都是必填。' })
    }
    if (password !== passwordCheck) {
      errors.push({ message: '密碼與確認密碼不相符！' })
    }
    if (name.length > 50) {
      errors.push({ message: '名稱上限為50字！' })
    }
    if (errors.length) {
      return res.render('signup', {
        errors,
        name,
        email,
        account
      })
    }

    User.findOne({
      where: {
        [Op.or]: [{ account }, { email }]
      }
    }).then(user => {
      if (user) {
        if (user.account === account) {
          errors.push({ message: 'account 已重複註冊！' })
        } else {
          errors.push({ message: 'email 已重複註冊！' })
        }
        return res.render('signup', {
          errors,
          account,
          name,
          email,
          password,
          passwordCheck
        })
      } else {
        req.flash('success_messages', '註冊成功!')
        return User.create({
          account,
          name,
          email,
          avatar: 'https://i.pinimg.com/474x/ff/4f/c3/ff4fc37f314916957e1103a2035a11fa.jpg',
          password: bcrypt.hashSync(
            req.body.password,
            bcrypt.genSaltSync(10),
            null
          ),
          role: 'user'
        }).then(user => {
          res.redirect('/signin')
        })
      }
    })
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
      const user = await Like.findAll(userId, {
        include: [
          { model: Tweet, include: [User] }
        ]
      })
      if (!user) throw new Error("user didn't exist!")
      console.log('likes:', user.toJSON())
      // TODO: 找到該user的like清單
      // 輸出like的tweets(該tweet的User name/account/comment/發文時間/回文數/回文連結/like那個推文的like數)
      return res.render('likes', {
        user: user.toJSON()
      })
    } catch (err) {
      next(err)
    }
  },
  getUserTweets: async (req, res, next) => {
    try {
      const userId = req.params.id
      const user = await User.findByPk(userId, {
        include: [
          { model: Tweet, include: [Reply, Like] }
        ],
        order: [
          [Tweet, 'createdAt', 'DESC']
        ]
      })
      if (!user) throw new Error("user didn't exist!")
      const likedTweetId = helpers.getUser(req) && helpers.getUser(req).Likes.map(liked => liked.TweetId)
      // const data = user.toJSON().Tweets
      const tweets = user.toJSON().Tweets.map(tweet => ({
        ...tweet,
        isLiked: likedTweetId.includes(tweet.id)
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
            include: [{
              model: Tweet,
              include: [{
                model: User,
                attributes: ['name']
              }]
            }]
          }
        ],
        order: [
          [Reply, 'createdAt', 'DESC']
        ]
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
    console.log('tweetId', tweetId)
    console.log('userId', req.user.id)
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
        if (like) throw new Error('You have liked this restaurant!')
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
        userId: req.user.id,
        tweetId: req.params.tweetId
      }
    })
      .then(like => {
        if (!like) throw new Error("You haven't liked this restaurant")
        return like.destroy()
      })
      .then(() => res.redirect('back'))
      .catch(err => next(err))
  }
}
module.exports = userController
