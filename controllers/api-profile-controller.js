const bcrypt = require('bcryptjs')
const helpers = require('../_helpers')
const { imgurFileHelper } = require('../helpers/file-helpers')
const { User } = require('../models')

const apiProfileController = {
  editUserAccount: async (req, res, next) => {
    // 抓id
    const { userId } = req.params
    const loginUser = helpers.getUser(req)
    try {
      // 找對應user、取出帳號、名稱、信箱
      const user = await User.findByPk(userId, {
        raw: true
      })
      // 找不到就報錯
      if (!user) throw new Error('帳號不存在!')
      // 判斷是否為本人
      if (loginUser.id !== Number(user.id)) {
        return res.json({ status: 'error', messages: '非本人不能操作' })
      }
      // api
      return res.json({ status: 'success', ...user })
    } catch (err) {
      next(err)
    }
  },
  putUserAccount: async (req, res, next) => {
    // 取出照片檔
    const cover = req.files?.cover ? req.files.cover[0] : null
    const avatar = req.files?.avatar ? req.files.avatar[0] : null
    // 抓id, 表單資料
    const { userId } = req.params
    const loginUser = helpers.getUser(req)
    const { account, name, email, password, passwordCheck, introduction } = req.body
    const saltNumber = 10
    // 判斷是否為本人
    if (loginUser.id !== Number(userId)) return res.redirect('back')
    try {
      // 找對應user、找出是否有account、email
      const [user, isAccountExist, isEmailExist, coverFilePath, avatarFilePath] = await Promise.all([
        User.findByPk(userId),
        // 如果account, email有值得話就搜尋
        User.findOne({ where: { account: account || '' } }),
        User.findOne({ where: { email: email || '' } }),
        imgurFileHelper(cover),
        imgurFileHelper(avatar)
      ])
      const errors = []
      // 找不到就報錯
      if (!user) errors.push({ status: 'error', messages: '帳號不存在!' })
      // 如果account、email有更動就判斷是否有重複
      if (user.account !== account && isAccountExist) errors.push({ status: 'error', messages: 'account已重複註冊!', name: 'account' })
      if (user.email !== email && isEmailExist) errors.push({ status: 'error', messages: 'email已重複註冊!', name: 'email' })
      // 確認name有無超過50字，introduction有無超過150字
      if (name?.length > 50) errors.push({ status: 'error', messages: '字數超出上限', name: 'name' })
      if (introduction?.length > 150) errors.push({ status: 'error', messages: '字數超出上限!', name: 'introduction' })
      // 確認密碼是否正確
      if (password !== passwordCheck) {
        errors.push({ status: 'error', messages: '密碼不一致!', name: 'password' })
        errors.push({ status: 'error', messages: '密碼不一致!', name: 'passwordCheck' })
      }
      if (errors.length) return res.json(errors)

      // 將密碼hash
      let hashedPassword = 0
      if (password) {
        const salt = bcrypt.genSaltSync(saltNumber)
        hashedPassword = bcrypt.hashSync(password, salt)
      }
      // 更新資料
      const userUpdate = await user.update({
        // 如果是空的就代入資料庫的值
        name: name || user.name,
        email: email || user.email,
        account: account || user.account,
        password: hashedPassword || user.password,
        introduction: introduction || user.introduction,
        cover: coverFilePath || user.cover,
        avatar: avatarFilePath || user.avatar
      })

      // redirect /tweets
      return res.json([{ status: 'success', ...userUpdate }])
    } catch (err) {
      next(err)
    }
  }
}

module.exports = apiProfileController
