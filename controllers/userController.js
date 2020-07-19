const bcrypt = require('bcryptjs')
const { Sequelize } = require('../models')
const { or } = Sequelize.Op

const db = require('../models')
const User = db.User
const Tweet = db.Tweet
const Reply = db.Reply
const Followship = db.Followship

const userController = {
  getUser: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        {
          model: Tweet,
          include: { model: User, as: 'LikedUser' },
        },
        { model: Tweet, include: Reply },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    }).then((user) => {
      const results = user.toJSON()
      results.followingCount = results.Followings.length
      results.followerCount = results.Followers.length
      console.log(results['Tweets'][0]['Replies'].length)

      for (let i = 0; i < results['Tweets'].length; i++) {
        results['Tweets'][i]['repliesCount'] =
          results['Tweets'][i]['Replies'].length
        results['Tweets'][i]['likeCount'] =
          results['Tweets'][i]['Likes'].length
      }
      return res.json(results)
    })
  },
  addFollowing: (req, res) => {
    const userId = req.params.userId
    return Followship.create({
      followerId: req.user.id,
      followingId: userId
    })
      .then(() => res.redirect('back'))
      .catch(err => res.send(err))
  },
  removeFollowing: (req, res) => {
    return Followship.findOne({ where: { followerId: req.user.id, followingId: req.params.userId } })
      .then(followship => {
        followship.destroy()
          .then(() => res.redirect('back'))
      })
      .catch(err => res.send(err))
  },
  userSigninPage: (req, res) => {
    res.render('userSigninPage')
  },
  userSignupPage: (req, res) => {
    res.render('userSignupPage')
  },
  // 使用者進入passport前檢查關卡
  userCheckRequired: (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) {
      req.flash('error_messages', '請輸入帳號密碼！')
      return res.redirect('/signin')
    }
    return next()
  },
  // 使用者成功登入後訊息提示
  userSigninSuccess: (req, res) => {
    req.flash('success_messages', '登入成功！')
    res.redirect('/home')
  },
  userSignup: (req, res) => {
    const { account, name, email, password, checkPassword } = req.body
    // 必填檢查
    if (!account || !name || !email || !password || !checkPassword) {
      return res.render('userSignupPage', {
        account, name, email, error_messages: '別偷懶~全部欄位均為必填呦！'
      }) // 密碼因安全性問題，要重新填寫
    }
    // 密碼 & 確認密碼檢查
    if (password !== checkPassword) {
      return res.render('userSignupPage', {
        account, name, email, error_messages: '密碼與確認密碼不符，請重新確認！'
      })
    }
    // 檢查 account & email 是否為唯一值
    User.findOne({ where: { [or]: { account, email } }, raw: true })
      .then(user => {
        if (!user) {
          return User.create({
            account,
            name,
            email,
            password: bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
            avatar: 'https://image.flaticon.com/icons/svg/2948/2948062.svg',
            cover: 'https://unsplash.com/photos/mWRR1xj95hg',
            introduction: `Hi Guys,I'm ${name},nice to meet you!`,
            role: 'user'
          })
            .then(() => res.redirect('/signin'))
            .catch(err => res.send(err))
        }
        if (user.account === account) {
          return res.render('userSignupPage', {
            account, name, email, error_messages: '帳號已存在，請更改成其他帳號！'
          })
        }
        if (user.email === email) {
          return res.render('userSignupPage', {
            account, name, email, error_messages: 'Email已存在，請更改成其他Email！'
          })
        }
      })
      .catch(err => res.send(err))
  }
}

module.exports = userController
