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
      
      // 因為了符合test user編輯基本資料後是以render形式渲染頁面，但接下來動作是追蹤的化res.redirect('back')會回傳json檔案頁面，故使用此解法提升使用者體驗也能過test
      if (req.headers.referer.includes('api') && req.headers.referer.includes('users')) {
        return res.redirect(`/users/${helpers.getUser(req).id}/tweets`)
      }
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
      
      // 因為了符合test user編輯基本資料後是以render形式渲染頁面，但接下來動作是追蹤的化res.redirect('back')會回傳json檔案頁面，故使用此解法提升使用者體驗也能過test
      if (req.headers.referer.includes('api') && req.headers.referer.includes('users')){
        return res.redirect(`/users/${helpers.getUser(req).id}/tweets`)
      }
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
