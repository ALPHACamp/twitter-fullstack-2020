const bcrypt = require('bcryptjs')
const helpers = require('../_helpers')
const imgur = require('imgur')
const { User, Tweet, Reply, Followship, Like } = require('../models')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
imgur.setClientId(IMGUR_CLIENT_ID)

const userController = {
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/tweets') // 暫時使用
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body

    if (!name || !email || !password || !checkPassword || !account) throw new Error('所有欄位都是必填。')
    if (password !== checkPassword) throw new Error('密碼 或 帳號 不正確！')
    if (name.length > 50) throw new Error('名稱上限為50字！')

    return Promise.all([
      User.findOne({ where: { account }, raw: true }),
      User.findOne({ where: { email }, raw: true })
    ])
      .then(([findAccount, findEmail]) => {
        if (findEmail) throw new Error('email已被使用！')
        if (findAccount) throw new Error('密碼 或 帳號 不正確！')
        return bcrypt.hash(password, 10)
      })
      .then(hash => User.create({
        account,
        name,
        email,
        password: hash,
        role: 'user',
        avatar: 'https://icon-library.com/images/default-user-icon/default-user-icon-17.jpg',
        banner: 'https://upload.cc/i1/2022/07/26/CE3yXw.png'
      }))
      .then(() => {
        req.flash('success_messages', '帳號註冊成功！')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  getUserTweets: (req, res, next) => {
    const id = req.params.id
    return Promise.all([
      User.findByPk(id, {
        include: [{ model: User, as: 'Followings' }, { model: User, as: 'Followers' }]
      }),
      Tweet.findAll({
        where: { userId: id },
        include: [Like, Reply],
        order: [['createdAt', 'desc']],
        nest: true
      })
    ])
      .then(([targetUser, tweets]) => {
        if (!targetUser) throw new Error('使用者不存在！')

        const user = helpers.getUser(req)
        if (user) {
          user.isFollowed = user.Followings.some(u => u.id === targetUser.id)
        }

        const tweetsData = tweets
          .map(t => ({
            ...t.toJSON(),
            likedCount: t.Likes.length,
            repliedCount: t.Replies.length,
            isLiked: t.Likes.some(like => like.userId === user.id)
          }))

        res.locals.tweetsLength = tweets.length
        res.render('user', { targetUser: targetUser.toJSON(), tweets: tweetsData, user })
      })
      .catch(err => next(err))
  },
  getUserReplies: (req, res, next) => {
    const id = req.params.id
    return Promise.all([
      User.findByPk(id, {
        include: [{ model: User, as: 'Followings' }, { model: User, as: 'Followers' }, Tweet]
      }),
      Reply.findAll({
        where: { userId: id },
        include: [{ model: Tweet, include: User }],
        order: [['createdAt', 'desc']],
        raw: true,
        nest: true
      })
    ])
      .then(([targetUser, replies]) => {
        if (!targetUser) throw new Error('使用者不存在！')
        const user = helpers.getUser(req)
        if (user) {
          user.isFollowed = user.Followings.some(u => u.id === targetUser.id)
        }
        res.locals.tweetsLength = targetUser.Tweets.length
        res.render('user', { targetUser: targetUser.toJSON(), replies, user })
      })
      .catch(err => next(err))
  },
  getUserLikes: (req, res, next) => {
    const id = req.params.id
    return Promise.all([
      User.findByPk(id, {
        include: [{ model: User, as: 'Followings' }, { model: User, as: 'Followers' }, Tweet]
      }),
      Like.findAll({
        where: { userId: id },
        include: [
          { model: Tweet, include: User },
          { model: Tweet, include: Like },
          { model: Tweet, include: Reply }
        ],
        order: [['createdAt', 'desc']],
        nest: true
      })
    ])
      .then(([targetUser, likes]) => {
        if (!targetUser) throw new Error('使用者不存在！')
        const user = helpers.getUser(req)
        if (user) {
          user.isFollowed = user.Followings.some(u => u.id === targetUser.id)
        }
        const likesData = likes
          .map(l => ({
            ...l.toJSON(),
            likedCount: l.Tweet.Likes.length,
            repliedCount: l.Tweet.Replies.length,
            isLiked: user ? l.Tweet.Likes.some(like => like.UserId === user.id) : false
          }))
        res.locals.tweetsLength = targetUser.Tweets.length
        res.render('user', { targetUser: targetUser.toJSON(), likes: likesData, user })
      })
      .catch(err => next(err))
  },
  getSetting: (req, res, next) => {
    const currentUserId = helpers.getUser(req) && helpers.getUser(req).id

    if (currentUserId !== Number(req.params.id)) {
      req.flash('error_messages', '無法修改他人資料！')
      return res.redirect(`/users/${currentUserId}/setting`)
    }

    return User.findByPk(req.params.id, {
      raw: true
    })
      .then(user => {
        res.render('setting', { user })
      })
      .catch(err => next(err))
  },
  putSetting: (req, res, next) => {
    const currentUser = helpers.getUser(req)
    const { account, name, email, password, checkPassword } = req.body

    if (!account || !name || !email || !password || !checkPassword) throw new Error('所有欄位都是必填！')
    if (password !== checkPassword) throw new Error('密碼與確認密碼不相符！')
    if (name.length > 50) throw new Error('字數超出上限！')

    return Promise.all([
      User.findByPk(currentUser.id),
      User.findOne({ where: { email }, raw: true }),
      User.findOne({ where: { account }, raw: true })
    ])
      .then(([user, findEmail, findAccount]) => {
        if (findAccount) {
          if (findAccount.id !== user.id) throw new Error('account 已重複註冊！')
        }

        if (findEmail) {
          if (findEmail.id !== user.id) throw new Error('email 已重複註冊！')
        }

        return bcrypt.hash(password, 10)
          .then(hash => {
            return user.update({
              account,
              name,
              email,
              password: hash
            })
          })
      })
      .then(() => {
        req.flash('success_messages', '個人資料修改成功！')
        return res.redirect(`/users/${currentUser.id}/tweets`)
      })
      .catch(err => next(err))
  }

}
module.exports = userController
