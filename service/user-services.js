const { User } = require('../models')
const helpers = require('../_helpers')

const userServices = {
  getUserEditPage: async (req, cb) => {
    try {
      console.log('req.params.id', req.params.id)
      const usingUser = helpers.getUser(req) // req.user
      if (Number(req.params.id) !== usingUser.id) {
        return cb(null, {
          status: 'error',
          messages: "Can't edit other profile!"
        })
      }

      const user = await User.findByPk(req.params.id, { raw: true })
      if (!user) throw new Error("User didn't exist!")

      return cb(null, user)
    } catch (error) {
      return cb(error)
    }
  }
}

module.exports = userServices
