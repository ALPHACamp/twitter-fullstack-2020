const bcrypt = require('bcryptjs')
const { Op } = require('sequelize')
const { User, Followship, Like, Tweet } = require('../models')
const helpers = require('../helpers/auth-helpers')

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword } = req.body
      const errors = []

      if (!account || !name || !email || !password || !checkPassword) {
        errors.push('所有欄位皆為必填')
      }

      const findUser = await User.findOne({
        where: { [Op.or]: [{ account }, { email }] }, // Op.or: 表示接下來陣列內的條件之一成立即可
        attributes: ['account', 'email'] // 若有找到，只返回 account 和 email 屬性即可
      })

      if (findUser && findUser.account === account) {
        errors.push('此帳號已被註冊')
      }
      if (name.length > 50) {
        errors.push('名稱不能超過 50 個字')
      }
      if (findUser && findUser.email === email) {
        errors.push('此 Email 已被註冊')
      }
      if (password !== checkPassword) {
        errors.push('兩次輸入的密碼不相同')
      }
      if (errors.length > 0) {
        throw new Error(errors.join('\n & \n'))
      }

      const hash = await bcrypt.hash(req.body.password, 10)
      await User.create({ account, name, email, password: hash })

      req.flash('success_messages', '成功註冊帳號！')
      return res.redirect('/signin')
    } catch (err) {
      next(err)
    }
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: async (req, res, next) => {
    try {
      req.flash('success_messages', '成功登入！')
      res.redirect('/tweets')
    } catch (err) {
      next(err)
    }
  },
  // 待刪除
  getOther: (req, res) => {
    res.render('other-tweets')
  },
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  //* 追蹤功能
  addFollowing: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.user.id)
      if (!user) throw new Error('找不到該用戶')
      return Followship.create({
        followerId: req.user.id,
        followingId: req.params.userId
      })
    } catch (err) {
      next(err)
    }
  },
  removeFollowing: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.user.id)
      if (!user) throw new Error('找不到該用戶')
      const followShip = await Followship.findOne({
        where: { followerId: req.user.id, followingId: req.params.userId }
      })
      if (!followShip) throw new Error('還沒有追蹤用戶')
      await followShip.destroy()
      return res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  //* Like tweet
  addLike: async (req, res, next) => {
    try {
      const tweet = await Tweet.findByPk(req.user.id)
      if (!tweet) throw new Error('找不到該篇推文')
      await Like.create({ tweetId: req.params.id, userId: req.user.id })
      return res.render('back')
    } catch (err) {
      next(err)
    }
  },
  removeLike: async (req, res, next) => {
    try {
      const like = await Like.findOne({
        where: { userId: req.user.id, tweetId: req.params.id }
      })
      like.destroy()
      return res.redirect('back')
    } catch (err) {
      next(err)
    }
  },
  //* 帳戶設定
  editUserAccount: async (req, res, next) => {
    const { id } = req.params
    const loginUser = helpers.getUser(req)
    if (loginUser.id !== Number(id)) throw new Error('您沒有權限編緝帳戶')

    try {
      const user = await User.findByPk(id, {
        raw: true
      })
      if (!user) throw new Error('該用戶不存在!')
      return res.render('account-setting', { user })
    } catch (err) {
      next(err)
    }
  },
  putUserAccount: async (req, res, next) => {
    const { id } = req.params
    const loginUser = helpers.getUser(req)
    const { account, name, email, password, checkPassword } = req.body
    const saltNumber = 10
    if (loginUser.id !== Number(id)) return res.redirect('back')

    try {
      // 找對應user、找出是否有account、email
      const [user, isAccountExist, isEmailExist] = await Promise.all([
        User.findByPk(id),
        // 如果account, email有值就搜尋
        User.findOne({ where: { account: account || '' } }),
        User.findOne({ where: { email: email || '' } })
      ])

      if (!user) throw new Error('該用戶不存在!')
      // 如果account、email有更動就判斷是否有重複
      if (user.account !== account && isAccountExist) throw new Error('該帳號已存在!')
      if (user.email !== email && isEmailExist) throw new Error('該email已存在!')
      // 確認name有無超過50字
      if (name?.length > 50) throw new Error('該名字超過字數上限 50 個字!')
      // 確認密碼是否正確
      if (password !== checkPassword) throw new Error('密碼不一致!')
      // 將密碼hash
      let hashedPassword = 0
      if (password) {
        const salt = bcrypt.genSaltSync(saltNumber)
        hashedPassword = bcrypt.hashSync(password, salt)
      }

      // 更新資料
      await user.update({
        // 如果是空的就代入資料庫的值
        account: account || user.account,
        name: name || user.name,
        email: email || user.email,
        password: hashedPassword || user.password
      })
      req.flash('success_messages', '已更新成功！')
      res.redirect('/tweets')
    } catch (err) {
      next(err)
    }
  }
}
module.exports = userController
