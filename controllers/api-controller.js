const { User } = require('../models')
const helpers = require('../_helpers')

const apiController = {
  getUser: async (req, res, next) => {
    try {
      console.log(req)
      // res.json('edit')
    } catch (err) {
      next(err)
    }
  },
  putUser: async (req, res, next) => {
    try {
      console.log(req.body)
    } catch (err) {
      next(err)
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
