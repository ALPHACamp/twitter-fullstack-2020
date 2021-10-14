const db = require('../models')
const Op = db.Sequelize.Op
const User = db.User
const helpers = require('../_helpers')
const bcrypt = require('bcryptjs')

const apiController = {
  getUserInfoEdit: async (req, res) => {
    const UserId = helpers.getUser(req).id
    const requestId = Number(req.params.id)
    if (UserId !== requestId) {
      req.flash('error_messages', '不可修改他人資料')
      return res.redirect('back', 200)
    }

    try {
      const userInfo = await User.findByPk(requestId, {raw: true})
      if (Object.keys(userInfo).length) {
        return res.render('editForm', { layout: 'main', userInfo, to: 'edit' })
      }
      req.flash('error_messages', '查無相關資料')
      return res.redirect('back', 200)
    }
    catch (error) {
      console.log(error)
      req.flash('error_messages', '操作失敗')
      return res.redirect('back')
    }
  },

  postUserInfoEdit: async (req, res) => {
    if (Number(req.params.id) !== helpers.getUser(req).id) {
      req.flash('error_messages', '不可修改他人資料')
      return res.redirect('back')
    }
    const userId = helpers.getUser(req).id
    const updateData = req.body
    const files = req.files

    if (updateData.password) {
      updateData.password = bcrypt.hashSync(updateData.password, bcrypt.genSaltSync(10))
    }
    try {
      if (files && Object.keys(files).length) {
        if (files.cover) {
          imgur.setClientID(IMGUR_CLIENT_ID);
          imgur.upload(files['cover'][0].path, async (err, img) => {
            await User.update(
              { ...updateData, cover: img.data.link },
              { where: { id: { [Op.eq]: userId } } }
            )
          })
        }
        if (files.avatar) {
          imgur.setClientID(IMGUR_CLIENT_ID);
          imgur.upload(files['avatar'][0].path, async (err, img) => {
            await User.update(
              { ...updateData, avatar: img.data.link },
              { where: { id: { [Op.eq]: userId } } }
            )
          })
        }
        return res.redirect(`/users/${userId}`)
      } else if (updateData.account || updateData.introduction) {
        await User.update(
          updateData,
          { where: { id: { [Op.eq]: userId } } }
        )
        res.redirect(`/users/${userId}`)
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