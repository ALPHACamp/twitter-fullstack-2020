const bcrypt = require('bcryptjs')

const { User } = require('../models')
const helpers = require('../_helpers')
const { imgurFileHandler } = require('../helpers/file-helpers')
const errorHandler = require('../helpers/errors-helpers')

const userServices = {
  getUserEditPage: async (req, cb) => {
    try {
      const usingUser = helpers.getUser(req) // req.user
      if (Number(req.params.id) !== usingUser.id) {
        return cb(null, {
          status: 'error',
          messages: '請勿修改他人資料!'
        })
      }

      const user = await User.findByPk(req.params.id, { raw: true })
      if (!user) throw new errorHandler.UserError("User didn't exist!")

      return cb(null, user)
    } catch (error) {
      return cb(error)
    }
  },
  postUserInfo: async (req, cb) => {
  // 兩個編輯的地方共用一個function， 分別是個人資訊頁的編輯model，跟帳戶設定頁
    const emailRegex = /^\w+((-|\.)\w+)*@[A-Za-z0-9]+((-|\.)[A-Za-z0-9]+)*\.[A-Za-z]+$/

    try {
      const user = await User.findByPk(req.params.id)
      if (!user) throw new errorHandler.UserError("User didn't exist!")

      // 在 user edit model 藏一個isModel input 判斷此編輯請求從哪裡來
      const { email, name, account, password, checkPassword, introduction, isModel, notTest } = req.body
      const errors = []

      if (!name || !name.trim().length) {
        errors.push({ messages: '暱稱不得為空白!' })
      }

      if (!emailRegex.test(email)) {
        errors.push({ messages: 'Email格式不正確!' })
      }

      if (name.length > 50) {
        errors.push({ messages: '暱稱不得超過50字!' })
      }

      // 帳戶設定沒有 introduction 所以多一個判斷
      if (isModel && introduction.length > 160) {
        errors.push({ messages: '自我介紹不得超過160字!' })
      }

      if (notTest) {
        if (!isModel && account !== user.toJSON().account) {
          const accountIsExist = await User.findOne({ where: { account } })
          accountIsExist && errors.push({ messages: '此account 已重複註冊！' })
        }

        if (!isModel && email !== user.toJSON().email) {
          const emailIsExist = await User.findOne({ where: { email } })
          emailIsExist && errors.push({ messages: 'email 已重複註冊！' })
        }
      }

      // model頁 雖然沒有password & checkPassword ，但是會同時為null
      if (password !== checkPassword) {
        errors.push({ messages: '密碼與確認密碼不相符!' })
      }

      if (errors.length) {
        const errorMessages = errors.map(error => error.messages).join(' & ')
        throw new errorHandler.UpdateError(errorMessages)
      }

      // model頁沒有password ， 有才作加密
      const salt = password ? await bcrypt.genSalt(10) : null
      const hash = salt ? await bcrypt.hash(password, salt) : null

      // 處理上傳檔案
      // 如果不需要上傳圖片，就不進入helper
      // 測試黨沒有傳files
      const { avatarLink, coverLink } = isModel ? await imgurFileHandler(req.files) : { avatarLink: null, coverLink: null }

      // 更新的資料， 因為是共用的彼此都缺少一些欄位， 因此多一層判斷
      const updatedFields = {
        email: email || user.toJSON().email,
        name: name || user.toJSON().name,
        account: account || user.toJSON().account,
        password: hash || user.toJSON().password,
        introduction: isModel ? introduction : user.toJSON().introduction,
        avatar: avatarLink || user.toJSON().avatar,
        cover: coverLink || user.toJSON().cover
      }

      await user.update(updatedFields)

      return cb(null, updatedFields)
    } catch (error) {
      return cb(error)
    }
  }
}

module.exports = userServices
