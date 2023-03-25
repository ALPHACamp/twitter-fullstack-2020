const { User, Tweet, Reply } = require('../models')
const bcrypt = require('bcryptjs')

const userController = {
  signUpPage: (req, res) => { // 登入
    return res.render('signup')
  },
  signUp: (req, res, next) => {
    const { account, name, email, password, passwordCheck } = req.body
    if (req.body.password !== req.body.passwordCheck) throw new Error('Passwords do not match!')
    return User.findOne({ where: { account } })
      .then(user => {
        if (user) throw new Error('Account already exists!')
        return bcrypt.hash(password, 10)
      })
      .then(hash => {
        return User.create({
          account,
          name,
          email,
          password: hash
        })
      })
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  signInPage: (req, res) => { // 註冊
    return res.render('signin')
  },
  signIn:(req,res,next)=>{
    console.log(123)
    res.redirect('/tweets')
  },
  getUser: async (req, res) => { // 取得個人資料頁面(推文清單)
    let [users, user] = await Promise.all([
      User.findAll({ where: { role: 'user' }, raw: true, nest: true, attributes: ['id'] }),
      User.findByPk((2), {
        where: { role: 'user' },
        include: [
          Tweet,
          { model: Tweet, as: 'LikedTweets', include: [User] },
        ],
        order: [
          ['Tweets', 'createdAt', 'DESC'],
        ],
      }),
    ])
    return res.render('users', { users: user.toJSON(), })
  },
  getSetting: (req, res, next) => { // 取得帳戶設定頁面
    return User.findOne({
      raw: true,
      nest: true,
      where: { id: "2" },
      attributes: ['name', 'email', 'account']
    })
      .then(user => {
        return res.render('setting', { user: user })
      })
      .catch(err => next(err))
  },
  putSetting: (req, res, next) => { // 編輯帳戶設定
    const { name, email, account, password } = req.body

    return User.findOne({
      where: { id: "2" },
    })

      .then(user => {
        return user.update({
          name,
          email,
          account,
          password
        })
      })
      .then(() => {
        return res.redirect('setting')
      })
      .catch(err => next(err))
  },
  getFollower: (req, res, next) => { // 跟隨者
    res.render('follower')
  },
  getFollowing: (req, res, next) => { // 跟隨中
    res.render('following')
  },
  logout: (req, res) => { // 登出
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  }
}

module.exports = userController

