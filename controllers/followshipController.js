const db = require('../models')
const Followship = db.Followship
const User = db.User
const helpers = require('../_helpers')



const followshipController = {

  addFollowing: async (req, res) => {
    try {
      console.log('into addFollowing')
      console.log('helpers.getUser(req).id', typeof Number(helpers.getUser(req).id))
      console.log('req.body.id', typeof Number(req.body.id))
      if (Number(helpers.getUser(req).id) === Number(req.body.id)) {
        req.flash('error_messages', '使用者不可以追蹤自己')
        return res.redirect('back')
      }
      const followship = await Followship.create({
        followerId: helpers.getUser(req).id,
        followingId: req.body.id
      })

      return res.redirect('back')

    } catch (err) {
      console.log(err)
      console.log('addFollowing err')
      return res.redirect('back')
    }

  },

  removeFollowing: async (req, res) => { //照點擊順序移除??

    try {
      await Followship.destroy({
        where: {
          followerId: helpers.getUser(req).id,
          followingId: req.params.userId
        }
      })

      return res.redirect('back')

    } catch {
      console.log(err)
      console.log('removeFollowing err')
      return res.redirect('back')
    }

  }
}



module.exports = followshipController