const { User } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')
const helper = require('../_helpers')

const userServices = {
  renderEditPage: async (req, res, callback) => {

    const currentUser = helper.getUser(req)
    const userId = Number(req.params.id)
    const user = await User.findOne({
      where: { id: userId }
    })
    console.log(currentUser)
    console.log(Number(user.id))
    if (Number(currentUser.id) !== Number(user.id)) {
      return res.json({ status: 'error', messages: '無法編輯其他使用者資料！' })
    }
    callback({
      id: user.id,
      name: user.name,
      introduction: user.introduction,
      cover: user.cover,
      avatar: user.avatar,
    })



  }

}
module.exports = userServices

