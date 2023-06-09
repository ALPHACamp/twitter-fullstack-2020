const bcrypt = require('bcryptjs')
const { User, Tweet, Reply, Like, Followship } = require('../models')
const _helpers = require('../_helpers')

const userController = {
  // 註冊
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: async (req, res, next) => {
    const { account, name, email, password, checkPassword } = req.body
    if (!account || !name || !email || !password) {
      req.flash('danger_msg', '欄位未正確填寫')
      return res.render('signup', { account, name, email, password, checkPassword })
    }
    if (password !== checkPassword) {
      req.flash('danger_msg', '輸入密碼不一致')
      return res.render('signup', { account, name, email, password, checkPassword })
    }

    try {
      const usedAccount = await User.findOne({ where: { account } })
      if (usedAccount) throw new Error('該帳號已被使用')
      const usedEmail = await User.findOne({ where: { email } })
      if (usedEmail) throw new Error('該email已被使用')

      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)
      await User.create({
        account,
        name,
        email,
        password: hashedPassword
      })
      req.flash('success_msg', '註冊成功，請以新帳號登入')
      return res.redirect('/signin')
    } catch (e) {
      return next(e)
    }
  },
  // 登入
  signInPage: (req, res) => {
    return res.render('signin')
  },
  signIn: (req, res) => {
    // req.flash('success_msg', '登入成功')  似乎沒地方顯示?
    return res.redirect('/tweets')
  },
  // 登出
  signOut: (req, res) => {
    if (req.user.role === 'user') {
      req.logout()
      req.flash('success_msg', "登出成功")
      return res.redirect('/signin')
    } else {
      req.logout()
      req.flash('success_msg', "登出成功")
      return res.redirect('/admin/signin')
    }
  },
  // User tweet 頁面 
  getUserTweets: async (req, res, next) => {
    try {
      const UserId = req.params.uid
      const loginUserId = _helpers.getUser(req).id

      let [user, tweetList, likeList, topUsers] = await Promise.all([
        User.findByPk(UserId, {
          include: [
            { model: User, as: 'Followings', attributes: ['id'] },
            { model: User, as: 'Followers', attributes: ['id'] },
          ],
        }),
        Tweet.findAll({
          where: { UserId },
          include: [
            { model: User, attributes: ['name', 'account', 'avatar'] },
            { model: Reply, attributes: ['id'] },
            { model: Like, attributes: ['id'] }
          ],
          order: [['createdAt', 'DESC']],
        }),
        Like.findAll({
          where: { UserId: loginUserId },
          raw: true,
          attributes: ['TweetId']
        }),
        User.findAll({
          attributes: ['name', 'account', 'avatar', 'id', 'role'],
          include: { model: User, as: 'Followers' },
        })
      ])

      // 資料處理
      if (!user) throw new Error('使用者不存在')
      user = user.toJSON()

      likeList = likeList.map(i => i.TweetId)
      tweetList = tweetList
        .map(i => {
          i = i.toJSON()
          return {
            ...i,
            isLike: likeList.some(j => j === i.id)
          }
        })
      topUsers = topUsers
        .map(i => {
          i = i.toJSON()
          return {
            ...i,
            isFollow: i.Followers.some(j => j.id === loginUserId)
          }
        })
        .filter(i => i.role === 'user')
        .sort((a, b) => b.Followers.length - a.Followers.length)
        .slice(0, 10)

      res.render('user/user-tweets', { user, tweetList, loginUserId, topUsers })
    } catch (err) { next(err) }
  }
}

module.exports = userController