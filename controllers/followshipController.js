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

      return res.redirect('back')

    } catch (err) {
      console.log(err)
      console.log('addFollowing err')
      return res.redirect('back')
    }

  },

  removeFollowing: async (req, res) => { //照點擊順序移除??

    try {
      const followship = await Followship.findOne({
        where: {
          followerId: req.user.id,
          followingId: req.params.userId
        }
      })
      console.log('=========================================')
      console.log(req.params.userId)
      console.log('=========================================')

      await followship.destroy()

      return res.redirect('back')

    } catch {
      console.log(err)
      console.log('removeFollowing err')
      return res.redirect('back')
    }

    // var paramsUserid = req.params.userId
    // var getfollowship = new Promise(function (resolve, reject) {
    //   if (paramsUserid) {
    //     var followship = Followship.findOne({
    //       where: {
    //         followerId: req.user.id,
    //         followingId: req.params.userId
    //       }
    //     })
    //     resolve(followship)
    //   } else {
    //     var reason = new Error('remove failed')
    //     reject(reason)
    //   }
    // })
    // console.log('=========================================')
    // console.log(req.params.userId)
    // console.log('=========================================')

    // var deletefollowship = function () {
    //   getfollowship
    //   .then((followship) => {
    //     console.log('=========================================')
    //     console.log(followship)
    //     console.log('=========================================')
    //     followship.destroy()
    //     console.log('seccess')
    //     return res.redirect('back')
    //   })
    //   .catch((error) => {
    //     console.warn(error)
    //   })
    // }

    // deletefollowship()

  }
}



module.exports = followshipController