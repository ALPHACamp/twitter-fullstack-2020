const bcrypt = require('bcrypt-nodejs')
const helpers = require('../_helpers')
// const { imgurFileHandler } = require('../helpers/file-helpers')

const { User } = require('../models')

const apiController = {
  getUserInfo: async (req, res, next) => {
    try {
      const currentUserId = Number(helpers.getUser(req).id)
      const userId = Number(req.params.id)
      if (currentUserId !== userId) {
        return res.status(200).json({
          status: 'error',
          message: "Can not edit other user's account!"
        })
      }
      const existUser = await User.findByPk(userId, { raw: true })
      if (!existUser) throw new Error("Account didn't exist!")
      const name = existUser.name
      return res.json({ status: 'success', name })
    } catch (err) {
      next(err)
    }
  },
  postUserInfo: async (req, res, next) => {
    try {
      const currentUserId = Number(helpers.getUser(req).id)
      const userId = Number(req.params.id)
      if (currentUserId !== userId) {
        throw new Error("Can not edit other user's account!")
      }
      let { account, name, email, password, checkPassword } = req.body
      if (process.env.NODE_ENV !== 'test') {
        if (!account || !email || !password || !name) {
          throw new Error('Please complete all required fields')
        }
      }
      if (password !== checkPassword) throw new Error('Passwords do not match!')
      const existAccount = await User.findOne({
        where: { account: account || null }
      })
      if (existAccount && Number(existAccount.id) !== currentUserId) {
        throw new Error('Account already exists!')
      }
      const existEmail = await User.findOne({ where: { email: email || null } })
      if (existEmail && Number(existEmail.id) !== currentUserId) {
        throw new Error('Email already exists!')
      }
      name = name.trim()
      if (name.length > 50) {
        throw new Error("Name can't have too many characters.")
      }

      const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
      const newUserData = { account, name, email, password: hash }
      const userData = await User.findByPk(userId)
      await userData.update(newUserData)
      req.flash('success_messages', '帳號重新編輯成功！')
      return res.status(200).json({ status: 'success', data: newUserData })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = apiController
