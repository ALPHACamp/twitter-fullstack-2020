const { User, Tweet, Reply } = require('../models')
const bcrypt = require('bcryptjs')
const Helpers = require('faker/lib/helpers')
const helpers = require('../_helpers')

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
  signIn: (req, res, next) => {
    console.log(123)
    res.redirect('/tweets')
  },
  getUser: async (req, res) => { // 取得個人資料頁面(推文清單)
    let [users, user] = await Promise.all([
      User.findAll({ where: { role: 'user' }, raw: true, nest: true, attributes: ['id'] }),
      User.findByPk((req.params.id), {
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
  getSetting: (req, res, ) => { // 取得帳戶設定頁面
    return User.findByPk(helpers.getUser(req).id)
      .then(user => {
        user = user.toJSON()
        const { name, account, email } = user
        return res.render('setting', { name, account, email })
      })
  },
  putSetting: (req, res, next) => { // 編輯帳戶設定
    const { name, email, account, password, passwordCheck } = req.body
    if( !name || !email || !password || !account || !passwordCheck){
      req.flash('wrong_messages', '所有欄位都是必填。')
      return res.redirect('back')
    }
    if(password !== passwordCheck) {
      req.flash('wrong_messages', '密碼與確認密碼不相符！')
      return res.redirect('back')
    }
      return User.findByPk(helpers.getUser(req).id)
      .then(user => {
        return user.update({
          name,
          email,
          account,
          password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
        })
      })
      .then(() => {
        req.flash('success_messages', '帳戶設定編輯成功!')
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

