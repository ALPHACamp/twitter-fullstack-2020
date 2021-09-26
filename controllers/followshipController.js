const db = require('../models')
const Followship = db.Followship
const helpers = require('../_helpers')

const followshipController = {
  following: (req, res) => {
    if (Number(helpers.getUser(req).id) === Number(req.body.id)) {
      req.flash('error_messages', '不可以追蹤自己！')
      return res.redirect('back')
    }
    Followship.create({
      followerId: helpers.getUser(req).id,
      followingId: req.body.id
    })
      .then(() => {
        return res.redirect('back')
      })
  },
  unfollowing: (req, res) => {
    Followship.findOne({
      where: {
        followerId: helpers.getUser(req).id,
        followingId: req.params.id
      }
    })
      .then(Followship => {
        Followship.destroy()
          .then(() => {
            return res.redirect('back')
          })
      })
  },
}

module.exports = followshipController