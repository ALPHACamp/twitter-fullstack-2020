const db = require('../models')
const { Message, User } = db
const helpers = require('../_helpers')

const socketController = {
  getPublicSocket: async (req, res) => {
    try {
      // 聊天紀錄
      const messages = await Message.findAll({
        raw: true,
        nest: true,
        include: [
          { model: User, attributes: ['id', 'avatar', 'name', 'account'] }
        ],
        order: [
          ['createdAt', 'DESC']
        ]
      })

      let dataMsg = []
      // data 包含 留言訊息 message, 與 isCurrent 是否屬於登入使用者貼文,
      dataMsg = messages.map((msg, index) => {
        const isCurrent = msg.UserId === helpers.getUser(req).id
        return {
          ...msg,
          isCurrent
        }
      })

      // 選染畫面用的變數
      const publicSocketPage = true

      return res.render('publicSocket', {
        publicSocketPage, dataMsg
      })
    } catch (err) {
      req.flash('error_messages', err)
      console.log(err)
      return res.redirect('/')
    }
  }
}
module.exports = socketController