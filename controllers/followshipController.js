const db = require('../models')
const Followship = db.Followship
const User = db.User



const followshipController = {

  addFollowing: async (req, res) => {
    try {
      const followship = await Followship.create({
        followerId: req.user.id,
        followingId: req.params.userId
      })
      res.status(200)
      return res.redirect('back')
    } catch (err) {
      console.log(err)
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
          followerId: req.user.id,
          followingId: req.params.userId
        }
      })
      res.status(200)
      return res.redirect('back')
    } catch {
      console.log(err)
      console.log('removeFollowing err')
      req.flash('error_messages', '取消追蹤失敗！')
      res.status(302)
      return res.redirect('back')
    }
  }
}



module.exports = followshipController