const db = require('../models')
const Followship = db.Followship
const User = db.User
const helpers = require('../_helpers')

const followshipController = {
  addFollowing: async (req, res) => {
    try {
      if (Number(helpers.getUser(req).id) === Number(req.body.id)) {
        req.flash('error_messages', '使用者不可以追蹤自己')
        return res.redirect(200, 'back')
      }
      await Followship.create({
        followerId: helpers.getUser(req).id,
        followingId: req.body.id
      })
      return res.redirect('back')
    } catch (err) {
      console.log('addFollowing err')
      req.flash('error_messages', '追蹤失敗！')
      res.status(302)
      return res.redirect('back')
    }
  },

  removeFollowing: async (req, res) => {
    try {
      await Followship.destroy({
        where: {
          followerId: helpers.getUser(req).id,
          followingId: req.params.userId
        }
      })
      res.status(200)
      return res.redirect('back')
    } catch {
      console.log('removeFollowing err')
      req.flash('error_messages', '取消追蹤失敗！')
      res.status(302)
      return res.redirect('back')
    }
  }
}

module.exports = followshipController
