const db = require('../models')
const Followship = db.Followship
const User = db.User



const followshipController = {

  addFollowing: async (req, res) => {
    try {
      const followship = await Followship.create({
        followerId: helpers.getUser(req).id,
        followingId: req.params.userId
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