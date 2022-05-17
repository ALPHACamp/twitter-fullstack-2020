const { User } = require('../models')
const helpers = require('../_helpers')
const { removeAllSpace, removeOuterSpace } = require('../_helpers')
const bcrypt = require('bcrypt-nodejs')

const apiController = {
  getUser: async (req, res, next) => {
    try {
      const userId = Number(helpers.getUser(req).id)
      const queryUserId = Number(req.params.id)
      if (userId !== queryUserId) return res.status(200).json({ status: 'error', message: '您無權限編輯使用者 !' })

      const queryUser = await User.findByPk(queryUserId, { raw: true })
      if (!queryUser) return res.status(500).json({ status: 'error', message: '使用者不存在 !' })
      delete queryUser.password

      return res.status(200).json({ status: 'success', user: queryUser })
    } catch (err) {
      next(err)
    }
  },
  putUser: async (req, res, next) => {
    try {
      const userId = Number(helpers.getUser(req).id)
      const queryUserId = Number(req.params.id) // from axios
      let { account, name, email, password, confirmPassword } = req.body // from axios

      // if (!account || !email || !password || !confirmPassword) return res.status(500).json({ status: 'error', message: '必填欄位未填寫完整 !' })
      if (password !== confirmPassword) return res.status(500).json({ status: 'error', message: '密碼與密碼再確認不相符 !' })
      if (account.length > 50) return res.status(500).json({ status: 'error', message: '帳號長度限制50字元以內' })
      if (name.length > 50) return res.status(500).json({ status: 'error', message: '名稱長度限制50字元以內' })
      if (password.length > 50) return res.status(500).json({ status: 'error', message: '密碼長度限制50字元以內' })
      if (confirmPassword.length > 50) return res.status(500).json({ status: 'error', message: '密碼再確認長度限制50字元以內' })
      if (userId !== queryUserId) return res.status(500).json({ status: 'error', message: '您沒有權限編輯使用者 !' })

      account = removeAllSpace(account)
      name = removeOuterSpace(name)
      if (!name) name = account

      const queryUser = await User.findByPk(queryUserId)
      if (!queryUser) return res.status(500).json({ status: 'error', message: '使用者不存在 !' })

      const hash = await bcrypt.hashSync(password, bcrypt.genSaltSync(10))

      const updatedQueryUser = await queryUser.update({ account, name, email, password: hash })
      const data = updatedQueryUser.toJSON()
      delete data.password

      return res.status(200).json({ status: 'success', data })
    } catch (err) {
      return res.status(500).json({ status: 'error', message: `${err}` })
    }
  },
  putAvatar: async (req, res, next) => {
    try {
      console.log(req)
      const queryUserId = req.params.id
      const { file } = req

      const [queryUser, filePath] = await Promise.all([User.findByPk(queryUserId), helpers.imgurFileHandler(file)])
      if (!queryUser) {
        req.flash('error_messages', '使用者不存在 !')
      }

      const updatedQueryUser = await queryUser.update({ avatar: filePath || null })

      return res.status(200).json({ status: 'success', data: updatedQueryUser })
    } catch (err) {
      return res.status(500).json({ status: 'error', message: `${err}` })
      // next(err)
    }
  }
}

module.exports = apiController
