const db = require('../models')
const Op = db.Sequelize.Op
const User = db.User
const helpers = require('../_helpers')
const bcrypt = require('bcryptjs')
const userController = require('./usersController')

const apiController = {
  getUserInfoEdit: async (req, res) => {
    const UserId = helpers.getUser(req).id
    const requestId = Number(req.params.id)
    if (UserId !== requestId) {
      return res.json({status: 'error'})
    }

    try {
      const userInfo = await User.findByPk(requestId, {raw: true})
      if (Object.keys(userInfo).length) {
        return res.json(userInfo)
      }
      req.flash('error_messages', '查無相關資料')
      return res.redirect('back')
    }
    catch (error) {
      console.log(error)
      req.flash('error_messages', '操作失敗')
      return res.redirect('back')
    }
  },

  postUserInfoEdit: async (req, res) => {
    if (Number(req.params.id) !== helpers.getUser(req).id) {
      return res.redirect('back')
    }
    const userId = helpers.getUser(req).id
    const updateData = req.body

    if (updateData.password) {
      updateData.password = bcrypt.hashSync(updateData.password, bcrypt.genSaltSync(10))
    }
    
    try {
      if (updateData.name || updateData.introduction) {
        await User.update(
          updateData,
          { where: { id: { [Op.eq]: userId } } }
          )
        return userController.getUser(req, res)
      } else {
        req.flash('error_messages', '操作失敗')
        return res.redirect('back')
      }
    }
    catch (error) {
      console.log(error)
      req.flash('error_messages', '操作失敗')
      return res.redirect('back')
    }
  }
}

module.exports = apiController