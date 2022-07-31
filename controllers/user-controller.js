const bcrypt = require('bcryptjs')
const helpers = require('../_helpers')
const imgur = require('imgur')
const { User, Tweet, Reply, Followship, Like } = require('../models')
const sequelize = require('sequelize')
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
    const currentUser = helpers.getUser(req)
    const id = currentUser.id
    return Promise.all([
      User.findByPk(id, {
        include: [
          { model: User, as: 'Followings' },
          { model: User, as: 'Followers' }
        ]
      }),
      Tweet.findAll({
        where: { userId: id },
        include: [Like, Reply],
        order: [['createdAt', 'desc']],
        nest: true
      }),
      Followship.findAll({
        include: User,
        group: 'followingId',
        attributes: {
          include: [[sequelize.fn('COUNT', sequelize.col('following_id')), 'count']]
        },
        order: [[sequelize.literal('count'), 'DESC']]
      })
    ])
      .then(([targetUser, tweets, followship]) => {
        if (!targetUser) throw new Error('使用者不存在！')

        currentUser.isFollowed = currentUser.Followings.some(u => u.id === targetUser.id)

        const users = followship
          .map(data => ({
            ...data.User.toJSON(),
            isFollowed: currentUser.Followings.some(u => u.id === data.followingId)
          }))
          .slice(0, 10)

        const tweetsData = tweets
          .map(t => ({
            ...t.toJSON(),
            likedCount: t.Likes.length,
            repliedCount: t.Replies.length,
            isLiked: t.Likes.some(like => like.UserId === currentUser.id)
          }))

        console.log(targetUser.toJSON())
        console.log(currentUser)
        res.locals.tweetsLength = tweets.length
        res.render('user', { targetUser: targetUser.toJSON(), tweets: tweetsData, currentUser, users })
      })
      .catch(err => next(err))
  },
  getSetting: (req, res, next) => {
    const currentUserId = helpers.getUser(req) && helpers.getUser(req).id

    if (currentUserId !== Number(req.params.id)) {
      req.flash('error_messages', '只能改自己的資料！')
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
